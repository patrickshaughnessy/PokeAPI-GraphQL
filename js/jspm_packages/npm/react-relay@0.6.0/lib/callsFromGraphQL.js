/* */ 
(function(process) {
  'use strict';
  var invariant = require('fbjs/lib/invariant');
  function callsFromGraphQL(concreteCalls, variables) {
    var callsOrDirectives = concreteCalls;
    var orderedCalls = [];
    for (var ii = 0; ii < callsOrDirectives.length; ii++) {
      var _callsOrDirectives$ii = callsOrDirectives[ii];
      var name = _callsOrDirectives$ii.name;
      var value = _callsOrDirectives$ii.value;
      if (value != null) {
        if (Array.isArray(value)) {
          value = value.map(function(arg) {
            return getCallVaue(arg, variables);
          });
        } else if (value.kind === 'BatchCallVariable') {
          value = null;
        } else {
          value = getCallVaue(value, variables);
        }
      }
      orderedCalls.push({
        name: name,
        value: value
      });
    }
    return orderedCalls;
  }
  function getCallVaue(value, variables) {
    if (value.kind === 'CallValue') {
      return value.callValue;
    } else {
      var variableName = value.callVariableName;
      !variables.hasOwnProperty(variableName) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'callsFromGraphQL(): Expected a declared value for variable, `$%s`.', variableName) : invariant(false) : undefined;
      return variables[variableName];
    }
  }
  module.exports = callsFromGraphQL;
})(require('process'));
