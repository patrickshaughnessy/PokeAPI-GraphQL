/* */ 
(function(process) {
  'use strict';
  var Promise = require('fbjs/lib/Promise');
  'use strict';
  var invariant = require('fbjs/lib/invariant');
  var queue = [];
  var schedule;
  var running = false;
  var RelayTaskScheduler = {
    injectScheduler: function injectScheduler(injectedScheduler) {
      schedule = injectedScheduler;
    },
    await: function await() {
      for (var _len = arguments.length,
          callbacks = Array(_len),
          _key = 0; _key < _len; _key++) {
        callbacks[_key] = arguments[_key];
      }
      var promise = new Promise(function(resolve, reject) {
        var nextIndex = 0;
        var error = null;
        function enqueueNext(value) {
          if (error) {
            reject(error);
            return;
          }
          if (nextIndex >= callbacks.length) {
            resolve(value);
          } else {
            queue.push(function() {
              enqueueNext((function() {
                var nextCallback = callbacks[nextIndex++];
                try {
                  value = nextCallback(value);
                } catch (e) {
                  error = e;
                  value = undefined;
                }
                return value;
              })());
            });
          }
        }
        enqueueNext(undefined);
      });
      scheduleIfNecessary();
      return promise;
    }
  };
  function scheduleIfNecessary() {
    if (running) {
      return;
    }
    if (queue.length) {
      running = true;
      var executeTask = createTaskExecutor(queue.shift());
      if (schedule) {
        schedule(executeTask);
      } else {
        executeTask();
      }
    } else {
      running = false;
    }
  }
  function createTaskExecutor(callback) {
    var invoked = false;
    return function() {
      !!invoked ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayTaskScheduler: Tasks can only be executed once.') : invariant(false) : undefined;
      invoked = true;
      invokeWithinScopedQueue(callback);
      running = false;
      scheduleIfNecessary();
    };
  }
  function invokeWithinScopedQueue(callback) {
    var originalQueue = queue;
    queue = [];
    try {
      callback();
    } finally {
      Array.prototype.unshift.apply(originalQueue, queue);
      queue = originalQueue;
    }
  }
  module.exports = RelayTaskScheduler;
})(require('process'));
