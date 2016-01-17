/* */ 
'use strict';
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var callsFromGraphQL = require('./callsFromGraphQL');
var printRelayQueryCall = require('./printRelayQueryCall');
var GraphQLStoreRangeUtils = (function() {
  function GraphQLStoreRangeUtils() {
    _classCallCheck(this, GraphQLStoreRangeUtils);
    this._rangeData = {};
  }
  GraphQLStoreRangeUtils.prototype.getClientIDForRangeWithID = function getClientIDForRangeWithID(calls, callValues, dataID) {
    var callsAsString = callsFromGraphQL(calls, callValues).map(function(call) {
      return printRelayQueryCall(call).substring(1);
    }).join(',');
    var key = dataID + '_' + callsAsString;
    var edge = this._rangeData[key];
    if (!edge) {
      this._rangeData[key] = {
        dataID: dataID,
        calls: calls,
        callValues: callValues
      };
    }
    return key;
  };
  GraphQLStoreRangeUtils.prototype.parseRangeClientID = function parseRangeClientID(rangeSpecificClientID) {
    return this._rangeData[rangeSpecificClientID] || null;
  };
  GraphQLStoreRangeUtils.prototype.getCanonicalClientID = function getCanonicalClientID(dataID) {
    return this._rangeData[dataID] ? this._rangeData[dataID].dataID : dataID;
  };
  return GraphQLStoreRangeUtils;
})();
module.exports = GraphQLStoreRangeUtils;
