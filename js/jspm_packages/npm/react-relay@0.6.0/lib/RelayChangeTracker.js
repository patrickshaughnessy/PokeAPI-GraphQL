/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _Object$freeze = require('babel-runtime/core-js/object/freeze')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var RelayChangeTracker = (function() {
    function RelayChangeTracker() {
      _classCallCheck(this, RelayChangeTracker);
      this._created = {};
      this._updated = {};
    }
    RelayChangeTracker.prototype.createID = function createID(recordID) {
      this._created[recordID] = true;
    };
    RelayChangeTracker.prototype.updateID = function updateID(recordID) {
      if (!this._created.hasOwnProperty(recordID)) {
        this._updated[recordID] = true;
      }
    };
    RelayChangeTracker.prototype.hasChange = function hasChange(recordID) {
      return !!(this._updated[recordID] || this._created[recordID]);
    };
    RelayChangeTracker.prototype.isNewRecord = function isNewRecord(recordID) {
      return !!this._created[recordID];
    };
    RelayChangeTracker.prototype.getChangeSet = function getChangeSet() {
      if (process.env.NODE_ENV !== 'production') {
        return {
          created: _Object$freeze(this._created),
          updated: _Object$freeze(this._updated)
        };
      }
      return {
        created: this._created,
        updated: this._updated
      };
    };
    return RelayChangeTracker;
  })();
  module.exports = RelayChangeTracker;
})(require('process'));
