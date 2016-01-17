/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayQuery = require('./RelayQuery');
  var invariant = require('fbjs/lib/invariant');
  var TYPE = '__type__';
  var RelayQueryTracker = (function() {
    function RelayQueryTracker() {
      _classCallCheck(this, RelayQueryTracker);
      this._trackedNodesByID = {};
    }
    RelayQueryTracker.prototype.trackNodeForID = function trackNodeForID(node, dataID, path) {
      if (GraphQLStoreDataHandler.isClientID(dataID)) {
        !path ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryTracker.trackNodeForID(): Expected `path` for client ID, ' + '`%s`.', dataID) : invariant(false) : undefined;
        if (!path.isRootPath()) {
          return;
        }
      }
      if (node instanceof RelayQuery.Field && node.getSchemaName() === TYPE) {
        return;
      }
      this._trackedNodesByID[dataID] = this._trackedNodesByID[dataID] || {
        trackedNodes: [],
        isMerged: false
      };
      this._trackedNodesByID[dataID].trackedNodes.push(node);
      this._trackedNodesByID[dataID].isMerged = false;
    };
    RelayQueryTracker.prototype.getTrackedChildrenForID = function getTrackedChildrenForID(dataID) {
      var trackedNodesByID = this._trackedNodesByID[dataID];
      if (!trackedNodesByID) {
        return [];
      }
      var isMerged = trackedNodesByID.isMerged;
      var trackedNodes = trackedNodesByID.trackedNodes;
      if (!isMerged) {
        (function() {
          var trackedChildren = [];
          trackedNodes.forEach(function(trackedQuery) {
            trackedChildren.push.apply(trackedChildren, _toConsumableArray(trackedQuery.getChildren()));
          });
          trackedNodes.length = 0;
          trackedNodesByID.isMerged = true;
          var containerNode = RelayQuery.Fragment.build('RelayQueryTracker', RelayNodeInterface.NODE_TYPE, trackedChildren);
          if (containerNode) {
            trackedNodes.push(containerNode);
          }
        })();
      }
      var trackedNode = trackedNodes[0];
      if (trackedNode) {
        return trackedNode.getChildren();
      }
      return [];
    };
    RelayQueryTracker.prototype.untrackNodesForID = function untrackNodesForID(dataID) {
      delete this._trackedNodesByID[dataID];
    };
    return RelayQueryTracker;
  })();
  module.exports = RelayQueryTracker;
})(require('process'));
