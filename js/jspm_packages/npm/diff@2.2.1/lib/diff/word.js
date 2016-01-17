/* */ 
'use strict';
exports.__esModule = true;
exports.diffWords = diffWords;
exports.diffWordsWithSpace = diffWordsWithSpace;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _base = require('./base');
var _base2 = _interopRequireDefault(_base);
var _utilParams = require('../util/params');
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new _base2['default']();
exports.wordDiff = wordDiff;
wordDiff.equals = function(left, right) {
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function(value) {
  var tokens = value.split(/(\s+|\b)/);
  for (var i = 0; i < tokens.length - 1; i++) {
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }
  return tokens;
};
function diffWords(oldStr, newStr, callback) {
  var options = _utilParams.generateOptions(callback, {ignoreWhitespace: true});
  return wordDiff.diff(oldStr, newStr, options);
}
function diffWordsWithSpace(oldStr, newStr, callback) {
  return wordDiff.diff(oldStr, newStr, callback);
}
