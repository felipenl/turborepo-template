export default {
  // Type check TypeScript files
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm run check-types',

  // Lint and format files in apps and packages directories
  '(apps|packages)/**/*.(ts|tsx|js)': filenames => {
    // Group files by their project directory (apps/name or packages/name)
    const filesByProject = filenames.reduce((acc, file) => {
      const projectMatch = file.match(/^(apps|packages)\/([^/]+)\//);
      if (projectMatch) {
        const [, type, name] = projectMatch;
        const projectPath = `${type}/${name}`;
        if (!acc[projectPath]) acc[projectPath] = [];
        acc[projectPath].push(file);
      }
      return acc;
    }, {});

    // Run lint and format for each project
    return Object.entries(filesByProject).flatMap(([projectPath, files]) => [
      `cd ${projectPath} && npx eslint --fix ${files.map(f => f.replace(`${projectPath}/`, '')).join(' ')}`,
      `npx prettier --write ${files.join(' ')}`,
    ]);
  },

  // Just format other supported files
  '(apps|packages)/**/*.(json|md)': filenames => [
    `npx prettier --write ${filenames.join(' ')}`,
  ],
};