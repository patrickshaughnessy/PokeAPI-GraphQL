/* */ 
(function(process) {
  'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var _require = require('fbemitter');
  var EventEmitter = _require.EventEmitter;
  var invariant = require('fbjs/lib/invariant');
  var FluxStore = (function() {
    function FluxStore(dispatcher) {
      var _this = this;
      _classCallCheck(this, FluxStore);
      this.__className = this.constructor.name;
      this.__changed = false;
      this.__changeEvent = 'change';
      this.__dispatcher = dispatcher;
      this.__emitter = new EventEmitter();
      this._dispatchToken = dispatcher.register(function(payload) {
        _this.__invokeOnDispatch(payload);
      });
    }
    FluxStore.prototype.addListener = function addListener(callback) {
      return this.__emitter.addListener(this.__changeEvent, callback);
    };
    FluxStore.prototype.getDispatcher = function getDispatcher() {
      return this.__dispatcher;
    };
    FluxStore.prototype.getDispatchToken = function getDispatchToken() {
      return this._dispatchToken;
    };
    FluxStore.prototype.hasChanged = function hasChanged() {
      !this.__dispatcher.isDispatching() ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.hasChanged(): Must be invoked while dispatching.', this.__className) : invariant(false) : undefined;
      return this.__changed;
    };
    FluxStore.prototype.__emitChange = function __emitChange() {
      !this.__dispatcher.isDispatching() ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.__emitChange(): Must be invoked while dispatching.', this.__className) : invariant(false) : undefined;
      this.__changed = true;
    };
    FluxStore.prototype.__invokeOnDispatch = function __invokeOnDispatch(payload) {
      this.__changed = false;
      this.__onDispatch(payload);
      if (this.__changed) {
        this.__emitter.emit(this.__changeEvent);
      }
    };
    FluxStore.prototype.__onDispatch = function __onDispatch(payload) {
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s has not overridden FluxStore.__onDispatch(), which is required', this.__className) : invariant(false) : undefined;
    };
    return FluxStore;
  })();
  module.exports = FluxStore;
})(require('process'));
