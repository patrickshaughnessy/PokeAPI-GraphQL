/* */ 
(function(process) {
  'use strict';
  var invariant = require('fbjs/lib/invariant');
  var RelayDeprecated = {upgradeContainerSpec: function upgradeContainerSpec(spec) {
      ['queries', 'queryParams'].forEach(function(property) {
        !!spec.hasOwnProperty(property) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay.createContainer(...): Found no longer supported property: %s', property) : invariant(false) : undefined;
      });
      return spec;
    }};
  module.exports = RelayDeprecated;
})(require('process'));
