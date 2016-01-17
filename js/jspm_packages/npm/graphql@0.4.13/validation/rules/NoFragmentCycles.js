/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.cycleErrorMessage = cycleErrorMessage;
exports.NoFragmentCycles = NoFragmentCycles;
var _error = require('../../error/index');
function cycleErrorMessage(fragName, spreadNames) {
  var via = spreadNames.length ? ' via ' + spreadNames.join(', ') : '';
  return 'Cannot spread fragment "' + fragName + '" within itself' + via + '.';
}
function NoFragmentCycles(context) {
  var visitedFrags = Object.create(null);
  var spreadPath = [];
  var spreadPathIndexByName = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      if (!visitedFrags[node.name.value]) {
        detectCycleRecursive(node);
      }
      return false;
    }
  };
  function detectCycleRecursive(fragment) {
    var fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    var spreadNodes = context.getFragmentSpreads(fragment);
    if (spreadNodes.length === 0) {
      return;
    }
    spreadPathIndexByName[fragmentName] = spreadPath.length;
    for (var i = 0; i < spreadNodes.length; i++) {
      var spreadNode = spreadNodes[i];
      var spreadName = spreadNode.name.value;
      var cycleIndex = spreadPathIndexByName[spreadName];
      if (cycleIndex === undefined) {
        spreadPath.push(spreadNode);
        if (!visitedFrags[spreadName]) {
          var spreadFragment = context.getFragment(spreadName);
          if (spreadFragment) {
            detectCycleRecursive(spreadFragment);
          }
        }
        spreadPath.pop();
      } else {
        var cyclePath = spreadPath.slice(cycleIndex);
        context.reportError(new _error.GraphQLError(cycleErrorMessage(spreadName, cyclePath.map(function(s) {
          return s.name.value;
        })), cyclePath.concat(spreadNode)));
      }
    }
    spreadPathIndexByName[fragmentName] = undefined;
  }
}
