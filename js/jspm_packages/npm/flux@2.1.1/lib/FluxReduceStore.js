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
  var FluxStore = require('./FluxStore');
  var abstractMethod = require('./abstractMethod');
  var invariant = require('fbjs/lib/invariant');
  var FluxReduceStore = (function(_FluxStore) {
    _inherits(FluxReduceStore, _FluxStore);
    function FluxReduceStore(dispatcher) {
      _classCallCheck(this, FluxReduceStore);
      _FluxStore.call(this, dispatcher);
      this._state = this.getInitialState();
    }
    FluxReduceStore.prototype.getState = function getState() {
      return this._state;
    };
    FluxReduceStore.prototype.getInitialState = function getInitialState() {
      return abstractMethod('FluxReduceStore', 'getInitialState');
    };
    FluxReduceStore.prototype.reduce = function reduce(state, action) {
      return abstractMethod('FluxReduceStore', 'reduce');
    };
    FluxReduceStore.prototype.areEqual = function areEqual(one, two) {
      return one === two;
    };
    FluxReduceStore.prototype.__invokeOnDispatch = function __invokeOnDispatch(action) {
      this.__changed = false;
      var startingState = this._state;
      var endingState = this.reduce(startingState, action);
      !(endingState !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s returned undefined from reduce(...), did you forget to return ' + 'state in the default case? (use null if this was intentional)', this.constructor.name) : invariant(false) : undefined;
      if (!this.areEqual(startingState, endingState)) {
        this._state = endingState;
        this.__emitChange();
      }
      if (this.__changed) {
        this.__emitter.emit(this.__changeEvent);
      }
    };
    return FluxReduceStore;
  })(FluxStore);
  module.exports = FluxReduceStore;
})(require('process'));
