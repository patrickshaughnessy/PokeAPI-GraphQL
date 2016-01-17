/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var Map = require('fbjs/lib/Map');
  var invariant = require('fbjs/lib/invariant');
  var RelayNeglectionStateMap = (function() {
    function RelayNeglectionStateMap() {
      _classCallCheck(this, RelayNeglectionStateMap);
      this._isSorted = true;
      this._map = new Map();
      this._states = [];
    }
    RelayNeglectionStateMap.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
      this._isSorted = false;
      !this._map.has(dataID) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayNeglectionStatesMap.decreaseSubscriptionsFor(): Cannot ' + 'decrease subscriptions for unregistered record `%s`.', dataID) : invariant(false) : undefined;
      var data = this._map.get(dataID);
      !(data.subscriptions > 0) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayNeglectionStatesMap.decreaseSubscriptionsFor(): Cannot ' + 'decrease subscriptions below 0 for record `%s`.', dataID) : invariant(false) : undefined;
      data.subscriptions--;
      this._map.set(dataID, data);
    };
    RelayNeglectionStateMap.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
      this._isSorted = false;
      if (!this._map.has(dataID)) {
        this._registerWithSubscriptionCount(dataID, 1);
        return;
      }
      var data = this._map.get(dataID);
      data.subscriptions++;
      this._map.set(dataID, data);
    };
    RelayNeglectionStateMap.prototype.register = function register(dataID) {
      this._isSorted = false;
      if (!this._map.has(dataID)) {
        this._registerWithSubscriptionCount(dataID, 0);
      }
    };
    RelayNeglectionStateMap.prototype.remove = function remove(dataID) {
      this._map['delete'](dataID);
    };
    RelayNeglectionStateMap.prototype.size = function size() {
      return this._map.size;
    };
    RelayNeglectionStateMap.prototype.values = function values() {
      this._sort();
      var done = false;
      var ii = 0;
      var states = this._states.slice();
      return {next: function next() {
          if (done || ii === states.length) {
            done = true;
            states = [];
            return {done: done};
          }
          var value = states[ii++];
          return {
            done: done,
            value: value
          };
        }};
    };
    RelayNeglectionStateMap.prototype._registerWithSubscriptionCount = function _registerWithSubscriptionCount(dataID, subscriptions) {
      this._isSorted = false;
      this._map.set(dataID, {
        dataID: dataID,
        collectible: false,
        generations: 0,
        subscriptions: subscriptions
      });
    };
    RelayNeglectionStateMap.prototype._sort = function _sort() {
      var _this = this;
      if (!this._isSorted) {
        this._states = [];
        this._map.forEach(function(state) {
          return state && _this._states.push(state);
        });
        this._states.sort(function(a, b) {
          return a.subscriptions - b.subscriptions;
        });
        this._isSorted = true;
      }
    };
    return RelayNeglectionStateMap;
  })();
  module.exports = RelayNeglectionStateMap;
})(require('process'));
