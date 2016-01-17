/* */ 
(function(process) {
  'use strict';
  var _defineProperty = require('babel-runtime/helpers/define-property')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var GraphQLMutatorConstants = require('./GraphQLMutatorConstants');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayMutationTracker = require('./RelayMutationTracker');
  var RelayMutationType = require('./RelayMutationType');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayQuery = require('./RelayQuery');
  var RelayQueryPath = require('./RelayQueryPath');
  var RelayProfiler = require('./RelayProfiler');
  var RelayRecordState = require('./RelayRecordState');
  var generateClientEdgeID = require('./generateClientEdgeID');
  var generateClientID = require('./generateClientID');
  var invariant = require('fbjs/lib/invariant');
  var printRelayQueryCall = require('./printRelayQueryCall');
  var warning = require('fbjs/lib/warning');
  var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
  var EDGES = RelayConnectionInterface.EDGES;
  var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
  var ID = RelayNodeInterface.ID;
  var NODE = RelayNodeInterface.NODE;
  var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
  var APPEND = GraphQLMutatorConstants.APPEND;
  var PREPEND = GraphQLMutatorConstants.PREPEND;
  var REMOVE = GraphQLMutatorConstants.REMOVE;
  var EDGES_FIELD = RelayQuery.Field.build({
    fieldName: EDGES,
    type: ANY_TYPE,
    metadata: {isPlural: true}
  });
  var IGNORED_KEYS = _defineProperty({error: true}, CLIENT_MUTATION_ID, true);
  var STUB_CURSOR_ID = 'client:cursor';
  function writeRelayUpdatePayload(writer, operation, payload, _ref) {
    var configs = _ref.configs;
    var isOptimisticUpdate = _ref.isOptimisticUpdate;
    configs.forEach(function(config) {
      switch (config.type) {
        case RelayMutationType.NODE_DELETE:
          handleNodeDelete(writer, payload, config);
          break;
        case RelayMutationType.RANGE_ADD:
          handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate);
          break;
        case RelayMutationType.RANGE_DELETE:
          handleRangeDelete(writer, payload, config);
          break;
        case RelayMutationType.FIELDS_CHANGE:
        case RelayMutationType.REQUIRED_CHILDREN:
          break;
        default:
          console.error('Expected a valid mutation handler type, got `%s`.', config.type);
      }
    });
    handleMerge(writer, payload, operation);
  }
  function handleNodeDelete(writer, payload, config) {
    var recordIDs = payload[config.deletedIDFieldName];
    if (!recordIDs) {
      return;
    }
    if (Array.isArray(recordIDs)) {
      recordIDs.forEach(function(id) {
        deleteRecord(writer, id);
      });
    } else {
      deleteRecord(writer, recordIDs);
    }
  }
  function deleteRecord(writer, recordID) {
    var store = writer.getRecordStore();
    var status = store.getRecordState(recordID);
    if (status === RelayRecordState.NONEXISTENT) {
      return;
    }
    var connectionIDs = store.getConnectionIDsForRecord(recordID);
    if (connectionIDs) {
      connectionIDs.forEach(function(connectionID) {
        var edgeID = generateClientEdgeID(connectionID, recordID);
        store.applyRangeUpdate(connectionID, edgeID, REMOVE);
        writer.recordUpdate(edgeID);
        writer.recordUpdate(connectionID);
        deleteRecord(writer, edgeID);
      });
    }
    store.deleteRecord(recordID);
    writer.recordUpdate(recordID);
  }
  function handleMerge(writer, payload, operation) {
    var store = writer.getRecordStore();
    for (var fieldName in payload) {
      if (!payload.hasOwnProperty(fieldName)) {
        continue;
      }
      var payloadData = payload[fieldName];
      if (typeof payloadData !== 'object' || payloadData == null) {
        continue;
      }
      var rootID = store.getDataID(fieldName);
      if (ID in payloadData || rootID || Array.isArray(payloadData)) {
        mergeField(writer, fieldName, payloadData, operation);
      }
    }
  }
  function mergeField(writer, fieldName, payload, operation) {
    if (fieldName in IGNORED_KEYS) {
      return;
    }
    if (Array.isArray(payload)) {
      payload.forEach(function(item) {
        if (typeof item === 'object' && item != null && !Array.isArray(item)) {
          if (getString(item, ID)) {
            mergeField(writer, fieldName, item, operation);
          }
        }
      });
      return;
    }
    var payloadData = payload;
    var store = writer.getRecordStore();
    var recordID = getString(payloadData, ID);
    var path;
    if (recordID != null) {
      path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', NODE, recordID, null, {identifyingArgName: ID}, NODE_TYPE));
    } else {
      recordID = store.getDataID(fieldName);
      path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', fieldName, null, null, null, ANY_TYPE));
    }
    !recordID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected a record ID in the response payload ' + 'supplied to update the store.') : invariant(false) : undefined;
    var handleNode = function handleNode(node) {
      node.getChildren().forEach(function(child) {
        if (child instanceof RelayQuery.Fragment) {
          handleNode(child);
        } else if (child instanceof RelayQuery.Field && child.getSerializationKey() === fieldName) {
          if (path && recordID) {
            var typeName = writer.getRecordTypeName(child, recordID, payloadData);
            writer.createRecordIfMissing(child, recordID, typeName, path);
            writer.writePayload(child, recordID, payloadData, path);
          }
        }
      });
    };
    handleNode(operation);
  }
  function handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate) {
    var clientMutationID = getString(payload, CLIENT_MUTATION_ID);
    !clientMutationID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected operation `%s` to have a `%s`.', operation.getName(), CLIENT_MUTATION_ID) : invariant(false) : undefined;
    var store = writer.getRecordStore();
    var edge = getObject(payload, config.edgeName);
    var edgeNode = edge && getObject(edge, NODE);
    if (!edge || !edgeNode) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'writeRelayUpdatePayload(): Expected response payload to include the ' + 'newly created edge `%s` and its `node` field. Did you forget to ' + 'update the `RANGE_ADD` mutation config?', config.edgeName) : undefined;
      return;
    }
    var connectionParentID = config.parentID;
    if (!connectionParentID) {
      var edgeSource = getObject(edge, 'source');
      if (edgeSource) {
        connectionParentID = getString(edgeSource, ID);
      }
    }
    !connectionParentID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Cannot insert edge without a configured ' + '`parentID` or a `%s.source.id` field.', config.edgeName) : invariant(false) : undefined;
    var nodeID = getString(edgeNode, ID) || generateClientID();
    var cursor = edge.cursor || STUB_CURSOR_ID;
    var edgeData = _extends({}, edge, {
      cursor: cursor,
      node: _extends({}, edgeNode, {id: nodeID})
    });
    var connectionIDs = store.getConnectionIDsForField(connectionParentID, config.connectionName);
    if (connectionIDs) {
      connectionIDs.forEach(function(connectionID) {
        return addRangeNode(writer, operation, config, connectionID, nodeID, edgeData);
      });
    }
    if (isOptimisticUpdate) {
      RelayMutationTracker.putClientIDForMutation(nodeID, clientMutationID);
    } else {
      var clientNodeID = RelayMutationTracker.getClientIDForMutation(clientMutationID);
      if (clientNodeID) {
        RelayMutationTracker.updateClientServerIDMap(clientNodeID, nodeID);
        RelayMutationTracker.deleteClientIDForMutation(clientMutationID);
      }
    }
  }
  function addRangeNode(writer, operation, config, connectionID, nodeID, edgeData) {
    var store = writer.getRecordStore();
    var filterCalls = store.getRangeFilterCalls(connectionID);
    var rangeBehavior = filterCalls ? getRangeBehavior(config.rangeBehaviors, filterCalls) : null;
    if (!rangeBehavior) {
      return;
    }
    var edgeID = generateClientEdgeID(connectionID, nodeID);
    var path = store.getPathToRecord(connectionID);
    !path ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected a path for connection record, `%s`.', connectionID) : invariant(false) : undefined;
    path = path.getPath(EDGES_FIELD, edgeID);
    var typeName = writer.getRecordTypeName(EDGES_FIELD, edgeID, edgeData);
    writer.createRecordIfMissing(EDGES_FIELD, edgeID, typeName, path);
    var hasEdgeField = false;
    var handleNode = function handleNode(node) {
      node.getChildren().forEach(function(child) {
        if (child instanceof RelayQuery.Fragment) {
          handleNode(child);
        } else if (child instanceof RelayQuery.Field && child.getSchemaName() === config.edgeName) {
          hasEdgeField = true;
          if (path) {
            writer.writePayload(child, edgeID, edgeData, path);
          }
        }
      });
    };
    handleNode(operation);
    !hasEdgeField ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected mutation query to include the ' + 'relevant edge field, `%s`.', config.edgeName) : invariant(false) : undefined;
    if (rangeBehavior in GraphQLMutatorConstants.RANGE_OPERATIONS) {
      store.applyRangeUpdate(connectionID, edgeID, rangeBehavior);
      if (writer.hasChangeToRecord(edgeID)) {
        writer.recordUpdate(connectionID);
      }
    } else {
      console.error('writeRelayUpdatePayload(): invalid range operation `%s`, valid ' + 'options are `%s` or `%s`.', rangeBehavior, APPEND, PREPEND);
    }
  }
  function handleRangeDelete(writer, payload, config) {
    var maybeRecordID = getString(payload, config.deletedIDFieldName);
    !(maybeRecordID != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Missing ID for deleted record at field `%s`.', config.deletedIDFieldName) : invariant(false) : undefined;
    var recordID = maybeRecordID;
    var store = writer.getRecordStore();
    var connectionName = config.pathToConnection.pop();
    var connectionParentID = getIDFromPath(store, config.pathToConnection, payload);
    config.pathToConnection.push(connectionName);
    if (!connectionParentID) {
      return;
    }
    var connectionIDs = store.getConnectionIDsForField(connectionParentID, connectionName);
    if (connectionIDs) {
      connectionIDs.forEach(function(connectionID) {
        deleteRangeEdge(writer, connectionID, recordID);
      });
    }
  }
  function deleteRangeEdge(writer, connectionID, nodeID) {
    var store = writer.getRecordStore();
    var edgeID = generateClientEdgeID(connectionID, nodeID);
    store.applyRangeUpdate(connectionID, edgeID, REMOVE);
    deleteRecord(writer, edgeID);
    if (writer.hasChangeToRecord(edgeID)) {
      writer.recordUpdate(connectionID);
    }
  }
  function getRangeBehavior(rangeBehaviors, calls) {
    var call = calls.map(printRelayQueryCall).sort().join('').slice(1);
    return rangeBehaviors[call] || null;
  }
  function getIDFromPath(store, path, payload) {
    if (path.length === 1) {
      var rootCallID = store.getDataID(path[0]);
      if (rootCallID) {
        return rootCallID;
      }
    }
    var payloadItem = path.reduce(function(payloadItem, step) {
      return payloadItem ? getObject(payloadItem, step) : null;
    }, payload);
    if (payloadItem) {
      var id = getString(payloadItem, ID);
      !(id != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s.id` to be a string.', path.join('.')) : invariant(false) : undefined;
      return id;
    }
    return null;
  }
  function getString(payload, field) {
    var value = payload[field];
    if (typeof value === 'number') {
      process.env.NODE_ENV !== 'production' ? warning(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got the ' + 'number `%s`.', field, value) : undefined;
      value = '' + value;
    }
    !(value == null || typeof value === 'string') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
    return value;
  }
  function getObject(payload, field) {
    var value = payload[field];
    !(value == null || typeof value === 'object' && !Array.isArray(value)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be an object, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
    return value;
  }
  module.exports = RelayProfiler.instrument('writeRelayUpdatePayload', writeRelayUpdatePayload);
})(require('process'));
