/* */ 
'use strict';
exports.__esModule = true;
exports.diffCss = diffCss;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _base = require('./base');
var _base2 = _interopRequireDefault(_base);
var cssDiff = new _base2['default']();
exports.cssDiff = cssDiff;
cssDiff.tokenize = function(value) {
  return value.split(/([{}:;,]|\s+)/);
};
function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
