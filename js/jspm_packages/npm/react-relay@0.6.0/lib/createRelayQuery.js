/* */ 
(function(process) {
  'use strict';
  var RelayMetaRoute = require('./RelayMetaRoute');
  var RelayQuery = require('./RelayQuery');
  var invariant = require('fbjs/lib/invariant');
  function createRelayQuery(node, variables) {
    !(typeof variables === 'object' && variables != null && !Array.isArray(variables)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay.Query: Expected `variables` to be an object.') : invariant(false) : undefined;
    return RelayQuery.Root.create(node, RelayMetaRoute.get('$createRelayQuery'), variables);
  }
  module.exports = createRelayQuery;
})(require('process'));
