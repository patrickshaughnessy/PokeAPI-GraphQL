/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var invariant = require('fbjs/lib/invariant');
  var _prefix = 'ID_';
  var Dispatcher = (function() {
    function Dispatcher() {
      _classCallCheck(this, Dispatcher);
      this._callbacks = {};
      this._isDispatching = false;
      this._isHandled = {};
      this._isPending = {};
      this._lastID = 1;
    }
    Dispatcher.prototype.register = function register(callback) {
      var id = _prefix + this._lastID++;
      this._callbacks[id] = callback;
      return id;
    };
    Dispatcher.prototype.unregister = function unregister(id) {
      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      delete this._callbacks[id];
    };
    Dispatcher.prototype.waitFor = function waitFor(ids) {
      !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
      for (var ii = 0; ii < ids.length; ii++) {
        var id = ids[ii];
        if (this._isPending[id]) {
          !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
          continue;
        }
        !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
        this._invokeCallback(id);
      }
    };
    Dispatcher.prototype.dispatch = function dispatch(payload) {
      !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
      this._startDispatching(payload);
      try {
        for (var id in this._callbacks) {
          if (this._isPending[id]) {
            continue;
          }
          this._invokeCallback(id);
        }
      } finally {
        this._stopDispatching();
      }
    };
    Dispatcher.prototype.isDispatching = function isDispatching() {
      return this._isDispatching;
    };
    Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
      this._isPending[id] = true;
      this._callbacks[id](this._pendingPayload);
      this._isHandled[id] = true;
    };
    Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
      for (var id in this._callbacks) {
        this._isPending[id] = false;
        this._isHandled[id] = false;
      }
      this._pendingPayload = payload;
      this._isDispatching = true;
    };
    Dispatcher.prototype._stopDispatching = function _stopDispatching() {
      delete this._pendingPayload;
      this._isDispatching = false;
    };
    return Dispatcher;
  })();
  module.exports = Dispatcher;
})(require('process'));
