/* */ 
(function(process) {
  'use strict';
  var invariant = require('fbjs/lib/invariant');
  function abstractMethod(className, methodName) {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Subclasses of %s must override %s() with their own implementation.', className, methodName) : invariant(false) : undefined;
  }
  module.exports = abstractMethod;
})(require('process'));
