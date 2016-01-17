/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayQuery = require('./RelayQuery');
  var RelayQueryPath = require('./RelayQueryPath');
  var findRelayQueryLeaves = require('./findRelayQueryLeaves');
  var forEachObject = require('fbjs/lib/forEachObject');
  var forEachRootCallArg = require('./forEachRootCallArg');
  var invariant = require('fbjs/lib/invariant');
  var isEmpty = require('fbjs/lib/isEmpty');
  function readRelayDiskCache(queries, store, cachedRecords, cachedRootCallMap, cacheManager, callbacks) {
    var reader = new RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, callbacks);
    reader.read(queries);
  }
  var RelayCacheReader = (function() {
    function RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, callbacks) {
      _classCallCheck(this, RelayCacheReader);
      this._store = store;
      this._cachedRecords = cachedRecords;
      this._cachedRootCallMap = cachedRootCallMap;
      this._cacheManager = cacheManager;
      this._callbacks = callbacks;
      this._hasFailed = false;
      this._pendingNodes = {};
      this._pendingRoots = {};
    }
    RelayCacheReader.prototype.read = function read(queries) {
      var _this = this;
      forEachObject(queries, function(query) {
        if (_this._hasFailed) {
          return;
        }
        if (query) {
          (function() {
            var storageKey = query.getStorageKey();
            forEachRootCallArg(query, function(identifyingArgValue) {
              if (_this._hasFailed) {
                return;
              }
              identifyingArgValue = identifyingArgValue || '';
              _this._visitRoot(storageKey, identifyingArgValue, query);
            });
          })();
        }
      });
      if (this._isDone()) {
        this._callbacks.onSuccess && this._callbacks.onSuccess();
      }
    };
    RelayCacheReader.prototype._visitRoot = function _visitRoot(storageKey, identifyingArgValue, query) {
      var dataID = this._store.getDataID(storageKey, identifyingArgValue);
      if (dataID == null) {
        if (this._cachedRootCallMap.hasOwnProperty(storageKey) && this._cachedRootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
          this._handleFailed();
        } else {
          this._queueRoot(storageKey, identifyingArgValue, query);
        }
      } else {
        this._visitNode(dataID, {
          node: query,
          path: new RelayQueryPath(query),
          rangeCalls: undefined
        });
      }
    };
    RelayCacheReader.prototype._queueRoot = function _queueRoot(storageKey, identifyingArgValue, query) {
      var _this2 = this;
      var rootKey = storageKey + '*' + identifyingArgValue;
      if (this._pendingRoots.hasOwnProperty(rootKey)) {
        this._pendingRoots[rootKey].push(query);
      } else {
        this._pendingRoots[rootKey] = [query];
        this._cacheManager.readRootCall(storageKey, identifyingArgValue, function(error, value) {
          if (_this2._hasFailed) {
            return;
          }
          if (error) {
            _this2._handleFailed();
            return;
          }
          var roots = _this2._pendingRoots[rootKey];
          delete _this2._pendingRoots[rootKey];
          _this2._cachedRootCallMap[storageKey] = _this2._cachedRootCallMap[storageKey] || {};
          _this2._cachedRootCallMap[storageKey][identifyingArgValue] = value;
          if (value == null) {
            _this2._handleFailed();
          } else {
            (function() {
              var dataID = value;
              roots.forEach(function(root) {
                if (_this2._hasFailed) {
                  return;
                }
                _this2._visitNode(dataID, {
                  node: root,
                  path: new RelayQueryPath(root),
                  rangeCalls: undefined
                });
              });
            })();
          }
          if (_this2._isDone()) {
            _this2._callbacks.onSuccess && _this2._callbacks.onSuccess();
          }
        });
      }
    };
    RelayCacheReader.prototype._visitNode = function _visitNode(dataID, pendingItem) {
      var _this3 = this;
      var _findRelayQueryLeaves = findRelayQueryLeaves(this._store, this._cachedRecords, pendingItem.node, dataID, pendingItem.path, pendingItem.rangeCalls);
      var missingData = _findRelayQueryLeaves.missingData;
      var pendingNodes = _findRelayQueryLeaves.pendingNodes;
      if (missingData) {
        this._handleFailed();
        return;
      }
      forEachObject(pendingNodes, function(pendingItems, dataID) {
        _this3._queueNode(dataID, pendingItems);
      });
    };
    RelayCacheReader.prototype._queueNode = function _queueNode(dataID, pendingItems) {
      var _this4 = this;
      if (this._pendingNodes.hasOwnProperty(dataID)) {
        var _pendingNodes$dataID;
        (_pendingNodes$dataID = this._pendingNodes[dataID]).push.apply(_pendingNodes$dataID, pendingItems);
      } else {
        this._pendingNodes[dataID] = pendingItems;
        this._cacheManager.readNode(dataID, function(error, value) {
          if (_this4._hasFailed) {
            return;
          }
          if (error) {
            _this4._handleFailed();
            return;
          }
          if (value && GraphQLStoreDataHandler.isClientID(dataID)) {
            value.__path__ = pendingItems[0].path;
          }
          _this4._cachedRecords[dataID] = value;
          var items = _this4._pendingNodes[dataID];
          delete _this4._pendingNodes[dataID];
          if (value === undefined) {
            _this4._handleFailed();
          } else {
            items.forEach(function(item) {
              if (_this4._hasFailed) {
                return;
              }
              _this4._visitNode(dataID, item);
            });
          }
          if (_this4._isDone()) {
            _this4._callbacks.onSuccess && _this4._callbacks.onSuccess();
          }
        });
      }
    };
    RelayCacheReader.prototype._isDone = function _isDone() {
      return isEmpty(this._pendingRoots) && isEmpty(this._pendingNodes) && !this._hasFailed;
    };
    RelayCacheReader.prototype._handleFailed = function _handleFailed() {
      !!this._hasFailed ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayStoreReader: Query set already failed') : invariant(false) : undefined;
      this._hasFailed = true;
      this._callbacks.onFailure && this._callbacks.onFailure();
    };
    return RelayCacheReader;
  })();
  module.exports = readRelayDiskCache;
})(require('process'));
