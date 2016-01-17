/* */ 
(function(process) {
  'use strict';
  module.exports = function(babel) {
    var t = babel.types;
    var DEV_EXPRESSION = t.binaryExpression('!==', t.memberExpression(t.memberExpression(t.identifier('process'), t.identifier('env'), false), t.identifier('NODE_ENV'), false), t.literal('production'));
    return new babel.Transformer('fbjs.dev-expression', {
      Identifier: {enter: function(node, parent) {
          if (process.env.NODE_ENV === 'test') {
            return undefined;
          }
          if (this.isIdentifier({name: '__DEV__'})) {
            return DEV_EXPRESSION;
          }
        }},
      CallExpression: {exit: function(node, parent) {
          if (process.env.NODE_ENV === 'test') {
            return undefined;
          }
          if (this.get('callee').isIdentifier({name: 'invariant'})) {
            var condition = node.arguments[0];
            return t.ifStatement(t.unaryExpression('!', condition), t.blockStatement([t.ifStatement(DEV_EXPRESSION, t.blockStatement([t.expressionStatement(t.callExpression(node.callee, [t.literal(false)].concat(node.arguments.slice(1))))]), t.blockStatement([t.expressionStatement(t.callExpression(node.callee, [t.literal(false)]))]))]));
          } else if (this.get('callee').isIdentifier({name: 'warning'})) {
            return t.ifStatement(DEV_EXPRESSION, t.blockStatement([t.expressionStatement(node)]));
          }
        }}
    });
  };
})(require('process'));
