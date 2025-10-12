export default {
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm run check-types',

  '(apps|packages)/**/*.(ts|tsx|js)': filenames => {
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

    return Object.entries(filesByProject).flatMap(([projectPath, files]) => [
      `cd ${projectPath} && npx eslint --fix ${files.map(f => f.replace(`${projectPath}/`, '')).join(' ')}`,
      `npx prettier --write ${files.join(' ')}`,
    ]);
  },

  '(apps|packages)/**/*.(json|md)': filenames => [`npx prettier --write ${filenames.join(' ')}`],
};
