module.exports = {
  // Type check TypeScript files
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm run check-types',

  // Lint and format files in apps directory
  'apps/**/*.(ts|tsx|js)': filenames => {
    // Group files by their app directory
    const filesByApp = filenames.reduce((acc, file) => {
      const appMatch = file.match(/^apps\/([^/]+)\//);
      if (appMatch) {
        const appName = appMatch[1];
        if (!acc[appName]) acc[appName] = [];
        acc[appName].push(file);
      }
      return acc;
    }, {});

    // Run lint and format for each app
    return Object.entries(filesByApp).flatMap(([appName, files]) => [
      `cd apps/${appName} && npx eslint --fix ${files.map(f => f.replace(`apps/${appName}/`, '')).join(' ')}`,
      `npx prettier --write ${files.join(' ')}`,
    ]);
  },

  // Lint and format files in packages directory
  'packages/**/*.(ts|tsx|js)': filenames => {
    // Group files by their package directory
    const filesByPackage = filenames.reduce((acc, file) => {
      const packageMatch = file.match(/^packages\/([^/]+)\//);
      if (packageMatch) {
        const packageName = packageMatch[1];
        if (!acc[packageName]) acc[packageName] = [];
        acc[packageName].push(file);
      }
      return acc;
    }, {});

    // Run lint and format for each package
    return Object.entries(filesByPackage).flatMap(([packageName, files]) => [
      `cd packages/${packageName} && npx eslint --fix ${files.map(f => f.replace(`packages/${packageName}/`, '')).join(' ')}`,
      `npx prettier --write ${files.join(' ')}`,
    ]);
  },

  // Just format other supported files
  '(apps|packages)/**/*.(json|md)': filenames => [
    `npx prettier --write ${filenames.join(' ')}`,
  ],
};