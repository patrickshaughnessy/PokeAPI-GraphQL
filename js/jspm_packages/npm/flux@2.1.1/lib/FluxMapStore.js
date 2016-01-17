/* */ 
(function(process) {
  'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  var FluxReduceStore = require('./FluxReduceStore');
  var Immutable = require('immutable');
  var invariant = require('fbjs/lib/invariant');
  var FluxMapStore = (function(_FluxReduceStore) {
    _inherits(FluxMapStore, _FluxReduceStore);
    function FluxMapStore() {
      _classCallCheck(this, FluxMapStore);
      _FluxReduceStore.apply(this, arguments);
    }
    FluxMapStore.prototype.getInitialState = function getInitialState() {
      return Immutable.Map();
    };
    FluxMapStore.prototype.at = function at(key) {
      !this.has(key) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected store to have key %s', key) : invariant(false) : undefined;
      return this.get(key);
    };
    FluxMapStore.prototype.has = function has(key) {
      return this.getState().has(key);
    };
    FluxMapStore.prototype.get = function get(key) {
      return this.getState().get(key);
    };
    FluxMapStore.prototype.getAll = function getAll(keys, prev) {
      var _this = this;
      var newKeys = Immutable.Set(keys);
      var start = prev || Immutable.Map();
      return start.withMutations(function(map) {
        for (var _iterator = start,
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
          var entry = _ref;
          var oldKey = entry[0];
          if (!newKeys.has(oldKey) || !_this.has(oldKey)) {
            map['delete'](oldKey);
          }
        }
        for (var _iterator2 = newKeys,
            _isArray2 = Array.isArray(_iterator2),
            _i2 = 0,
            _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
          var _ref2;
          if (_isArray2) {
            if (_i2 >= _iterator2.length)
              break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done)
              break;
            _ref2 = _i2.value;
          }
          var key = _ref2;
          if (_this.has(key)) {
            map.set(key, _this.at(key));
          }
        }
      });
    };
    return FluxMapStore;
  })(FluxReduceStore);
  module.exports = FluxMapStore;
})(require('process'));
