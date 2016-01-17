/* */ 
'use strict';
var util = require('util');
function invariant(condition, format) {
  if (!condition) {
    for (var _len = arguments.length,
        args = Array(_len > 2 ? _len - 2 : 0),
        _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    throw new Error(util.format.apply(util, [format].concat(args)));
  }
}
module.exports = invariant;
