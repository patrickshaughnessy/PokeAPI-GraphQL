/* */ 
'use strict';
var GraphQLFragmentPointer = require('./GraphQLFragmentPointer');
var RelayMutationTransaction = require('./RelayMutationTransaction');
var RelayQuery = require('./RelayQuery');
var RelayQueryResultObservable = require('./RelayQueryResultObservable');
var RelayStoreData = require('./RelayStoreData');
var forEachRootCallArg = require('./forEachRootCallArg');
var readRelayQueryData = require('./readRelayQueryData');
var storeData = RelayStoreData.getDefaultInstance();
var queryRunner = storeData.getQueryRunner();
var queuedStore = storeData.getQueuedStore();
var RelayStore = {
  primeCache: function primeCache(querySet, callback) {
    return queryRunner.run(querySet, callback);
  },
  forceFetch: function forceFetch(querySet, callback) {
    return queryRunner.forceFetch(querySet, callback);
  },
  read: function read(node, dataID, options) {
    return readRelayQueryData(storeData, node, dataID, options).data;
  },
  readAll: function readAll(node, dataIDs, options) {
    return dataIDs.map(function(dataID) {
      return readRelayQueryData(storeData, node, dataID, options).data;
    });
  },
  readQuery: function readQuery(root, options) {
    var storageKey = root.getStorageKey();
    var results = [];
    forEachRootCallArg(root, function(identifyingArgValue) {
      var data;
      var dataID = queuedStore.getDataID(storageKey, identifyingArgValue);
      if (dataID != null) {
        data = RelayStore.read(root, dataID, options);
      }
      results.push(data);
    });
    return results;
  },
  observe: function observe(fragment, dataID) {
    var fragmentPointer = new GraphQLFragmentPointer(fragment.isPlural() ? [dataID] : dataID, fragment);
    return new RelayQueryResultObservable(storeData, fragmentPointer);
  },
  applyUpdate: function applyUpdate(mutation, callbacks) {
    return storeData.getMutationQueue().createTransaction(mutation, callbacks);
  },
  update: function update(mutation, callbacks) {
    this.applyUpdate(mutation, callbacks).commit();
  }
};
module.exports = RelayStore;
