/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.missingFieldArgMessage = missingFieldArgMessage;
exports.missingDirectiveArgMessage = missingDirectiveArgMessage;
exports.ProvidedNonNullArguments = ProvidedNonNullArguments;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _error = require('../../error/index');
var _jsutilsKeyMap = require('../../jsutils/keyMap');
var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);
var _typeDefinition = require('../../type/definition');
function missingFieldArgMessage(fieldName, argName, type) {
  return 'Field "' + fieldName + '" argument "' + argName + '" of type "' + type + '" ' + 'is required but not provided.';
}
function missingDirectiveArgMessage(directiveName, argName, type) {
  return 'Directive "@' + directiveName + '" argument "' + argName + '" of type ' + ('"' + type + '" is required but not provided.');
}
function ProvidedNonNullArguments(context) {
  return {
    Field: {leave: function leave(fieldAST) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        var argASTs = fieldAST.arguments || [];
        var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function(arg) {
          return arg.name.value;
        });
        fieldDef.args.forEach(function(argDef) {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof _typeDefinition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingFieldArgMessage(fieldAST.name.value, argDef.name, argDef.type), [fieldAST]));
          }
        });
      }},
    Directive: {leave: function leave(directiveAST) {
        var directiveDef = context.getDirective();
        if (!directiveDef) {
          return false;
        }
        var argASTs = directiveAST.arguments || [];
        var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function(arg) {
          return arg.name.value;
        });
        directiveDef.args.forEach(function(argDef) {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof _typeDefinition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingDirectiveArgMessage(directiveAST.name.value, argDef.name, argDef.type), [directiveAST]));
          }
        });
      }}
  };
}
