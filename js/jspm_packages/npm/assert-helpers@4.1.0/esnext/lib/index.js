/* */ 
(function(process) {
  'use strict';
  const util = require('util');
  const assert = require('assert');
  const colors = require('ansicolors');
  const diffUtil = require('diff');
  function wait(delay, fn) {
    return setTimeout(fn, delay);
  }
  function isTTY() {
    return process.stdout && process.stdout.isTTY === true && process.stderr && process.stderr.isTTY === true;
  }
  function inspect(value, opts = {}) {
    if (isTTY() && opts.colors == null) {
      opts.colors = process.argv.indexOf('--no-colors') === -1;
    } else {
      opts.colors = false;
    }
    return util.inspect(value, opts);
  }
  function inspectDiff(diff) {
    let result = '';
    diff.forEach(function(part) {
      let value = part.value;
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
    const diff = diffUtil.diffChars(inspect(oldData, {colors: false}), inspect(newData, {colors: false}));
    return inspectDiff(diff);
  }
  function diffObjects(newData, oldData) {
    const diff = diffUtil.diffJson(inspect(oldData, {colors: false}), inspect(newData, {colors: false}));
    return inspectDiff(diff);
  }
  function log(...args) {
    for (const arg of args) {
      console.log(inspect(arg));
    }
  }
  function logComparison(actual, expected, error) {
    const lines = ['------------------------------------', 'Comparison Error:', colors.green(error.stack || error.message || error), ''];
    if (typeof actual === 'string' && typeof expected === 'string') {
      lines.push('Comparison Diff:', diffStrings(actual, expected), '');
    } else if (typeof actual === 'object' && typeof expected === 'object') {
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
      testName = `Expected \`${actual}\` to contain \`${expected}\``;
    assert.ok(actual.indexOf(expected) !== -1, testName);
  }
  function errorEqual(actualError, expectedError, testName) {
    let expectedErrorMessage,
        actualErrorMessage;
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
  function completeViaCallback(result, delay = 100) {
    return function(complete) {
      wait(delay, function() {
        complete(null, result);
      });
    };
  }
  function returnErrorViaCallback(error = 'an error occured') {
    return function() {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error(error);
      }
    };
  }
  function throwErrorViaCallback(error = 'an error occured') {
    return function() {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error);
      }
    };
  }
  function expectViaCallback(...argsExpected) {
    return function(...argsActual) {
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
    isTTY,
    inspect,
    log,
    logComparison,
    diffStrings,
    diffObjects,
    equal,
    deepEqual,
    contains,
    errorEqual,
    returnViaCallback,
    completeViaCallback,
    returnErrorViaCallback,
    throwErrorViaCallback,
    expectViaCallback,
    expectErrorViaCallback,
    expectFunctionToThrow
  };
})(require('process'));
