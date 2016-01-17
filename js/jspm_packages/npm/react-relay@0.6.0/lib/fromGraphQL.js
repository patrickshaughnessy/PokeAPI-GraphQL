/* */ 
(function(process) {
  'use strict';
  var RelayQuery = require('./RelayQuery');
  var RelayMetaRoute = require('./RelayMetaRoute');
  var invariant = require('fbjs/lib/invariant');
  var fromGraphQL = {
    Field: (function(_Field) {
      function Field(_x) {
        return _Field.apply(this, arguments);
      }
      Field.toString = function() {
        return _Field.toString();
      };
      return Field;
    })(function(query) {
      var node = createNode(query, RelayQuery.Field);
      !(node instanceof RelayQuery.Field) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL field node.') : invariant(false) : undefined;
      return node;
    }),
    Fragment: (function(_Fragment) {
      function Fragment(_x2) {
        return _Fragment.apply(this, arguments);
      }
      Fragment.toString = function() {
        return _Fragment.toString();
      };
      return Fragment;
    })(function(query) {
      var node = createNode(query, RelayQuery.Fragment);
      !(node instanceof RelayQuery.Fragment) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL fragment node.') : invariant(false) : undefined;
      return node;
    }),
    Query: function Query(query) {
      var node = createNode(query, RelayQuery.Root);
      !(node instanceof RelayQuery.Root) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'fromGraphQL.Operation(): Expected a root node.') : invariant(false) : undefined;
      return node;
    },
    Operation: (function(_Operation) {
      function Operation(_x3) {
        return _Operation.apply(this, arguments);
      }
      Operation.toString = function() {
        return _Operation.toString();
      };
      return Operation;
    })(function(query) {
      var node = createNode(query, RelayQuery.Operation);
      !(node instanceof RelayQuery.Operation) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'fromGraphQL.Operation(): Expected a mutation/subscription node.') : invariant(false) : undefined;
      return node;
    })
  };
  function createNode(query, desiredType) {
    var variables = {};
    var route = RelayMetaRoute.get('$fromGraphQL');
    return desiredType.create(query, route, variables);
  }
  module.exports = fromGraphQL;
})(require('process'));
