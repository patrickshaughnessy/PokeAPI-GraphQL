/* */ 
(function(process) {
  'use strict';
  var invariant = require('fbjs/lib/invariant');
  function forEachRootCallArg(query, callback) {
    !!query.getBatchCall() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'forEachRootCallArg(): Cannot iterate over batch call variables.') : invariant(false) : undefined;
    function each(identifyingArgValue, fn) {
      if (Array.isArray(identifyingArgValue)) {
        identifyingArgValue.forEach(function(value) {
          return each(value, fn);
        });
      } else if (identifyingArgValue == null) {
        fn(identifyingArgValue);
      } else {
        !(typeof identifyingArgValue === 'string' || typeof identifyingArgValue === 'number') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay: Expected arguments to root field `%s` to each be strings/' + 'numbers, got `%s`.', query.getFieldName(), JSON.stringify(identifyingArgValue)) : invariant(false) : undefined;
        fn('' + identifyingArgValue);
      }
    }
    var identifyingArg = query.getIdentifyingArg();
    var identifyingArgValue = identifyingArg && identifyingArg.value || null;
    each(identifyingArgValue, callback);
  }
  module.exports = forEachRootCallArg;
})(require('process'));
