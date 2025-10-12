# Turborepo Template

A production-ready monorepo template with automated development workflows, comprehensive linting, formatting, and version management.

## Quick Start

```bash
# Clone the template
git clone <your-repo-url> my-project
cd my-project

# Run setup script (optional)
./setup.sh

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Architecture

This monorepo is built with [Turborepo](https://turbo.build/repo) and includes automated development workflows.

### What's Included

- **`web`**: Example Next.js application
- **`@repo/ui`**: Shared React component library
- **`@repo/eslint-config`**: Comprehensive ESLint configurations (base + React)
- **`@repo/typescript-config`**: Shared TypeScript configurations  
- **`@repo/version-bump`**: Automated version management system

All packages include TypeScript, ESLint, and Prettier configurations.

## Development Workflow

This project includes automated development workflows powered by:

- **Husky**: Git hooks for pre-commit and post-merge automation
- **lint-staged**: Automatic linting and formatting of staged files
- **Automatic versioning**: Modified packages are automatically version-bumped on merge to master/main (supports both local merges and GitHub PR merges)
- **Conventional commits**: Enforced commit message format

## Using This Template

1. **Clone or fork this repository**
2. **Rename the directory** to match your project
3. **Run the setup script** (optional): `./setup.sh`
4. **Install dependencies**: `pnpm install`
5. **Start developing**: `pnpm dev`

### Quick Start

```bash
pnpm install
```

### Development Commands

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build all packages
pnpm build

# Build specific package
pnpm build --filter=web

# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm check-types

# Manual version bump
pnpm version-bump

# Test version bump functionality
pnpm test:version-bump
```

### Git Workflow

1. **Pre-commit**: Automatically lints and formats staged files
2. **Commit message**: Validates conventional commit format
3. **Post-merge**: Automatically bumps versions for modified packages when merging to master/main

## Template Features

- ✅ **Monorepo**: Turborepo for fast, scalable builds
- ✅ **TypeScript**: Full type safety across all packages
- ✅ **ESLint**: Comprehensive linting with base and React configs
- ✅ **Prettier**: Consistent code formatting
- ✅ **Husky**: Git hooks for automated workflows
- ✅ **lint-staged**: Fast, incremental linting
- ✅ **Auto-versioning**: Automatic version bumping on merge to master/main
- ✅ **Conventional commits**: Enforced commit message format

## Template Usage

### For GitHub Template Repository

1. Click "Use this template" button
2. Create your new repository
3. Clone and run `./setup.sh`

### For Manual Setup

1. Clone: `git clone <repo-url> my-project`
2. Remove git history: `rm -rf .git && git init`
3. Run setup: `./setup.sh`

## Customization

1. **Update project name** in root `package.json`
2. **Modify apps** in `apps/` directory for your use case
3. **Add packages** in `packages/` directory as needed
4. **Configure ESLint** rules in `packages/eslint-config/`
5. **Adjust git hooks** in `.husky/` if needed

## Package Structure

Each package follows consistent patterns:
- `eslint.config.js` - ESLint configuration
- `package.json` - Package metadata and scripts  
- `tsconfig.json` - TypeScript configuration

### Documentation

- [Version Bumping Guide](./docs/VERSION_BUMPING.md) - Automatic version management
- [ESLint Config](./packages/eslint-config/README.md) - Shared linting configurations
- [Version Bump Package](./packages/version-bump/README.md) - Version management utilities
