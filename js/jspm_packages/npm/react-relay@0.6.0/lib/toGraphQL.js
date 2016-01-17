/* */ 
(function(process) {
  'use strict';
  var QueryBuilder = require('./QueryBuilder');
  var RelayQuery = require('./RelayQuery');
  var callsToGraphQL = require('./callsToGraphQL');
  var invariant = require('fbjs/lib/invariant');
  var toGraphQL = {
    Query: function Query(node) {
      return node.getConcreteQueryNode(function() {
        var batchCall = node.getBatchCall();
        var identifyingArgValue = undefined;
        if (batchCall) {
          identifyingArgValue = QueryBuilder.createBatchCallVariable(batchCall.sourceQueryID, batchCall.sourceQueryPath);
        } else {
          var identifyingArg = node.getIdentifyingArg();
          if (identifyingArg) {
            if (Array.isArray(identifyingArg.value)) {
              identifyingArgValue = identifyingArg.value.map(QueryBuilder.createCallValue);
            } else {
              identifyingArgValue = QueryBuilder.createCallValue(identifyingArg.value);
            }
          }
        }
        var children = node.getChildren().map(toGraphQLSelection);
        return QueryBuilder.createQuery({
          children: children,
          fieldName: node.getFieldName(),
          identifyingArgValue: identifyingArgValue,
          isDeferred: node.isDeferred(),
          metadata: node.__concreteNode__.metadata,
          name: node.getName(),
          type: node.getType()
        });
      });
    },
    Fragment: (function(_Fragment) {
      function Fragment(_x) {
        return _Fragment.apply(this, arguments);
      }
      Fragment.toString = function() {
        return _Fragment.toString();
      };
      return Fragment;
    })(function(node) {
      return node.getConcreteQueryNode(function() {
        var children = node.getChildren().map(toGraphQLSelection);
        var fragment = {
          children: children,
          kind: 'Fragment',
          hash: node.getConcreteFragmentHash(),
          metadata: {
            isAbstract: node.isAbstract(),
            plural: node.isPlural()
          },
          name: node.getDebugName(),
          type: node.getType()
        };
        return fragment;
      });
    }),
    Field: (function(_Field) {
      function Field(_x2) {
        return _Field.apply(this, arguments);
      }
      Field.toString = function() {
        return _Field.toString();
      };
      return Field;
    })(function(node) {
      return node.getConcreteQueryNode(function() {
        var calls = callsToGraphQL(node.getCallsWithValues());
        var children = node.getChildren().map(toGraphQLSelection);
        var field = {
          alias: node.__concreteNode__.alias,
          calls: calls,
          children: children,
          fieldName: node.getSchemaName(),
          kind: 'Field',
          metadata: node.__concreteNode__.metadata,
          type: node.getType()
        };
        return field;
      });
    })
  };
  function toGraphQLSelection(node) {
    if (node instanceof RelayQuery.Fragment) {
      return toGraphQL.Fragment(node);
    } else {
      !(node instanceof RelayQuery.Field) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'toGraphQL: Invalid node.') : invariant(false) : undefined;
      return toGraphQL.Field(node);
    }
  }
  module.exports = toGraphQL;
})(require('process'));
