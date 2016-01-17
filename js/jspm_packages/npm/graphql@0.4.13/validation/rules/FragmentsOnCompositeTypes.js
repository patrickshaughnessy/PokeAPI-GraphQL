/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.inlineFragmentOnNonCompositeErrorMessage = inlineFragmentOnNonCompositeErrorMessage;
exports.fragmentOnNonCompositeErrorMessage = fragmentOnNonCompositeErrorMessage;
exports.FragmentsOnCompositeTypes = FragmentsOnCompositeTypes;
var _error = require('../../error/index');
var _languagePrinter = require('../../language/printer');
var _typeDefinition = require('../../type/definition');
function inlineFragmentOnNonCompositeErrorMessage(type) {
  return 'Fragment cannot condition on non composite type "' + type + '".';
}
function fragmentOnNonCompositeErrorMessage(fragName, type) {
  return 'Fragment "' + fragName + '" cannot condition on non composite ' + ('type "' + type + '".');
}
function FragmentsOnCompositeTypes(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var type = context.getType();
      if (node.typeCondition && type && !(0, _typeDefinition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(inlineFragmentOnNonCompositeErrorMessage((0, _languagePrinter.print)(node.typeCondition)), [node.typeCondition]));
      }
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var type = context.getType();
      if (type && !(0, _typeDefinition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(fragmentOnNonCompositeErrorMessage(node.name.value, (0, _languagePrinter.print)(node.typeCondition)), [node.typeCondition]));
      }
    }
  };
}
