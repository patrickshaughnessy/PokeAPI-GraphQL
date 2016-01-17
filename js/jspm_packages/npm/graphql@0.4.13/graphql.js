/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.graphql = graphql;
var _languageSource = require('./language/source');
var _languageParser = require('./language/parser');
var _validationValidate = require('./validation/validate');
var _executionExecute = require('./execution/execute');
function graphql(schema, requestString, rootValue, variableValues, operationName) {
  return new Promise(function(resolve) {
    var source = new _languageSource.Source(requestString || '', 'GraphQL request');
    var documentAST = (0, _languageParser.parse)(source);
    var validationErrors = (0, _validationValidate.validate)(schema, documentAST);
    if (validationErrors.length > 0) {
      resolve({errors: validationErrors});
    } else {
      resolve((0, _executionExecute.execute)(schema, documentAST, rootValue, variableValues, operationName));
    }
  })['catch'](function(error) {
    return {errors: [error]};
  });
}
