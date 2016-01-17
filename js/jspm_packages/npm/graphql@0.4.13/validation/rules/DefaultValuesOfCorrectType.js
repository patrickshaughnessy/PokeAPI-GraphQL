/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.defaultForNonNullArgMessage = defaultForNonNullArgMessage;
exports.badValueForDefaultArgMessage = badValueForDefaultArgMessage;
exports.DefaultValuesOfCorrectType = DefaultValuesOfCorrectType;
var _error = require('../../error/index');
var _languagePrinter = require('../../language/printer');
var _typeDefinition = require('../../type/definition');
var _utilitiesIsValidLiteralValue = require('../../utilities/isValidLiteralValue');
function defaultForNonNullArgMessage(varName, type, guessType) {
  return 'Variable "$' + varName + '" of type "' + type + '" is required and will not ' + ('use the default value. Perhaps you meant to use type "' + guessType + '".');
}
function badValueForDefaultArgMessage(varName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Variable "$' + varName + ' has invalid default value ' + value + '.' + message;
}
function DefaultValuesOfCorrectType(context) {
  return {
    VariableDefinition: function VariableDefinition(varDefAST) {
      var name = varDefAST.variable.name.value;
      var defaultValue = varDefAST.defaultValue;
      var type = context.getInputType();
      if (type instanceof _typeDefinition.GraphQLNonNull && defaultValue) {
        context.reportError(new _error.GraphQLError(defaultForNonNullArgMessage(name, type, type.ofType), [defaultValue]));
      }
      if (type && defaultValue) {
        var errors = (0, _utilitiesIsValidLiteralValue.isValidLiteralValue)(type, defaultValue);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueForDefaultArgMessage(name, type, (0, _languagePrinter.print)(defaultValue), errors), [defaultValue]));
        }
      }
      return false;
    },
    SelectionSet: function SelectionSet() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}
