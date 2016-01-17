/* */ 
(function(process) {
  'use strict';
  function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var util = require('util');
  var assert = require('assert');
  var colors = require('ansicolors');
  var diffUtil = require('diff');
  function wait(delay, fn) {
    return setTimeout(fn, delay);
  }
  function isTTY() {
    return process.stdout && process.stdout.isTTY === true && process.stderr && process.stderr.isTTY === true;
  }
  function inspect(value) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    if (isTTY() && opts.colors == null) {
      opts.colors = process.argv.indexOf('--no-colors') === -1;
    } else {
      opts.colors = false;
    }
    return util.inspect(value, opts);
  }
  function inspectDiff(diff) {
    var result = '';
    diff.forEach(function(part) {
      var value = part.value;
      if (part.added) {
        value = colors.open.black + colors.bgGreen(value) + colors.open.green;
      } else if (part.removed) {
        value = colors.open.black + colors.bgBrightRed(value) + colors.open.green;
      }
      result += value;
    });
    return colors.green(result);
  }
  function diffStrings(newData, oldData) {
    var diff = diffUtil.diffChars(inspect(oldData, {colors: false}), inspect(newData, {colors: false}));
    return inspectDiff(diff);
  }
  function diffObjects(newData, oldData) {
    var diff = diffUtil.diffJson(inspect(oldData, {colors: false}), inspect(newData, {colors: false}));
    return inspectDiff(diff);
  }
  function log() {
    for (var _len = arguments.length,
        args = Array(_len),
        _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
      for (var _iterator = args[Symbol.iterator](),
          _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arg = _step.value;
        console.log(inspect(arg));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  function logComparison(actual, expected, error) {
    var lines = ['------------------------------------', 'Comparison Error:', colors.green(error.stack || error.message || error), ''];
    if (typeof actual === 'string' && typeof expected === 'string') {
      lines.push('Comparison Diff:', diffStrings(actual, expected), '');
    } else if ((typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) === 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) === 'object') {
      lines.push('Comparison Diff:', diffObjects(actual, expected), '');
    }
    lines.push('Comparison Actual:', inspect(actual), '', 'Comparison Expected:', inspect(expected), '------------------------------------');
    if (process.stderr) {
      process.stderr.write(lines.join('\n') + '\n');
    } else {
      console.log(lines.join('\n'));
    }
  }
  function equal(actual, expected, testName) {
    try {
      assert.equal(actual, expected, testName);
    } catch (checkError) {
      logComparison(actual, expected, checkError);
      throw checkError;
    }
  }
  function deepEqual(actual, expected, testName) {
    try {
      assert.deepEqual(actual, expected, testName);
    } catch (checkError) {
      logComparison(actual, expected, checkError);
      throw checkError;
    }
  }
  function contains(actual, expected, testName) {
    if (testName == null)
      testName = 'Expected `' + actual + '` to contain `' + expected + '`';
    assert.ok(actual.indexOf(expected) !== -1, testName);
  }
  function errorEqual(actualError, expectedError, testName) {
    var expectedErrorMessage = undefined,
        actualErrorMessage = undefined;
    if (expectedError) {
      if (expectedError instanceof Error) {
        expectedErrorMessage = expectedError.message;
      } else {
        expectedErrorMessage = expectedError;
        expectedError = new Error(expectedErrorMessage);
      }
    }
    if (actualError) {
      if (actualError instanceof Error) {
        actualErrorMessage = actualError.message;
      } else {
        actualErrorMessage = actualError;
        actualError = new Error(actualErrorMessage);
      }
    }
    try {
      if (actualErrorMessage && expectedErrorMessage) {
        contains(actualErrorMessage, expectedErrorMessage, testName);
      } else {
        equal(actualError, expectedError || null, testName);
      }
    } catch (checkError) {
      logComparison(actualError && (actualError.stack || actualError.message || actualError), expectedErrorMessage, checkError);
      throw checkError;
    }
  }
  function returnViaCallback(result) {
    return function() {
      return result;
    };
  }
  function completeViaCallback(result) {
    var delay = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
    return function(complete) {
      wait(delay, function() {
        complete(null, result);
      });
    };
  }
  function returnErrorViaCallback() {
    var error = arguments.length <= 0 || arguments[0] === undefined ? 'an error occured' : arguments[0];
    return function() {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error(error);
      }
    };
  }
  function throwErrorViaCallback() {
    var error = arguments.length <= 0 || arguments[0] === undefined ? 'an error occured' : arguments[0];
    return function() {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error);
      }
    };
  }
  function expectViaCallback() {
    for (var _len2 = arguments.length,
        argsExpected = Array(_len2),
        _key2 = 0; _key2 < _len2; _key2++) {
      argsExpected[_key2] = arguments[_key2];
    }
    return function() {
      for (var _len3 = arguments.length,
          argsActual = Array(_len3),
          _key3 = 0; _key3 < _len3; _key3++) {
        argsActual[_key3] = arguments[_key3];
      }
      deepEqual(argsActual, argsExpected);
    };
  }
  function expectErrorViaCallback(error, testName, next) {
    return function(inputError) {
      try {
        errorEqual(inputError, error);
      } catch (checkError) {
        if (next) {
          next(checkError);
          return;
        } else {
          throw checkError;
        }
      }
      if (next)
        next();
    };
  }
  function expectFunctionToThrow(fn, error, testName) {
    try {
      fn();
    } catch (checkError) {
      errorEqual(checkError, error, testName);
    }
  }
  module.exports = {
    isTTY: isTTY,
    inspect: inspect,
    log: log,
    logComparison: logComparison,
    diffStrings: diffStrings,
    diffObjects: diffObjects,
    equal: equal,
    deepEqual: deepEqual,
    contains: contains,
    errorEqual: errorEqual,
    returnViaCallback: returnViaCallback,
    completeViaCallback: completeViaCallback,
    returnErrorViaCallback: returnErrorViaCallback,
    throwErrorViaCallback: throwErrorViaCallback,
    expectViaCallback: expectViaCallback,
    expectErrorViaCallback: expectErrorViaCallback,
    expectFunctionToThrow: expectFunctionToThrow
  };
})(require('process'));
