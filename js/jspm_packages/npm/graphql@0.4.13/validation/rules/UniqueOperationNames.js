/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.duplicateOperationNameMessage = duplicateOperationNameMessage;
exports.UniqueOperationNames = UniqueOperationNames;
var _error = require('../../error/index');
function duplicateOperationNameMessage(operationName) {
  return 'There can only be one operation named "' + operationName + '".';
}
function UniqueOperationNames(context) {
  var knownOperationNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition(node) {
      var operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(new _error.GraphQLError(duplicateOperationNameMessage(operationName.value), [knownOperationNames[operationName.value], operationName]));
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}
