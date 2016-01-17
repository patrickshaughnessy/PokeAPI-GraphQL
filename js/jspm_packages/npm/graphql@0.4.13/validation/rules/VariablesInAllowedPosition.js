/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.badVarPosMessage = badVarPosMessage;
exports.VariablesInAllowedPosition = VariablesInAllowedPosition;
var _error = require('../../error/index');
var _typeDefinition = require('../../type/definition');
var _utilitiesTypeComparators = require('../../utilities/typeComparators');
var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');
function badVarPosMessage(varName, varType, expectedType) {
  return 'Variable "$' + varName + '" of type "' + varType + '" used in position ' + ('expecting type "' + expectedType + '".');
}
function VariablesInAllowedPosition(context) {
  var varDefMap = Object.create(null);
  return {
    OperationDefinition: {
      enter: function enter() {
        varDefMap = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);
        usages.forEach(function(_ref) {
          var node = _ref.node;
          var type = _ref.type;
          var varName = node.name.value;
          var varDef = varDefMap[varName];
          if (varDef && type) {
            var varType = (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), varDef.type);
            if (varType && !(0, _utilitiesTypeComparators.isTypeSubTypeOf)(effectiveType(varType, varDef), type)) {
              context.reportError(new _error.GraphQLError(badVarPosMessage(varName, varType, type), [varDef, node]));
            }
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(varDefAST) {
      varDefMap[varDefAST.variable.name.value] = varDefAST;
    }
  };
}
function effectiveType(varType, varDef) {
  return !varDef.defaultValue || varType instanceof _typeDefinition.GraphQLNonNull ? varType : new _typeDefinition.GraphQLNonNull(varType);
}
