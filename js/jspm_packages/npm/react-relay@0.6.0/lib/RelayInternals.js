/* */ 
'use strict';
var RelayNetworkLayer = require('./RelayNetworkLayer');
var RelayStoreData = require('./RelayStoreData');
var flattenRelayQuery = require('./flattenRelayQuery');
var printRelayQuery = require('./printRelayQuery');
var RelayInternals = {
  NetworkLayer: RelayNetworkLayer,
  DefaultStoreData: RelayStoreData.getDefaultInstance(),
  flattenRelayQuery: flattenRelayQuery,
  printRelayQuery: printRelayQuery
};
module.exports = RelayInternals;
