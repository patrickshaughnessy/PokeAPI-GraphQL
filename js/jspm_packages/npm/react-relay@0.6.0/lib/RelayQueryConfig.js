/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _Object$freeze = require('babel-runtime/core-js/object/freeze')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var invariant = require('fbjs/lib/invariant');
  var RelayQueryConfig = (function() {
    function RelayQueryConfig(initialVariables) {
      _classCallCheck(this, RelayQueryConfig);
      !(this.constructor !== RelayQueryConfig) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryConfig: Abstract class cannot be instantiated.') : invariant(false) : undefined;
      Object.defineProperty(this, 'name', {
        enumerable: true,
        value: this.constructor.routeName,
        writable: false
      });
      Object.defineProperty(this, 'params', {
        enumerable: true,
        value: this.prepareVariables(_extends({}, initialVariables)) || {},
        writable: false
      });
      Object.defineProperty(this, 'queries', {
        enumerable: true,
        value: _extends({}, this.constructor.queries),
        writable: false
      });
      if (process.env.NODE_ENV !== 'production') {
        _Object$freeze(this.params);
        _Object$freeze(this.queries);
      }
    }
    RelayQueryConfig.prototype.prepareVariables = function prepareVariables(prevVariables) {
      return prevVariables;
    };
    return RelayQueryConfig;
  })();
  module.exports = RelayQueryConfig;
})(require('process'));
