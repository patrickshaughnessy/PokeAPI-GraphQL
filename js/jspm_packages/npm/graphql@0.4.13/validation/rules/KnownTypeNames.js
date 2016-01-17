/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.unknownTypeMessage = unknownTypeMessage;
exports.KnownTypeNames = KnownTypeNames;
var _error = require('../../error/index');
function unknownTypeMessage(type) {
  return 'Unknown type "' + type + '".';
}
function KnownTypeNames(context) {
  return {NamedType: function NamedType(node) {
      var typeName = node.name.value;
      var type = context.getSchema().getType(typeName);
      if (!type) {
        context.reportError(new _error.GraphQLError(unknownTypeMessage(typeName), [node]));
      }
    }};
}
