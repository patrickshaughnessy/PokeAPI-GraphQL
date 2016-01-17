/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _defineProperty = require('babel-runtime/helpers/define-property')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];
  var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];
  var GraphQLMutatorConstants = require('./GraphQLMutatorConstants');
  var GraphQLSegment = require('./GraphQLSegment');
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var forEachObject = require('fbjs/lib/forEachObject');
  var invariant = require('fbjs/lib/invariant');
  var printRelayQueryCall = require('./printRelayQueryCall');
  var warning = require('fbjs/lib/warning');
  var END_CURSOR = RelayConnectionInterface.END_CURSOR;
  var HAS_NEXT_PAGE = RelayConnectionInterface.HAS_NEXT_PAGE;
  var HAS_PREV_PAGE = RelayConnectionInterface.HAS_PREV_PAGE;
  var START_CURSOR = RelayConnectionInterface.START_CURSOR;
  function callsArrayToObject(queryCalls) {
    var calls = {};
    for (var ii = 0; ii < queryCalls.length; ii++) {
      if (RelayConnectionInterface.isConnectionCall(queryCalls[ii])) {
        var _queryCalls$ii = queryCalls[ii];
        var name = _queryCalls$ii.name;
        var value = _queryCalls$ii.value;
        if (Array.isArray(value) && value.length) {
          value = value[0];
        }
        if (value === null) {
          continue;
        }
        calls[name] = value;
      }
    }
    if (calls.first) {
      !!isNaN(calls.first) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLRange: Expected `first` argument to be a number, got ' + '`%s`.', calls.first) : invariant(false) : undefined;
      calls.first = +calls.first;
    } else if (calls.last) {
      !!isNaN(calls.last) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLRange: Expected `last` argument to be a number, got ' + '`%s`.', calls.last) : invariant(false) : undefined;
      calls.last = +calls.last;
    }
    return calls;
  }
  function isStaticCall(calls) {
    return calls.hasOwnProperty('surrounds') || calls.hasOwnProperty('find');
  }
  function isValidRangeCall(calls) {
    var hasFirst = calls.hasOwnProperty('first');
    var hasLast = calls.hasOwnProperty('last');
    return (hasFirst || hasLast) && !(hasFirst && hasLast);
  }
  function isValidRangeCallValues(calls) {
    return calls.hasOwnProperty('first') && calls.first > 0 || calls.hasOwnProperty('last') && calls.last > 0;
  }
  function validateEdge(edge) {
    !(GraphQLStoreDataHandler.getID(edge) !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLStore: `edge` must have a data id') : invariant(false) : undefined;
    !(edge.node !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLStore: `edge` must have `node` field') : invariant(false) : undefined;
  }
  function validateEdges(edges) {
    edges.forEach(validateEdge);
  }
  var GraphQLRange = (function() {
    function GraphQLRange() {
      _classCallCheck(this, GraphQLRange);
      this.reset();
    }
    GraphQLRange.prototype.reset = function reset() {
      this._orderedSegments = [new GraphQLSegment(), new GraphQLSegment()];
      this._staticQueriesMap = {};
      this._hasFirst = false;
      this._hasLast = false;
    };
    GraphQLRange.prototype._resetSegment = function _resetSegment(index) {
      !(index >= 0 && index < this._orderedSegments.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'cannot reset non-existent segment') : invariant(false) : undefined;
      this._orderedSegments[index] = new GraphQLSegment();
    };
    GraphQLRange.prototype._getSegmentIndexByCursor = function _getSegmentIndexByCursor(cursor) {
      for (var ii = 0; ii < this._orderedSegments.length; ii++) {
        if (this._orderedSegments[ii].containsEdgeWithCursor(cursor)) {
          return ii;
        }
      }
      return null;
    };
    GraphQLRange.prototype._getSegmentIndexByID = function _getSegmentIndexByID(id) {
      for (var ii = 0; ii < this._orderedSegments.length; ii++) {
        if (this._orderedSegments[ii].containsEdgeWithID(id)) {
          return ii;
        }
      }
      return null;
    };
    GraphQLRange.prototype._addStaticEdges = function _addStaticEdges(queryCalls, edges) {
      var calls = _callsToString(queryCalls);
      var edgeIDsToStore = [];
      var cursorsToStore = [];
      for (var ii = 0; ii < edges.length; ii++) {
        var edge = edges[ii];
        edgeIDsToStore.push(GraphQLStoreDataHandler.getID(edge));
        cursorsToStore.push(edge.cursor);
      }
      this._staticQueriesMap[calls] = {
        edgeIDs: edgeIDsToStore,
        cursors: cursorsToStore
      };
    };
    GraphQLRange.prototype.addItems = function addItems(queryCalls, edges, pageInfo) {
      validateEdges(edges);
      var calls = callsArrayToObject(queryCalls);
      var segmentCount,
          segmentIndex;
      if (isStaticCall(calls)) {
        this._addStaticEdges(queryCalls, edges);
        return;
      }
      if (!isValidRangeCall(calls)) {
        console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
        return;
      }
      if (calls.before === null || calls.after === null) {
        console.error('GraphQLRange received null as a cursor.');
        return;
      }
      if (calls.first) {
        if (calls.before && !calls.after) {
          if (pageInfo[HAS_NEXT_PAGE] === true) {
            if (this._getSegmentIndexByCursor(calls.before) === 0) {
              this._orderedSegments.unshift(new GraphQLSegment());
            }
            this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], undefined, calls.before);
          } else {
            this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before);
          }
        } else {
          if (!calls.after) {
            segmentIndex = 0;
            segmentCount = this.getFirstSegment().getCount();
            if (segmentCount && (calls.first > segmentCount || edges.length > segmentCount) && !this.getFirstSegment().getFirstCursor()) {
              this._resetSegment(segmentIndex);
            }
          }
          this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after, calls.before);
        }
      } else if (calls.last) {
        if (calls.after && !calls.before) {
          if (pageInfo[HAS_PREV_PAGE] === true) {
            if (this._getSegmentIndexByCursor(calls.after) === this._orderedSegments.length - 1) {
              this._orderedSegments.push(new GraphQLSegment());
            }
            this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], undefined, calls.after);
          } else {
            this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after);
          }
        } else {
          if (!calls.before) {
            segmentIndex = this._orderedSegments.length - 1;
            segmentCount = this.getLastSegment().getCount();
            if (segmentCount && (calls.last > segmentCount || edges.length > segmentCount) && !this.getLastSegment().getLastCursor()) {
              this._resetSegment(segmentIndex);
            }
          }
          this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before, calls.after);
        }
      }
    };
    GraphQLRange.prototype.getFirstSegment = function getFirstSegment() {
      return this._orderedSegments[0];
    };
    GraphQLRange.prototype.getLastSegment = function getLastSegment() {
      return this._orderedSegments[this._orderedSegments.length - 1];
    };
    GraphQLRange.prototype._concatSegments = function _concatSegments(segmentIndex) {
      !(segmentIndex + 1 < this._orderedSegments.length && segmentIndex >= 0) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'GraphQLRange cannot concat segments outside the range ' + 'of orderedSegments') : invariant(false) : undefined;
      var firstSegment = this._orderedSegments[segmentIndex];
      var secondSegment = this._orderedSegments[segmentIndex + 1];
      if (firstSegment.concatSegment(secondSegment)) {
        this._orderedSegments.splice(segmentIndex + 1, 1);
      } else {
        console.warn('GraphQLRange was unable to concat segment %d and segment %d', segmentIndex, segmentIndex + 1);
      }
    };
    GraphQLRange.prototype.prependEdge = function prependEdge(edge) {
      validateEdge(edge);
      this._hasFirst = true;
      this._removeEdgeIfApplicable(edge);
      var segment = this.getFirstSegment();
      segment.prependEdge(edge);
    };
    GraphQLRange.prototype.appendEdge = function appendEdge(edge) {
      validateEdge(edge);
      this._hasLast = true;
      this._removeEdgeIfApplicable(edge);
      var segment = this.getLastSegment();
      segment.appendEdge(edge);
    };
    GraphQLRange.prototype._removeEdgeIfApplicable = function _removeEdgeIfApplicable(edge) {
      var id = GraphQLStoreDataHandler.getID(edge);
      var index = this._getSegmentIndexByID(id);
      if (index != null) {
        this._orderedSegments[index].removeEdge(id);
      }
    };
    GraphQLRange.prototype._removeEdgesIfApplicable = function _removeEdgesIfApplicable(edges) {
      for (var ii = 0; ii < edges.length; ii++) {
        this._removeEdgeIfApplicable(edges[ii]);
      }
    };
    GraphQLRange.prototype._addAfterFirstItems = function _addAfterFirstItems(edges, hasNextPage, afterCursor, beforeCursor) {
      var segment;
      var segmentIndex;
      var lastCursor;
      if (afterCursor !== undefined) {
        segmentIndex = this._getSegmentIndexByCursor(afterCursor);
        if (segmentIndex == null) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', afterCursor) : undefined;
          return;
        }
        segment = this._orderedSegments[segmentIndex];
        lastCursor = segment.getLastCursor();
        if (lastCursor !== afterCursor) {
          edges = this._reconcileAfterFirstEdges(segment, edges, afterCursor);
          afterCursor = lastCursor;
          if (!edges) {
            return;
          }
        }
      } else {
        segmentIndex = 0;
        segment = this._orderedSegments[segmentIndex];
        lastCursor = segment.getLastCursor();
        if (lastCursor !== undefined) {
          edges = this._reconcileAfterFirstEdges(segment, edges);
          afterCursor = lastCursor;
          if (!edges) {
            return;
          }
        }
      }
      if (beforeCursor !== undefined) {
        if (segmentIndex === this._orderedSegments.length - 1) {
          console.warn('GraphQLRange cannot add because there is no next segment');
          return;
        } else if (this._orderedSegments[segmentIndex + 1].getFirstCursor() !== beforeCursor) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'GraphQLRange cannot add because beforeCursor does not match first ' + 'cursor of the next segment') : undefined;
          return;
        }
      }
      if (afterCursor === undefined) {
        this._hasFirst = true;
      }
      this._removeEdgesIfApplicable(edges);
      segment.addEdgesAfterCursor(edges, afterCursor);
      if (!hasNextPage) {
        if (beforeCursor !== undefined) {
          this._concatSegments(segmentIndex);
        } else {
          this._hasLast = true;
          this._orderedSegments.splice(segmentIndex + 1, this._orderedSegments.length - 1 - segmentIndex);
        }
      }
    };
    GraphQLRange.prototype._reconcileAfterFirstEdges = function _reconcileAfterFirstEdges(segment, edges, cursor) {
      var metadata = segment.getMetadataAfterCursor(edges.length + 1, cursor);
      var edgeIDs = metadata.edgeIDs;
      if (edgeIDs.length > edges.length) {
        return undefined;
      }
      for (var ii = 0; ii < edgeIDs.length; ii++) {
        if (edgeIDs[ii] !== GraphQLStoreDataHandler.getID(edges[ii])) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
          return undefined;
        }
      }
      return edges.slice(edgeIDs.length);
    };
    GraphQLRange.prototype._addBeforeLastItems = function _addBeforeLastItems(edges, hasPrevPage, beforeCursor, afterCursor) {
      var segment;
      var segmentIndex;
      var firstCursor;
      if (beforeCursor !== undefined) {
        segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
        if (segmentIndex == null) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', beforeCursor) : undefined;
          return;
        }
        segment = this._orderedSegments[segmentIndex];
        firstCursor = segment.getFirstCursor();
        if (firstCursor !== beforeCursor) {
          edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
          beforeCursor = firstCursor;
          if (!edges) {
            return;
          }
        }
      } else {
        segmentIndex = this._orderedSegments.length - 1;
        segment = this._orderedSegments[segmentIndex];
        firstCursor = segment.getFirstCursor();
        if (firstCursor !== undefined) {
          edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
          beforeCursor = firstCursor;
          if (!edges) {
            return;
          }
        }
      }
      if (afterCursor !== undefined) {
        if (segmentIndex === 0) {
          console.warn('GraphQLRange cannot add because there is no previous segment');
          return;
        } else if (this._orderedSegments[segmentIndex - 1].getLastCursor() !== afterCursor) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'GraphQLRange cannot add because afterCursor does not match last ' + 'cursor of the previous segment') : undefined;
          return;
        }
      }
      if (beforeCursor === undefined) {
        this._hasLast = true;
      }
      this._removeEdgesIfApplicable(edges);
      segment.addEdgesBeforeCursor(edges, beforeCursor);
      if (!hasPrevPage) {
        if (afterCursor !== undefined) {
          this._concatSegments(segmentIndex - 1);
        } else {
          this._hasFirst = true;
          this._orderedSegments.splice(0, segmentIndex);
        }
      }
    };
    GraphQLRange.prototype._reconcileBeforeLastEdges = function _reconcileBeforeLastEdges(segment, edges, cursor) {
      var metadata = segment.getMetadataBeforeCursor(edges.length + 1, cursor);
      var edgeIDs = metadata.edgeIDs;
      if (edgeIDs.length > edges.length) {
        return undefined;
      }
      for (var ii = 1; ii <= edgeIDs.length; ii++) {
        if (edgeIDs[edgeIDs.length - ii] !== GraphQLStoreDataHandler.getID(edges[edges.length - ii])) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
          return undefined;
        }
      }
      return edges.slice(0, edges.length - edgeIDs.length);
    };
    GraphQLRange.prototype.removeEdgeWithID = function removeEdgeWithID(id) {
      for (var ii = 0; ii < this._orderedSegments.length; ii++) {
        this._orderedSegments[ii].removeAllEdges(id);
      }
    };
    GraphQLRange.prototype.retrieveRangeInfoForQuery = function retrieveRangeInfoForQuery(queryCalls, optimisticData) {
      var calls = callsArrayToObject(queryCalls);
      if (isStaticCall(calls)) {
        return this._retrieveRangeInfoForStaticCalls(queryCalls);
      }
      if (!isValidRangeCall(calls)) {
        console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
        return {
          requestedEdgeIDs: [],
          diffCalls: [],
          pageInfo: RelayConnectionInterface.getDefaultPageInfo()
        };
      }
      if (calls.first && calls.before || calls.last && calls.after) {
        return {
          requestedEdgeIDs: [],
          diffCalls: [],
          pageInfo: RelayConnectionInterface.getDefaultPageInfo()
        };
      }
      if (!isValidRangeCallValues(calls)) {
        console.error('GraphQLRange only supports first(<count>) or last(<count>) ' + 'where count is greater than 0');
        return {
          requestedEdgeIDs: [],
          diffCalls: [],
          pageInfo: RelayConnectionInterface.getDefaultPageInfo()
        };
      }
      if (calls.first) {
        return this._retrieveRangeInfoForFirstQuery(queryCalls, optimisticData);
      } else if (calls.last) {
        return this._retrieveRangeInfoForLastQuery(queryCalls, optimisticData);
      }
    };
    GraphQLRange.prototype._retrieveRangeInfoForStaticCalls = function _retrieveRangeInfoForStaticCalls(queryCalls) {
      var calls = _callsToString(queryCalls);
      var storedInfo = this._staticQueriesMap[calls];
      if (storedInfo) {
        var _pageInfo;
        return {
          requestedEdgeIDs: storedInfo.edgeIDs,
          diffCalls: [],
          pageInfo: (_pageInfo = {}, _defineProperty(_pageInfo, START_CURSOR, storedInfo.cursors[0]), _defineProperty(_pageInfo, END_CURSOR, storedInfo.cursors[storedInfo.cursors.length - 1]), _defineProperty(_pageInfo, HAS_NEXT_PAGE, true), _defineProperty(_pageInfo, HAS_PREV_PAGE, true), _pageInfo)
        };
      }
      return {
        requestedEdgeIDs: [],
        diffCalls: queryCalls,
        pageInfo: RelayConnectionInterface.getDefaultPageInfo()
      };
    };
    GraphQLRange.prototype._retrieveRangeInfoForFirstQuery = function _retrieveRangeInfoForFirstQuery(queryCalls, optimisticData) {
      var appendEdgeIDs = [];
      var prependEdgeIDs = [];
      var deleteIDs = [];
      if (optimisticData) {
        appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
        prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
        deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
      }
      var calls = callsArrayToObject(queryCalls);
      var countNeeded = calls.first + deleteIDs.length;
      var segment;
      var segmentIndex;
      var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());
      var afterCursor = calls.after;
      if (afterCursor !== undefined) {
        segmentIndex = this._getSegmentIndexByCursor(afterCursor);
        if (segmentIndex == null) {
          console.warn('GraphQLRange cannot find a segment that has the cursor: ' + afterCursor);
          return {
            requestedEdgeIDs: [],
            diffCalls: [],
            pageInfo: pageInfo
          };
        }
        segment = this._orderedSegments[segmentIndex];
      } else {
        var prependEdgesCount = prependEdgeIDs.length;
        countNeeded -= prependEdgesCount;
        segmentIndex = 0;
        segment = this._orderedSegments[segmentIndex];
      }
      var requestedMetadata = segment.getMetadataAfterCursor(countNeeded, afterCursor);
      var requestedEdgeIDs = requestedMetadata.edgeIDs;
      var requestedCursors = requestedMetadata.cursors;
      var diffCalls = [];
      if (requestedCursors.length) {
        pageInfo[START_CURSOR] = requestedCursors[0];
        pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
      }
      var lastID = requestedEdgeIDs[requestedEdgeIDs.length - 1];
      if (!this._hasLast || segmentIndex !== this._orderedSegments.length - 1 || lastID && lastID !== segment.getLastID()) {
        pageInfo[HAS_NEXT_PAGE] = true;
        if (requestedEdgeIDs.length < countNeeded) {
          countNeeded -= requestedEdgeIDs.length;
          var lastCursor = segment.getLastCursor();
          if (lastCursor === null) {
            diffCalls.push({
              name: 'first',
              value: calls.first
            });
          } else {
            if (lastCursor !== undefined) {
              diffCalls.push({
                name: 'after',
                value: lastCursor
              });
            }
            if (segmentIndex !== this._orderedSegments.length - 1) {
              var nextSegment = this._orderedSegments[segmentIndex + 1];
              var firstCursor = nextSegment.getFirstCursor();
              if (firstCursor !== undefined) {
                diffCalls.push({
                  name: 'before',
                  value: firstCursor
                });
              }
            }
            diffCalls.push({
              name: 'first',
              value: countNeeded
            });
          }
        }
      }
      if (optimisticData) {
        if (prependEdgeIDs.length && !calls.after) {
          requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
        }
        if (appendEdgeIDs.length && !pageInfo[HAS_NEXT_PAGE]) {
          requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
        }
        if (deleteIDs.length) {
          requestedEdgeIDs = requestedEdgeIDs.filter(function(edgeID) {
            return deleteIDs.indexOf(edgeID) == -1;
          });
        }
        if (requestedEdgeIDs.length > calls.first) {
          requestedEdgeIDs = requestedEdgeIDs.slice(0, calls.first);
        }
      }
      return {
        requestedEdgeIDs: requestedEdgeIDs,
        diffCalls: diffCalls,
        pageInfo: pageInfo
      };
    };
    GraphQLRange.prototype._retrieveRangeInfoForLastQuery = function _retrieveRangeInfoForLastQuery(queryCalls, optimisticData) {
      var appendEdgeIDs = [];
      var prependEdgeIDs = [];
      var deleteIDs = [];
      if (optimisticData) {
        appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
        prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
        deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
      }
      var calls = callsArrayToObject(queryCalls);
      var countNeeded = calls.last + deleteIDs.length;
      var segment;
      var segmentIndex;
      var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());
      var beforeCursor = calls.before;
      if (beforeCursor !== undefined) {
        segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
        if (segmentIndex == null) {
          console.warn('GraphQLRange cannot find a segment that has the cursor: ' + beforeCursor);
          return {
            requestedEdgeIDs: [],
            diffCalls: [],
            pageInfo: pageInfo
          };
        }
        segment = this._orderedSegments[segmentIndex];
      } else {
        var appendEdgesCount = appendEdgeIDs.length;
        countNeeded -= appendEdgesCount;
        segmentIndex = this._orderedSegments.length - 1;
        segment = this._orderedSegments[segmentIndex];
      }
      var requestedMetadata = segment.getMetadataBeforeCursor(countNeeded, beforeCursor);
      var requestedEdgeIDs = requestedMetadata.edgeIDs;
      var requestedCursors = requestedMetadata.cursors;
      var diffCalls = [];
      if (requestedCursors.length) {
        pageInfo[START_CURSOR] = requestedCursors[0];
        pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
      }
      var firstID = requestedEdgeIDs[0];
      if (!this._hasFirst || segmentIndex !== 0 || firstID && firstID !== segment.getFirstID()) {
        pageInfo[HAS_PREV_PAGE] = true;
        if (requestedEdgeIDs.length < countNeeded) {
          countNeeded -= requestedEdgeIDs.length;
          var firstCursor = segment.getFirstCursor();
          if (firstCursor === null) {
            diffCalls.push({
              name: 'last',
              value: calls.last
            });
          } else {
            if (firstCursor !== undefined) {
              diffCalls.push({
                name: 'before',
                value: firstCursor
              });
            }
            if (segmentIndex !== 0) {
              var prevSegment = this._orderedSegments[segmentIndex - 1];
              var lastCursor = prevSegment.getLastCursor();
              if (lastCursor !== undefined) {
                diffCalls.push({
                  name: 'after',
                  value: lastCursor
                });
              }
            }
            diffCalls.push({
              name: 'last',
              value: countNeeded
            });
          }
        }
      }
      if (optimisticData) {
        if (appendEdgeIDs.length && !calls.before) {
          requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
        }
        if (prependEdgeIDs.length && !pageInfo[HAS_PREV_PAGE]) {
          requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
        }
        if (deleteIDs.length) {
          requestedEdgeIDs = requestedEdgeIDs.filter(function(edgeID) {
            return deleteIDs.indexOf(edgeID) == -1;
          });
        }
        if (requestedEdgeIDs.length > calls.last) {
          var length = requestedEdgeIDs.length;
          requestedEdgeIDs = requestedEdgeIDs.slice(length - calls.last, length);
        }
      }
      return {
        requestedEdgeIDs: requestedEdgeIDs,
        diffCalls: diffCalls,
        pageInfo: pageInfo
      };
    };
    GraphQLRange.fromJSON = function fromJSON(descriptor) {
      var _descriptor = _slicedToArray(descriptor, 4);
      var hasFirst = _descriptor[0];
      var hasLast = _descriptor[1];
      var staticQueriesMap = _descriptor[2];
      var orderedSegments = _descriptor[3];
      var range = new GraphQLRange();
      range._hasFirst = hasFirst;
      range._hasLast = hasLast;
      range._staticQueriesMap = staticQueriesMap;
      range._orderedSegments = orderedSegments.map(function(descriptor) {
        return GraphQLSegment.fromJSON(descriptor);
      });
      return range;
    };
    GraphQLRange.prototype.toJSON = function toJSON() {
      return [this._hasFirst, this._hasLast, this._staticQueriesMap, this._orderedSegments];
    };
    GraphQLRange.prototype.__debug = function __debug() {
      return {orderedSegments: this._orderedSegments};
    };
    GraphQLRange.prototype.getEdgeIDs = function getEdgeIDs() {
      var edgeIDs = [];
      this._orderedSegments.forEach(function(segment) {
        edgeIDs.push.apply(edgeIDs, _toConsumableArray(segment.getEdgeIDs()));
      });
      forEachObject(this._staticQueriesMap, function(query) {
        edgeIDs.push.apply(edgeIDs, _toConsumableArray(query.edgeIDs));
      });
      return edgeIDs;
    };
    return GraphQLRange;
  })();
  function _callsToString(calls) {
    return calls.map(function(call) {
      return printRelayQueryCall(call).substring(1);
    }).join(',');
  }
  module.exports = GraphQLRange;
})(require('process'));
