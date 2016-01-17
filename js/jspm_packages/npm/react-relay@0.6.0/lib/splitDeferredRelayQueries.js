/* */ 
(function(process) {
  'use strict';
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var QueryBuilder = require('./QueryBuilder');
  var RelayNodeInterface = require('./RelayNodeInterface');
  var RelayProfiler = require('./RelayProfiler');
  var RelayQuery = require('./RelayQuery');
  var RelayQueryTransform = require('./RelayQueryTransform');
  var RelayRefQueryDescriptor = require('./RelayRefQueryDescriptor');
  var invariant = require('fbjs/lib/invariant');
  function splitDeferredRelayQueries(node) {
    var splitter = new GraphQLSplitDeferredQueries();
    var splitQueries = {
      __parent__: null,
      __path__: [],
      __refQuery__: null,
      deferred: [],
      required: null
    };
    splitter.visit(node, splitQueries);
    return buildQueries(splitQueries);
  }
  function getRequisiteSiblings(node, parent) {
    var siblings = parent.getChildren().filter(function(child) {
      return child !== node && child instanceof RelayQuery.Field && child.isRequisite();
    });
    return siblings.map(function(sibling) {
      var children = sibling.getChildren().filter(function(child) {
        return child instanceof RelayQuery.Field && child.isRequisite();
      });
      var clone = sibling.clone(children);
      !clone ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Unexpected non-scalar, requisite field.') : invariant(false) : undefined;
      return clone;
    });
  }
  function wrapNode(node, path) {
    for (var ii = path.length - 1; ii >= 0; ii--) {
      var parent = path[ii];
      if (parent instanceof RelayQuery.Field && parent.getInferredRootCallName()) {
        return new RelayRefQueryDescriptor(node, path.slice(0, ii + 1));
      }
      var siblings = getRequisiteSiblings(node, parent);
      var children = [node].concat(siblings);
      node = parent.clone(children);
    }
    !(node instanceof RelayQuery.Root) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Cannot build query without a root node.') : invariant(false) : undefined;
    var identifyingArg = node.getIdentifyingArg();
    var identifyingArgName = identifyingArg && identifyingArg.name || null;
    var identifyingArgValue = identifyingArg && identifyingArg.value || null;
    var metadata = {
      identifyingArgName: identifyingArgName,
      isDeferred: true
    };
    return RelayQuery.Root.build(node.getName(), node.getFieldName(), identifyingArgValue, node.getChildren(), metadata, node.getType());
  }
  function isEmpty(node) {
    if (node.isScalar()) {
      return node.isGenerated() && !node.isRefQueryDependency();
    } else {
      return node.getChildren().every(isEmpty);
    }
  }
  function buildQueries(splitQueries) {
    if (splitQueries.required && isEmpty(splitQueries.required)) {
      splitQueries.required = null;
    }
    splitQueries.deferred = splitQueries.deferred.map(function(nestedSplitQueries) {
      var descriptor = nestedSplitQueries.__refQuery__;
      if (descriptor) {
        var context = splitQueries.required;
        if (!context) {
          var parentSplitQueries = splitQueries;
          while (parentSplitQueries.__parent__) {
            context = parentSplitQueries.__parent__.required;
            if (context) {
              break;
            }
            parentSplitQueries = parentSplitQueries.__parent__;
          }
        }
        !context ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Expected a context root query.') : invariant(false) : undefined;
        nestedSplitQueries.required = createRefQuery(descriptor, context);
      }
      return buildQueries(nestedSplitQueries);
    });
    return splitQueries;
  }
  function createRefQuery(descriptor, context) {
    var node = descriptor.node;
    !(node instanceof RelayQuery.Field || node instanceof RelayQuery.Fragment) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a field or fragment.') : invariant(false) : undefined;
    var path = ['$', '*'];
    var parent;
    for (var ii = 0; ii < descriptor.path.length; ii++) {
      parent = descriptor.path[ii];
      if (parent instanceof RelayQuery.Field) {
        path.push(parent.getSerializationKey());
        if (parent.isPlural()) {
          path.push('*');
        }
      }
    }
    !(path.length > 2) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a complete path.') : invariant(false) : undefined;
    var field = parent;
    var primaryKey = field.getInferredPrimaryKey();
    !primaryKey ? process.env.NODE_ENV !== 'production' ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a primary key.') : invariant(false) : undefined;
    path.push(primaryKey);
    var root = RelayQuery.Root.build(context.getName(), RelayNodeInterface.NODES, QueryBuilder.createBatchCallVariable(context.getID(), path.join('.')), [node], {
      identifyingArgName: RelayNodeInterface.ID,
      isDeferred: true
    }, RelayNodeInterface.NODE_TYPE);
    var result = root;
    return result;
  }
  var GraphQLSplitDeferredQueries = (function(_RelayQueryTransform) {
    _inherits(GraphQLSplitDeferredQueries, _RelayQueryTransform);
    function GraphQLSplitDeferredQueries() {
      _classCallCheck(this, GraphQLSplitDeferredQueries);
      _RelayQueryTransform.apply(this, arguments);
    }
    GraphQLSplitDeferredQueries.prototype.visitField = function visitField(node, splitQueries) {
      if (!node.hasDeferredDescendant()) {
        return node;
      }
      splitQueries.__path__.push(node);
      var result = this.traverse(node, splitQueries);
      splitQueries.__path__.pop();
      if (result && node.getInferredRootCallName()) {
        var key = node.getInferredPrimaryKey();
        var children = result.getChildren().map(function(child) {
          if (child instanceof RelayQuery.Field && child.getSchemaName() === key) {
            return child.cloneAsRefQueryDependency();
          } else {
            return child;
          }
        });
        result = result.clone(children);
      }
      return result;
    };
    GraphQLSplitDeferredQueries.prototype.visitFragment = function visitFragment(node, splitQueries) {
      if (!node.getChildren().length) {
        return null;
      }
      if (node.isDeferred()) {
        var path = splitQueries.__path__;
        var deferred = {
          __parent__: splitQueries,
          __path__: path,
          __refQuery__: null,
          deferred: [],
          required: null
        };
        var result = this.traverse(node, deferred);
        if (result) {
          var wrapped = wrapNode(result, path);
          if (wrapped instanceof RelayQuery.Root) {
            deferred.required = wrapped;
          } else if (wrapped instanceof RelayRefQueryDescriptor) {
            deferred.__refQuery__ = wrapped;
          }
        }
        if (result || deferred.deferred.length) {
          splitQueries.deferred.push(deferred);
        }
        return null;
      } else if (node.hasDeferredDescendant()) {
        return this.traverse(node, splitQueries);
      } else {
        return node;
      }
    };
    GraphQLSplitDeferredQueries.prototype.visitRoot = function visitRoot(node, splitQueries) {
      var result;
      if (!node.hasDeferredDescendant()) {
        splitQueries.required = node;
        return node;
      } else {
        splitQueries.__path__.push(node);
        result = this.traverse(node, splitQueries);
        splitQueries.__path__.pop();
        splitQueries.required = result;
        return result;
      }
    };
    return GraphQLSplitDeferredQueries;
  })(RelayQueryTransform);
  var instrumented = RelayProfiler.instrument('splitDeferredRelayQueries', splitDeferredRelayQueries);
  module.exports = instrumented;
})(require('process'));
