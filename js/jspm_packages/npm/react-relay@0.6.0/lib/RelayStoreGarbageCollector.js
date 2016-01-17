/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayBufferedNeglectionStateMap = require('./RelayBufferedNeglectionStateMap');
  var RelayNeglectionStateMap = require('./RelayNeglectionStateMap');
  var RelayProfiler = require('./RelayProfiler');
  var RelayTaskScheduler = require('./RelayTaskScheduler');
  var forEachObject = require('fbjs/lib/forEachObject');
  var resolveImmediate = require('fbjs/lib/resolveImmediate');
  var RANGE = '__range__';
  var RelayStoreGarbageCollector = (function() {
    function RelayStoreGarbageCollector(relayStoreData) {
      _classCallCheck(this, RelayStoreGarbageCollector);
      this._directNeglectionStates = new RelayNeglectionStateMap();
      this._bufferedNeglectionStates = new RelayBufferedNeglectionStateMap(this._directNeglectionStates);
      this._neglectionStates = this._bufferedNeglectionStates;
      this._relayStoreData = relayStoreData;
      this._cycles = 0;
    }
    RelayStoreGarbageCollector.prototype.scheduleCollection = function scheduleCollection(stepLength) {
      var _this = this;
      this._bufferedNeglectionStates.flushBuffer();
      var iterator = this._neglectionStates.values();
      var currentCycle = ++this._cycles;
      this._neglectionStates = this._directNeglectionStates;
      RelayTaskScheduler.await(function() {
        return _this._collectGarbageStep(currentCycle, iterator, iterator.next(), stepLength);
      });
    };
    RelayStoreGarbageCollector.prototype._collectGarbageStep = function _collectGarbageStep(currentCycle, remainingDataIDs, offset, stepLength) {
      var _this2 = this;
      var iterator = offset;
      var neglectionState;
      if (currentCycle !== this._cycles) {
        for (iterator = offset; !iterator.done; iterator = remainingDataIDs.next()) {
          var _iterator = iterator;
          neglectionState = _iterator.value;
          if (neglectionState) {
            neglectionState.collectible = true;
          }
        }
        return;
      }
      iterator = offset;
      var profileState = {
        count: -1,
        stepLength: stepLength
      };
      var profile = RelayProfiler.profile('RelayStoreGarbageCollector.collect', profileState);
      var recordsBefore = this._neglectionStates.size();
      var seenRecords = 0;
      for (iterator = offset; !iterator.done && (stepLength == null || seenRecords < stepLength); iterator = remainingDataIDs.next()) {
        var _iterator2 = iterator;
        neglectionState = _iterator2.value;
        if (neglectionState) {
          if (this._isCollectible(neglectionState)) {
            seenRecords += this._removeRecordAndDescendentClientRecords(neglectionState.dataID);
          } else {
            seenRecords++;
          }
          neglectionState.collectible = true;
        }
      }
      var recordsAfter = this._neglectionStates.size();
      profileState.count = recordsBefore - recordsAfter;
      profile.stop();
      if (!iterator.done) {
        resolveImmediate(function() {
          return RelayTaskScheduler.await(function() {
            return _this2._collectGarbageStep(currentCycle, remainingDataIDs, iterator, stepLength);
          });
        });
      } else {
        this._neglectionStates = this._bufferedNeglectionStates;
      }
    };
    RelayStoreGarbageCollector.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
      this._neglectionStates.decreaseSubscriptionsFor(dataID);
    };
    RelayStoreGarbageCollector.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
      this._neglectionStates.increaseSubscriptionsFor(dataID);
    };
    RelayStoreGarbageCollector.prototype.register = function register(dataID) {
      this._neglectionStates.register(dataID);
    };
    RelayStoreGarbageCollector.prototype._isCollectible = function _isCollectible(neglectionState) {
      var isEligibleForCollection = neglectionState.collectible && !neglectionState.subscriptions;
      var queuedStore = this._relayStoreData.getQueuedStore();
      return isEligibleForCollection && (!GraphQLStoreDataHandler.isClientID(neglectionState.dataID) || queuedStore.hasRange(neglectionState.dataID));
    };
    RelayStoreGarbageCollector.prototype._removeRecordAndDescendentClientRecords = function _removeRecordAndDescendentClientRecords(dataID) {
      var records = this._relayStoreData.getNodeData();
      var queuedRecords = this._relayStoreData.getQueuedData();
      var cachedRecords = this._relayStoreData.getCachedData();
      var removalStatusMap = {};
      removalStatusMap[dataID] = 'pending';
      var removedRecords = 0;
      var remainingRecords = [records[dataID], queuedRecords[dataID], cachedRecords[dataID]];
      function enqueueField(field) {
        var dataID = getClientIDFromLinkedRecord(field);
        if (dataID && !removalStatusMap[dataID]) {
          removalStatusMap[dataID] = 'pending';
          remainingRecords.push(records[dataID], queuedRecords[dataID], cachedRecords[dataID]);
        }
      }
      while (remainingRecords.length) {
        var currentRecord = remainingRecords.shift();
        if (currentRecord && typeof currentRecord === 'object') {
          var range = currentRecord[RANGE];
          if (range) {
            range.getEdgeIDs().forEach(function(id) {
              return enqueueField({__dataID__: id});
            });
          } else {
            forEachObject(currentRecord, function(field, fieldName) {
              if (GraphQLStoreDataHandler.isMetadataKey(fieldName)) {
                return;
              }
              if (Array.isArray(field)) {
                field.forEach(enqueueField);
              } else {
                enqueueField(field);
              }
            });
          }
          var currentDataID = GraphQLStoreDataHandler.getID(currentRecord);
          if (currentDataID && removalStatusMap[currentDataID] === 'pending') {
            this._removeRecord(currentRecord);
            removalStatusMap[currentDataID] = 'removed';
            removedRecords++;
          }
        }
      }
      return removedRecords;
    };
    RelayStoreGarbageCollector.prototype._removeRecord = function _removeRecord(record) {
      var dataID = record.__dataID__;
      this._relayStoreData.getQueryTracker().untrackNodesForID(dataID);
      this._relayStoreData.getQueuedStore().removeRecord(dataID);
      this._neglectionStates.remove(dataID);
    };
    return RelayStoreGarbageCollector;
  })();
  function getClientIDFromLinkedRecord(field) {
    if (!field || typeof field !== 'object') {
      return null;
    }
    var dataID = GraphQLStoreDataHandler.getID(field);
    if (dataID && GraphQLStoreDataHandler.isClientID(dataID)) {
      return dataID;
    }
    return null;
  }
  module.exports = RelayStoreGarbageCollector;
})(require('process'));
