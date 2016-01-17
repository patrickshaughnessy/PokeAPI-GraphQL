/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.typeFromAST = typeFromAST;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _languageKinds = require('../language/kinds');
var _typeDefinition = require('../type/definition');
function typeFromAST(schema, inputTypeAST) {
  var innerType;
  if (inputTypeAST.kind === _languageKinds.LIST_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new _typeDefinition.GraphQLList(innerType);
  }
  if (inputTypeAST.kind === _languageKinds.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new _typeDefinition.GraphQLNonNull(innerType);
  }
  (0, _jsutilsInvariant2['default'])(inputTypeAST.kind === _languageKinds.NAMED_TYPE, 'Must be a named type.');
  return schema.getType(inputTypeAST.name.value);
}
