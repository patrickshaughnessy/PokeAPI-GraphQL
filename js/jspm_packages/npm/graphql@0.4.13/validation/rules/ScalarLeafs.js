/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.noSubselectionAllowedMessage = noSubselectionAllowedMessage;
exports.requiredSubselectionMessage = requiredSubselectionMessage;
exports.ScalarLeafs = ScalarLeafs;
var _error = require('../../error/index');
var _typeDefinition = require('../../type/definition');
function noSubselectionAllowedMessage(field, type) {
  return 'Field "' + field + '" of type "' + type + '" must not have a sub selection.';
}
function requiredSubselectionMessage(field, type) {
  return 'Field "' + field + '" of type "' + type + '" must have a sub selection.';
}
function ScalarLeafs(context) {
  return {Field: function Field(node) {
      var type = context.getType();
      if (type) {
        if ((0, _typeDefinition.isLeafType)(type)) {
          if (node.selectionSet) {
            context.reportError(new _error.GraphQLError(noSubselectionAllowedMessage(node.name.value, type), [node.selectionSet]));
          }
        } else if (!node.selectionSet) {
          context.reportError(new _error.GraphQLError(requiredSubselectionMessage(node.name.value, type), [node]));
        }
      }
    }};
}
