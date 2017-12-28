const types = require('./utils/types');

module.exports = function transformVSCodeModulesLoader(babel) {
  const t = types(babel.types);
  return {
    name: 'transform-vscode-modules-loader',
    visitor: {
      CallExpression(nodePath, state) {
        if (
          t.isStaticSyncRequireExpression(nodePath.node, nodePath.scope)
          && t.isGlobalRequireReference(nodePath.node.callee, nodePath.scope)
        ) {
          const [request] = nodePath.node.arguments;
          nodePath.replaceWith(t.requireExpression(request));
        } else if (t.isStaticAsyncSingleRequireExpression(nodePath.node, nodePath.scope)) {
          const [request, callback] = nodePath.node.arguments;
          nodePath.replaceWith(t.callExpression(callback, [t.requireExpression(request)]));
        } else if (t.isMultipleRequireExpression(nodePath.node, nodePath.scope)) {
          const [requests, callback] = nodePath.node.arguments;
          nodePath.replaceWith(t.callExpression(callback,
            requests.elements.map(t.requireExpression)
          ));
        } else if (t.isGlobalRequireCallExpression(nodePath.node, nodePath.scope)) {
          nodePath.get('callee').replaceWith(t.requireIdentifier());
        } else if (t.isRequireConfigCallExpression(nodePath.node, nodePath.scope)) {
          nodePath.remove();
        } else if (t.isNodeRequireExpression(nodePath.node, nodePath.scope)) {
          nodePath.replaceWith(t.callExpression(t.requireIdentifier(), nodePath.node.arguments));
        }
      },
      UnaryExpression(nodePath, state) {
        if (
          t.isTypeofRequireExpression(nodePath.node, nodePath.scope)
          || t.isTypeofDefineExpression(nodePath.node, nodePath.scope)
          || t.isTypeofRequireConfigExpression(nodePath.node, nodePath.scope)
        ) {
          nodePath.replaceWith(t.stringLiteral('function'));
        } else if (t.isTypeofProcessExpression(nodePath.node, nodePath.scope)) {
          nodePath.replaceWith(t.identifier('undefined'));
        }
      },
      MemberExpression(nodePath, state) {
        if (t.isDefineAmdExpression(nodePath.node, nodePath.scope)) {
          nodePath.replaceWith(t.booleanLiteral(true));
        } else if (t.isGlobalRequireReference(nodePath.node, nodePath.scope)) {
          nodePath.replaceWith(t.functionExpression(null, [], t.blockStatement([
            t.throwError('Invalid runtime require'),
          ])));
        } else if (t.isGlobalDefineReference(nodePath.node, nodePath.scope)) {
          nodePath.replaceWith(t.functionExpression(null, [], t.blockStatement([
            t.throwError('Invalid runtime define'),
          ])));
        }
      },
    },
  };
};
