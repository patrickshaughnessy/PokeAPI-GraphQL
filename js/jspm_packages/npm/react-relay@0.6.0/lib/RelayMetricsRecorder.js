/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
  var GraphQLStoreQueryResolver = require('./GraphQLStoreQueryResolver');
  var RelayNetworkLayer = require('./RelayNetworkLayer');
  var RelayProfiler = require('./RelayProfiler');
  var RelayQuery = require('./RelayQuery');
  var buildRQL = require('./buildRQL');
  var checkRelayQueryData = require('./checkRelayQueryData');
  var diffRelayQuery = require('./diffRelayQuery');
  var flattenRelayQuery = require('./flattenRelayQuery');
  var invariant = require('fbjs/lib/invariant');
  var getRelayQueries = require('./getRelayQueries');
  var performanceNow = require('fbjs/lib/performanceNow');
  var printRelayQuery = require('./printRelayQuery');
  var readRelayQueryData = require('./readRelayQueryData');
  var splitDeferredRelayQueries = require('./splitDeferredRelayQueries');
  var subtractRelayQuery = require('./subtractRelayQuery');
  var writeRelayQueryPayload = require('./writeRelayQueryPayload');
  var writeRelayUpdatePayload = require('./writeRelayUpdatePayload');
  var INSTRUMENTED_METHODS = [GraphQLStoreQueryResolver.prototype.resolve, buildRQL.Fragment, buildRQL.Query, checkRelayQueryData, diffRelayQuery, flattenRelayQuery, getRelayQueries, printRelayQuery, readRelayQueryData, splitDeferredRelayQueries, subtractRelayQuery, writeRelayQueryPayload, writeRelayUpdatePayload, GraphQLStoreQueryResolver.prototype.resolve, RelayQuery.Field.prototype.getStorageKey, RelayQuery.Field.prototype.getSerializationKey, RelayQuery.Node.prototype.clone, RelayQuery.Node.prototype.equals, RelayQuery.Node.prototype.getChildren, RelayQuery.Node.prototype.getDirectives, RelayQuery.Node.prototype.hasDeferredDescendant, RelayQuery.Node.prototype.getFieldByStorageKey, RelayNetworkLayer.sendMutation, RelayNetworkLayer.sendQueries];
  var INSTRUMENTED_AGGREGATE_METHODS = ['RelayContainer.prototype.componentWillMount', 'RelayContainer.prototype.componentWillReceiveProps', 'RelayContainer.prototype.shouldComponentUpdate'];
  var measurementDefaults = {
    aggregateTime: 0,
    callCount: 0
  };
  var RelayMetricsRecorder = (function() {
    function RelayMetricsRecorder() {
      _classCallCheck(this, RelayMetricsRecorder);
      this._isEnabled = false;
      this._measurements = {};
      this._profiles = [];
      this._profileStack = [];
      this._recordingStartTime = 0;
      this._recordingTotalTime = 0;
      this._startTimesStack = [];
      this._measure = this._measure.bind(this);
      this._instrumentProfile = this._instrumentProfile.bind(this);
      this._startMeasurement = this._startMeasurement.bind(this);
      this._stopMeasurement = this._stopMeasurement.bind(this);
    }
    RelayMetricsRecorder.prototype.start = function start() {
      var _this = this;
      if (this._isEnabled) {
        return;
      }
      this._recordingStartTime = performanceNow();
      this._isEnabled = true;
      this._profileStack = [0];
      this._startTimesStack = [0];
      INSTRUMENTED_METHODS.forEach(function(method) {
        !(method && method.attachHandler) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMetricsRecorder: Attempted to measure an invalid method.') : invariant(false) : undefined;
        method.attachHandler(_this._measure);
      });
      INSTRUMENTED_AGGREGATE_METHODS.forEach(function(name) {
        RelayProfiler.attachAggregateHandler(name, _this._measure);
      });
      RelayProfiler.attachProfileHandler('*', this._instrumentProfile);
    };
    RelayMetricsRecorder.prototype.stop = function stop() {
      var _this2 = this;
      if (!this._isEnabled) {
        return;
      }
      this._recordingTotalTime += performanceNow() - this._recordingStartTime;
      this._isEnabled = false;
      INSTRUMENTED_METHODS.forEach(function(method) {
        method.detachHandler(_this2._measure);
      });
      INSTRUMENTED_AGGREGATE_METHODS.forEach(function(name) {
        RelayProfiler.detachAggregateHandler(name, _this2._measure);
      });
      RelayProfiler.detachProfileHandler('*', this._instrumentProfile);
    };
    RelayMetricsRecorder.prototype.getMetrics = function getMetrics() {
      var _measurements = this._measurements;
      var totalTime = 0;
      var sortedMeasurements = {};
      _Object$keys(_measurements).sort(function(a, b) {
        return _measurements[b].aggregateTime - _measurements[a].aggregateTime;
      }).forEach(function(name) {
        totalTime += _measurements[name].aggregateTime;
        sortedMeasurements[name] = _measurements[name];
      });
      var sortedProfiles = this._profiles.sort(function(a, b) {
        if (a.startTime < b.startTime) {
          return -1;
        } else if (a.startTime > b.startTime) {
          return 1;
        } else {
          return a.endTime - a.startTime - (b.endTime - b.startTime);
        }
      });
      return {
        measurements: sortedMeasurements,
        profiles: sortedProfiles,
        recordingTime: this._recordingTotalTime,
        totalTime: totalTime
      };
    };
    RelayMetricsRecorder.prototype._measure = function _measure(name, callback) {
      this._startMeasurement(name);
      callback();
      this._stopMeasurement(name);
    };
    RelayMetricsRecorder.prototype._instrumentProfile = function _instrumentProfile(name) {
      var _this3 = this;
      var startTime = performanceNow();
      return function() {
        _this3._profiles.push({
          endTime: performanceNow(),
          name: name,
          startTime: startTime
        });
      };
    };
    RelayMetricsRecorder.prototype._startMeasurement = function _startMeasurement(name) {
      this._measurements[name] = this._measurements[name] || _extends({}, measurementDefaults);
      this._profileStack.unshift(0);
      this._startTimesStack.unshift(performanceNow());
    };
    RelayMetricsRecorder.prototype._stopMeasurement = function _stopMeasurement(name) {
      var innerTime = this._profileStack.shift();
      var start = this._startTimesStack.shift();
      var totalTime = performanceNow() - start;
      this._measurements[name].aggregateTime += totalTime - innerTime;
      this._measurements[name].callCount++;
      this._profileStack[0] += totalTime;
    };
    return RelayMetricsRecorder;
  })();
  module.exports = RelayMetricsRecorder;
})(require('process'));
