# Workspace Scripts

This directory contains advanced workspace management scripts for the Arvasit monorepo.

## run-script.ts

A sophisticated script for running commands across the workspace with dependency ordering and parallel execution support.

### Features

- **Dependency-Aware Execution**: Automatically detects internal dependencies and runs commands in the correct order
- **Parallel Execution**: Run commands in parallel while respecting dependency order
- **Package Discovery**: Automatically discovers packages in `libs/`, `domains/`, `packages/`, and `apps/`
- **Error Handling**: Comprehensive error handling with clear error messages
- **Circular Dependency Detection**: Detects and reports circular dependencies

### Usage

```bash
# Basic usage
pnpm ts-node scripts/workspace/run-script.ts <package-folder> <command-name> [--parallel]

# Using pnpm script aliases
pnpm run <package-folder> <command-name> [--parallel]
```

### Examples

```bash
# Build all packages in dependency order
pnpm ts-node scripts/workspace/run-script.ts all build

# Run dev commands in parallel for apps
pnpm ts-node scripts/workspace/run-script.ts apps dev --parallel

# Build only libraries
pnpm ts-node scripts/workspace/run-script.ts libs build

# Run linting for all packages
pnpm ts-node scripts/workspace/run-script.ts all lint

# Using pnpm script aliases
pnpm run all build
pnpm run apps dev --parallel
pnpm run libs build
```

### Package Folders

- `all` - All packages (libs, domains, packages, apps)
- `libs` - Library packages only
- `domains` - Domain packages only
- `packages` - Package packages only
- `apps` - Application packages only

### Commands

Any command defined in the `scripts` section of a package's `package.json` can be run.

Common commands:

- `build` - Build the package
- `dev` - Start development server
- `lint` - Run linting
- `format` - Format code
- `type-check` - Run TypeScript type checking
- `test` - Run tests

### Parallel Execution

Use the `--parallel` flag to run commands in parallel while respecting dependency order:

```bash
# Start all apps in parallel
pnpm ts-node scripts/workspace/run-script.ts apps dev --parallel

# Run tests in parallel for all packages
pnpm ts-node scripts/workspace/run-script.ts all test --parallel
```

### Dependency Resolution

The script automatically:

1. Discovers all packages in the specified folder(s)
2. Analyzes internal dependencies (packages starting with `@arvasit/`)
3. Performs topological sorting to determine execution order
4. Executes commands in the correct dependency order

### Error Handling

- **Circular Dependencies**: Detects and reports circular dependency chains
- **Missing Commands**: Skips packages that don't have the specified command
- **Command Failures**: Stops execution on first failure with clear error messages
- **Invalid Packages**: Warns about packages with invalid `package.json` files

### Output

The script provides detailed logging:

- Shows which packages are being processed
- Indicates dependency order
- Reports success/failure for each package
- Provides summary statistics

### Integration with PNPM

The script uses `pnpm --filter` to run commands in specific packages, ensuring:

- Proper workspace context
- Correct dependency resolution
- Consistent behavior with other pnpm commands

### Best Practices

1. **Use for Complex Workflows**: When you need dependency-aware execution
2. **Parallel for Long-Running Commands**: Use `--parallel` for dev servers, tests, etc.
3. **Sequential for Builds**: Use without `--parallel` for build commands that depend on each other
4. **Test First**: Always test with a subset of packages before running on all packages
