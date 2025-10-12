module.exports = {
  // Type check TypeScript files
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm run check-types',

  // Lint then format TypeScript and JavaScript files
  '(apps|packages)/**/*.(ts|tsx|js)': filenames => [
    `npx eslint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  // Just format other supported files
  '(apps|packages)/**/*.(json|md)': filenames => [
    `npx prettier --write ${filenames.join(' ')}`,
  ],
};