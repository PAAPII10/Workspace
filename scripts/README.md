# Scripts

This directory contains utility scripts for the Arvasit monorepo workspace.

## generate-library-exports.ts

Automatically generates the `exports` field for any library/domain/package in the workspace.

### Purpose

- Scans the `src` directory for `.ts` files and subdirectories
- For each file/directory:
  - If it has an `index.ts`, adds a barrel export for that directory
  - If it's an individual `.ts` file (not a test or index), adds an export mapping
- Skips test files (`.spec.ts`, `.test.ts`) and test directories (starting with `__`)
- Overwrites the `exports` field in `package.json`

### Usage

```bash
# Using pnpm script (recommended)
pnpm generate-exports <library-name>

# Using ts-node directly
pnpm ts-node scripts/generate-library-exports.ts <library-name>
```

### Examples

```bash
# Generate exports for utils library
pnpm generate-exports utils

# Generate exports for users domain
pnpm generate-exports users

# Generate exports for sdk package
pnpm generate-exports sdk
```

### Supported Libraries

The script looks for libraries in the following directories:

- `libs/<name>` (e.g., `libs/utils`, `libs/components`)
- `domains/<name>` (e.g., `domains/users`, `domains/products`)
- `packages/<name>` (e.g., `packages/sdk`)

### Generated Exports Format

The script generates exports in the following format:

```json
{
  "./": {
    "types": "./dist/index.d.ts",
    "require": "./dist/index.js",
    "import": "./dist/index.js"
  },
  "./path/to/file": {
    "types": "./dist/path/to/file.d.ts",
    "require": "./dist/path/to/file.js",
    "import": "./dist/path/to/file.js"
  }
}
```

### Example Output

If you have the following structure in `domains/users/src/`:

```
src/
├── index.ts
├── dto/
│   └── create-user.dto.ts
├── schema/
│   └── user.schema.ts
└── types/
    └── user.types.ts
```

The script will generate:

```json
{
  "./": {
    "types": "./dist/index.d.ts",
    "require": "./dist/index.js",
    "import": "./dist/index.js"
  },
  "./dto/create-user.dto": {
    "types": "./dist/dto/create-user.dto.d.ts",
    "require": "./dist/dto/create-user.dto.js",
    "import": "./dist/dto/create-user.dto.js"
  },
  "./schema/user.schema": {
    "types": "./dist/schema/user.schema.d.ts",
    "require": "./dist/schema/user.schema.js",
    "import": "./dist/schema/user.schema.js"
  },
  "./types/user.types": {
    "types": "./dist/types/user.types.d.ts",
    "require": "./dist/types/user.types.js",
    "import": "./dist/types/user.types.js"
  }
}
```

### Notes

- The script automatically detects directories with `index.ts` files and creates barrel exports
- Individual `.ts` files are exported as separate modules
- Test files and test directories are automatically skipped
- The script provides detailed logging of what files and directories were included

