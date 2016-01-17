/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.unusedVariableMessage = unusedVariableMessage;
exports.NoUnusedVariables = NoUnusedVariables;
var _error = require('../../error/index');
function unusedVariableMessage(varName) {
  return 'Variable "$' + varName + '" is never used.';
}
function NoUnusedVariables(context) {
  var variableDefs = [];
  return {
    OperationDefinition: {
      enter: function enter() {
        variableDefs = [];
      },
      leave: function leave(operation) {
        var variableNameUsed = Object.create(null);
        var usages = context.getRecursiveVariableUsages(operation);
        usages.forEach(function(_ref) {
          var node = _ref.node;
          variableNameUsed[node.name.value] = true;
        });
        variableDefs.forEach(function(variableDef) {
          var variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context.reportError(new _error.GraphQLError(unusedVariableMessage(variableName), [variableDef]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}
