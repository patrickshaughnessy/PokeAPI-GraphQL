/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.badValueMessage = badValueMessage;
exports.ArgumentsOfCorrectType = ArgumentsOfCorrectType;
var _error = require('../../error/index');
var _languagePrinter = require('../../language/printer');
var _utilitiesIsValidLiteralValue = require('../../utilities/isValidLiteralValue');
function badValueMessage(argName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Argument "' + argName + '" has invalid value ' + value + '.' + message;
}
function ArgumentsOfCorrectType(context) {
  return {Argument: function Argument(argAST) {
      var argDef = context.getArgument();
      if (argDef) {
        var errors = (0, _utilitiesIsValidLiteralValue.isValidLiteralValue)(argDef.type, argAST.value);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueMessage(argAST.name.value, argDef.type, (0, _languagePrinter.print)(argAST.value), errors), [argAST.value]));
        }
      }
      return false;
    }};
}
