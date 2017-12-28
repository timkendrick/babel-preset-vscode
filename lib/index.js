const transformVscodeModules = require('./transform-vscode-modules');
const transformImportPaths = require('./transform-import-paths');

module.exports = function presetVSCode() {
  return {
    plugins: [
      transformVscodeModules,
      [transformImportPaths, {
        transform: [
          {
            pattern: /vs\/css!(.*?)(?:\.css)?$/,
            replace: '$1.css',
          },
        ],
      }],
    ],
  };
};
