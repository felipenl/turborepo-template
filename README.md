# Turborepo Template

A production-ready full-stack monorepo template with Docker, Traefik reverse proxy, automatic SSL, and complete CI/CD infrastructure.

**✨ Features:** TypeScript monorepo • Docker containerization • Auto SSL via Let's Encrypt • GitHub Actions CI/CD • Automated versioning

## Quick Start

### Using This Template

**Option 1: GitHub Template (Recommended)**
1. Click "Use this template" button above
2. Create your new repository
3. Clone and follow setup below

**Option 2: Manual Clone**
```bash
git clone https://github.com/yourusername/turborepo-template.git my-project
cd my-project
rm -rf .git && git init
```

### Local Development Setup

```bash
# Install dependencies
pnpm install

# Create local environment file
cp .env.local.example .env.local

# Start development (no Docker needed)
pnpm dev

# Access:
# - API: http://localhost:4000
# - Web: http://localhost:3000
```

### Production Deployment

See **[📘 Using This Template Guide](./docs/using-this-template.md)** for complete setup instructions.

## Architecture

This monorepo is built with [Turborepo](https://turbo.build/repo) and includes automated development workflows.

### What's Included

**Apps:**
- **`web`**: Next.js 15 application with React 19
- **`api`**: Node.js backend API example with env validation

**Packages:**
- **`@repo/ui`**: Shared React component library
- **`@repo/observability`**: Logging, metrics, and monitoring (Pino-based)
- **`@repo/database`**: Drizzle ORM with extensible database clients (PostgreSQL ready)
- **`@repo/errors`**: Custom error classes (CustomError, ResponseError, AuthError)
- **`@repo/utils`**: Shared utilities (server middleware, JWT, string/date helpers)
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

## Production Infrastructure

This template is **production-ready** with:

- ✅ **Docker**: Multi-stage builds for API and Web apps
- ✅ **Traefik**: Reverse proxy with automatic Let's Encrypt SSL
- ✅ **PostgreSQL**: Containerized database with health checks
- ✅ **Network isolation**: Internal database network + public proxy network
- ✅ **Non-root containers**: Security-hardened images
- ✅ **Health checks**: Readiness probes for all services
- ✅ **CI/CD**: Automated linting, testing, and type checking

### Deployment Options

**Option 1: Docker Compose (Recommended for VPS)**
```bash
# Copy production env file
cp .env.example .env
nano .env  # Update domains and secrets

# Create SSL cert storage
touch infrastructure/traefik/acme/acme.json
chmod 600 infrastructure/traefik/acme/acme.json

# Start all services
docker compose up -d
```

**Option 2: Cloud Platforms**
- Dockerfiles work with: AWS ECS, Google Cloud Run, Azure Container Apps, Railway, Render

See **[📘 Using This Template](./docs/using-this-template.md)** for complete deployment guide.

## Documentation

- **[Using This Template](./docs/using-this-template.md)** - Complete setup and deployment guide
- **[Deployment Automation](./docs/deployment-automation.md)** - CI/CD setup with GitHub Actions
- **[Environment Variables](./docs/environment-variables.md)** - Configuration guide
- **[Version Bumping](./docs/VERSION_BUMPING.md)** - Automated version management
- **[Testing](./TESTING.md)** - Local and production testing guide
- **[Infrastructure](./infrastructure/README.md)** - Traefik and SSL configuration
