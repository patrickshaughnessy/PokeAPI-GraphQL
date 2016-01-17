/* */ 
'use strict';
exports.__esModule = true;
exports.diffSentences = diffSentences;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _base = require('./base');
var _base2 = _interopRequireDefault(_base);
var sentenceDiff = new _base2['default']();
exports.sentenceDiff = sentenceDiff;
sentenceDiff.tokenize = function(value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
