
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Used to configure the graphQLHTTP middleware by providing a schema
 * and other configuration options.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = graphqlHTTP;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _graphqlError = require('graphql/error');

var _graphqlExecution = require('graphql/execution');

var _graphqlLanguage = require('graphql/language');

var _graphqlValidation = require('graphql/validation');

var _graphqlUtilitiesGetOperationAST = require('graphql/utilities/getOperationAST');

var _parseBody = require('./parseBody');

var _renderGraphiQL = require('./renderGraphiQL');

/**
 * Middleware for express; takes an options object or function as input to
 * configure behavior, and returns an express middleware.
 */

function graphqlHTTP(options) {
  if (!options) {
    throw new Error('GraphQL middleware requires options.');
  }

  return function (request, response) {
    // Higher scoped variables are referred to at various stages in the
    // asyncronous state machine below.
    var schema = undefined;
    var rootValue = undefined;
    var pretty = undefined;
    var graphiql = undefined;
    var showGraphiQL = undefined;
    var query = undefined;
    var variables = undefined;
    var operationName = undefined;

    // Use promises as a mechanism for capturing any thrown errors during the
    // asyncronous process.
    new Promise(function (resolve, reject) {

      // Get GraphQL options given this request.
      var optionsObj = getOptions(options, request);
      schema = optionsObj.schema;
      rootValue = optionsObj.rootValue;
      pretty = optionsObj.pretty;
      graphiql = optionsObj.graphiql;

      // GraphQL HTTP only supports GET and POST methods.
      if (request.method !== 'GET' && request.method !== 'POST') {
        response.set('Allow', 'GET, POST');
        throw (0, _httpErrors2['default'])(405, 'GraphQL only supports GET and POST requests.');
      }

      // Parse the Request body.
      (0, _parseBody.parseBody)(request, function (parseError, data) {
        if (parseError) {
          reject(parseError);
        } else {
          resolve(data || {});
        }
      });
    }).then(function (data) {
      showGraphiQL = graphiql && canDisplayGraphiQL(request, data);

      // Get GraphQL params from the request and POST body data.
      var params = getGraphQLParams(request, data);
      query = params.query;
      variables = params.variables;
      operationName = params.operationName;

      // If there is no query, but GraphiQL will be displayed, do not produce
      // a result, otherwise return a 400: Bad Request.
      if (!query) {
        if (showGraphiQL) {
          return null;
        }
        throw (0, _httpErrors2['default'])(400, 'Must provide query string.');
      }

      // GraphQL source.
      var source = new _graphqlLanguage.Source(query, 'GraphQL request');

      // Parse source to AST, reporting any syntax error.
      var documentAST = undefined;
      try {
        documentAST = (0, _graphqlLanguage.parse)(source);
      } catch (syntaxError) {
        // Return 400: Bad Request if any syntax errors errors exist.
        response.status(400);
        return { errors: [syntaxError] };
      }

      // Validate AST, reporting any errors.
      var validationErrors = (0, _graphqlValidation.validate)(schema, documentAST);
      if (validationErrors.length > 0) {
        // Return 400: Bad Request if any validation errors exist.
        response.status(400);
        return { errors: validationErrors };
      }

      // Only query operations are allowed on GET requests.
      if (request.method === 'GET') {
        // Determine if this GET request will perform a non-query.
        var operationAST = (0, _graphqlUtilitiesGetOperationAST.getOperationAST)(documentAST, operationName);
        if (operationAST && operationAST.operation !== 'query') {
          // If GraphiQL can be shown, do not perform this query, but
          // provide it to GraphiQL so that the requester may perform it
          // themselves if desired.
          if (showGraphiQL) {
            return null;
          }

          // Otherwise, report a 405: Method Not Allowed error.
          response.set('Allow', 'POST');
          throw (0, _httpErrors2['default'])(405, 'Can only perform a ' + operationAST.operation + ' operation ' + 'from a POST request.');
        }
      }

      // Perform the execution, reporting any errors creating the context.
      try {
        return (0, _graphqlExecution.execute)(schema, documentAST, rootValue, variables, operationName);
      } catch (contextError) {
        // Return 400: Bad Request if any execution context errors exist.
        response.status(400);
        return { errors: [contextError] };
      }
    })['catch'](function (error) {
      // If an error was caught, report the httpError status, or 500.
      response.status(error.status || 500);
      return { errors: [error] };
    }).then(function (result) {
      // Format any encountered errors.
      if (result && result.errors) {
        result.errors = result.errors.map(_graphqlError.formatError);
      }

      // If allowed to show GraphiQL, present it instead of JSON.
      if (showGraphiQL) {
        response.set('Content-Type', 'text/html').send((0, _renderGraphiQL.renderGraphiQL)({ query: query, variables: variables, result: result }));
      } else {
        // Otherwise, present JSON directly.
        response.set('Content-Type', 'application/json').send(JSON.stringify(result, null, pretty ? 2 : 0));
      }
    });
  };
}

/**
 * Get the options that the middleware was configured with, sanity
 * checking them.
 */
function getOptions(options, request) {
  var optionsData = typeof options === 'function' ? options(request) : options;

  if (!optionsData || typeof optionsData !== 'object') {
    throw new Error('GraphQL middleware option function must return an options object.');
  }

  if (!optionsData.schema) {
    throw new Error('GraphQL middleware options must contain a schema.');
  }

  return optionsData;
}

/**
 * Helper function to get the GraphQL params from the request.
 */
function getGraphQLParams(request, data) {
  // GraphQL Query string.
  var query = request.query.query || data.query;

  // Parse the variables if needed.
  var variables = request.query.variables || data.variables;
  if (variables && typeof variables === 'string') {
    try {
      variables = JSON.parse(variables);
    } catch (error) {
      throw (0, _httpErrors2['default'])(400, 'Variables are invalid JSON.');
    }
  }

  // Name of GraphQL operation to execute.
  var operationName = request.query.operationName || data.operationName;

  return { query: query, variables: variables, operationName: operationName };
}

/**
 * Helper function to determine if GraphiQL can be displayed.
 */
function canDisplayGraphiQL(request, data) {
  // If `raw` exists, GraphiQL mode is not enabled.
  var raw = request.query.raw !== undefined || data.raw !== undefined;
  // Allowed to show GraphiQL if not requested as raw and this request
  // prefers HTML over JSON.
  return !raw && request.accepts(['json', 'html']) === 'html';
}
module.exports = exports['default'];

/**
 * A GraphQL schema from graphql-js.
 */

/**
 * An object to pass as the rootValue to the graphql() function.
 */

/**
 * A boolean to configure whether the output should be pretty-printed.
 */

/**
 * A boolean to optionally enable GraphiQL mode
 */