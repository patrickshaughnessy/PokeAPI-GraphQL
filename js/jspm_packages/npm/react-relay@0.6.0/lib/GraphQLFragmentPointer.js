/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayQuery = require('./RelayQuery');
  var invariant = require('fbjs/lib/invariant');
  var shallowEqual = require('fbjs/lib/shallowEqual');
  var GraphQLFragmentPointer = (function() {
    GraphQLFragmentPointer.createForRoot = function createForRoot(store, query) {
      var fragment = getRootFragment(query);
      if (!fragment) {
        return null;
      }
      var concreteFragmentID = fragment.getConcreteFragmentID();
      var storageKey = query.getStorageKey();
      var identifyingArg = query.getIdentifyingArg();
      var identifyingArgValue = identifyingArg && identifyingArg.value || null;
      if (Array.isArray(identifyingArgValue)) {
        var rootFragment = fragment;
        return identifyingArgValue.map(function(singleIdentifyingArgValue) {
          var dataID = store.getDataID(storageKey, singleIdentifyingArgValue);
          if (!dataID) {
            return null;
          }
          var pointer = GraphQLStoreDataHandler.createPointerWithID(dataID);
          pointer[concreteFragmentID] = new GraphQLFragmentPointer([dataID], rootFragment);
          return pointer;
        });
      }
      !(typeof identifyingArgValue === 'string' || identifyingArgValue == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLFragmentPointer: Value for the argument to `%s` on query `%s` ' + 'should be a string, but it was set to `%s`. Check that the value is a ' + 'string.', query.getFieldName(), query.getName(), identifyingArgValue) : invariant(false) : undefined;
      var dataIDOrIDs = store.getDataID(storageKey, identifyingArgValue);
      if (!dataIDOrIDs) {
        return null;
      }
      var result = {};
      var fragmentPointer = new GraphQLFragmentPointer(dataIDOrIDs, fragment);
      result[concreteFragmentID] = fragmentPointer;
      return result;
    };
    function GraphQLFragmentPointer(dataIDOrIDs, fragment) {
      _classCallCheck(this, GraphQLFragmentPointer);
      var isArray = Array.isArray(dataIDOrIDs);
      var isPlural = fragment.isPlural();
      !(isArray === isPlural) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLFragmentPointer: Wrong plurality, %s supplied with %s fragment.', isArray ? 'array of data IDs' : 'single data ID', isPlural ? 'plural' : 'non-plural') : invariant(false) : undefined;
      this._dataIDOrIDs = dataIDOrIDs;
      this._fragment = fragment;
    }
    GraphQLFragmentPointer.prototype.getDataID = function getDataID() {
      !!Array.isArray(this._dataIDOrIDs) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLFragmentPointer.getDataID(): Bad call for plural fragment.') : invariant(false) : undefined;
      return this._dataIDOrIDs;
    };
    GraphQLFragmentPointer.prototype.getDataIDs = function getDataIDs() {
      !Array.isArray(this._dataIDOrIDs) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLFragmentPointer.getDataIDs(): Bad call for non-plural fragment.') : invariant(false) : undefined;
      return this._dataIDOrIDs;
    };
    GraphQLFragmentPointer.prototype.getFragment = function getFragment() {
      return this._fragment;
    };
    GraphQLFragmentPointer.prototype.equals = function equals(that) {
      return shallowEqual(this._dataIDOrIDs, that._dataIDOrIDs) && this._fragment.isEquivalent(that._fragment);
    };
    GraphQLFragmentPointer.prototype.toString = function toString() {
      return 'GraphQLFragmentPointer(ids: ' + JSON.stringify(this._dataIDOrIDs) + ', fragment: `' + this.getFragment().getDebugName() + ', params: ' + JSON.stringify(this._fragment.getVariables()) + ')';
    };
    return GraphQLFragmentPointer;
  })();
  function getRootFragment(query) {
    var batchCall = query.getBatchCall();
    if (batchCall) {
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Queries supplied at the root cannot have batch call variables. Query ' + '`%s` has a batch call variable, `%s`.', query.getName(), batchCall.refParamName) : invariant(false) : undefined;
    }
    var fragment;
    query.getChildren().forEach(function(child) {
      if (child instanceof RelayQuery.Fragment) {
        !!fragment ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + '(e.g. `${Component.getFragment(\'...\')}`). Query `%s` contains ' + 'more than one fragment.', query.getName()) : invariant(false) : undefined;
        fragment = child;
      } else if (child instanceof RelayQuery.Field) {
        !child.isGenerated() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + 'and no fields. Query `%s` contains a field, `%s`. If you need to ' + 'fetch fields, declare them in a Relay container.', query.getName(), child.getSchemaName()) : invariant(false) : undefined;
      }
    });
    return fragment;
  }
  module.exports = GraphQLFragmentPointer;
})(require('process'));
