/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var Deferred = require('fbjs/lib/Deferred');
var printRelayQuery = require('./printRelayQuery');
var RelayQueryRequest = (function(_Deferred) {
  _inherits(RelayQueryRequest, _Deferred);
  function RelayQueryRequest(query) {
    _classCallCheck(this, RelayQueryRequest);
    _Deferred.call(this);
    this._printedQuery = null;
    this._query = query;
  }
  RelayQueryRequest.prototype.getDebugName = function getDebugName() {
    return this._query.getName();
  };
  RelayQueryRequest.prototype.getID = function getID() {
    return this._query.getID();
  };
  RelayQueryRequest.prototype.getVariables = function getVariables() {
    var printedQuery = this._printedQuery;
    if (!printedQuery) {
      printedQuery = printRelayQuery(this._query);
      this._printedQuery = printedQuery;
    }
    return printedQuery.variables;
  };
  RelayQueryRequest.prototype.getQueryString = function getQueryString() {
    var printedQuery = this._printedQuery;
    if (!printedQuery) {
      printedQuery = printRelayQuery(this._query);
      this._printedQuery = printedQuery;
    }
    return printedQuery.text;
  };
  RelayQueryRequest.prototype.getQuery = function getQuery() {
    return this._query;
  };
  return RelayQueryRequest;
})(Deferred);
module.exports = RelayQueryRequest;
