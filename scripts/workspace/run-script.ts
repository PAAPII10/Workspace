#!/usr/bin/env ts-node
import { execSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

interface PackageInfo {
  name: string;
  packageName: string;
  packageFolder: PackageFolder;
  path: string;
  dependencies: string[];
  hasCommand: boolean;
}

type PackageFolder = (typeof PACKAGE_FOLDERS)[number];

/**
 * Valid package folders in the current workspace
 */
const PACKAGE_FOLDERS = ['all', 'libs', 'domains', 'packages', 'apps'] as const;

const PARALLEL_COMMANDS_INTERVAL = 1000;

/**
 * Discovers all packages in a given directory and analyzes their dependencies and commands
 */
function discoverPackages(packageFolder: PackageFolder, command: string): PackageInfo[] {
  const packageFolderPath = join(process.cwd(), packageFolder);

  if (!existsSync(packageFolderPath)) {
    return [];
  }

  const packages: PackageInfo[] = [];

  for (const currentPackageFolder of readdirSync(packageFolderPath, {
    withFileTypes: true,
  })) {
    if (currentPackageFolder.isDirectory()) {
      const packageJsonPath = join(packageFolderPath, currentPackageFolder.name, 'package.json');

      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          const dependencies = extractInternalDependencies(packageJson);
          const hasCommand = packageJson.scripts && packageJson.scripts[command];

          packages.push({
            name: currentPackageFolder.name,
            packageName: packageJson.name,
            packageFolder,
            path: join(packageFolder, currentPackageFolder.name),
            dependencies,
            hasCommand: Boolean(hasCommand),
          });
        } catch {
          console.warn(`⚠️  Warning: Invalid package.json in ${packageJsonPath}`);
        }
      }
    }
  }

  return packages;
}

/**
 * Extracts internal dependencies from package.json
 * Only considers dependencies that start with @arvasit/ as internal
 */
function extractInternalDependencies(packageJson: any): string[] {
  const internalDeps = new Set<string>();
  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      for (const depName in packageJson[depType]) {
        if (depName.startsWith('@arvasit/')) {
          internalDeps.add(depName);
        }
      }
    }
  }

  return Array.from(internalDeps);
}

/**
 * Performs topological sort for dependency order
 * Ensures that dependencies are processed before dependents
 */
function topologicalSort(packages: PackageInfo[]): PackageInfo[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sortedPackages: PackageInfo[] = [];
  const packagesMap = new Map(packages.map(packageInfo => [packageInfo.packageName, packageInfo]));

  function visit(packageName: string): void {
    if (visited.has(packageName)) return;
    if (visiting.has(packageName)) {
      throw new Error(`🔄 Circular dependency detected: ${packageName}`);
    }

    visiting.add(packageName);

    const packageInfo = packagesMap.get(packageName)!;

    for (const dependency of packageInfo.dependencies) {
      visit(dependency);
    }

    visiting.delete(packageName);
    visited.add(packageName);
    sortedPackages.push(packageInfo);
  }

  for (const { packageName } of packages) {
    visit(packageName);
  }

  return sortedPackages;
}

/**
 * Executes a command in a specific package synchronously
 */
function executeCommandSync(packageFolder: PackageInfo, command: string): void {
  if (!packageFolder.hasCommand) return;

  console.log(`  🚀 Running "${command}" in ${packageFolder.packageName}...`);
  try {
    execSync(`pnpm --filter ${packageFolder.packageName} ${command}`, {
      stdio: 'inherit',
    });
  } catch {
    console.error(`  ❌ Script "${command}" failed in ${packageFolder.packageName}`);
    process.exit(1);
  }
}

/**
 * Executes a command in a specific package asynchronously (for parallel commands)
 */
function executeCommandAsync(packageFolder: PackageInfo, command: string): Promise<void> {
  if (!packageFolder.hasCommand) return Promise.resolve();

  return new Promise(resolve => {
    console.log(`  🚀 Starting "${command}" in ${packageFolder.packageName}...`);

    const child = spawn('pnpm', ['--filter', packageFolder.packageName, command], {
      stdio: 'inherit',
    });

    // For parallel commands, we consider them "started" successfully once they begin
    // We don't wait for them to finish since they're meant to keep running
    setTimeout(() => {
      console.log(`  ✅ ${packageFolder.packageName} started successfully`);
      resolve();
    }, PARALLEL_COMMANDS_INTERVAL); // Give it a second to ensure it started properly

    child.on('error', error => {
      console.error(
        `  ❌ Failed to start "${command}" in ${packageFolder.packageName}:`,
        error.message,
      );
      process.exit(1);
    });
  });
}

/**
 * Handles parallel command execution with dependency-ordered startup
 */
async function executeParallelCommands(packages: PackageInfo[], command: string): Promise<void> {
  console.log(`⚡ Starting parallel execution...`);

  for (let index = 0; index < packages.length; index++) {
    const packageFolder = packages[index];
    await executeCommandAsync(packageFolder, command);
  }

  console.log(`\n🎉 All commands running! Processes will continue running...`);
  console.log(`⛔ Press Ctrl+C to stop all processes`);

  // Keep the script alive to maintain all child processes
  return new Promise(() => {
    // This promise never resolves, keeping the parent process alive
  });
}

/**
 * Runs the given command in packages based on the command type and flags
 */
async function runWorkspaceCommand(
  packageFolder: PackageFolder,
  command: string,
  parallel: boolean,
): Promise<void> {
  console.log(
    `🔄 Running command "${command}" in ${packageFolder === 'all' ? 'all' : packageFolder} packages ${parallel ? '(parallel)' : ''}...`,
  );

  const allWorkspacePackages = (['libs', 'domains', 'packages', 'apps'] as PackageFolder[]).flatMap(
    packageFolder => discoverPackages(packageFolder, command),
  );

  const sortedPackages = topologicalSort(allWorkspacePackages);

  const packageFoldersToPerform: PackageFolder[] =
    packageFolder === 'all' ? ['libs', 'domains', 'packages', 'apps'] : [packageFolder];

  const allExecutablePackages: PackageInfo[] = [];

  for (const packageFolderToPerform of packageFoldersToPerform) {
    const packages = sortedPackages.filter(
      ({ packageFolder }) => packageFolder === packageFolderToPerform,
    );
    allExecutablePackages.push(...packages);
  }

  if (allExecutablePackages.length === 0) {
    console.log(`  ❌ No package with "${command}" command found in ${packageFolder}/`);
    return;
  }

  if (parallel) {
    await executeParallelCommands(allExecutablePackages, command);
  } else {
    for (const packageFolder of allExecutablePackages) {
      executeCommandSync(packageFolder, command);
    }

    console.log(`\n🎉 Script execution completed:`);
    console.log(`   📊 Total packages: ${allWorkspacePackages.length}`);
    console.log(`   ✅ Executed: ${allExecutablePackages.length}`);
  }
}

// Add support for a "circular-deps:check" command target that runs madge in packages
// The existing script already dispatches per scope (apps, libs, domains, packages, all)
// This extends it so that when command === 'circular-deps:check', we run the package-level script if present

// Add a simple scaffold command to create a new package quickly
// Usage: pnpm ts-node scripts/workspace/run-script.ts scaffold <type> <name>
// type: lib|domain|package|app
// name: kebab-case package name without scope
// This creates folder, minimal package.json, tsconfig, src/index.ts

// Main execution
const args = process.argv.slice(2);
const packageFolder = args[0] as PackageFolder;
const command = args[1];
const parallel = args.includes('--parallel');

if (!packageFolder || !command) {
  console.error(
    'Usage: pnpm ts-node scripts/workspace/run-script.ts <package-folder> <command-name> [--parallel]',
  );
  console.error('');
  console.error('Examples:');
  console.error('  pnpm ts-node scripts/workspace/run-script.ts all build');
  console.error('  pnpm ts-node scripts/workspace/run-script.ts libs start --parallel');
  console.error('  pnpm ts-node scripts/workspace/run-script.ts apps dev --parallel');
  console.error('');
  console.error('Flags:');
  console.error('  --parallel    Run commands in parallel with dependency-ordered startup');
  console.error('');
  console.error('Commands that automatically use dependency ordering: build, compile');
  console.error('Use --parallel to run any command in parallel while respecting dependencies');
  process.exit(1);
}

if (!PACKAGE_FOLDERS.includes(packageFolder)) {
  console.error(`Valid package folder: ${PACKAGE_FOLDERS.join(', ')}`);
  process.exit(1);
}

runWorkspaceCommand(packageFolder, command, parallel).catch(error => {
  console.error('❌ Script execution failed:', error);
  process.exit(1);
});
