/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  exports.applyPatch = applyPatch;
  exports.applyPatches = applyPatches;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _parse = require('./parse');
  var _utilDistanceIterator = require('../util/distance-iterator');
  var _utilDistanceIterator2 = _interopRequireDefault(_utilDistanceIterator);
  function applyPatch(source, uniDiff) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    if (typeof uniDiff === 'string') {
      uniDiff = _parse.parsePatch(uniDiff);
    }
    if (Array.isArray(uniDiff)) {
      if (uniDiff.length > 1) {
        throw new Error('applyPatch only works with a single input.');
      }
      uniDiff = uniDiff[0];
    }
    var lines = source.split('\n'),
        hunks = uniDiff.hunks,
        compareLine = options.compareLine || function(lineNumber, line, operation, patchContent) {
          return line === patchContent;
        },
        errorCount = 0,
        fuzzFactor = options.fuzzFactor || 0,
        minLine = 0,
        offset = 0,
        removeEOFNL = undefined,
        addEOFNL = undefined;
    function hunkFits(hunk, toPos) {
      for (var j = 0; j < hunk.lines.length; j++) {
        var line = hunk.lines[j],
            operation = line[0],
            content = line.substr(1);
        if (operation === ' ' || operation === '-') {
          if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
            errorCount++;
            if (errorCount > fuzzFactor) {
              return false;
            }
          }
          toPos++;
        }
      }
      return true;
    }
    for (var i = 0; i < hunks.length; i++) {
      var hunk = hunks[i],
          maxLine = lines.length - hunk.oldLines,
          localOffset = 0,
          toPos = offset + hunk.oldStart - 1;
      var iterator = _utilDistanceIterator2['default'](toPos, minLine, maxLine);
      for (; localOffset !== undefined; localOffset = iterator()) {
        if (hunkFits(hunk, toPos + localOffset)) {
          hunk.offset = offset += localOffset;
          break;
        }
      }
      if (localOffset === undefined) {
        return false;
      }
      minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
    }
    for (var i = 0; i < hunks.length; i++) {
      var hunk = hunks[i],
          toPos = hunk.offset + hunk.newStart - 1;
      for (var j = 0; j < hunk.lines.length; j++) {
        var line = hunk.lines[j],
            operation = line[0],
            content = line.substr(1);
        if (operation === ' ') {
          toPos++;
        } else if (operation === '-') {
          lines.splice(toPos, 1);
        } else if (operation === '+') {
          lines.splice(toPos, 0, content);
          toPos++;
        } else if (operation === '\\') {
          var previousOperation = hunk.lines[j - 1] ? hunk.lines[j - 1][0] : null;
          if (previousOperation === '+') {
            removeEOFNL = true;
          } else if (previousOperation === '-') {
            addEOFNL = true;
          }
        }
      }
    }
    if (removeEOFNL) {
      while (!lines[lines.length - 1]) {
        lines.pop();
      }
    } else if (addEOFNL) {
      lines.push('');
    }
    return lines.join('\n');
  }
  function applyPatches(uniDiff, options) {
    if (typeof uniDiff === 'string') {
      uniDiff = _parse.parsePatch(uniDiff);
    }
    var currentIndex = 0;
    function processIndex() {
      var index = uniDiff[currentIndex++];
      if (!index) {
        return options.complete();
      }
      options.loadFile(index, function(err, data) {
        if (err) {
          return options.complete(err);
        }
        var updatedContent = applyPatch(data, index, options);
        options.patched(index, updatedContent);
        setTimeout(processIndex, 0);
      });
    }
    processIndex();
  }
})(require('process'));
