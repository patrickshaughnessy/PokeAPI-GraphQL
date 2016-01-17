/* */ 
'use strict';
exports.__esModule = true;
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _base = require('./base');
var _base2 = _interopRequireDefault(_base);
var _utilParams = require('../util/params');
var lineDiff = new _base2['default']();
exports.lineDiff = lineDiff;
lineDiff.tokenize = function(value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/);
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }
  return retLines;
};
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options = _utilParams.generateOptions(callback, {ignoreWhitespace: true});
  return lineDiff.diff(oldStr, newStr, options);
}
