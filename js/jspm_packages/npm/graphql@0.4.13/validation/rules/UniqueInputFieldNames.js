/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.duplicateInputFieldMessage = duplicateInputFieldMessage;
exports.UniqueInputFieldNames = UniqueInputFieldNames;
var _error = require('../../error/index');
function duplicateInputFieldMessage(fieldName) {
  return 'There can be only one input field named "' + fieldName + '".';
}
function UniqueInputFieldNames(context) {
  var knownNameStack = [];
  var knownNames = Object.create(null);
  return {
    ObjectValue: {
      enter: function enter() {
        knownNameStack.push(knownNames);
        knownNames = Object.create(null);
      },
      leave: function leave() {
        knownNames = knownNameStack.pop();
      }
    },
    ObjectField: function ObjectField(node) {
      var fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context.reportError(new _error.GraphQLError(duplicateInputFieldMessage(fieldName), [knownNames[fieldName], node.name]));
      } else {
        knownNames[fieldName] = node.name;
      }
      return false;
    }
  };
}
