/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.anonOperationNotAloneMessage = anonOperationNotAloneMessage;
exports.LoneAnonymousOperation = LoneAnonymousOperation;
var _error = require('../../error/index');
var _languageKinds = require('../../language/kinds');
function anonOperationNotAloneMessage() {
  return 'This anonymous operation must be the only defined operation.';
}
function LoneAnonymousOperation(context) {
  var operationCount = 0;
  return {
    Document: function Document(node) {
      operationCount = node.definitions.filter(function(definition) {
        return definition.kind === _languageKinds.OPERATION_DEFINITION;
      }).length;
    },
    OperationDefinition: function OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(new _error.GraphQLError(anonOperationNotAloneMessage(), [node]));
      }
    }
  };
}
