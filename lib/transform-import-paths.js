const types = require('./utils/types');

module.exports = function transformImportPaths(babel) {
  const t = types(babel.types);
  return {
    name: 'transform-import-paths',
    visitor: {
      ImportDeclaration(path, state) {
        const transforms = getPathTransforms(state.opts.transform);
        const importPath = path.node.source.value;
        const updatedPath = transformPath(transforms, importPath, { path, state });
        if (updatedPath !== importPath) {
          path.get('source').replaceWith(t.stringLiteral(updatedPath));
        }
      },
      CallExpression(path, state) {
        if (
          t.isStaticSyncRequireExpression(path.node, path.scope)
          || t.isStaticRequireToUrlCallExpression(path.node, path.scope)
        ) {
          const transforms = getPathTransforms(state.opts.transform);
          const importPath = path.node.arguments[0].value;
          const updatedPath = transformPath(transforms, importPath, { path, state });
          if (updatedPath !== importPath) {
            path.get('arguments.0').replaceWith(t.stringLiteral(updatedPath));
          }
        }
      },
    },
  };
};

function getPathTransforms(options) {
  if (!options) { return []; }
  if (Array.isArray(options) && options.every(isValidPathTransform)) { return options; }
  if (isValidPathTransform(options)) { return [options]; }
  throw new Error(`Invalid search patterns: ${options}`);
}

function isValidPathTransform(value) {
  if (!value || (typeof value !== 'object')) { return false; }
  return (('pattern' in value) && ('replace' in value));
}

function transformPath(transforms, inputPath, context) {
  const match = transforms.find(({ pattern }) => matchesPattern(pattern, inputPath));
  if (!match) { return inputPath; }
  const updatedPath = replacePattern(match.pattern, match.replace, inputPath, context);
  if (updatedPath === inputPath) { return inputPath; }
  return transformPath(transforms, updatedPath, context);
}

function matchesPattern(pattern, input) {
  if (typeof pattern === 'string') {
    return (input === pattern);
  } else if (pattern instanceof RegExp) {
    return pattern.test(input);
  } else {
    throw new Error(`Invalid pattern: ${pattern}`);
  }
}

function replacePattern(pattern, replacement, input, context) {
  const replace = (typeof replacement === 'function' ? replacement.bind(context) : replacement);
  return input.replace(pattern, replace);
}
