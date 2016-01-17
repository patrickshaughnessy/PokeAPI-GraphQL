/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var RelayMutationTransactionStatus = require('./RelayMutationTransactionStatus');
  var invariant = require('fbjs/lib/invariant');
  var RelayMutationTransaction = (function() {
    function RelayMutationTransaction(mutationQueue, id) {
      _classCallCheck(this, RelayMutationTransaction);
      this._id = id;
      this._mutationQueue = mutationQueue;
    }
    RelayMutationTransaction.prototype.commit = function commit() {
      var status = this.getStatus();
      !(status === RelayMutationTransactionStatus.UNCOMMITTED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + 'can be comitted.') : invariant(false) : undefined;
      this._mutationQueue.commit(this._id);
    };
    RelayMutationTransaction.prototype.recommit = function recommit() {
      var status = this.getStatus();
      !(status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationTransaction: Only transaction with status ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be comitted.') : invariant(false) : undefined;
      this._mutationQueue.commit(this._id);
    };
    RelayMutationTransaction.prototype.rollback = function rollback() {
      var status = this.getStatus();
      !(status === RelayMutationTransactionStatus.UNCOMMITTED || status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be rolledback.') : invariant(false) : undefined;
      this._mutationQueue.rollback(this._id);
    };
    RelayMutationTransaction.prototype.getError = function getError() {
      return this._mutationQueue.getError(this._id);
    };
    RelayMutationTransaction.prototype.getStatus = function getStatus() {
      return this._mutationQueue.getStatus(this._id);
    };
    return RelayMutationTransaction;
  })();
  module.exports = RelayMutationTransaction;
})(require('process'));
