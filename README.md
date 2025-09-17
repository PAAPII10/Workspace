# Arvasit PNPM Monorepo Workspace

A comprehensive monorepo workspace using PNPM with apps, libs, domains, and packages, all scoped under `@arvasit`.

## Structure

```
├── apps/
│   ├── backend/          # NestJS backend application (@arvasit/backend)
│   ├── web/              # Next.js web frontend (@arvasit/web)
│   └── admin/            # Next.js admin dashboard (@arvasit/admin)
├── libs/
│   ├── types/            # Shared TypeScript types (@arvasit/types)
│   ├── utils/            # Common utility functions (@arvasit/utils)
│   ├── schemas/          # Global validation schemas (@arvasit/schemas)
│   └── components/       # Shared React component library (@arvasit/components)
├── domains/
│   ├── users/            # Users feature module (@arvasit/users)
│   └── products/         # Products feature module (@arvasit/products)
└── packages/
    └── sdk/              # API client SDK (@arvasit/sdk)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PNPM >= 8.0.0

### Installation

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Run all apps in development
pnpm dev

# Run specific app
pnpm --filter @arvasit/backend dev
pnpm --filter @arvasit/web dev
pnpm --filter @arvasit/admin dev
```

## Available Scripts

- `pnpm build` - Build all apps/packages in topological order
- `pnpm dev` - Run all apps in parallel
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages with Prettier
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build outputs
- `pnpm storybook` - Start Storybook for components
- `pnpm build-storybook` - Build Storybook static files
- `pnpm generate-exports <library-name>` - Generate exports for a library/domain/package
- `pnpm run <package-folder> <command>` - Run commands with dependency ordering
- `pnpm run:build` - Build all packages in dependency order
- `pnpm run:dev` - Start all apps in parallel
- `pnpm run:lint` - Lint all packages
- `pnpm run:format` - Format all packages
- `pnpm run:type-check` - Type check all packages

## Package Details

### Apps

- **@arvasit/backend** - NestJS backend API server (port 3001)
- **@arvasit/web** - Next.js web frontend (port 3000)
- **@arvasit/admin** - Next.js admin dashboard (port 3002)

### Libraries

- **@arvasit/types** - Shared TypeScript types and interfaces
- **@arvasit/utils** - Common utility functions
- **@arvasit/schemas** - Zod validation schemas
- **@arvasit/components** - React component library with Storybook

### Domains

- **@arvasit/users** - User management DTOs, schemas, and types
- **@arvasit/products** - Product management DTOs, schemas, and types

### Packages

- **@arvasit/sdk** - API client SDK for consuming backend services

## Development

### TypeScript Path Resolution

All packages use TypeScript path mapping for clean imports with `@arvasit/*` scope:

```typescript
import { CreateUserDto } from '@arvasit/users';
import { UserSchema } from '@arvasit/schemas';
import { Button } from '@arvasit/components';
import { formatCurrency } from '@arvasit/utils';
import { ApiClient } from '@arvasit/sdk';
```

### Component Library

The component library includes:

- Tailwind CSS for styling
- TypeScript support
- Storybook for documentation
- Both CJS and ESM builds via tsup

To run Storybook:

```bash
pnpm storybook
```

### Building

The build process follows topological ordering:

1. Libraries (types, utils, schemas)
2. Components (depends on types, utils)
3. Domains (depends on types, schemas)
4. SDK (depends on all above)
5. Apps (depend on all packages)

## Example Usage

### Using the SDK

```typescript
import { createApiClient } from '@arvasit/sdk';
import { CreateUserDto } from '@arvasit/users';
import { CreateProductDto } from '@arvasit/products';

const apiClient = createApiClient({
  baseUrl: 'http://localhost:3001',
  apiKey: 'your-api-key',
});

// Create a user
const userData: CreateUserDto = {
  email: 'user@example.com',
  name: 'John Doe',
  password: 'securepassword',
};

const userResponse = await apiClient.createUser(userData);

// Create a product
const productData: CreateProductDto = {
  name: 'Example Product',
  price: 99.99,
  category: 'electronics',
  sku: 'PROD-001',
};

const productResponse = await apiClient.createProduct(productData);
```

### Using Components

```typescript
import { Button } from '@arvasit/components';
import { formatCurrency } from '@arvasit/utils';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Click me
      </Button>
      <p>Price: {formatCurrency(99.99)}</p>
    </div>
  );
}
```

### Export Generation

The workspace includes an automated script to generate `exports` fields for all libraries, domains, and packages:

```bash
# Generate exports for a specific library
pnpm generate-exports utils
pnpm generate-exports users
pnpm generate-exports components

# Or use ts-node directly
pnpm ts-node scripts/generate-library-exports.ts <library-name>
```

The script automatically:

- Scans the `src` directory for `.ts` files and subdirectories
- Creates barrel exports for directories with `index.ts` files
- Creates individual exports for standalone `.ts` files
- Skips test files and test directories
- Updates the `package.json` with proper export mappings

This enables clean imports like:

```typescript
import { CreateUserDto } from '@arvasit/users/dto';
import { formatCurrency } from '@arvasit/utils/string';
import { Button } from '@arvasit/components';
```

### Advanced Workspace Management

The workspace includes a sophisticated `run-script.ts` for dependency-aware command execution:

```bash
# Build all packages in dependency order
pnpm run all build

# Start all apps in parallel
pnpm run apps dev --parallel

# Run specific commands for specific package types
pnpm run libs build
pnpm run domains test
pnpm run packages lint
```

**Key Features:**

- **Dependency Ordering**: Automatically runs commands in the correct order based on internal dependencies
- **Parallel Execution**: Run commands in parallel while respecting dependency order
- **Package Discovery**: Automatically finds packages in `libs/`, `domains/`, `packages/`, and `apps/`
- **Error Handling**: Comprehensive error handling with clear messages
- **Circular Dependency Detection**: Detects and reports circular dependencies

**Use Cases:**

- Complex build processes that need dependency ordering
- Running development servers in parallel
- Batch operations across multiple package types
- CI/CD workflows that need reliable execution order

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm format`
4. Run `pnpm type-check`
5. Submit a pull request

## License

MIT
