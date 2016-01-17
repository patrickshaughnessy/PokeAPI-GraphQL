/* */ 
(function(process) {
  'use strict';
  var Promise = require('fbjs/lib/Promise');
  'use strict';
  var RelayProfiler = require('./RelayProfiler');
  var invariant = require('fbjs/lib/invariant');
  var injectedNetworkLayer;
  var RelayNetworkLayer = {
    injectNetworkLayer: function injectNetworkLayer(networkLayer) {
      injectedNetworkLayer = networkLayer;
    },
    sendMutation: function sendMutation(mutationRequest) {
      var networkLayer = getCurrentNetworkLayer();
      var promise = networkLayer.sendMutation(mutationRequest);
      if (promise) {
        Promise.resolve(promise).done();
      }
    },
    sendQueries: function sendQueries(queryRequests) {
      var networkLayer = getCurrentNetworkLayer();
      var promise = networkLayer.sendQueries(queryRequests);
      if (promise) {
        Promise.resolve(promise).done();
      }
    },
    supports: function supports() {
      var networkLayer = getCurrentNetworkLayer();
      return networkLayer.supports.apply(networkLayer, arguments);
    }
  };
  function getCurrentNetworkLayer() {
    !injectedNetworkLayer ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayNetworkLayer: Use `injectNetworkLayer` to configure a network layer.') : invariant(false) : undefined;
    return injectedNetworkLayer;
  }
  RelayProfiler.instrumentMethods(RelayNetworkLayer, {
    sendMutation: 'RelayNetworkLayer.sendMutation',
    sendQueries: 'RelayNetworkLayer.sendQueries'
  });
  module.exports = RelayNetworkLayer;
})(require('process'));
