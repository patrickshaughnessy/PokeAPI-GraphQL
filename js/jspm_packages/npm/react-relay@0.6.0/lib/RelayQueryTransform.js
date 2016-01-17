/* */ 
(function(process) {
  'use strict';
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var RelayQueryVisitor = require('./RelayQueryVisitor');
  var RelayQueryTransform = (function(_RelayQueryVisitor) {
    _inherits(RelayQueryTransform, _RelayQueryVisitor);
    function RelayQueryTransform() {
      _classCallCheck(this, RelayQueryTransform);
      _RelayQueryVisitor.apply(this, arguments);
    }
    RelayQueryTransform.prototype.traverse = function traverse(node, nextState) {
      if (node.isScalar()) {
        return node;
      }
      var nextChildren;
      var children = node.getChildren();
      for (var ii = 0; ii < children.length; ii++) {
        var prevChild = children[ii];
        var nextChild = this.visit(prevChild, nextState);
        if (nextChild !== prevChild) {
          nextChildren = nextChildren || children.slice(0, ii);
        }
        if (nextChildren && nextChild) {
          nextChildren.push(nextChild);
        }
      }
      if (nextChildren) {
        if (!nextChildren.length) {
          return null;
        }
        return node.clone(nextChildren);
      }
      return node;
    };
    return RelayQueryTransform;
  })(RelayQueryVisitor);
  module.exports = RelayQueryTransform;
})(require('process'));
