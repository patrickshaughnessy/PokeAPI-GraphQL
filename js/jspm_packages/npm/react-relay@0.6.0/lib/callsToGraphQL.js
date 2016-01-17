/* */ 
'use strict';
var QueryBuilder = require('./QueryBuilder');
function callsToGraphQL(calls) {
  return calls.map(function(_ref) {
    var name = _ref.name;
    var value = _ref.value;
    var concreteValue = null;
    if (Array.isArray(value)) {
      concreteValue = value.map(QueryBuilder.createCallValue);
    } else if (value != null) {
      concreteValue = QueryBuilder.createCallValue(value);
    }
    return QueryBuilder.createCall(name, concreteValue);
  });
}
module.exports = callsToGraphQL;
