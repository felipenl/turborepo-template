# Automatic Version Bumping

This monorepo includes automatic version bumping for modified packages and apps when pushing to the remote repository.

## How it works

1. **Pre-push Hook**: When you run `git push`, a pre-push hook is triggered
2. **Change Detection**: The system detects which apps and packages have been modified since the last push
3. **Version Increment**: Each modified project gets its patch version incremented (e.g., `0.1.0` → `0.1.1`)
4. **Auto-commit**: The version changes are automatically committed with a message like `chore: bump versions for apps/web, packages/ui [skip ci]`

## What triggers a version bump

Any changes to files within:

- `apps/[app-name]/` directories
- `packages/[package-name]/` directories

## Manual version bumping

You can also manually trigger version bumping by running:

```bash
pnpm run version-bump
```

This will check for changes and bump versions accordingly.

## Skipping version bumps

If you want to push without triggering version bumps, you can:

1. **Skip the pre-push hook entirely:**

   ```bash
   git push --no-verify
   ```

2. **Or temporarily disable the hook:**
   ```bash
   chmod -x .husky/pre-push
   git push
   chmod +x .husky/pre-push
   ```

## Version bump behavior

- **Patch version increment**: Only the patch version is incremented (third number in semver)
- **Individual project tracking**: Each app/package is versioned independently
- **Skip CI**: Version bump commits include `[skip ci]` to prevent unnecessary CI runs
- **Safe execution**: If version bumping fails for any reason, the push will still proceed

## Files involved

- `.husky/pre-push` - The Husky pre-push hook
- `packages/version-bump/` - The dedicated package that handles version detection and bumping
- Individual `package.json` files in apps and packages

## Example workflow

```bash
# Make changes to the web app
echo "console.log('new feature');" >> apps/web/app/page.tsx

# Commit your changes
git add .
git commit -m "feat: add new feature to web app"

# Push (triggers automatic version bump)
git push

# The system will:
# 1. Detect changes in apps/web/
# 2. Bump apps/web/package.json version from 0.1.1 to 0.1.2
# 3. Commit the version change
# 4. Push everything to remote
```
