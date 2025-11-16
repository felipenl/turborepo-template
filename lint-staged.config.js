// lint-staged.config.js
export default {
  '(apps|packages)/**/*.(ts|tsx|js)': filenames => {
    const projectPaths = [...new Set(
      filenames
        .map(file => {
          const match = file.match(/^(apps|packages)\/[^/]+/);
          return match ? match[0] : null;
        })
        .filter(Boolean) // elimina null/undefined
    )];

    return projectPaths.flatMap(projectPath => [
      `cd ${projectPath} && pnpm lint:fix`,
      `cd ${projectPath} && pnpm format`
    ]);
  },

  '(apps|packages)/**/*.(json|md|yml|yaml)': filenames =>
    filenames.map(file => `prettier --write ${file}`)
};
