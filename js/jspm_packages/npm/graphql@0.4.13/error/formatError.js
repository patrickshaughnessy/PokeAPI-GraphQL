/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.formatError = formatError;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
function formatError(error) {
  (0, _jsutilsInvariant2['default'])(error, 'Received null or undefined error.');
  return {
    message: error.message,
    locations: error.locations
  };
}
