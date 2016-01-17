/* */ 
(function(process) {
  'use strict';
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var RelayQuery = require('./RelayQuery');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayQueryVisitor = require('./RelayQueryVisitor');
  var RelayRecordState = require('./RelayRecordState');
  var generateClientEdgeID = require('./generateClientEdgeID');
  var generateClientID = require('./generateClientID');
  var invariant = require('fbjs/lib/invariant');
  var isCompatibleRelayFragmentType = require('./isCompatibleRelayFragmentType');
  var warning = require('fbjs/lib/warning');
  var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
  var ID = RelayNodeInterface.ID;
  var TYPENAME = RelayNodeInterface.TYPENAME;
  var EDGES = RelayConnectionInterface.EDGES;
  var NODE = RelayConnectionInterface.NODE;
  var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
  var RelayQueryWriter = (function(_RelayQueryVisitor) {
    _inherits(RelayQueryWriter, _RelayQueryVisitor);
    function RelayQueryWriter(store, queryTracker, changeTracker, options) {
      _classCallCheck(this, RelayQueryWriter);
      _RelayQueryVisitor.call(this);
      this._changeTracker = changeTracker;
      this._forceIndex = options && options.forceIndex ? options.forceIndex : 0;
      this._isOptimisticUpdate = !!(options && options.isOptimisticUpdate);
      this._store = store;
      this._queryTracker = queryTracker;
      this._updateTrackedQueries = !!(options && options.updateTrackedQueries);
    }
    RelayQueryWriter.prototype.getRecordStore = function getRecordStore() {
      return this._store;
    };
    RelayQueryWriter.prototype.getRecordTypeName = function getRecordTypeName(node, recordID, payload) {
      if (this._isOptimisticUpdate) {
        return null;
      }
      var typeName = payload[TYPENAME];
      if (typeName == null && !node.isAbstract()) {
        typeName = node.getType();
      }
      process.env.NODE_ENV !== 'production' ? warning(typeName && typeName !== ANY_TYPE, 'RelayQueryWriter: Could not find a type name for record `%s`.', recordID) : undefined;
      return typeName || null;
    };
    RelayQueryWriter.prototype.writePayload = function writePayload(node, recordID, responseData, path) {
      var _this = this;
      var state = {
        nodeID: null,
        recordID: recordID,
        responseData: responseData,
        path: path
      };
      if (node instanceof RelayQuery.Field && !node.isScalar()) {
        node.getChildren().forEach(function(child) {
          _this.visit(child, state);
        });
        return;
      }
      this.visit(node, state);
    };
    RelayQueryWriter.prototype.recordCreate = function recordCreate(recordID) {
      this._changeTracker.createID(recordID);
    };
    RelayQueryWriter.prototype.recordUpdate = function recordUpdate(recordID) {
      this._changeTracker.updateID(recordID);
    };
    RelayQueryWriter.prototype.hasChangeToRecord = function hasChangeToRecord(recordID) {
      return this._changeTracker.hasChange(recordID);
    };
    RelayQueryWriter.prototype.isNewRecord = function isNewRecord(recordID) {
      return this._changeTracker.isNewRecord(recordID);
    };
    RelayQueryWriter.prototype.createRecordIfMissing = function createRecordIfMissing(node, recordID, typeName, path) {
      var recordState = this._store.getRecordState(recordID);
      if (recordState !== RelayRecordState.EXISTENT) {
        this._store.putRecord(recordID, typeName, path);
        this.recordCreate(recordID);
      }
      if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
        this._queryTracker.trackNodeForID(node, recordID, path);
      }
    };
    RelayQueryWriter.prototype.visitRoot = function visitRoot(root, state) {
      var path = state.path;
      var recordID = state.recordID;
      var responseData = state.responseData;
      var recordState = this._store.getRecordState(recordID);
      if (responseData == null) {
        !(responseData !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Unexpectedly encountered `undefined` in payload. ' + 'Cannot set root record `%s` to undefined.', recordID) : invariant(false) : undefined;
        this._store.deleteRecord(recordID);
        if (recordState === RelayRecordState.EXISTENT) {
          this.recordUpdate(recordID);
        }
        return;
      }
      !(typeof responseData === 'object' && responseData !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an array or object.', recordID) : invariant(false) : undefined;
      if (recordState !== RelayRecordState.EXISTENT) {
        var typeName = this.getRecordTypeName(root, recordID, responseData);
        this._store.putRecord(recordID, typeName, path);
        this.recordCreate(recordID);
      }
      if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
        this._queryTracker.trackNodeForID(root, recordID, path);
      }
      this.traverse(root, state);
    };
    RelayQueryWriter.prototype.visitFragment = function visitFragment(fragment, state) {
      var recordID = state.recordID;
      if (fragment.isDeferred()) {
        this._store.setHasDeferredFragmentData(recordID, fragment.getFragmentID());
        this.recordUpdate(recordID);
      }
      if (this._isOptimisticUpdate || isCompatibleRelayFragmentType(fragment, this._store.getType(recordID))) {
        var _path = state.path.getPath(fragment, recordID);
        this.traverse(fragment, _extends({}, state, {path: _path}));
      }
    };
    RelayQueryWriter.prototype.visitField = function visitField(field, state) {
      var recordID = state.recordID;
      var responseData = state.responseData;
      !(this._store.getRecordState(recordID) === RelayRecordState.EXISTENT) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot update a non-existent record, `%s`.', recordID) : invariant(false) : undefined;
      !(typeof responseData === 'object' && responseData !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an object.', recordID) : invariant(false) : undefined;
      var fieldData = responseData[field.getSerializationKey()];
      if (fieldData === undefined) {
        return;
      }
      if (fieldData === null) {
        this._store.deleteField(recordID, field.getStorageKey());
        this.recordUpdate(recordID);
        return;
      }
      if (field.isScalar()) {
        this._writeScalar(field, state, recordID, fieldData);
      } else if (field.isConnection()) {
        this._writeConnection(field, state, recordID, fieldData);
      } else if (field.isPlural()) {
        this._writePluralLink(field, state, recordID, fieldData);
      } else {
        this._writeLink(field, state, recordID, fieldData);
      }
    };
    RelayQueryWriter.prototype._writeScalar = function _writeScalar(field, state, recordID, nextValue) {
      var storageKey = field.getStorageKey();
      var prevValue = this._store.getField(recordID, storageKey);
      this._store.putField(recordID, storageKey, nextValue);
      if (Array.isArray(prevValue) && Array.isArray(nextValue) && prevValue.length === nextValue.length && prevValue.every(function(prev, ii) {
        return prev === nextValue[ii];
      })) {
        return;
      } else if (prevValue === nextValue) {
        return;
      }
      this.recordUpdate(recordID);
    };
    RelayQueryWriter.prototype._writeConnection = function _writeConnection(field, state, recordID, connectionData) {
      var storageKey = field.getStorageKey();
      var connectionID = this._store.getLinkedRecordID(recordID, storageKey);
      if (!connectionID) {
        connectionID = generateClientID();
      }
      var connectionRecordState = this._store.getRecordState(connectionID);
      var hasEdges = !!(field.getFieldByStorageKey(EDGES) || connectionData != null && typeof connectionData === 'object' && connectionData[EDGES]);
      var path = state.path.getPath(field, connectionID);
      this._store.putRecord(connectionID, null, path);
      this._store.putLinkedRecordID(recordID, storageKey, connectionID);
      if (connectionRecordState !== RelayRecordState.EXISTENT) {
        this.recordUpdate(recordID);
        this.recordCreate(connectionID);
      }
      if (this.isNewRecord(connectionID) || this._updateTrackedQueries) {
        this._queryTracker.trackNodeForID(field, connectionID, path);
      }
      if (hasEdges && (!this._store.hasRange(connectionID) || this._forceIndex && this._forceIndex > this._store.getRangeForceIndex(connectionID))) {
        this._store.putRange(connectionID, field.getCallsWithValues(), this._forceIndex);
        this.recordUpdate(connectionID);
      }
      var connectionState = {
        path: path,
        nodeID: null,
        recordID: connectionID,
        responseData: connectionData
      };
      this._traverseConnection(field, field, connectionState);
    };
    RelayQueryWriter.prototype._traverseConnection = function _traverseConnection(connection, node, state) {
      var _this2 = this;
      node.getChildren().forEach(function(child) {
        if (child instanceof RelayQuery.Field) {
          if (child.getSchemaName() === EDGES) {
            _this2._writeEdges(connection, child, state);
          } else if (child.getSchemaName() !== PAGE_INFO) {
            _this2.visit(child, state);
          }
        } else {
          _this2._traverseConnection(connection, child, state);
        }
      });
    };
    RelayQueryWriter.prototype._writeEdges = function _writeEdges(connection, edges, state) {
      var _this3 = this;
      var connectionID = state.recordID;
      var connectionData = state.responseData;
      !(typeof connectionData === 'object' && connectionData !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot write edges for malformed connection `%s` on ' + 'record `%s`, expected the response to be an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
      var edgesData = connectionData[EDGES];
      if (edgesData == null) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected a response for field `edges`.', connection.getDebugName(), connectionID) : undefined;
        return;
      }
      !Array.isArray(edgesData) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected `edges` to be an array.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
      var rangeCalls = connection.getCallsWithValues();
      !RelayConnectionInterface.hasRangeCalls(rangeCalls) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s` without `first`, `last`, or `find` argument.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
      var rangeInfo = this._store.getRangeMetadata(connectionID, rangeCalls);
      !rangeInfo ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Expected a range to exist for connection field `%s` ' + 'on record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
      var fetchedEdgeIDs = [];
      var isUpdate = false;
      var nextIndex = 0;
      var filteredEdges = rangeInfo.filteredEdges;
      edgesData.forEach(function(edgeData) {
        if (edgeData == null) {
          return;
        }
        !(typeof edgeData === 'object' && edgeData) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Cannot write edge for connection field `%s` on ' + 'record `%s`, expected an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
        var nodeData = edgeData[NODE];
        if (nodeData == null) {
          return;
        }
        !(typeof nodeData === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Expected node to be an object for field `%s` on ' + 'record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
        var prevEdge = filteredEdges[nextIndex++];
        var nodeID = nodeData && nodeData[ID] || prevEdge && _this3._store.getLinkedRecordID(prevEdge.edgeID, NODE) || generateClientID();
        var edgeID = generateClientEdgeID(connectionID, nodeID);
        var path = state.path.getPath(edges, edgeID);
        _this3.createRecordIfMissing(edges, edgeID, null, path);
        fetchedEdgeIDs.push(edgeID);
        _this3.traverse(edges, {
          path: path,
          nodeID: nodeID,
          recordID: edgeID,
          responseData: edgeData
        });
        isUpdate = isUpdate || _this3.hasChangeToRecord(edgeID);
      });
      var pageInfo = connectionData[PAGE_INFO] || RelayConnectionInterface.getDefaultPageInfo();
      this._store.putRangeEdges(connectionID, rangeCalls, pageInfo, fetchedEdgeIDs);
      if (isUpdate) {
        this.recordUpdate(connectionID);
      }
    };
    RelayQueryWriter.prototype._writePluralLink = function _writePluralLink(field, state, recordID, fieldData) {
      var _this4 = this;
      var storageKey = field.getStorageKey();
      !Array.isArray(fieldData) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Expected array data for field `%s` on record `%s`.', field.getDebugName(), recordID) : invariant(false) : undefined;
      var prevLinkedIDs = this._store.getLinkedRecordIDs(recordID, storageKey);
      var nextLinkedIDs = [];
      var isUpdate = !prevLinkedIDs;
      var nextIndex = 0;
      fieldData.forEach(function(nextRecord) {
        if (nextRecord == null) {
          return;
        }
        !(typeof nextRecord === 'object' && nextRecord) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Expected elements for plural field `%s` to be ' + 'objects.', storageKey) : invariant(false) : undefined;
        var prevLinkedID = prevLinkedIDs && prevLinkedIDs[nextIndex];
        var nextLinkedID = nextRecord[ID] || prevLinkedID || generateClientID();
        nextLinkedIDs.push(nextLinkedID);
        var path = state.path.getPath(field, nextLinkedID);
        var typeName = _this4.getRecordTypeName(field, nextLinkedID, nextRecord);
        _this4.createRecordIfMissing(field, nextLinkedID, typeName, path);
        isUpdate = isUpdate || nextLinkedID !== prevLinkedID || _this4.isNewRecord(nextLinkedID);
        _this4.traverse(field, {
          path: path,
          nodeID: null,
          recordID: nextLinkedID,
          responseData: nextRecord
        });
        isUpdate = isUpdate || _this4.hasChangeToRecord(nextLinkedID);
        nextIndex++;
      });
      this._store.putLinkedRecordIDs(recordID, storageKey, nextLinkedIDs);
      isUpdate = isUpdate || !prevLinkedIDs || prevLinkedIDs.length !== nextLinkedIDs.length;
      if (isUpdate) {
        this.recordUpdate(recordID);
      }
    };
    RelayQueryWriter.prototype._writeLink = function _writeLink(field, state, recordID, fieldData) {
      var nodeID = state.nodeID;
      var storageKey = field.getStorageKey();
      !(typeof fieldData === 'object' && fieldData !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryWriter: Expected data for non-scalar field `%s` on record ' + '`%s` to be an object.', field.getDebugName(), recordID) : invariant(false) : undefined;
      var prevLinkedID = this._store.getLinkedRecordID(recordID, storageKey);
      var nextLinkedID = field.getSchemaName() === NODE && nodeID || fieldData[ID] || prevLinkedID || generateClientID();
      var path = state.path.getPath(field, nextLinkedID);
      var typeName = this.getRecordTypeName(field, nextLinkedID, fieldData);
      this.createRecordIfMissing(field, nextLinkedID, typeName, path);
      this._store.putLinkedRecordID(recordID, storageKey, nextLinkedID);
      if (prevLinkedID !== nextLinkedID || this.isNewRecord(nextLinkedID)) {
        this.recordUpdate(recordID);
      }
      this.traverse(field, {
        path: path,
        nodeID: null,
        recordID: nextLinkedID,
        responseData: fieldData
      });
    };
    return RelayQueryWriter;
  })(RelayQueryVisitor);
  module.exports = RelayQueryWriter;
})(require('process'));
