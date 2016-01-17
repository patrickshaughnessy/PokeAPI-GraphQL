/* */ 
(function(process) {
  'use strict';
  module.exports = function(esnextModule, es5Module, _require) {
    var EARLIST_V8_MAJOR_VERSION_THAT_SUPPORTS_ESNEXT = 4;
    if (_require == null) {
      if (process.env.DEBUG_ESNEXTGUARDIAN) {
        console.log('DEBUG: ' + new Error('The `require` argument should have been passed to ESNextGuardian for:\n' + esnextModule + '\n' + es5Module).stack);
      }
      _require = require;
    }
    if (process.env.DEBUG_ESNEXTGUARDIAN && (esnextModule[0] === '.' || es5Module[0] === '.')) {
      console.log('DEBUG: ' + new Error('Relative paths were passed to ESNextGuardian for:\n' + esnextModule + '\n' + es5Module).stack);
    }
    if (process.env.REQUIRE_ESNEXT) {
      return _require(esnextModule);
    } else if (process.env.REQUIRE_ES5 || process.versions.v8 && process.versions.v8.split('.')[0] < EARLIST_V8_MAJOR_VERSION_THAT_SUPPORTS_ESNEXT) {
      return _require(es5Module);
    } else {
      try {
        return _require(esnextModule);
      } catch (e) {
        if (process.env.DEBUG_ESNEXTGUARDIAN) {
          console.log('DEBUG: ' + new Error('Downgraded ESNext to ES5:\n' + esnextModule + '\n' + es5Module + '\n' + e.stack).stack);
        }
        return _require(es5Module);
      }
    }
  };
})(require('process'));
