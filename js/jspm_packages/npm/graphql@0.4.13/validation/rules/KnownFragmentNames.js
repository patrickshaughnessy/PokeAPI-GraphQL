/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.unknownFragmentMessage = unknownFragmentMessage;
exports.KnownFragmentNames = KnownFragmentNames;
var _error = require('../../error/index');
function unknownFragmentMessage(fragName) {
  return 'Unknown fragment "' + fragName + '".';
}
function KnownFragmentNames(context) {
  return {FragmentSpread: function FragmentSpread(node) {
      var fragmentName = node.name.value;
      var fragment = context.getFragment(fragmentName);
      if (!fragment) {
        context.reportError(new _error.GraphQLError(unknownFragmentMessage(fragmentName), [node.name]));
      }
    }};
}
