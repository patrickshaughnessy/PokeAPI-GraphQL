/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.locatedError = locatedError;
var _GraphQLError = require('./GraphQLError');
function locatedError(error, nodes) {
  var message = error ? error.message || String(error) : 'An unknown error occurred.';
  var stack = error ? error.stack : null;
  return new _GraphQLError.GraphQLError(message, nodes, stack);
}
