/* */ 
(function(process) {
  'use strict';
  function mapModule(context, module) {
    var moduleMap = context.state.opts._moduleMap || {};
    if (moduleMap.hasOwnProperty(module)) {
      return moduleMap[module];
    }
    if (process.env.NODE_ENV !== 'test') {
      var modulePrefix = context.state.opts._modulePrefix || './';
      return modulePrefix + module;
    }
  }
  module.exports = function(babel) {
    var t = babel.types;
    function transformRequireCall(context, call) {
      if (!t.isIdentifier(call.callee, {name: 'require'}) && !(t.isMemberExpression(call.callee) && t.isIdentifier(call.callee.object, {name: 'require'}) && t.isIdentifier(call.callee.property, {name: 'requireActual'}))) {
        return;
      }
      var moduleArg = call.arguments[0];
      if (moduleArg && moduleArg.type === 'Literal') {
        var module = mapModule(context, moduleArg.value);
        if (module) {
          return t.callExpression(call.callee, [t.literal(module)]);
        }
      }
    }
    function transformJestCall(context, call) {
      if (!t.isMemberExpression(call.callee)) {
        return;
      }
      var object;
      var member = call.callee;
      if (t.isIdentifier(member.object, {name: 'jest'})) {
        object = member.object;
      } else if (t.isCallExpression(member.object)) {
        object = transformJestCall(context, member.object);
      }
      if (!object) {
        return;
      }
      var args = call.arguments;
      if (args[0] && args[0].type === 'Literal' && (t.isIdentifier(member.property, {name: 'dontMock'}) || t.isIdentifier(member.property, {name: 'mock'}) || t.isIdentifier(member.property, {name: 'genMockFromModule'}))) {
        var module = mapModule(context, args[0].value);
        if (module) {
          args = [t.literal(module)];
        }
      }
      return t.callExpression(t.memberExpression(object, member.property), args);
    }
    return new babel.Transformer('fbjs.rewrite-modules', {CallExpression: {exit: function(node, parent) {
          return (transformRequireCall(this, node) || transformJestCall(this, node));
        }}});
  };
})(require('process'));
