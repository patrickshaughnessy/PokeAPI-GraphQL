/* */ 
(function(process) {
  'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var invariant = require('fbjs/lib/invariant');
  var FluxStoreGroup = (function() {
    function FluxStoreGroup(stores, callback) {
      var _this = this;
      _classCallCheck(this, FluxStoreGroup);
      this._dispatcher = _getUniformDispatcher(stores);
      var storeTokens = stores.map(function(store) {
        return store.getDispatchToken();
      });
      this._dispatchToken = this._dispatcher.register(function(payload) {
        _this._dispatcher.waitFor(storeTokens);
        callback();
      });
    }
    FluxStoreGroup.prototype.release = function release() {
      this._dispatcher.unregister(this._dispatchToken);
    };
    return FluxStoreGroup;
  })();
  function _getUniformDispatcher(stores) {
    !(stores && stores.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Must provide at least one store to FluxStoreGroup') : invariant(false) : undefined;
    var dispatcher = stores[0].getDispatcher();
    if (process.env.NODE_ENV !== 'production') {
      for (var _iterator = stores,
          _isArray = Array.isArray(_iterator),
          _i = 0,
          _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
        var _ref;
        if (_isArray) {
          if (_i >= _iterator.length)
            break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done)
            break;
          _ref = _i.value;
        }
        var store = _ref;
        !(store.getDispatcher() === dispatcher) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'All stores in a FluxStoreGroup must use the same dispatcher') : invariant(false) : undefined;
      }
    }
    return dispatcher;
  }
  module.exports = FluxStoreGroup;
})(require('process'));
