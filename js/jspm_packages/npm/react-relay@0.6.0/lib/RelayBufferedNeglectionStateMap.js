/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var invariant = require('fbjs/lib/invariant');
  var RelayBufferedNeglectionStateMap = (function() {
    function RelayBufferedNeglectionStateMap(neglectionStateMap) {
      _classCallCheck(this, RelayBufferedNeglectionStateMap);
      this._bufferedChanges = [];
      this._neglectionStateMap = neglectionStateMap;
    }
    RelayBufferedNeglectionStateMap.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
      this._bufferedChanges.push({
        type: 'decrease',
        dataID: dataID
      });
    };
    RelayBufferedNeglectionStateMap.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
      this._bufferedChanges.push({
        type: 'increase',
        dataID: dataID
      });
    };
    RelayBufferedNeglectionStateMap.prototype.register = function register(dataID) {
      this._bufferedChanges.push({
        type: 'register',
        dataID: dataID
      });
    };
    RelayBufferedNeglectionStateMap.prototype.remove = function remove(dataID) {
      this._bufferedChanges.push({
        type: 'remove',
        dataID: dataID
      });
    };
    RelayBufferedNeglectionStateMap.prototype.size = function size() {
      return this._neglectionStateMap.size();
    };
    RelayBufferedNeglectionStateMap.prototype.values = function values() {
      return this._neglectionStateMap.values();
    };
    RelayBufferedNeglectionStateMap.prototype.flushBuffer = function flushBuffer() {
      var _this = this;
      this._bufferedChanges.forEach(function(action) {
        var type = action.type;
        var dataID = action.dataID;
        switch (type) {
          case 'decrease':
            _this._neglectionStateMap.decreaseSubscriptionsFor(dataID);
            break;
          case 'increase':
            _this._neglectionStateMap.increaseSubscriptionsFor(dataID);
            break;
          case 'register':
            _this._neglectionStateMap.register(dataID);
            break;
          case 'remove':
            _this._neglectionStateMap.remove(dataID);
            break;
          default:
            !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayBufferedNeglectionStateMap._flushBufferedChanges: ' + 'Invalid type %s for buffered chaged', type) : invariant(false) : undefined;
        }
      });
      this._bufferedChanges = [];
    };
    return RelayBufferedNeglectionStateMap;
  })();
  module.exports = RelayBufferedNeglectionStateMap;
})(require('process'));
