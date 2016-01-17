/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.getOperationAST = getOperationAST;
var _languageKinds = require('../language/kinds');
function getOperationAST(documentAST, operationName) {
  var operation = null;
  for (var i = 0; i < documentAST.definitions.length; i++) {
    var definition = documentAST.definitions[i];
    if (definition.kind === _languageKinds.OPERATION_DEFINITION) {
      if (!operationName) {
        if (operation) {
          return null;
        }
        operation = definition;
      } else if (definition.name && definition.name.value === operationName) {
        return definition;
      }
    }
  }
  return operation;
}
