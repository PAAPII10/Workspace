import * as fs from 'fs';
import * as path from 'path';

interface ExportMapping {
  types: string;
  require: string;
  import: string;
}

interface Exports {
  [key: string]: ExportMapping;
}

function findLibraryPath(libraryName: string): string | null {
  const possiblePaths = [
    `libs/${libraryName}`,
    `domains/${libraryName}`,
    `packages/${libraryName}`,
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }

  return null;
}

function shouldSkipFile(fileName: string): boolean {
  // Skip test files and test directories
  if (fileName.endsWith('.spec.ts') || fileName.endsWith('.test.ts') || fileName.startsWith('__')) {
    return true;
  }
  return false;
}

function shouldSkipDirectory(dirName: string): boolean {
  // Skip test directories
  if (dirName.startsWith('__')) {
    return true;
  }
  return false;
}

function scanDirectory(dirPath: string, basePath: string): string[] {
  const items: string[] = [];

  if (!fs.existsSync(dirPath)) {
    return items;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(entry.name)) {
        continue;
      }

      // Check if directory has an index.ts file
      const indexPath = path.join(fullPath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        // Add barrel export for directory
        const exportPath = relativePath.replace(/\\/g, '/');
        items.push(exportPath);
        console.log(`📁 Found directory with index.ts: ${exportPath}`);
      } else {
        // Recursively scan subdirectory
        const subItems = scanDirectory(fullPath, basePath);
        items.push(...subItems);
      }
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      if (shouldSkipFile(entry.name)) {
        continue;
      }

      // Skip index.ts files as they're handled by directory exports
      if (entry.name === 'index.ts') {
        continue;
      }

      // Add individual file export
      const exportPath = relativePath.replace(/\\/g, '/').replace('.ts', '');
      items.push(exportPath);
      console.log(`📄 Found TypeScript file: ${exportPath}`);
    }
  }

  return items;
}

function generateExports(exportPaths: string[]): Exports {
  const exports: Exports = {};

  // Add root export
  exports['.'] = {
    types: './dist/index.d.ts',
    require: './dist/index.js',
    import: './dist/index.js',
  };

  // Add individual exports
  for (const exportPath of exportPaths) {
    exports[`./${exportPath}`] = {
      types: `./dist/${exportPath}.d.ts`,
      require: `./dist/${exportPath}.js`,
      import: `./dist/${exportPath}.js`,
    };
  }

  return exports;
}

function updatePackageJson(libraryPath: string, exports: Exports): void {
  const packageJsonPath = path.join(libraryPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.exports = exports;

  // Write back to file with proper formatting
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Error: Library name is required');
    console.log('Usage: pnpm ts-node scripts/generate-library-exports.ts <library-name>');
    console.log('Example: pnpm ts-node scripts/generate-library-exports.ts utils');
    process.exit(1);
  }

  const libraryName = args[0];
  console.log(`🔍 Looking for library: ${libraryName}`);

  const libraryPath = findLibraryPath(libraryName);

  if (!libraryPath) {
    console.error(`❌ Error: Library '${libraryName}' not found in libs/, domains/, or packages/`);
    process.exit(1);
  }

  console.log(`✅ Found library at: ${libraryPath}`);

  const srcPath = path.join(libraryPath, 'src');

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Error: src/ directory not found in ${libraryPath}`);
    process.exit(1);
  }

  console.log(`📂 Scanning src directory: ${srcPath}`);
  console.log('');

  const exportPaths = scanDirectory(srcPath, srcPath);

  console.log('');
  console.log(`📋 Found ${exportPaths.length} export paths`);

  const exports = generateExports(exportPaths);

  console.log('📝 Generated exports:');
  console.log(JSON.stringify(exports, null, 2));
  console.log('');

  try {
    updatePackageJson(libraryPath!, exports);
    console.log(`✅ Generated ${exportPaths.length + 1} exports for @arvasit/${libraryName}`);
  } catch (error) {
    console.error(`❌ Error updating package.json: ${error}`);
    process.exit(1);
  }
}

main();
