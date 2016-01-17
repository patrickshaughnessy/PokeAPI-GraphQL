/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
Object.defineProperty(exports, '__esModule', {value: true});
var RelayConnectionInterface = require('./RelayConnectionInterface');
var RelayQueryVisitor = require('./RelayQueryVisitor');
var RelayRecordState = require('./RelayRecordState');
var isCompatibleRelayFragmentType = require('./isCompatibleRelayFragmentType');
var EDGES = RelayConnectionInterface.EDGES;
var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
function findRelayQueryLeaves(store, cachedRecords, queryNode, dataID, path, rangeCalls) {
  var finder = new RelayQueryLeavesFinder(store, cachedRecords);
  var state = {
    dataID: dataID,
    missingData: false,
    path: path,
    rangeCalls: rangeCalls,
    rangeInfo: undefined
  };
  finder.visit(queryNode, state);
  return {
    missingData: state.missingData,
    pendingNodes: finder.getPendingNodes()
  };
}
var RelayQueryLeavesFinder = (function(_RelayQueryVisitor) {
  _inherits(RelayQueryLeavesFinder, _RelayQueryVisitor);
  function RelayQueryLeavesFinder(store) {
    var cachedRecords = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    _classCallCheck(this, RelayQueryLeavesFinder);
    _RelayQueryVisitor.call(this);
    this._store = store;
    this._cachedRecords = cachedRecords;
    this._pendingNodes = {};
  }
  RelayQueryLeavesFinder.prototype.getPendingNodes = function getPendingNodes() {
    return this._pendingNodes;
  };
  RelayQueryLeavesFinder.prototype.traverse = function traverse(node, state) {
    var children = node.getChildren();
    for (var ii = 0; ii < children.length; ii++) {
      if (state.missingData) {
        return;
      }
      this.visit(children[ii], state);
    }
  };
  RelayQueryLeavesFinder.prototype.visitFragment = function visitFragment(fragment, state) {
    var dataID = state.dataID;
    var recordState = this._store.getRecordState(dataID);
    if (recordState === RelayRecordState.UNKNOWN) {
      this._handleMissingData(fragment, state);
      return;
    } else if (recordState === RelayRecordState.NONEXISTENT) {
      return;
    }
    if (isCompatibleRelayFragmentType(fragment, this._store.getType(dataID))) {
      this.traverse(fragment, state);
    }
  };
  RelayQueryLeavesFinder.prototype.visitField = function visitField(field, state) {
    var dataID = state.dataID;
    var recordState = this._store.getRecordState(dataID);
    if (recordState === RelayRecordState.UNKNOWN) {
      this._handleMissingData(field, state);
      return;
    } else if (recordState === RelayRecordState.NONEXISTENT) {
      return;
    }
    if (state.rangeCalls && !state.rangeInfo) {
      var metadata = this._store.getRangeMetadata(dataID, state.rangeCalls);
      if (metadata) {
        state.rangeInfo = metadata;
      }
    }
    var rangeInfo = state.rangeInfo;
    if (rangeInfo && field.getSchemaName() === EDGES) {
      this._visitEdges(field, state);
    } else if (rangeInfo && field.getSchemaName() === PAGE_INFO) {
      this._visitPageInfo(field, state);
    } else if (field.isScalar()) {
      this._visitScalar(field, state);
    } else if (field.isPlural()) {
      this._visitPlural(field, state);
    } else if (field.isConnection()) {
      this._visitConnection(field, state);
    } else {
      this._visitLinkedField(field, state);
    }
  };
  RelayQueryLeavesFinder.prototype._visitScalar = function _visitScalar(field, state) {
    var fieldData = this._store.getField(state.dataID, field.getStorageKey());
    if (fieldData === undefined) {
      this._handleMissingData(field, state);
    }
  };
  RelayQueryLeavesFinder.prototype._visitPlural = function _visitPlural(field, state) {
    var dataIDs = this._store.getLinkedRecordIDs(state.dataID, field.getStorageKey());
    if (dataIDs === undefined) {
      this._handleMissingData(field, state);
      return;
    }
    if (dataIDs) {
      for (var ii = 0; ii < dataIDs.length; ii++) {
        if (state.missingData) {
          break;
        }
        var nextState = {
          dataID: dataIDs[ii],
          missingData: false,
          path: state.path.getPath(field, dataIDs[ii]),
          rangeCalls: undefined,
          rangeInfo: undefined
        };
        this.traverse(field, nextState);
        state.missingData = nextState.missingData;
      }
    }
  };
  RelayQueryLeavesFinder.prototype._visitConnection = function _visitConnection(field, state) {
    var calls = field.getCallsWithValues();
    var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
    if (dataID === undefined) {
      this._handleMissingData(field, state);
      return;
    }
    if (dataID) {
      var nextState = {
        dataID: dataID,
        missingData: false,
        path: state.path.getPath(field, dataID),
        rangeCalls: calls,
        rangeInfo: null
      };
      var metadata = this._store.getRangeMetadata(dataID, calls);
      if (metadata) {
        nextState.rangeInfo = metadata;
      }
      this.traverse(field, nextState);
      state.missingData = state.missingData || nextState.missingData;
    }
  };
  RelayQueryLeavesFinder.prototype._visitEdges = function _visitEdges(field, state) {
    var rangeInfo = state.rangeInfo;
    if (!rangeInfo) {
      this._handleMissingData(field, state);
      return;
    }
    if (rangeInfo.diffCalls.length) {
      state.missingData = true;
      return;
    }
    var edgeIDs = rangeInfo.requestedEdgeIDs;
    for (var ii = 0; ii < edgeIDs.length; ii++) {
      if (state.missingData) {
        break;
      }
      var nextState = {
        dataID: edgeIDs[ii],
        missingData: false,
        path: state.path.getPath(field, edgeIDs[ii]),
        rangeCalls: undefined,
        rangeInfo: undefined
      };
      this.traverse(field, nextState);
      state.missingData = state.missingData || nextState.missingData;
    }
  };
  RelayQueryLeavesFinder.prototype._visitPageInfo = function _visitPageInfo(field, state) {
    var rangeInfo = state.rangeInfo;
    if (!rangeInfo || !rangeInfo.pageInfo) {
      this._handleMissingData(field, state);
      return;
    }
  };
  RelayQueryLeavesFinder.prototype._visitLinkedField = function _visitLinkedField(field, state) {
    var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
    if (dataID === undefined) {
      this._handleMissingData(field, state);
      return;
    }
    if (dataID) {
      var nextState = {
        dataID: dataID,
        missingData: false,
        path: state.path.getPath(field, dataID),
        rangeCalls: undefined,
        rangeInfo: undefined
      };
      this.traverse(field, nextState);
      state.missingData = state.missingData || nextState.missingData;
    }
  };
  RelayQueryLeavesFinder.prototype._handleMissingData = function _handleMissingData(node, state) {
    var dataID = state.dataID;
    if (this._cachedRecords.hasOwnProperty(dataID)) {
      state.missingData = true;
    } else {
      this._pendingNodes[dataID] = this._pendingNodes[dataID] || [];
      this._pendingNodes[dataID].push({
        node: node,
        path: state.path,
        rangeCalls: state.rangeCalls
      });
    }
  };
  return RelayQueryLeavesFinder;
})(RelayQueryVisitor);
module.exports = findRelayQueryLeaves;
