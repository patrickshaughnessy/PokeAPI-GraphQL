/* */ 
'use strict';
exports.__esModule = true;
exports.diffChars = diffChars;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _base = require('./base');
var _base2 = _interopRequireDefault(_base);
var characterDiff = new _base2['default']();
exports.characterDiff = characterDiff;
function diffChars(oldStr, newStr, callback) {
  return characterDiff.diff(oldStr, newStr, callback);
}
