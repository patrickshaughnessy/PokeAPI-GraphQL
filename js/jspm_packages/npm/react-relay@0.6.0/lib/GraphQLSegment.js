/* */ 
'use strict';
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];
var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];
var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
var GraphQLSegment = (function() {
  function GraphQLSegment() {
    _classCallCheck(this, GraphQLSegment);
    this._indexToMetadataMap = {};
    this._idToIndicesMap = {};
    this._cursorToIndexMap = {};
    this._count = 0;
    this._minIndex = null;
    this._maxIndex = null;
  }
  GraphQLSegment.prototype._getIndexForCursor = function _getIndexForCursor(cursor) {
    return this._cursorToIndexMap[cursor];
  };
  GraphQLSegment.prototype._getIndexForID = function _getIndexForID(id) {
    var indices = this._idToIndicesMap[id];
    return indices && indices[0];
  };
  GraphQLSegment.prototype.getFirstCursor = function getFirstCursor() {
    if (this.getLength()) {
      for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
        var metadata = this._indexToMetadataMap[ii];
        if (!metadata.deleted) {
          return metadata.cursor;
        }
      }
    }
  };
  GraphQLSegment.prototype.getLastCursor = function getLastCursor() {
    if (this.getLength()) {
      for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
        var metadata = this._indexToMetadataMap[ii];
        if (!metadata.deleted) {
          return metadata.cursor;
        }
      }
    }
  };
  GraphQLSegment.prototype.getFirstID = function getFirstID() {
    if (this.getLength()) {
      for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
        var metadata = this._indexToMetadataMap[ii];
        if (!metadata.deleted) {
          return metadata.edgeID;
        }
      }
    }
  };
  GraphQLSegment.prototype.getLastID = function getLastID() {
    if (this.getLength()) {
      for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
        var metadata = this._indexToMetadataMap[ii];
        if (!metadata.deleted) {
          return metadata.edgeID;
        }
      }
    }
  };
  GraphQLSegment.prototype._getEdgeAtIndex = function _getEdgeAtIndex(index) {
    var edge = this._indexToMetadataMap[index];
    return edge && !edge.deleted ? edge : null;
  };
  GraphQLSegment.prototype.containsEdgeWithID = function containsEdgeWithID(id) {
    var index = this._getIndexForID(id);
    if (index === undefined) {
      return false;
    }
    return !!this._getEdgeAtIndex(index);
  };
  GraphQLSegment.prototype.containsEdgeWithCursor = function containsEdgeWithCursor(cursor) {
    var index = this._getIndexForCursor(cursor);
    if (index === undefined) {
      return false;
    }
    return !!this._getEdgeAtIndex(index);
  };
  GraphQLSegment.prototype.getMetadataAfterCursor = function getMetadataAfterCursor(count, cursor) {
    if (!this.getLength()) {
      return {
        edgeIDs: [],
        cursors: []
      };
    }
    var currentIndex = this._minIndex;
    if (cursor) {
      var index = this._getIndexForCursor(cursor);
      if (index === undefined) {
        console.warn('This segment does not have a cursor %s', cursor);
        return {
          edgeIDs: [],
          cursors: []
        };
      }
      currentIndex = index + 1;
    }
    var total = 0;
    var edgeIDs = [];
    var cursors = [];
    while (currentIndex <= this._maxIndex && total < count) {
      var metadata = this._indexToMetadataMap[currentIndex];
      if (!metadata.deleted) {
        edgeIDs.push(metadata.edgeID);
        cursors.push(metadata.cursor);
        total++;
      }
      currentIndex++;
    }
    return {
      edgeIDs: edgeIDs,
      cursors: cursors
    };
  };
  GraphQLSegment.prototype.getMetadataBeforeCursor = function getMetadataBeforeCursor(count, cursor) {
    if (!this.getLength()) {
      return {
        edgeIDs: [],
        cursors: []
      };
    }
    var currentIndex = this._maxIndex;
    if (cursor) {
      var index = this._getIndexForCursor(cursor);
      if (index === undefined) {
        console.warn('This segment does not have a cursor %s', cursor);
        return {
          edgeIDs: [],
          cursors: []
        };
      }
      currentIndex = index - 1;
    }
    var total = 0;
    var edgeIDs = [];
    var cursors = [];
    while (currentIndex >= this._minIndex && total < count) {
      var metadata = this._indexToMetadataMap[currentIndex];
      if (!metadata.deleted) {
        edgeIDs.push(metadata.edgeID);
        cursors.push(metadata.cursor);
        total++;
      }
      currentIndex--;
    }
    return {
      edgeIDs: edgeIDs.reverse(),
      cursors: cursors.reverse()
    };
  };
  GraphQLSegment.prototype._addEdgeAtIndex = function _addEdgeAtIndex(edge, index) {
    if (this.getLength() === 0) {
      this._minIndex = index;
      this._maxIndex = index;
    } else if (this._minIndex == index + 1) {
      this._minIndex = index;
    } else if (this._maxIndex == index - 1) {
      this._maxIndex = index;
    } else {
      console.warn('Attempted to add noncontiguous index to GraphQLSegment: ' + index + ' to ' + ('(' + this._minIndex + ', ' + this._maxIndex + ')'));
      return;
    }
    var edgeID = GraphQLStoreDataHandler.getID(edge);
    var cursor = edge.cursor;
    var idIndex = this._getIndexForID(edgeID);
    if (idIndex !== undefined && this._getEdgeAtIndex(idIndex)) {
      console.warn('Attempted to add an ID already in GraphQLSegment: %s', edgeID);
      return;
    }
    this._indexToMetadataMap[index] = {
      edgeID: edgeID,
      cursor: cursor,
      deleted: false
    };
    this._idToIndicesMap[edgeID] = this._idToIndicesMap[edgeID] || [];
    this._idToIndicesMap[edgeID].unshift(index);
    this._count++;
    if (cursor) {
      this._cursorToIndexMap[cursor] = index;
    }
  };
  GraphQLSegment.prototype.prependEdge = function prependEdge(edge) {
    this._addEdgeAtIndex(edge, this._minIndex !== null ? this._minIndex - 1 : 0);
  };
  GraphQLSegment.prototype.appendEdge = function appendEdge(edge) {
    this._addEdgeAtIndex(edge, this._maxIndex !== null ? this._maxIndex + 1 : 0);
  };
  GraphQLSegment.prototype.removeEdge = function removeEdge(id) {
    var index = this._getIndexForID(id);
    if (index === undefined) {
      console.warn('Attempted to remove edge with ID that was never in GraphQLSegment: ' + id);
      return;
    }
    var data = this._indexToMetadataMap[index];
    if (data.deleted) {
      console.warn('Attempted to remove edge with ID that was already removed: ' + id);
      return;
    }
    data.deleted = true;
    this._count--;
  };
  GraphQLSegment.prototype.removeAllEdges = function removeAllEdges(id) {
    var indices = this._idToIndicesMap[id];
    if (!indices) {
      return;
    }
    for (var ii = 0; ii < indices.length; ii++) {
      var data = this._indexToMetadataMap[indices[ii]];
      if (!data.deleted) {
        data.deleted = true;
        this._count--;
      }
    }
  };
  GraphQLSegment.prototype.addEdgesAfterCursor = function addEdgesAfterCursor(edges, cursor) {
    var index = -1;
    if (cursor) {
      index = this._getIndexForCursor(cursor);
      if (index === undefined) {
        console.warn('This segment does not have a cursor %s', cursor);
        return;
      }
    }
    while (this._maxIndex !== null && index < this._maxIndex) {
      var data = this._indexToMetadataMap[index + 1];
      if (data.deleted) {
        index++;
      } else {
        console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'last index is ' + this._maxIndex + ' trying to add edges before ' + index);
        return;
      }
    }
    var startIndex = index + 1;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      this._addEdgeAtIndex(edge, startIndex + ii);
    }
  };
  GraphQLSegment.prototype.addEdgesBeforeCursor = function addEdgesBeforeCursor(edges, cursor) {
    var index = 1;
    if (cursor) {
      index = this._getIndexForCursor(cursor);
      if (index === undefined) {
        console.warn('This segment does not have a cursor %s', cursor);
        return;
      }
    }
    while (this._minIndex !== null && index > this._minIndex) {
      var data = this._indexToMetadataMap[index - 1];
      if (data.deleted) {
        index--;
      } else {
        console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'first index is ' + this._minIndex + ' trying to add edges after ' + index);
        return;
      }
    }
    var startIndex = index - 1;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[edges.length - ii - 1];
      this._addEdgeAtIndex(edge, startIndex - ii);
    }
  };
  GraphQLSegment.prototype.getLength = function getLength() {
    if (this._minIndex === null && this._maxIndex === null) {
      return 0;
    }
    return this._maxIndex - this._minIndex + 1;
  };
  GraphQLSegment.prototype.getCount = function getCount() {
    return this._count;
  };
  GraphQLSegment.prototype._rollback = function _rollback(cursorRollbackMap, idRollbackMap, counters) {
    _Object$assign(this._cursorToIndexMap, cursorRollbackMap);
    _Object$assign(this._idToIndicesMap, idRollbackMap);
    this._count = counters.count;
    this._maxIndex = counters.maxIndex;
    this._minIndex = counters.minIndex;
  };
  GraphQLSegment.prototype._getCounterState = function _getCounterState() {
    return {
      count: this._count,
      maxIndex: this._maxIndex,
      minIndex: this._minIndex
    };
  };
  GraphQLSegment.prototype.concatSegment = function concatSegment(segment) {
    if (!segment.getLength()) {
      return true;
    }
    var idRollbackMap = {};
    var cursorRollbackMap = {};
    var counterState = this._getCounterState();
    var newEdges = segment._indexToMetadataMap;
    for (var ii = segment._minIndex; ii <= segment._maxIndex; ii++) {
      var index;
      if (this.getLength()) {
        index = this._maxIndex + 1;
      } else {
        index = 0;
        this._minIndex = 0;
      }
      this._maxIndex = index;
      var newEdge = newEdges[ii];
      var idIndex = this._getIndexForID(newEdge.edgeID);
      if (!idRollbackMap.hasOwnProperty(newEdge.edgeID)) {
        if (this._idToIndicesMap[newEdge.edgeID]) {
          idRollbackMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID].slice();
        } else {
          idRollbackMap[newEdge.edgeID] = undefined;
        }
      }
      if (idIndex !== undefined) {
        var idEdge = this._indexToMetadataMap[idIndex];
        if (idEdge.deleted && !newEdge.deleted) {
          this._idToIndicesMap[newEdge.edgeID].unshift(index);
        } else if (!newEdge.deleted) {
          console.warn('Attempt to concat an ID already in GraphQLSegment: %s', newEdge.edgeID);
          this._rollback(cursorRollbackMap, idRollbackMap, counterState);
          return false;
        } else {
          this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
          this._idToIndicesMap[newEdge.edgeID].push(index);
        }
      } else {
        this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
        this._idToIndicesMap[newEdge.edgeID].unshift(index);
      }
      var cursorIndex = this._getIndexForCursor(newEdge.cursor);
      if (cursorIndex !== undefined) {
        var cursorEdge = this._indexToMetadataMap[cursorIndex];
        if (cursorEdge.deleted && !newEdge.deleted) {
          cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
          this._cursorToIndexMap[newEdge.cursor] = index;
        } else if (!newEdge.deleted) {
          console.warn('Attempt to concat a cursor already in GraphQLSegment: %s', newEdge.cursor);
          this._rollback(cursorRollbackMap, idRollbackMap, counterState);
          return false;
        }
      } else if (newEdge.cursor) {
        cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
        this._cursorToIndexMap[newEdge.cursor] = index;
      }
      if (!newEdge.deleted) {
        this._count++;
      }
      this._indexToMetadataMap[index] = _Object$assign({}, newEdge);
    }
    return true;
  };
  GraphQLSegment.prototype.toJSON = function toJSON() {
    return [this._indexToMetadataMap, this._idToIndicesMap, this._cursorToIndexMap, this._minIndex, this._maxIndex, this._count];
  };
  GraphQLSegment.fromJSON = function fromJSON(descriptor) {
    var _descriptor = _slicedToArray(descriptor, 6);
    var indexToMetadataMap = _descriptor[0];
    var idToIndicesMap = _descriptor[1];
    var cursorToIndexMap = _descriptor[2];
    var minIndex = _descriptor[3];
    var maxIndex = _descriptor[4];
    var count = _descriptor[5];
    var segment = new GraphQLSegment();
    segment._indexToMetadataMap = indexToMetadataMap;
    segment._idToIndicesMap = idToIndicesMap;
    segment._cursorToIndexMap = cursorToIndexMap;
    segment._minIndex = minIndex;
    segment._maxIndex = maxIndex;
    segment._count = count;
    return segment;
  };
  GraphQLSegment.prototype.__debug = function __debug() {
    return {
      metadata: this._indexToMetadataMap,
      idToIndices: this._idToIndicesMap,
      cursorToIndex: this._cursorToIndexMap
    };
  };
  GraphQLSegment.prototype.getEdgeIDs = function getEdgeIDs() {
    return _Object$keys(this._idToIndicesMap);
  };
  return GraphQLSegment;
})();
module.exports = GraphQLSegment;
