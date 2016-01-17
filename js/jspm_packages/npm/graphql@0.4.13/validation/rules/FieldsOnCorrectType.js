/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.undefinedFieldMessage = undefinedFieldMessage;
exports.FieldsOnCorrectType = FieldsOnCorrectType;
var _error = require('../../error/index');
function undefinedFieldMessage(fieldName, type) {
  return 'Cannot query field "' + fieldName + '" on "' + type + '".';
}
function FieldsOnCorrectType(context) {
  return {Field: function Field(node) {
      var type = context.getParentType();
      if (type) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          context.reportError(new _error.GraphQLError(undefinedFieldMessage(node.name.value, type.name), [node]));
        }
      }
    }};
}
