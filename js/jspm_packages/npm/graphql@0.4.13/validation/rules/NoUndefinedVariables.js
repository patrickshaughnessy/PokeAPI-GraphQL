/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.undefinedVarMessage = undefinedVarMessage;
exports.NoUndefinedVariables = NoUndefinedVariables;
var _error = require('../../error/index');
function undefinedVarMessage(varName, opName) {
  return opName ? 'Variable "$' + varName + '" is not defined by operation "' + opName + '".' : 'Variable "$' + varName + '" is not defined.';
}
function NoUndefinedVariables(context) {
  var variableNameDefined = Object.create(null);
  return {
    OperationDefinition: {
      enter: function enter() {
        variableNameDefined = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);
        usages.forEach(function(_ref) {
          var node = _ref.node;
          var varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context.reportError(new _error.GraphQLError(undefinedVarMessage(varName, operation.name && operation.name.value), [node, operation]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(varDefAST) {
      variableNameDefined[varDefAST.variable.name.value] = true;
    }
  };
}
