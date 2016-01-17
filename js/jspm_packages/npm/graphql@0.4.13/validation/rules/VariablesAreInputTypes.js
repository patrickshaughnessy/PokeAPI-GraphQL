/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.nonInputTypeOnVarMessage = nonInputTypeOnVarMessage;
exports.VariablesAreInputTypes = VariablesAreInputTypes;
var _error = require('../../error/index');
var _languagePrinter = require('../../language/printer');
var _typeDefinition = require('../../type/definition');
var _utilitiesTypeFromAST = require('../../utilities/typeFromAST');
function nonInputTypeOnVarMessage(variableName, typeName) {
  return 'Variable "$' + variableName + '" cannot be non-input type "' + typeName + '".';
}
function VariablesAreInputTypes(context) {
  return {VariableDefinition: function VariableDefinition(node) {
      var type = (0, _utilitiesTypeFromAST.typeFromAST)(context.getSchema(), node.type);
      if (type && !(0, _typeDefinition.isInputType)(type)) {
        var variableName = node.variable.name.value;
        context.reportError(new _error.GraphQLError(nonInputTypeOnVarMessage(variableName, (0, _languagePrinter.print)(node.type)), [node.type]));
      }
    }};
}
