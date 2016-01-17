/* */ 
(function(process) {
  'use strict';
  var Promise = require('fbjs/lib/Promise');
  'use strict';
  var RelayNetworkLayer = require('./RelayNetworkLayer');
  var RelayProfiler = require('./RelayProfiler');
  var RelayQueryRequest = require('./RelayQueryRequest');
  var resolveImmediate = require('fbjs/lib/resolveImmediate');
  var queue = null;
  function fetchRelayQuery(query) {
    if (!queue) {
      (function() {
        queue = [];
        var currentQueue = queue;
        resolveImmediate(function() {
          queue = null;
          profileQueue(currentQueue);
          processQueue(currentQueue);
        });
      })();
    }
    var request = new RelayQueryRequest(query);
    queue.push(request);
    return request.getPromise();
  }
  function processQueue(currentQueue) {
    RelayNetworkLayer.sendQueries(currentQueue);
  }
  function profileQueue(currentQueue) {
    var firstResultProfiler = RelayProfiler.profile('fetchRelayQuery');
    currentQueue.forEach(function(query) {
      var profiler = RelayProfiler.profile('fetchRelayQuery.query');
      var onSettle = function onSettle() {
        profiler.stop();
        if (firstResultProfiler) {
          firstResultProfiler.stop();
          firstResultProfiler = null;
        }
      };
      query.getPromise().done(onSettle, onSettle);
    });
  }
  module.exports = fetchRelayQuery;
})(require('process'));
