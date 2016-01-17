/* */ 
(function(process) {
  'use strict';
  var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var QueryBuilder = require('./QueryBuilder');
  var RelayFragmentReference = require('./RelayFragmentReference');
  var RelayRouteFragment = require('./RelayRouteFragment');
  var invariant = require('fbjs/lib/invariant');
  function RelayQL(strings) {
    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQL: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `Relay.QL`.') : invariant(false) : undefined;
  }
  _Object$assign(RelayQL, {
    __frag: function __frag(substitution) {
      if (typeof substitution === 'function') {
        return new RelayRouteFragment(substitution);
      }
      if (substitution != null) {
        !(substitution instanceof RelayFragmentReference || QueryBuilder.getFragment(substitution) || QueryBuilder.getFragmentReference(substitution)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQL: Invalid fragment composition, use ' + '`${Child.getFragment(\'name\')}`.') : invariant(false) : undefined;
      }
      return substitution;
    },
    __var: function __var(expression) {
      var variable = QueryBuilder.getCallVariable(expression);
      if (variable) {
        !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
      }
      return QueryBuilder.createCallValue(expression);
    },
    __varDEPRECATED: function __varDEPRECATED(expression) {
      var variable = QueryBuilder.getCallVariable(expression);
      if (variable) {
        !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
      }
      return expression;
    }
  });
  module.exports = RelayQL;
})(require('process'));
