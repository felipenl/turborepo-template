# Automatic Version Bumping

This monorepo includes automatic version bumping for modified packages and apps when merging changes into the master/main branch.

## How it works

1. **Post-merge Hook**: When you merge changes into master or main branch, a post-merge hook is triggered
2. **GitHub Actions**: When a PR is merged via GitHub's interface, a GitHub Actions workflow automatically triggers
3. **Change Detection**: The system detects which apps and packages have been modified in the merged changes
4. **Version Increment**: Each modified project gets its patch version incremented (e.g., `0.1.0` → `0.1.1`)
5. **Auto-commit**: The version changes are automatically committed with a message like `chore: version bump after merge to main [skip ci]`

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
