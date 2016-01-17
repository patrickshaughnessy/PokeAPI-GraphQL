/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.unknownDirectiveMessage = unknownDirectiveMessage;
exports.misplacedDirectiveMessage = misplacedDirectiveMessage;
exports.KnownDirectives = KnownDirectives;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _error = require('../../error/index');
var _jsutilsFind = require('../../jsutils/find');
var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);
var _languageKinds = require('../../language/kinds');
function unknownDirectiveMessage(directiveName) {
  return 'Unknown directive "' + directiveName + '".';
}
function misplacedDirectiveMessage(directiveName, placement) {
  return 'Directive "' + directiveName + '" may not be used on "' + placement + '".';
}
function KnownDirectives(context) {
  return {Directive: function Directive(node, key, parent, path, ancestors) {
      var directiveDef = (0, _jsutilsFind2['default'])(context.getSchema().getDirectives(), function(def) {
        return def.name === node.name.value;
      });
      if (!directiveDef) {
        context.reportError(new _error.GraphQLError(unknownDirectiveMessage(node.name.value), [node]));
        return;
      }
      var appliedTo = ancestors[ancestors.length - 1];
      switch (appliedTo.kind) {
        case _languageKinds.OPERATION_DEFINITION:
          if (!directiveDef.onOperation) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'operation'), [node]));
          }
          break;
        case _languageKinds.FIELD:
          if (!directiveDef.onField) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'field'), [node]));
          }
          break;
        case _languageKinds.FRAGMENT_SPREAD:
        case _languageKinds.INLINE_FRAGMENT:
        case _languageKinds.FRAGMENT_DEFINITION:
          if (!directiveDef.onFragment) {
            context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, 'fragment'), [node]));
          }
          break;
      }
    }};
}
