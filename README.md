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

**Apps:**
- **`web`**: Next.js 15 application with React 19
- **`api`**: Node.js backend API example with env validation

**Packages:**
- **`@repo/ui`**: Shared React component library
- **`@repo/eslint-config`**: ESLint configurations (base, backend, React, Next.js)
- **`@repo/typescript-config`**: Shared TypeScript configurations
- **`@repo/test-config`**: Vitest testing infrastructure
- **`@repo/version-bump`**: Automated version management system

All apps/packages include TypeScript, ESLint, Prettier, and testing support.

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

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Manual version bump
pnpm version-bump

# Test version bump functionality
pnpm test:version-bump
```

### Environment Variables

Environment variables use a **hierarchical structure**:
- **Root `.env`** - Shared variables (database, APIs)
- **App `.env.local`** - App-specific configuration

Setup:
```bash
# Copy root shared env
cp .env.example .env

# Copy app-specific env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local

# Fill in actual values
```

See [Environment Variables Guide](./docs/environment-variables.md) for complete documentation

```

### Git Workflow

1. **Pre-commit**: Automatically lints and formats staged files
2. **Commit message**: Validates conventional commit format
3. **Post-merge**: Automatically bumps versions for modified packages when merging to master/main

## Template Features

- ✅ **Monorepo**: Turborepo for fast, scalable builds
- ✅ **TypeScript**: Full type safety across all packages
- ✅ **ESLint 9**: Flat config with base, backend, React, and Next.js presets
- ✅ **Prettier**: Integrated code formatting
- ✅ **Vitest**: Fast unit testing with coverage
- ✅ **Environment Variables**: Documented .env pattern with validation
- ✅ **CI/CD**: GitHub Actions for linting, testing, and building
- ✅ **Husky**: Git hooks for automated workflows
- ✅ **lint-staged**: Fast, incremental linting on commit
- ✅ **Auto-versioning**: Automatic version bumping on merge
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

- [Environment Variables Guide](./docs/environment-variables.md) - Setup and best practices
- [Version Bumping Guide](./docs/VERSION_BUMPING.md) - Automatic version management
- [ESLint Config](./packages/eslint-config/README.md) - Shared linting configurations
- [Test Config](./packages/test-config/README.md) - Vitest testing setup
- [Version Bump Package](./packages/version-bump/README.md) - Version management utilities

## Before Production

This template is development-ready. Before deploying to production, add:

- [ ] **Dockerfile** for each app (containerization)
- [ ] **docker-compose.yml** (orchestration)
- [ ] **Deployment pipeline** (deploy workflow in `.github/workflows/`)
- [ ] **Environment secrets** (use secret management, not plain env vars)
- [ ] **Monitoring** (APM, error tracking)
- [ ] **Security hardening** (rate limiting, CSP headers, etc.)
- [ ] **Database migrations** (if using a database)
- [ ] **Health checks** (liveness/readiness endpoints)

For a production-ready infrastructure setup with Docker, Traefik, monitoring, and security hardening, see our [Production Deployment Guide](./docs/production-deployment.md) (if available).
