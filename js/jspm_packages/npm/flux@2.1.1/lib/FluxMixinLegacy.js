/* */ 
(function(process) {
  'use strict';
  var FluxStoreGroup = require('./FluxStoreGroup');
  var invariant = require('fbjs/lib/invariant');
  function FluxMixinLegacy(stores) {
    return {
      getInitialState: function() {
        enforceInterface(this);
        return this.constructor.calculateState(null);
      },
      componentDidMount: function() {
        var _this = this;
        var changed = false;
        var setChanged = function() {
          changed = true;
        };
        this._fluxMixinSubscriptions = stores.map(function(store) {
          return store.addListener(setChanged);
        });
        var callback = function() {
          if (changed) {
            _this.setState(function(prevState) {
              return _this.constructor.calculateState(_this.state);
            });
          }
          changed = false;
        };
        this._fluxMixinStoreGroup = new FluxStoreGroup(stores, callback);
      },
      componentWillUnmount: function() {
        this._fluxMixinStoreGroup.release();
        for (var _iterator = this._fluxMixinSubscriptions,
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
          var subscription = _ref;
          subscription.remove();
        }
        this._fluxMixinSubscriptions = [];
      }
    };
  }
  function enforceInterface(o) {
    !o.constructor.calculateState ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Components that use FluxMixinLegacy must implement ' + '`calculateState()` on the statics object') : invariant(false) : undefined;
  }
  module.exports = FluxMixinLegacy;
})(require('process'));
