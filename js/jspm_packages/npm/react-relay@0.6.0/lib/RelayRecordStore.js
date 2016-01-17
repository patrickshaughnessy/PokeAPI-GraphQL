/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var GraphQLMutatorConstants = require('./GraphQLMutatorConstants');
  var GraphQLRange = require('./GraphQLRange');
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayRecordStatusMap = require('./RelayRecordStatusMap');
  var forEachObject = require('fbjs/lib/forEachObject');
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var CURSOR = RelayConnectionInterface.CURSOR;
  var NODE = RelayConnectionInterface.NODE;
  var EMPTY = '';
  var FILTER_CALLS = '__filterCalls__';
  var FORCE_INDEX = '__forceIndex__';
  var RANGE = '__range__';
  var RESOLVED_FRAGMENT_MAP = '__resolvedFragmentMap__';
  var RESOLVED_FRAGMENT_MAP_GENERATION = '__resolvedFragmentMapGeneration__';
  var PATH = '__path__';
  var APPEND = GraphQLMutatorConstants.APPEND;
  var PREPEND = GraphQLMutatorConstants.PREPEND;
  var REMOVE = GraphQLMutatorConstants.REMOVE;
  var RelayRecordStore = (function() {
    function RelayRecordStore(records, rootCallMaps, nodeConnectionMap, cacheWriter, clientMutationID) {
      _classCallCheck(this, RelayRecordStore);
      this._cacheWriter = cacheWriter;
      this._cachedRecords = records.cachedRecords;
      this._cachedRootCallMap = rootCallMaps && rootCallMaps.cachedRootCallMap || {};
      this._clientMutationID = clientMutationID;
      this._queuedRecords = records.queuedRecords;
      this._nodeConnectionMap = nodeConnectionMap || {};
      this._records = records.records;
      this._rootCallMap = rootCallMaps && rootCallMaps.rootCallMap || {};
      this._storage = [];
      if (this._queuedRecords) {
        this._storage.push(this._queuedRecords);
      }
      if (this._records) {
        this._storage.push(this._records);
      }
      if (this._cachedRecords) {
        this._storage.push(this._cachedRecords);
      }
    }
    RelayRecordStore.prototype.getDataID = function getDataID(storageKey, identifyingArgValue) {
      if (RelayNodeInterface.isNodeRootCall(storageKey)) {
        !(identifyingArgValue != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.getDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
        return identifyingArgValue;
      }
      if (identifyingArgValue == null) {
        identifyingArgValue = EMPTY;
      }
      if (this._rootCallMap.hasOwnProperty(storageKey) && this._rootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
        return this._rootCallMap[storageKey][identifyingArgValue];
      } else if (this._cachedRootCallMap.hasOwnProperty(storageKey)) {
        return this._cachedRootCallMap[storageKey][identifyingArgValue];
      }
    };
    RelayRecordStore.prototype.putDataID = function putDataID(storageKey, identifyingArgValue, dataID) {
      if (RelayNodeInterface.isNodeRootCall(storageKey)) {
        !(identifyingArgValue != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
        return;
      }
      if (identifyingArgValue == null) {
        identifyingArgValue = EMPTY;
      }
      this._rootCallMap[storageKey] = this._rootCallMap[storageKey] || {};
      this._rootCallMap[storageKey][identifyingArgValue] = dataID;
      if (this._cacheWriter) {
        this._cacheWriter.writeRootCall(storageKey, identifyingArgValue, dataID);
      }
    };
    RelayRecordStore.prototype.getRecordState = function getRecordState(dataID) {
      var record = this._getRecord(dataID);
      if (record === null) {
        return 'NONEXISTENT';
      } else if (record === undefined) {
        return 'UNKNOWN';
      }
      return 'EXISTENT';
    };
    RelayRecordStore.prototype.putRecord = function putRecord(dataID, typeName, path) {
      var target = this._queuedRecords || this._records;
      var prevRecord = target[dataID];
      if (prevRecord) {
        if (target === this._queuedRecords) {
          this._setClientMutationID(prevRecord);
        }
        return;
      }
      var nextRecord = {
        __dataID__: dataID,
        __typename: typeName
      };
      if (target === this._queuedRecords) {
        this._setClientMutationID(nextRecord);
      }
      if (GraphQLStoreDataHandler.isClientID(dataID)) {
        !path ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putRecord(): Expected a path for non-refetchable ' + 'record `%s`.', dataID) : invariant(false) : undefined;
        nextRecord[PATH] = path;
      }
      target[dataID] = nextRecord;
      var cacheWriter = this._cacheWriter;
      if (!this._queuedRecords && cacheWriter) {
        cacheWriter.writeField(dataID, '__dataID__', dataID, typeName);
      }
    };
    RelayRecordStore.prototype.getPathToRecord = function getPathToRecord(dataID) {
      var path = this._getField(dataID, PATH);
      return path;
    };
    RelayRecordStore.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
      !this._queuedRecords ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.hasOptimisticUpdate(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
      return this._queuedRecords.hasOwnProperty(dataID);
    };
    RelayRecordStore.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
      !this._queuedRecords ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.getClientMutationIDs(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
      var record = this._queuedRecords[dataID];
      return record ? record.__mutationIDs__ : null;
    };
    RelayRecordStore.prototype.hasMutationError = function hasMutationError(dataID) {
      if (this._queuedRecords) {
        var record = this._queuedRecords[dataID];
        return !!(record && RelayRecordStatusMap.isErrorStatus(record.__status__));
      }
      return false;
    };
    RelayRecordStore.prototype.setMutationErrorStatus = function setMutationErrorStatus(dataID, hasError) {
      !this._queuedRecords ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Can only set the ' + 'mutation status of queued records.') : invariant(false) : undefined;
      var record = this._queuedRecords[dataID];
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Expected record `%s` to ' + 'exist before settings its mutation error status.', dataID) : invariant(false) : undefined;
      record.__status__ = RelayRecordStatusMap.setErrorStatus(record.__status__, hasError);
    };
    RelayRecordStore.prototype.hasDeferredFragmentData = function hasDeferredFragmentData(dataID, fragmentID) {
      var resolvedFragmentMap = this._getField(dataID, RESOLVED_FRAGMENT_MAP);
      !(typeof resolvedFragmentMap === 'object' || resolvedFragmentMap == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.hasDeferredFragmentData(): Expected the map of ' + 'resolved deferred fragments associated with record `%s` to be null or ' + 'an object. Found a(n) `%s`.', dataID, typeof resolvedFragmentMap) : invariant(false) : undefined;
      return !!(resolvedFragmentMap && resolvedFragmentMap[fragmentID]);
    };
    RelayRecordStore.prototype.setHasDeferredFragmentData = function setHasDeferredFragmentData(dataID, fragmentID) {
      var record = this._getRecord(dataID);
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.setHasDeferredFragmentData(): Expected record `%s` ' + 'to exist before marking it as having received data for the deferred ' + 'fragment with id `%s`.', dataID, fragmentID) : invariant(false) : undefined;
      var resolvedFragmentMap = record[RESOLVED_FRAGMENT_MAP];
      if (typeof resolvedFragmentMap !== 'object' || !resolvedFragmentMap) {
        resolvedFragmentMap = {};
      }
      resolvedFragmentMap[fragmentID] = true;
      record[RESOLVED_FRAGMENT_MAP] = resolvedFragmentMap;
      if (typeof record[RESOLVED_FRAGMENT_MAP_GENERATION] === 'number') {
        record[RESOLVED_FRAGMENT_MAP_GENERATION]++;
      } else {
        record[RESOLVED_FRAGMENT_MAP_GENERATION] = 0;
      }
    };
    RelayRecordStore.prototype.deleteRecord = function deleteRecord(dataID) {
      var target = this._queuedRecords || this._records;
      target[dataID] = null;
      if (!this._queuedRecords) {
        delete this._nodeConnectionMap[dataID];
        if (this._cacheWriter) {
          this._cacheWriter.writeNode(dataID, null);
        }
      }
    };
    RelayRecordStore.prototype.getType = function getType(dataID) {
      return this._getField(dataID, '__typename');
    };
    RelayRecordStore.prototype.getField = function getField(dataID, storageKey) {
      return this._getField(dataID, storageKey);
    };
    RelayRecordStore.prototype.putField = function putField(dataID, storageKey, value) {
      var record = this._getRecordForWrite(dataID);
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putField(): Expected record `%s` to exist before ' + 'writing field `%s`.', dataID, storageKey) : invariant(false) : undefined;
      record[storageKey] = value;
      if (!this._queuedRecords && this._cacheWriter) {
        var typeName = record.__typename;
        this._cacheWriter.writeField(dataID, storageKey, value, typeName);
      }
    };
    RelayRecordStore.prototype.deleteField = function deleteField(dataID, storageKey) {
      var record = this._getRecordForWrite(dataID);
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.deleteField(): Expected record `%s` to exist before ' + 'deleting field `%s`.', dataID, storageKey) : invariant(false) : undefined;
      record[storageKey] = null;
      if (!this._queuedRecords && this._cacheWriter) {
        this._cacheWriter.writeField(dataID, storageKey, null);
      }
    };
    RelayRecordStore.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
      var field = this._getField(dataID, storageKey);
      if (field == null) {
        return field;
      }
      !(typeof field === 'object' && field !== null && !Array.isArray(field)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.getLinkedRecordID(): Expected field `%s` for record ' + '`%s` to have a linked record.', storageKey, dataID) : invariant(false) : undefined;
      return field.__dataID__;
    };
    RelayRecordStore.prototype.putLinkedRecordID = function putLinkedRecordID(parentID, storageKey, recordID) {
      var parent = this._getRecordForWrite(parentID);
      !parent ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking to record `%s`.', parentID, recordID) : invariant(false) : undefined;
      var record = this._getRecord(recordID);
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking from record `%s`.', recordID, parentID) : invariant(false) : undefined;
      var fieldValue = {__dataID__: recordID};
      parent[storageKey] = fieldValue;
      if (!this._queuedRecords && this._cacheWriter) {
        this._cacheWriter.writeField(parentID, storageKey, fieldValue);
      }
    };
    RelayRecordStore.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
      var field = this._getField(dataID, storageKey);
      if (field == null) {
        return field;
      }
      !Array.isArray(field) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected field `%s` for ' + 'record `%s` to have an array of linked records.', storageKey, dataID) : invariant(false) : undefined;
      return field.map(function(item, ii) {
        !(typeof item === 'object' && item.__dataID__) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected element at index %s ' + 'in field `%s` for record `%s` to be a linked record.', ii, storageKey, dataID) : invariant(false) : undefined;
        return item.__dataID__;
      });
    };
    RelayRecordStore.prototype.putLinkedRecordIDs = function putLinkedRecordIDs(parentID, storageKey, recordIDs) {
      var _this = this;
      var parent = this._getRecordForWrite(parentID);
      !parent ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to exist ' + 'before linking records.', parentID) : invariant(false) : undefined;
      var records = recordIDs.map(function(recordID) {
        var record = _this._getRecord(recordID);
        !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to ' + 'exist before linking from `%s`.', recordID, parentID) : invariant(false) : undefined;
        return {__dataID__: recordID};
      });
      parent[storageKey] = records;
      if (!this._queuedRecords && this._cacheWriter) {
        this._cacheWriter.writeField(parentID, storageKey, records);
      }
    };
    RelayRecordStore.prototype.getConnectionIDsForRecord = function getConnectionIDsForRecord(dataID) {
      var connectionIDs = this._nodeConnectionMap[dataID];
      if (connectionIDs) {
        return _Object$keys(connectionIDs);
      }
      return null;
    };
    RelayRecordStore.prototype.getConnectionIDsForField = function getConnectionIDsForField(dataID, schemaName) {
      var record = this._records[dataID];
      if (record == null) {
        return record;
      }
      var connectionIDs;
      forEachObject(record, function(datum, key) {
        if (datum && getFieldNameFromKey(key) === schemaName) {
          var dataID = datum.__dataID__;
          if (dataID) {
            connectionIDs = connectionIDs || [];
            connectionIDs.push(dataID);
          }
        }
      });
      return connectionIDs;
    };
    RelayRecordStore.prototype.getRangeForceIndex = function getRangeForceIndex(connectionID) {
      var forceIndex = this._getField(connectionID, FORCE_INDEX);
      if (forceIndex === null) {
        return -1;
      }
      return forceIndex || 0;
    };
    RelayRecordStore.prototype.getRangeFilterCalls = function getRangeFilterCalls(connectionID) {
      return this._getField(connectionID, FILTER_CALLS);
    };
    RelayRecordStore.prototype.getRangeMetadata = function getRangeMetadata(connectionID, calls) {
      var _this2 = this;
      if (connectionID == null) {
        return connectionID;
      }
      var range = this._getField(connectionID, RANGE);
      if (range == null) {
        if (range === null) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'RelayRecordStore.getRangeMetadata(): Expected range to exist if ' + '`edges` has been fetched.') : undefined;
        }
        return undefined;
      }
      var filterCalls = getFilterCalls(calls);
      if (calls.length === filterCalls.length) {
        return {
          diffCalls: calls,
          filterCalls: filterCalls,
          pageInfo: undefined,
          requestedEdgeIDs: [],
          filteredEdges: []
        };
      }
      var queuedRecord = this._queuedRecords ? this._queuedRecords[connectionID] : null;
      var _range$retrieveRangeInfoForQuery = range.retrieveRangeInfoForQuery(calls, queuedRecord);
      var diffCalls = _range$retrieveRangeInfoForQuery.diffCalls;
      var pageInfo = _range$retrieveRangeInfoForQuery.pageInfo;
      var requestedEdgeIDs = _range$retrieveRangeInfoForQuery.requestedEdgeIDs;
      if (diffCalls && diffCalls.length) {
        diffCalls = filterCalls.concat(diffCalls);
      } else {
        diffCalls = [];
      }
      var filteredEdges;
      if (requestedEdgeIDs) {
        filteredEdges = requestedEdgeIDs.map(function(edgeID) {
          return {
            edgeID: edgeID,
            nodeID: _this2.getLinkedRecordID(edgeID, NODE)
          };
        }).filter(function(edge) {
          return _this2._getRecord(edge.nodeID);
        });
      } else {
        filteredEdges = [];
      }
      return {
        diffCalls: diffCalls,
        filterCalls: filterCalls,
        pageInfo: pageInfo,
        requestedEdgeIDs: requestedEdgeIDs,
        filteredEdges: filteredEdges
      };
    };
    RelayRecordStore.prototype.putRange = function putRange(connectionID, calls, forceIndex) {
      !!this._queuedRecords ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putRange(): Cannot create a queued range.') : invariant(false) : undefined;
      var record = this._getRecord(connectionID);
      !record ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putRange(): Expected record `%s` to exist before ' + 'adding a range.', connectionID) : invariant(false) : undefined;
      var range = new GraphQLRange();
      var filterCalls = getFilterCalls(calls);
      forceIndex = forceIndex || 0;
      record.__filterCalls__ = filterCalls;
      record.__forceIndex__ = forceIndex;
      record.__range__ = range;
      var cacheWriter = this._cacheWriter;
      if (!this._queuedRecords && cacheWriter) {
        cacheWriter.writeField(connectionID, FILTER_CALLS, filterCalls);
        cacheWriter.writeField(connectionID, FORCE_INDEX, forceIndex);
        cacheWriter.writeField(connectionID, RANGE, range);
      }
    };
    RelayRecordStore.prototype.hasRange = function hasRange(connectionID) {
      return !!this._getField(connectionID, RANGE);
    };
    RelayRecordStore.prototype.putRangeEdges = function putRangeEdges(connectionID, calls, pageInfo, edges) {
      var _this3 = this;
      var range = this._getField(connectionID, RANGE);
      !range ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore.putRangeEdges(): Expected record `%s` to exist and ' + 'have a range.', connectionID) : invariant(false) : undefined;
      var edgesData = [];
      edges.forEach(function(edgeID) {
        var edgeData = _this3._getRangeEdgeData(edgeID);
        edgesData.push(edgeData);
        _this3._addConnectionForNode(connectionID, edgeData.node.__dataID__);
      });
      range.addItems(calls, edgesData, pageInfo);
      if (!this._queuedRecords && this._cacheWriter) {
        this._cacheWriter.writeField(connectionID, RANGE, range);
      }
    };
    RelayRecordStore.prototype.applyRangeUpdate = function applyRangeUpdate(connectionID, edgeID, operation) {
      if (this._queuedRecords) {
        this._applyOptimisticRangeUpdate(connectionID, edgeID, operation);
      } else {
        this._applyServerRangeUpdate(connectionID, edgeID, operation);
      }
    };
    RelayRecordStore.prototype.removeRecord = function removeRecord(dataID) {
      delete this._records[dataID];
      if (this._queuedRecords) {
        delete this._queuedRecords[dataID];
      }
      if (this._cachedRecords) {
        delete this._cachedRecords[dataID];
      }
    };
    RelayRecordStore.prototype._getRangeEdgeData = function _getRangeEdgeData(edgeID) {
      var nodeID = this.getLinkedRecordID(edgeID, NODE);
      !nodeID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore: Expected edge `%s` to have a `node` record.', edgeID) : invariant(false) : undefined;
      return {
        __dataID__: edgeID,
        cursor: this.getField(edgeID, CURSOR),
        node: {__dataID__: nodeID}
      };
    };
    RelayRecordStore.prototype._applyOptimisticRangeUpdate = function _applyOptimisticRangeUpdate(connectionID, edgeID, operation) {
      !this._queuedRecords ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore: Expected queued records to exist for optimistic ' + '`%s` update to record `%s`.', operation, connectionID) : invariant(false) : undefined;
      var record = this._queuedRecords[connectionID];
      if (!record) {
        record = {__dataID__: connectionID};
        this._queuedRecords[connectionID] = record;
      }
      this._setClientMutationID(record);
      var queue = record[operation];
      if (!queue) {
        queue = [];
        record[operation] = queue;
      }
      if (operation === PREPEND) {
        queue.unshift(edgeID);
      } else {
        queue.push(edgeID);
      }
    };
    RelayRecordStore.prototype._applyServerRangeUpdate = function _applyServerRangeUpdate(connectionID, edgeID, operation) {
      !this._records ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore: Expected base records to exist for `%s` update to ' + 'record `%s`.', operation, connectionID) : invariant(false) : undefined;
      var range = this._getField(connectionID, RANGE);
      !range ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore: Cannot apply `%s` update to non-existent record `%s`.', operation, connectionID) : invariant(false) : undefined;
      if (operation === REMOVE) {
        range.removeEdgeWithID(edgeID);
        var nodeID = this.getLinkedRecordID(edgeID, 'node');
        if (nodeID) {
          this._removeConnectionForNode(connectionID, nodeID);
        }
      } else {
        var edgeData = this._getRangeEdgeData(edgeID);
        this._addConnectionForNode(connectionID, edgeData.node.__dataID__);
        if (operation === APPEND) {
          range.appendEdge(this._getRangeEdgeData(edgeID));
        } else {
          range.prependEdge(this._getRangeEdgeData(edgeID));
        }
      }
      if (this._cacheWriter) {
        this._cacheWriter.writeField(connectionID, RANGE, range);
      }
    };
    RelayRecordStore.prototype._addConnectionForNode = function _addConnectionForNode(connectionID, nodeID) {
      var connectionMap = this._nodeConnectionMap[nodeID];
      if (!connectionMap) {
        connectionMap = {};
        this._nodeConnectionMap[nodeID] = connectionMap;
      }
      connectionMap[connectionID] = true;
    };
    RelayRecordStore.prototype._removeConnectionForNode = function _removeConnectionForNode(connectionID, nodeID) {
      var connectionMap = this._nodeConnectionMap[nodeID];
      if (connectionMap) {
        delete connectionMap[connectionID];
        if (_Object$keys(connectionMap).length === 0) {
          delete this._nodeConnectionMap[nodeID];
        }
      }
    };
    RelayRecordStore.prototype._getRecord = function _getRecord(dataID) {
      if (this._queuedRecords && this._queuedRecords.hasOwnProperty(dataID)) {
        return this._queuedRecords[dataID];
      } else if (this._records.hasOwnProperty(dataID)) {
        return this._records[dataID];
      } else if (this._cachedRecords) {
        return this._cachedRecords[dataID];
      }
    };
    RelayRecordStore.prototype._getRecordForWrite = function _getRecordForWrite(dataID) {
      var record = this._getRecord(dataID);
      if (!record) {
        return record;
      }
      var source = this._queuedRecords || this._records;
      if (!source[dataID]) {
        record = source[dataID] = {__dataID__: dataID};
      }
      if (source === this._queuedRecords) {
        this._setClientMutationID(record);
      }
      return record;
    };
    RelayRecordStore.prototype._getField = function _getField(dataID, storageKey) {
      var storage = this._storage;
      for (var ii = 0; ii < storage.length; ii++) {
        var record = storage[ii][dataID];
        if (record === null) {
          return null;
        } else if (record && record.hasOwnProperty(storageKey)) {
          return record[storageKey];
        }
      }
      return undefined;
    };
    RelayRecordStore.prototype._setClientMutationID = function _setClientMutationID(record) {
      var clientMutationID = this._clientMutationID;
      !clientMutationID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRecordStore: _clientMutationID cannot be null/undefined.') : invariant(false) : undefined;
      var mutationIDs = record.__mutationIDs__ || [];
      if (mutationIDs.indexOf(clientMutationID) === -1) {
        mutationIDs.push(clientMutationID);
        record.__mutationIDs__ = mutationIDs;
      }
      record.__status__ = RelayRecordStatusMap.setOptimisticStatus(0, true);
    };
    return RelayRecordStore;
  })();
  function getFilterCalls(calls) {
    return calls.filter(function(call) {
      return !RelayConnectionInterface.isConnectionCall(call);
    });
  }
  function getFieldNameFromKey(key) {
    return key.split(/(?![_A-Za-z][_0-9A-Za-z]*)/, 1)[0];
  }
  module.exports = RelayRecordStore;
})(require('process'));
