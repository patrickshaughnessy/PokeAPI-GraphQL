/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.duplicateFragmentNameMessage = duplicateFragmentNameMessage;
exports.UniqueFragmentNames = UniqueFragmentNames;
var _error = require('../../error/index');
function duplicateFragmentNameMessage(fragName) {
  return 'There can only be one fragment named "' + fragName + '".';
}
function UniqueFragmentNames(context) {
  var knownFragmentNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context.reportError(new _error.GraphQLError(duplicateFragmentNameMessage(fragmentName), [knownFragmentNames[fragmentName], node.name]));
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}
