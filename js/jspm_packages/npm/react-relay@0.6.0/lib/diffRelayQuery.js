/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayProfiler = require('./RelayProfiler');
  var RelayQuery = require('./RelayQuery');
  var RelayQueryPath = require('./RelayQueryPath');
  var forEachRootCallArg = require('./forEachRootCallArg');
  var invariant = require('fbjs/lib/invariant');
  var isCompatibleRelayFragmentType = require('./isCompatibleRelayFragmentType');
  var warning = require('fbjs/lib/warning');
  var ID = RelayNodeInterface.ID;
  var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
  var TYPENAME = RelayNodeInterface.TYPENAME;
  var EDGES = RelayConnectionInterface.EDGES;
  var NODE = RelayConnectionInterface.NODE;
  var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
  var idField = RelayQuery.Field.build({
    fieldName: ID,
    metadata: {isRequisite: true},
    type: 'String'
  });
  var typeField = RelayQuery.Field.build({
    fieldName: TYPENAME,
    metadata: {isRequisite: true},
    type: 'String'
  });
  var nodeWithID = RelayQuery.Field.build({
    fieldName: RelayNodeInterface.NODE,
    children: [idField, typeField],
    type: NODE_TYPE
  });
  function diffRelayQuery(root, store, tracker) {
    var path = new RelayQueryPath(root);
    var queries = [];
    var visitor = new RelayDiffQueryBuilder(store, tracker);
    var rootIdentifyingArg = root.getIdentifyingArg();
    var rootIdentifyingArgValue = rootIdentifyingArg && rootIdentifyingArg.value || null;
    var isPluralCall = Array.isArray(rootIdentifyingArgValue) && rootIdentifyingArgValue.length > 1;
    var metadata = undefined;
    if (rootIdentifyingArg != null) {
      metadata = {};
      metadata.identifyingArgName = rootIdentifyingArg.name;
      if (rootIdentifyingArg.type != null) {
        metadata.identifyingArgType = rootIdentifyingArg.type;
      }
    }
    var fieldName = root.getFieldName();
    var storageKey = root.getStorageKey();
    forEachRootCallArg(root, function(identifyingArgValue) {
      var nodeRoot;
      if (isPluralCall) {
        !(identifyingArgValue != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'diffRelayQuery(): Unexpected null or undefined value in root call ' + 'argument array for query, `%s(...).', fieldName) : invariant(false) : undefined;
        nodeRoot = RelayQuery.Root.build(root.getName(), fieldName, [identifyingArgValue], root.getChildren(), metadata, root.getType());
      } else {
        nodeRoot = root;
      }
      var dataID = store.getDataID(storageKey, identifyingArgValue);
      if (dataID == null) {
        queries.push(nodeRoot);
        return;
      }
      var scope = makeScope(dataID);
      var diffOutput = visitor.visit(nodeRoot, path, scope);
      var diffNode = diffOutput ? diffOutput.diffNode : null;
      if (diffNode) {
        !(diffNode instanceof RelayQuery.Root) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'diffRelayQuery(): Expected result to be a root query.') : invariant(false) : undefined;
        queries.push(diffNode);
      }
    });
    return queries.concat(visitor.getSplitQueries());
  }
  var RelayDiffQueryBuilder = (function() {
    function RelayDiffQueryBuilder(store, tracker) {
      _classCallCheck(this, RelayDiffQueryBuilder);
      this._store = store;
      this._splitQueries = [];
      this._tracker = tracker;
    }
    RelayDiffQueryBuilder.prototype.splitQuery = function splitQuery(root) {
      this._splitQueries.push(root);
    };
    RelayDiffQueryBuilder.prototype.getSplitQueries = function getSplitQueries() {
      return this._splitQueries;
    };
    RelayDiffQueryBuilder.prototype.visit = function visit(node, path, scope) {
      if (node instanceof RelayQuery.Field) {
        return this.visitField(node, path, scope);
      } else if (node instanceof RelayQuery.Fragment) {
        return this.visitFragment(node, path, scope);
      } else if (node instanceof RelayQuery.Root) {
        return this.visitRoot(node, path, scope);
      }
    };
    RelayDiffQueryBuilder.prototype.visitRoot = function visitRoot(node, path, scope) {
      return this.traverse(node, path, scope);
    };
    RelayDiffQueryBuilder.prototype.visitFragment = function visitFragment(node, path, scope) {
      return this.traverse(node, path, scope);
    };
    RelayDiffQueryBuilder.prototype.visitField = function visitField(node, path, _ref) {
      var connectionField = _ref.connectionField;
      var dataID = _ref.dataID;
      var edgeID = _ref.edgeID;
      var rangeInfo = _ref.rangeInfo;
      if (connectionField && rangeInfo) {
        if (edgeID) {
          if (node.getSchemaName() === EDGES) {
            return this.diffConnectionEdge(connectionField, node, path.getPath(node, edgeID), edgeID, rangeInfo);
          } else {
            return null;
          }
        } else {
          if (node.getSchemaName() === EDGES || node.getSchemaName() === PAGE_INFO) {
            return rangeInfo.diffCalls.length > 0 ? {
              diffNode: node,
              trackedNode: null
            } : null;
          }
        }
      }
      if (node.isScalar()) {
        return this.diffScalar(node, dataID);
      } else if (node.isGenerated()) {
        return {
          diffNode: node,
          trackedNode: null
        };
      } else if (node.isConnection()) {
        return this.diffConnection(node, path, dataID);
      } else if (node.isPlural()) {
        return this.diffPluralLink(node, path, dataID);
      } else {
        return this.diffLink(node, path, dataID);
      }
    };
    RelayDiffQueryBuilder.prototype.traverse = function traverse(node, path, scope) {
      var _this = this;
      var diffNode = undefined;
      var diffChildren = undefined;
      var trackedNode = undefined;
      var trackedChildren = undefined;
      var hasDiffField = false;
      var hasTrackedField = false;
      node.getChildren().forEach(function(child) {
        if (child instanceof RelayQuery.Field) {
          var diffOutput = _this.visitField(child, path, scope);
          var diffChild = diffOutput ? diffOutput.diffNode : null;
          var trackedChild = diffOutput ? diffOutput.trackedNode : null;
          if (diffChild) {
            diffChildren = diffChildren || [];
            diffChildren.push(diffChild);
            hasDiffField = hasDiffField || !diffChild.isGenerated();
          } else if (child.isRequisite() && !scope.rangeInfo) {
            diffChildren = diffChildren || [];
            diffChildren.push(child);
          }
          if (trackedChild) {
            trackedChildren = trackedChildren || [];
            trackedChildren.push(trackedChild);
            hasTrackedField = hasTrackedField || !trackedChild.isGenerated();
          } else if (child.isRequisite()) {
            trackedChildren = trackedChildren || [];
            trackedChildren.push(child);
          }
        } else if (child instanceof RelayQuery.Fragment) {
          var isCompatibleType = isCompatibleRelayFragmentType(child, _this._store.getType(scope.dataID));
          if (isCompatibleType) {
            var diffOutput = _this.traverse(child, path, scope);
            var diffChild = diffOutput ? diffOutput.diffNode : null;
            var trackedChild = diffOutput ? diffOutput.trackedNode : null;
            if (diffChild) {
              diffChildren = diffChildren || [];
              diffChildren.push(diffChild);
              hasDiffField = true;
            }
            if (trackedChild) {
              trackedChildren = trackedChildren || [];
              trackedChildren.push(trackedChild);
              hasTrackedField = true;
            }
          } else {
            diffChildren = diffChildren || [];
            diffChildren.push(child);
          }
        }
      });
      if (diffChildren && hasDiffField) {
        diffNode = node.clone(diffChildren);
      }
      if (trackedChildren && hasTrackedField) {
        trackedNode = node.clone(trackedChildren);
      }
      if (trackedNode && !(trackedNode instanceof RelayQuery.Fragment)) {
        this._tracker.trackNodeForID(trackedNode, scope.dataID, path);
      }
      return {
        diffNode: diffNode,
        trackedNode: trackedNode
      };
    };
    RelayDiffQueryBuilder.prototype.diffScalar = function diffScalar(field, dataID) {
      if (this._store.getField(dataID, field.getStorageKey()) === undefined) {
        return {
          diffNode: field,
          trackedNode: null
        };
      }
      return null;
    };
    RelayDiffQueryBuilder.prototype.diffLink = function diffLink(field, path, dataID) {
      var nextDataID = this._store.getLinkedRecordID(dataID, field.getStorageKey());
      if (nextDataID === undefined) {
        return {
          diffNode: field,
          trackedNode: null
        };
      }
      if (nextDataID === null) {
        return null;
      }
      return this.traverse(field, path.getPath(field, nextDataID), makeScope(nextDataID));
    };
    RelayDiffQueryBuilder.prototype.diffPluralLink = function diffPluralLink(field, path, dataID) {
      var _this2 = this;
      var linkedIDs = this._store.getLinkedRecordIDs(dataID, field.getStorageKey());
      if (linkedIDs === undefined) {
        return {
          diffNode: field,
          trackedNode: null
        };
      } else if (linkedIDs === null || linkedIDs.length === 0) {
        return null;
      } else if (field.getInferredRootCallName() === NODE) {
        var hasSplitQueries = false;
        linkedIDs.forEach(function(itemID) {
          var itemState = _this2.traverse(field, path.getPath(field, itemID), makeScope(itemID));
          if (itemState) {
            hasSplitQueries = hasSplitQueries || !!itemState.trackedNode || !!itemState.diffNode;
            if (itemState.diffNode) {
              _this2.splitQuery(buildRoot(itemID, itemState.diffNode.getChildren(), path.getName(), field.getType()));
            }
          }
        });
        if (hasSplitQueries) {
          return {
            diffNode: null,
            trackedNode: field
          };
        }
      } else {
        var sampleItemID = linkedIDs[0];
        return this.traverse(field, path.getPath(field, sampleItemID), makeScope(sampleItemID));
      }
      return null;
    };
    RelayDiffQueryBuilder.prototype.diffConnection = function diffConnection(field, path, dataID) {
      var _this3 = this;
      var store = this._store;
      var connectionID = store.getLinkedRecordID(dataID, field.getStorageKey());
      var rangeInfo = store.getRangeMetadata(connectionID, field.getCallsWithValues());
      if (connectionID === undefined) {
        return {
          diffNode: field,
          trackedNode: null
        };
      }
      if (connectionID === null) {
        return null;
      }
      if (rangeInfo == null) {
        return this.traverse(field, path.getPath(field, connectionID), makeScope(connectionID));
      }
      var diffCalls = rangeInfo.diffCalls;
      var filteredEdges = rangeInfo.filteredEdges;
      var hasSplitQueries = false;
      filteredEdges.forEach(function(edge) {
        if (rangeInfo && connectionID) {
          var scope = {
            connectionField: field,
            dataID: connectionID,
            edgeID: edge.edgeID,
            rangeInfo: rangeInfo
          };
          var diffOutput = _this3.traverse(field, path.getPath(field, edge.edgeID), scope);
          if (diffOutput) {
            hasSplitQueries = hasSplitQueries || !!diffOutput.trackedNode;
          }
        }
      });
      var scope = {
        connectionField: field,
        dataID: connectionID,
        edgeID: null,
        rangeInfo: rangeInfo
      };
      var diffOutput = this.traverse(field, path.getPath(field, connectionID), scope);
      var diffNode = diffOutput ? diffOutput.diffNode : null;
      var trackedNode = diffOutput ? diffOutput.trackedNode : null;
      if (diffCalls.length && diffNode instanceof RelayQuery.Field) {
        diffNode = diffNode.cloneFieldWithCalls(diffNode.getChildren(), diffCalls);
      }
      if (hasSplitQueries) {
        trackedNode = field;
      }
      return {
        diffNode: diffNode,
        trackedNode: trackedNode
      };
    };
    RelayDiffQueryBuilder.prototype.diffConnectionEdge = function diffConnectionEdge(connectionField, edgeField, path, edgeID, rangeInfo) {
      var nodeID = this._store.getLinkedRecordID(edgeID, NODE);
      if (!nodeID || GraphQLStoreDataHandler.isClientID(nodeID)) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'RelayDiffQueryBuilder: connection `node{*}` can only be refetched ' + 'if the node is refetchable by `id`. Cannot refetch data for field ' + '`%s`.', connectionField.getStorageKey()) : undefined;
        return null;
      }
      var hasSplitQueries = false;
      var diffOutput = this.traverse(edgeField, path.getPath(edgeField, edgeID), makeScope(edgeID));
      var diffNode = diffOutput ? diffOutput.diffNode : null;
      var trackedNode = diffOutput ? diffOutput.trackedNode : null;
      if (diffNode) {
        var _splitNodeAndEdgesFields = splitNodeAndEdgesFields(diffNode);
        var diffEdgesField = _splitNodeAndEdgesFields.edges;
        var diffNodeField = _splitNodeAndEdgesFields.node;
        if (diffNodeField) {
          hasSplitQueries = true;
          var nodeField = edgeField.getFieldByStorageKey('node');
          !nodeField ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayDiffQueryBuilder: expected a `node` field for connection `%s`.', connectionField.getSchemaName()) : invariant(false) : undefined;
          this.splitQuery(buildRoot(nodeID, diffNodeField.getChildren(), path.getName(), nodeField.getType()));
        }
        if (diffEdgesField) {
          if (connectionField.isFindable()) {
            diffEdgesField = diffEdgesField.clone(diffEdgesField.getChildren().concat(nodeWithID));
            var connectionFind = connectionField.cloneFieldWithCalls([diffEdgesField], rangeInfo.filterCalls.concat({
              name: 'find',
              value: nodeID
            }));
            if (connectionFind) {
              hasSplitQueries = true;
              var connectionParent = path.getParent().getParent();
              this.splitQuery(connectionParent.getQuery(connectionFind));
            }
          } else {
            process.env.NODE_ENV !== 'production' ? warning(false, 'RelayDiffQueryBuilder: connection `edges{*}` fields can only be ' + 'refetched if the connection supports the `find` call. Cannot ' + 'refetch data for field `%s`.', connectionField.getStorageKey()) : undefined;
          }
        }
      }
      return {
        diffNode: null,
        trackedNode: hasSplitQueries ? edgeField : trackedNode
      };
    };
    return RelayDiffQueryBuilder;
  })();
  function makeScope(dataID) {
    return {
      connectionField: null,
      dataID: dataID,
      edgeID: null,
      rangeInfo: null
    };
  }
  function splitNodeAndEdgesFields(edgeOrFragment) {
    var children = edgeOrFragment.getChildren();
    var edgeChildren = [];
    var hasNodeChild = false;
    var nodeChildren = [];
    var hasEdgeChild = false;
    for (var ii = 0; ii < children.length; ii++) {
      var child = children[ii];
      if (child instanceof RelayQuery.Field) {
        if (child.getSchemaName() === NODE) {
          var subFields = child.getChildren();
          nodeChildren = nodeChildren.concat(subFields);
          hasNodeChild = hasNodeChild || subFields.length !== 1 || !(subFields[0] instanceof RelayQuery.Field) || subFields[0].getSchemaName() !== 'id';
        } else {
          edgeChildren.push(child);
          hasEdgeChild = hasEdgeChild || !child.isRequisite();
        }
      } else if (child instanceof RelayQuery.Fragment) {
        var _splitNodeAndEdgesFields2 = splitNodeAndEdgesFields(child);
        var edges = _splitNodeAndEdgesFields2.edges;
        var node = _splitNodeAndEdgesFields2.node;
        if (edges) {
          edgeChildren.push(edges);
          hasEdgeChild = true;
        }
        if (node) {
          nodeChildren.push(node);
          hasNodeChild = true;
        }
      }
    }
    return {
      edges: hasEdgeChild ? edgeOrFragment.clone(edgeChildren) : null,
      node: hasNodeChild ? edgeOrFragment.clone(nodeChildren) : null
    };
  }
  function buildRoot(rootID, nodes, name, type) {
    var children = [idField, typeField];
    var fields = [];
    nodes.forEach(function(node) {
      if (node instanceof RelayQuery.Field) {
        fields.push(node);
      } else {
        children.push(node);
      }
    });
    children.push(RelayQuery.Fragment.build('diffRelayQuery', type, fields));
    return RelayQuery.Root.build(name, NODE, rootID, children, {identifyingArgName: RelayNodeInterface.ID}, NODE_TYPE);
  }
  module.exports = RelayProfiler.instrument('diffRelayQuery', diffRelayQuery);
})(require('process'));
