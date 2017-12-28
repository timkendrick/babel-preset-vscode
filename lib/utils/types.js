module.exports = function types(t) {
  const self = {
    requireIdentifier() {
      return t.identifier('require');
    },
    requireExpression(targetExpression) {
      return t.callExpression(self.requireIdentifier(), [targetExpression]);
    },
    throwError(message) {
      return t.throwStatement(t.newExpression(t.identifier('Error'), [
        t.stringLiteral(message),
      ]));
    },
    isStaticSyncRequireExpression(node, scope) {
      return (
        self.isSyncRequireExpression(node, scope)
        && t.isStringLiteral(node.arguments[0])
      );
    },
    isDynamicSyncRequireExpression(node, scope) {
      return (
        self.isSyncRequireExpression(node, scope)
        && !t.isStringLiteral(node.arguments[0])
      );
    },
    isStaticAsyncSingleRequireExpression(node, scope) {
      return (
        self.isAsyncRequireExpression(node, scope)
        && t.isStringLiteral(node.arguments[0])
      );
    },
    isMultipleRequireExpression(node, scope) {
      return (
        self.isAsyncRequireExpression(node, scope)
        && t.isArrayExpression(node.arguments[0])
      );
    },
    isSyncRequireExpression(node, scope) {
      return (
        self.isRequireCallExpression(node, scope)
        && (node.arguments.length === 1)
      );
    },
    isAsyncRequireExpression(node, scope) {
      return (
        self.isRequireCallExpression(node, scope)
        && ((node.arguments.length === 2) || (node.arguments.length === 3))
      );
    },
    isRequireCallExpression(node, scope) {
      return (
        self.isUnscopedRequireCallExpression(node, scope)
        || self.isGlobalRequireCallExpression(node, scope)
      );
    },
    isDefineCallExpression(node, scope) {
      return (
        self.isUnscopedDefineCallExpression(node, scope)
        || self.isGlobalDefineCallExpression(node, scope)
      );
    },
    isRequireIdentifier(node) {
      return t.isIdentifier(node, { name: 'require' });
    },
    isDefineIdentifier(node, scope) {
      return t.isIdentifier(node, { name: 'define' });
    },
    isProcessIdentifier(node, scope) {
      return t.isIdentifier(node, { name: 'process' });
    },
    isUnscopedRequireIdentifier(node, scope) {
      return (!scope.hasBinding('require') && self.isRequireIdentifier(node));
    },
    isUnscopedDefineIdentifier(node, scope) {
      return (!scope.hasBinding('define') && self.isDefineIdentifier(node));
    },
    isUnscopedProcessIdentifier(node, scope) {
      return (!scope.hasBinding('process') && self.isProcessIdentifier(node));
    },
    isUnscopedRequireCallExpression(node, scope) {
      return (t.isCallExpression(node) && self.isUnscopedRequireIdentifier(node.callee, scope));
    },
    isUnscopedDefineCallExpression(node, scope) {
      return (t.isCallExpression(node) && self.isUnscopedDefineIdentifier(node.callee, scope));
    },
    isGlobalRequireCallExpression(node, scope) {
      return (t.isCallExpression(node) && self.isGlobalRequireReference(node.callee, scope));
    },
    isGlobalDefineCallExpression(node, scope) {
      return (t.isCallExpression(node) && self.isGlobalDefineReference(node.callee, scope));
    },
    isGlobalRequireReference(node, scope) {
      return self.isGlobalReference(node, scope) && self.isRequireIdentifier(node.property);
    },
    isGlobalDefineReference(node, scope) {
      return self.isGlobalReference(node, scope) && self.isDefineIdentifier(node.property, scope);
    },
    isGlobalProcessReference(node, scope) {
      return self.isGlobalReference(node, scope) && self.isProcessIdentifier(node.property, scope);
    },
    isTypeofRequireExpression(node, scope) {
      return (
        self.isTypeofExpression(node)
        && (
          self.isUnscopedRequireIdentifier(node.argument, scope)
          || self.isGlobalRequireReference(node.argument, scope)
        )
      );
    },
    isTypeofDefineExpression(node, scope) {
      return (
        self.isTypeofExpression(node)
        && (
          self.isUnscopedDefineIdentifier(node.argument, scope)
          || self.isGlobalDefineReference(node.argument, scope)
        )
      );
    },
    isTypeofRequireConfigExpression(node, scope) {
      return (self.isTypeofExpression(node) && self.isRequireConfigReference(node.argument, scope));
    },
    isTypeofProcessExpression(node, scope) {
      return (
        self.isTypeofExpression(node)
        && (
          self.isUnscopedProcessIdentifier(node.argument, scope)
          || self.isGlobalProcessReference(node.argument, scope)
        )
      );
    },
    isDefineAmdExpression(node, scope) {
      return (t.isMemberExpression(node)
        && (t.isIdentifier(node.property, { name: 'amd' }))
        && (
          self.isDefineIdentifier(node.object, scope)
          || self.isGlobalDefineReference(node.object, scope)
        )
      );
    },
    isStaticRequireToUrlCallExpression(node, scope) {
      return (
        self.isRequireToUrlCallExpression(node, scope)
        && t.isStringLiteral(node.arguments[0])
      );
    },
    isRequireToUrlCallExpression(node, scope) {
      return (
        t.isCallExpression(node)
        && self.isRequireToUrlReference(node.callee, scope)
        && (node.arguments.length === 1)
      );
    },
    isRequireConfigCallExpression(node, scope) {
      return (
        t.isCallExpression(node)
        && self.isRequireConfigReference(node.callee, scope)
        && (node.arguments.length === 1)
      );
    },
    isNodeRequireExpression(node, scope) {
      return (
        t.isCallExpression(node)
        && self.isNodeRequireReference(node.callee, scope)
        && (node.arguments.length === 1)
      );
    },
    isRequireConfigReference(node, scope) {
      return self.isRequireMethodReference(node, scope, 'config');
    },
    isRequireToUrlReference(node, scope) {
      return self.isRequireMethodReference(node, scope, 'toUrl');
    },
    isNodeRequireReference(node, scope) {
      return self.isRequireMethodReference(node, scope, '__$__nodeRequire');
    },
    isRequireMethodReference(node, scope, method) {
      return (t.isMemberExpression(node)
        && (
          self.isUnscopedRequireIdentifier(node.object, scope)
          || self.isGlobalRequireReference(node.object, scope)
        )
        && t.isIdentifier(node.property, { name: method })
      );
    },
    isGlobalReference(node, scope) {
      return (t.isMemberExpression(node)
        && (
          (t.isIdentifier(node.object, { name: 'window' }) && !scope.hasBinding('window'))
          || (t.isIdentifier(node.object, { name: 'global' }) && !scope.hasBinding('global'))
          || (t.isIdentifier(node.object, { name: 'self' }) && !scope.hasBinding('self'))
        )
      );
    },
    isTypeofExpression(node) {
      return (t.isUnaryExpression(node) && (node.operator === 'typeof'));
    },
  };
  return {
    ...t,
    ...self,
  };
};
