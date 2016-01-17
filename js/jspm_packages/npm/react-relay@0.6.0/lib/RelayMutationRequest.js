/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var Deferred = require('fbjs/lib/Deferred');
var printRelayQuery = require('./printRelayQuery');
var RelayMutationRequest = (function(_Deferred) {
  _inherits(RelayMutationRequest, _Deferred);
  function RelayMutationRequest(mutation, files) {
    _classCallCheck(this, RelayMutationRequest);
    _Deferred.call(this);
    this._mutation = mutation;
    this._printedQuery = null;
    this._files = files;
  }
  RelayMutationRequest.prototype.getDebugName = function getDebugName() {
    return this._mutation.getName();
  };
  RelayMutationRequest.prototype.getFiles = function getFiles() {
    return this._files;
  };
  RelayMutationRequest.prototype.getVariables = function getVariables() {
    var printedQuery = this._printedQuery;
    if (!printedQuery) {
      printedQuery = printRelayQuery(this._mutation);
      this._printedQuery = printedQuery;
    }
    return printedQuery.variables;
  };
  RelayMutationRequest.prototype.getQueryString = function getQueryString() {
    var printedQuery = this._printedQuery;
    if (!printedQuery) {
      printedQuery = printRelayQuery(this._mutation);
      this._printedQuery = printedQuery;
    }
    return printedQuery.text;
  };
  RelayMutationRequest.prototype.getMutation = function getMutation() {
    return this._mutation;
  };
  return RelayMutationRequest;
})(Deferred);
module.exports = RelayMutationRequest;
