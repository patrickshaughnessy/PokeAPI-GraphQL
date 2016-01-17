/* */ 
'use strict';
var RelayStoreData = require('./RelayStoreData');
var RelayGarbageCollection = {
  initialize: function initialize() {
    RelayStoreData.getDefaultInstance().initializeGarbageCollector();
  },
  scheduleCollection: function scheduleCollection(stepLength) {
    var garbageCollector = RelayStoreData.getDefaultInstance().getGarbageCollector();
    if (garbageCollector) {
      garbageCollector.scheduleCollection(stepLength);
    }
  }
};
module.exports = RelayGarbageCollection;
