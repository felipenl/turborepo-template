import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '(apps|packages)/**/*.(ts|tsx|js)': (filenames: readonly string[]) => {
    const projectPaths = [
      ...new Set(
        filenames
          .map(file => {
            const match = file.match(/^(apps|packages)\/[^/]+/);
            return match ? match[0] : null;
          })
          .filter((path): path is string => Boolean(path)),
      ),
    ];

    return projectPaths.flatMap(projectPath => [
      `cd ${projectPath} && pnpm lint:fix`,
      `cd ${projectPath} && pnpm format`,
    ]);
  },

  '(apps|packages)/**/*.(json|md|yml|yaml)': (filenames: readonly string[]) =>
    filenames.map(file => `prettier --write ${file}`),
};

export default config;
