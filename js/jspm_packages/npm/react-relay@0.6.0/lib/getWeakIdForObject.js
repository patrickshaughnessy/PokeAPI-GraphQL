/* */ 
(function(process) {
  'use strict';
  var KEY = '$getWeakIdForObject';
  if (process.env.NODE_ENV !== 'production') {
    KEY += Math.random().toString(36).slice(2);
  }
  var _nextNodeID = 0;
  function getWeakIdForObject(node) {
    var id = node[KEY];
    if (id == null) {
      id = (_nextNodeID++).toString(36);
      node[KEY] = id;
    }
    return id;
  }
  module.exports = getWeakIdForObject;
})(require('process'));
