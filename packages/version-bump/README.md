# `@repo/version-bump`

A utility package for automatically bumping versions of modified projects in a monorepo.

## Features

- Detects modified apps and packages since the last push/commit
- Automatically increments patch versions
- Commits version changes with conventional commit messages
- Supports both programmatic and CLI usage

## Usage

### CLI Usage

```bash
# Run version bump from anywhere in the monorepo
npx @repo/version-bump

# Or via the root script
pnpm run version-bump

# Test the version bump functionality
pnpm --filter @repo/version-bump test
```

### Programmatic Usage

```javascript
import { versionBump, runVersionBump } from '@repo/version-bump';

// Basic usage with error handling built-in
const result = runVersionBump();
if (result.success) {
  console.log('Version bumped for:', result.versionedProjects);
} else {
  console.error('Version bump failed:', result.error);
}

// Advanced usage without built-in error handling
const { versionedProjects } = versionBump();
```

## How it works

1. **Change Detection**: Uses `git diff` to find files modified since the last push or commit
2. **Project Identification**: Identifies which apps (`apps/*/`) and packages (`packages/*/`) contain changes
3. **Version Increment**: Uses `npm version patch` to increment the patch version in each modified project's `package.json`
4. **Auto-commit**: Stages and commits the version changes with a message like `chore: bump versions for apps/web, packages/ui [skip ci]`

## Integration with Husky

This package is designed to work with Husky pre-push hooks:

```bash
# .husky/pre-push
#!/usr/bin/env sh
npx @repo/version-bump
```

## Configuration

The package works out of the box with no configuration required. It follows these conventions:

- **Apps**: Located in `apps/[app-name]/`
- **Packages**: Located in `packages/[package-name]/`
- **Version Type**: Always increments patch version (e.g., `1.0.0` → `1.0.1`)
- **Commit Message**: Uses format `chore: bump versions for [project-list] [skip ci]`

## Error Handling

The package gracefully handles various scenarios:

- No git upstream configured (falls back to comparing with previous commit)
- Missing `package.json` files (skips with warning)
- Failed version increments (logs error but continues with other projects)
- No changes detected (exits cleanly)

## API

### `versionBump()`

Performs the version bump operation and returns a result object.

**Returns:**

```javascript
{
  success: boolean,
  versionedProjects: string[], // Array of project paths that were versioned
  error?: string // Only present if success is false
}
```

### `runVersionBump()`

Same as `versionBump()` but with built-in error handling. Always returns a result object and never throws.
