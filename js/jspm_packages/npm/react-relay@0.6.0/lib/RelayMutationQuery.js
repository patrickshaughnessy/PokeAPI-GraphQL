/* */ 
(function(process) {
  'use strict';
  var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayMetaRoute = require('./RelayMetaRoute');
  var RelayMutationType = require('./RelayMutationType');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayQuery = require('./RelayQuery');
  var flattenRelayQuery = require('./flattenRelayQuery');
  var forEachObject = require('fbjs/lib/forEachObject');
  var nullthrows = require('fbjs/lib/nullthrows');
  var inferRelayFieldsFromData = require('./inferRelayFieldsFromData');
  var intersectRelayQuery = require('./intersectRelayQuery');
  var invariant = require('fbjs/lib/invariant');
  var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
  var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
  var ID = RelayNodeInterface.ID;
  var TYPENAME = RelayNodeInterface.TYPENAME;
  var RelayMutationQuery = {
    buildFragmentForFields: function buildFragmentForFields(_ref) {
      var fatQuery = _ref.fatQuery;
      var fieldIDs = _ref.fieldIDs;
      var tracker = _ref.tracker;
      var mutatedFields = [];
      forEachObject(fieldIDs, function(dataIDOrIDs, fieldName) {
        var fatField = getFieldFromFatQuery(fatQuery, fieldName);
        var dataIDs = [].concat(dataIDOrIDs);
        var trackedChildren = [];
        dataIDs.forEach(function(dataID) {
          trackedChildren.push.apply(trackedChildren, _toConsumableArray(tracker.getTrackedChildrenForID(dataID)));
        });
        var trackedField = fatField.clone(trackedChildren);
        if (trackedField) {
          var mutationField = intersectRelayQuery(trackedField, fatField);
          if (mutationField) {
            mutatedFields.push(mutationField);
          }
        }
      });
      return buildMutationFragment(fatQuery, mutatedFields);
    },
    buildFragmentForEdgeDeletion: function buildFragmentForEdgeDeletion(_ref2) {
      var fatQuery = _ref2.fatQuery;
      var connectionName = _ref2.connectionName;
      var parentID = _ref2.parentID;
      var parentName = _ref2.parentName;
      var tracker = _ref2.tracker;
      var fatParent = getFieldFromFatQuery(fatQuery, parentName);
      var mutatedFields = [];
      var trackedParent = fatParent.clone(tracker.getTrackedChildrenForID(parentID));
      if (trackedParent) {
        var filterUnterminatedRange = function filterUnterminatedRange(node) {
          return node.getSchemaName() === connectionName;
        };
        var mutatedField = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
        if (mutatedField) {
          mutatedFields.push(mutatedField);
        }
      }
      return buildMutationFragment(fatQuery, mutatedFields);
    },
    buildFragmentForEdgeInsertion: function buildFragmentForEdgeInsertion(_ref3) {
      var fatQuery = _ref3.fatQuery;
      var connectionName = _ref3.connectionName;
      var parentID = _ref3.parentID;
      var edgeName = _ref3.edgeName;
      var parentName = _ref3.parentName;
      var rangeBehaviors = _ref3.rangeBehaviors;
      var tracker = _ref3.tracker;
      var trackedChildren = tracker.getTrackedChildrenForID(parentID);
      var mutatedFields = [];
      var trackedConnections = [];
      trackedChildren.forEach(function(trackedChild) {
        trackedConnections.push.apply(trackedConnections, _toConsumableArray(findDescendantFields(trackedChild, connectionName)));
      });
      if (trackedConnections.length) {
        var keysWithoutRangeBehavior = {};
        var mutatedEdgeFields = [];
        trackedConnections.forEach(function(trackedConnection) {
          var trackedEdges = findDescendantFields(trackedConnection, 'edges');
          if (!trackedEdges.length) {
            return;
          }
          if (trackedConnection.getRangeBehaviorKey() in rangeBehaviors) {
            trackedEdges.forEach(function(trackedEdge) {
              mutatedEdgeFields.push.apply(mutatedEdgeFields, _toConsumableArray(trackedEdge.getChildren()));
            });
          } else {
            var key = trackedConnection.getSerializationKey();
            keysWithoutRangeBehavior[key] = true;
          }
        });
        if (mutatedEdgeFields.length) {
          mutatedFields.push(buildEdgeField(parentID, edgeName, mutatedEdgeFields));
        }
        if (parentName != null) {
          var fatParent = getFieldFromFatQuery(fatQuery, parentName);
          var trackedParent = fatParent.clone(trackedChildren);
          if (trackedParent) {
            var filterUnterminatedRange = function filterUnterminatedRange(node) {
              return !keysWithoutRangeBehavior.hasOwnProperty(node.getSerializationKey());
            };
            var mutatedParent = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
            if (mutatedParent) {
              mutatedFields.push(mutatedParent);
            }
          }
        }
      }
      return buildMutationFragment(fatQuery, mutatedFields);
    },
    buildFragmentForOptimisticUpdate: function buildFragmentForOptimisticUpdate(_ref4) {
      var response = _ref4.response;
      var fatQuery = _ref4.fatQuery;
      var mutatedFields = inferRelayFieldsFromData(response);
      return buildMutationFragment(fatQuery, mutatedFields);
    },
    buildQueryForOptimisticUpdate: function buildQueryForOptimisticUpdate(_ref5) {
      var fatQuery = _ref5.fatQuery;
      var mutation = _ref5.mutation;
      var response = _ref5.response;
      var tracker = _ref5.tracker;
      var children = [nullthrows(RelayMutationQuery.buildFragmentForOptimisticUpdate({
        response: response,
        fatQuery: fatQuery,
        tracker: tracker
      }))];
      return RelayQuery.Mutation.build('OptimisticQuery', fatQuery.getType(), mutation.calls[0].name, null, children, mutation.metadata);
    },
    buildQuery: function buildQuery(_ref6) {
      var configs = _ref6.configs;
      var fatQuery = _ref6.fatQuery;
      var input = _ref6.input;
      var mutationName = _ref6.mutationName;
      var mutation = _ref6.mutation;
      var tracker = _ref6.tracker;
      return (function() {
        var children = [RelayQuery.Field.build({
          fieldName: CLIENT_MUTATION_ID,
          type: 'String',
          metadata: {isRequisite: true}
        })];
        configs.forEach(function(config) {
          switch (config.type) {
            case RelayMutationType.REQUIRED_CHILDREN:
              children = children.concat(config.children.map(function(child) {
                return RelayQuery.Fragment.create(child, RelayMetaRoute.get('$buildQuery'), {});
              }));
              break;
            case RelayMutationType.RANGE_ADD:
              children.push(RelayMutationQuery.buildFragmentForEdgeInsertion({
                connectionName: config.connectionName,
                edgeName: config.edgeName,
                fatQuery: fatQuery,
                parentID: config.parentID,
                parentName: config.parentName,
                rangeBehaviors: sanitizeRangeBehaviors(config.rangeBehaviors),
                tracker: tracker
              }));
              break;
            case RelayMutationType.RANGE_DELETE:
            case RelayMutationType.NODE_DELETE:
              children.push(RelayMutationQuery.buildFragmentForEdgeDeletion({
                connectionName: config.connectionName,
                fatQuery: fatQuery,
                parentID: config.parentID,
                parentName: config.parentName,
                tracker: tracker
              }));
              children.push(RelayQuery.Field.build({
                fieldName: config.deletedIDFieldName,
                type: 'String'
              }));
              break;
            case RelayMutationType.FIELDS_CHANGE:
              children.push(RelayMutationQuery.buildFragmentForFields({
                fatQuery: fatQuery,
                fieldIDs: config.fieldIDs,
                tracker: tracker
              }));
              break;
          }
        });
        return RelayQuery.Mutation.build(mutationName, fatQuery.getType(), mutation.calls[0].name, input, children.filter(function(child) {
          return child != null;
        }), mutation.metadata);
      })();
    }
  };
  function getFieldFromFatQuery(fatQuery, fieldName) {
    var field = fatQuery.getFieldByStorageKey(fieldName);
    !field ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationQuery: Invalid field name on fat query, `%s`.', fieldName) : invariant(false) : undefined;
    return field;
  }
  function buildMutationFragment(fatQuery, fields) {
    var fragment = RelayQuery.Fragment.build('MutationQuery', fatQuery.getType(), fields);
    if (fragment) {
      !(fragment instanceof RelayQuery.Fragment) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationQuery: Expected a fragment.') : invariant(false) : undefined;
      return fragment;
    }
    return null;
  }
  function buildEdgeField(parentID, edgeName, edgeFields) {
    var fields = [RelayQuery.Field.build({
      fieldName: 'cursor',
      type: 'String'
    })];
    if (RelayConnectionInterface.EDGES_HAVE_SOURCE_FIELD && !GraphQLStoreDataHandler.isClientID(parentID)) {
      fields.push(RelayQuery.Field.build({
        fieldName: 'source',
        type: ANY_TYPE,
        children: [RelayQuery.Field.build({
          fieldName: ID,
          type: 'String'
        }), RelayQuery.Field.build({
          fieldName: TYPENAME,
          type: 'String'
        })]
      }));
    }
    fields.push.apply(fields, edgeFields);
    var edgeField = flattenRelayQuery(RelayQuery.Field.build({
      fieldName: edgeName,
      type: ANY_TYPE,
      children: fields
    }));
    !(edgeField instanceof RelayQuery.Field) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationQuery: Expected a field.') : invariant(false) : undefined;
    return edgeField;
  }
  function sanitizeRangeBehaviors(rangeBehaviors) {
    var unsortedKeys = undefined;
    forEachObject(rangeBehaviors, function(value, key) {
      if (key !== '') {
        var keyParts = key.slice(0, -1).split(/\)\./);
        var sortedKey = keyParts.sort().join(').') + (keyParts.length ? ')' : '');
        if (sortedKey !== key) {
          unsortedKeys = unsortedKeys || [];
          unsortedKeys.push(key);
        }
      }
    });
    if (unsortedKeys) {
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutation: To define a range behavior key without sorting ' + 'the arguments alphabetically is disallowed as of Relay 0.5.1. Please ' + 'sort the argument names of the range behavior key%s `%s`%s.', unsortedKeys.length === 1 ? '' : 's', unsortedKeys.length === 1 ? unsortedKeys[0] : unsortedKeys.length === 2 ? unsortedKeys[0] + '` and `' + unsortedKeys[1] : unsortedKeys.slice(0, -1).join('`, `'), unsortedKeys.length > 2 ? ', and `' + unsortedKeys.slice(-1) + '`' : '') : invariant(false) : undefined;
    }
    return rangeBehaviors;
  }
  function findDescendantFields(rootNode, fieldName) {
    var fields = [];
    function traverse(node) {
      if (node instanceof RelayQuery.Field) {
        if (node.getSchemaName() === fieldName) {
          fields.push(node);
          return;
        }
      }
      if (node === rootNode || node instanceof RelayQuery.Fragment) {
        node.getChildren().forEach(function(child) {
          return traverse(child);
        });
      }
    }
    traverse(rootNode);
    return fields;
  }
  module.exports = RelayMutationQuery;
})(require('process'));
