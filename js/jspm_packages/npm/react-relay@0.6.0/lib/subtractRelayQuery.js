/* */ 
(function(process) {
  'use strict';
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var RelayProfiler = require('./RelayProfiler');
  var RelayQuery = require('./RelayQuery');
  var RelayQueryTransform = require('./RelayQueryTransform');
  var areEqual = require('fbjs/lib/areEqual');
  var invariant = require('fbjs/lib/invariant');
  function subtractRelayQuery(minuend, subtrahend) {
    var visitor = new RelayQuerySubtractor();
    var state = {
      isEmpty: true,
      subtrahend: subtrahend
    };
    var diff = visitor.visit(minuend, state);
    if (!state.isEmpty) {
      !(diff instanceof RelayQuery.Root) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'subtractRelayQuery(): Expected a subtracted query root.') : invariant(false) : undefined;
      return diff;
    }
    return null;
  }
  var RelayQuerySubtractor = (function(_RelayQueryTransform) {
    _inherits(RelayQuerySubtractor, _RelayQueryTransform);
    function RelayQuerySubtractor() {
      _classCallCheck(this, RelayQuerySubtractor);
      _RelayQueryTransform.apply(this, arguments);
    }
    RelayQuerySubtractor.prototype.visitRoot = function visitRoot(node, state) {
      var subtrahend = state.subtrahend;
      !(subtrahend instanceof RelayQuery.Root) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'subtractRelayQuery(): Cannot subtract a non-root node from a root.') : invariant(false) : undefined;
      if (!canSubtractRoot(node, subtrahend)) {
        state.isEmpty = false;
        return node;
      }
      return this._subtractChildren(node, state);
    };
    RelayQuerySubtractor.prototype.visitFragment = function visitFragment(node, state) {
      return this._subtractChildren(node, state);
    };
    RelayQuerySubtractor.prototype.visitField = function visitField(node, state) {
      var diff;
      if (node.isScalar()) {
        diff = this._subtractScalar(node, state);
      } else if (node.isConnection()) {
        diff = this._subtractConnection(node, state);
      } else {
        diff = this._subtractField(node, state);
      }
      if (diff && (diff.isRequisite() || !state.isEmpty)) {
        return diff;
      }
      return null;
    };
    RelayQuerySubtractor.prototype._subtractScalar = function _subtractScalar(node, state) {
      var subField = state.subtrahend.getField(node);
      if (subField && !node.isRequisite()) {
        return null;
      }
      state.isEmpty = isEmptyField(node);
      return node;
    };
    RelayQuerySubtractor.prototype._subtractConnection = function _subtractConnection(node, state) {
      var subtrahendRanges = getMatchingRangeFields(node, state.subtrahend);
      if (!subtrahendRanges.length) {
        state.isEmpty = isEmptyField(node);
        return node;
      }
      var diff = node;
      var fieldState;
      for (var ii = 0; ii < subtrahendRanges.length; ii++) {
        fieldState = {
          isEmpty: true,
          subtrahend: subtrahendRanges[ii]
        };
        diff = this._subtractChildren(diff, fieldState);
        state.isEmpty = fieldState.isEmpty;
        if (!diff) {
          break;
        }
      }
      return diff;
    };
    RelayQuerySubtractor.prototype._subtractField = function _subtractField(node, state) {
      var subField = state.subtrahend.getField(node);
      if (!subField) {
        state.isEmpty = isEmptyField(node);
        return node;
      }
      var fieldState = {
        isEmpty: true,
        subtrahend: subField
      };
      var diff = this._subtractChildren(node, fieldState);
      state.isEmpty = fieldState.isEmpty;
      return diff;
    };
    RelayQuerySubtractor.prototype._subtractChildren = function _subtractChildren(node, state) {
      var _this = this;
      return node.clone(node.getChildren().map(function(child) {
        var childState = {
          isEmpty: true,
          subtrahend: state.subtrahend
        };
        var diff = _this.visit(child, childState);
        state.isEmpty = state.isEmpty && childState.isEmpty;
        return diff;
      }));
    };
    return RelayQuerySubtractor;
  })(RelayQueryTransform);
  function isEmptyField(node) {
    if (node instanceof RelayQuery.Field && node.isScalar()) {
      return node.isRequisite() && !node.isRefQueryDependency() && node.getApplicationName() === node.getSchemaName();
    } else {
      return node.getChildren().every(isEmptyField);
    }
  }
  function canSubtractRoot(min, sub) {
    var minIdentifyingCall = min.getIdentifyingArg();
    var subIdentifyingCall = sub.getIdentifyingArg();
    return min.getFieldName() === sub.getFieldName() && areEqual(minIdentifyingCall, subIdentifyingCall);
  }
  function getMatchingRangeFields(node, subtrahend) {
    return subtrahend.getChildren().filter(function(child) {
      return child instanceof RelayQuery.Field && canSubtractField(node, child);
    });
  }
  function canSubtractField(minField, subField) {
    if (minField.getSchemaName() !== subField.getSchemaName()) {
      return false;
    }
    var minArgs = minField.getCallsWithValues();
    var subArgs = subField.getCallsWithValues();
    if (minArgs.length !== subArgs.length) {
      return false;
    }
    return minArgs.every(function(minArg, ii) {
      var subArg = subArgs[ii];
      if (subArg == null) {
        return false;
      }
      if (minArg.name !== subArg.name) {
        return false;
      }
      if (minArg.name === 'first' || minArg.name === 'last') {
        return parseInt('' + minArg.value, 10) <= parseInt('' + subArg.value, 10);
      }
      return areEqual(minArg.value, subArg.value);
    });
  }
  module.exports = RelayProfiler.instrument('subtractRelayQuery', subtractRelayQuery);
})(require('process'));
