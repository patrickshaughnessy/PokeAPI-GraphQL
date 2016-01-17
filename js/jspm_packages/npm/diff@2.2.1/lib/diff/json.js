/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  exports.diffJson = diffJson;
  exports.canonicalize = canonicalize;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _base = require('./base');
  var _base2 = _interopRequireDefault(_base);
  var _line = require('./line');
  var objectPrototypeToString = Object.prototype.toString;
  var jsonDiff = new _base2['default']();
  exports.jsonDiff = jsonDiff;
  jsonDiff.useLongestToken = true;
  jsonDiff.tokenize = _line.lineDiff.tokenize;
  jsonDiff.castInput = function(value) {
    return typeof value === 'string' ? value : JSON.stringify(canonicalize(value), undefined, '  ');
  };
  jsonDiff.equals = function(left, right) {
    return _base2['default'].prototype.equals(left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
  };
  function diffJson(oldObj, newObj, callback) {
    return jsonDiff.diff(oldObj, newObj, callback);
  }
  function canonicalize(obj, stack, replacementStack) {
    stack = stack || [];
    replacementStack = replacementStack || [];
    var i = undefined;
    for (i = 0; i < stack.length; i += 1) {
      if (stack[i] === obj) {
        return replacementStack[i];
      }
    }
    var canonicalizedObj = undefined;
    if ('[object Array]' === objectPrototypeToString.call(obj)) {
      stack.push(obj);
      canonicalizedObj = new Array(obj.length);
      replacementStack.push(canonicalizedObj);
      for (i = 0; i < obj.length; i += 1) {
        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack);
      }
      stack.pop();
      replacementStack.pop();
    } else if (typeof obj === 'object' && obj !== null) {
      stack.push(obj);
      canonicalizedObj = {};
      replacementStack.push(canonicalizedObj);
      var sortedKeys = [],
          key = undefined;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          sortedKeys.push(key);
        }
      }
      sortedKeys.sort();
      for (i = 0; i < sortedKeys.length; i += 1) {
        key = sortedKeys[i];
        canonicalizedObj[key] = canonicalize(obj[key], stack, replacementStack);
      }
      stack.pop();
      replacementStack.pop();
    } else {
      canonicalizedObj = obj;
    }
    return canonicalizedObj;
  }
})(require('process'));
