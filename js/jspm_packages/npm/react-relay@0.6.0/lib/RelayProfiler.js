/* */ 
(function(process) {
  'use strict';
  var emptyFunction = require('fbjs/lib/emptyFunction');
  var forEachObject = require('fbjs/lib/forEachObject');
  var removeFromArray = require('fbjs/lib/removeFromArray');
  var aggregateHandlersByName = {};
  var profileHandlersByName = {'*': []};
  var NOT_INVOKED = {};
  var defaultProfiler = {stop: emptyFunction};
  var shouldInstrument = function shouldInstrument(name) {
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return name.charAt(0) !== '@';
  };
  var RelayProfiler = {
    instrumentMethods: function instrumentMethods(object, names) {
      forEachObject(names, function(name, key) {
        object[key] = RelayProfiler.instrument(name, object[key]);
      });
    },
    instrument: function instrument(name, originalFunction) {
      if (!shouldInstrument(name)) {
        originalFunction.attachHandler = emptyFunction;
        originalFunction.detachHandler = emptyFunction;
        return originalFunction;
      }
      if (!aggregateHandlersByName.hasOwnProperty(name)) {
        aggregateHandlersByName[name] = [];
      }
      var aggregateHandlers = aggregateHandlersByName[name];
      var handlers = [];
      var contexts = [];
      var invokeHandlers = function invokeHandlers() {
        var context = contexts[contexts.length - 1];
        if (context[0]) {
          context[0]--;
          aggregateHandlers[context[0]](name, invokeHandlers);
        } else if (context[1]) {
          context[1]--;
          handlers[context[1]](name, invokeHandlers);
        } else {
          context[4] = originalFunction.apply(context[2], context[3]);
        }
      };
      var instrumentedCallback = function instrumentedCallback() {
        var returnValue = undefined;
        if (aggregateHandlers.length === 0 && handlers.length === 0) {
          returnValue = originalFunction.apply(this, arguments);
        } else {
          contexts.push([aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
          invokeHandlers();
          var context = contexts.pop();
          returnValue = context[4];
          if (returnValue === NOT_INVOKED) {
            throw new Error('RelayProfiler: Handler did not invoke original function.');
          }
        }
        return returnValue;
      };
      instrumentedCallback.attachHandler = function(handler) {
        handlers.push(handler);
      };
      instrumentedCallback.detachHandler = function(handler) {
        removeFromArray(handlers, handler);
      };
      instrumentedCallback.displayName = '(instrumented ' + name + ')';
      return instrumentedCallback;
    },
    attachAggregateHandler: function attachAggregateHandler(name, handler) {
      if (shouldInstrument(name)) {
        if (!aggregateHandlersByName.hasOwnProperty(name)) {
          aggregateHandlersByName[name] = [];
        }
        aggregateHandlersByName[name].push(handler);
      }
    },
    detachAggregateHandler: function detachAggregateHandler(name, handler) {
      if (shouldInstrument(name)) {
        if (aggregateHandlersByName.hasOwnProperty(name)) {
          removeFromArray(aggregateHandlersByName[name], handler);
        }
      }
    },
    profile: function profile(name, state) {
      var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
      var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
      if (hasNamedHandlers || hasCatchAllHandlers) {
        var _ret = (function() {
          var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
          var stopHandlers = undefined;
          for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
            var profileHandler = profileHandlers[ii];
            var stopHandler = profileHandler(name, state);
            stopHandlers = stopHandlers || [];
            stopHandlers.unshift(stopHandler);
          }
          return {v: {stop: function stop() {
                if (stopHandlers) {
                  stopHandlers.forEach(function(stopHandler) {
                    return stopHandler();
                  });
                }
              }}};
        })();
        if (typeof _ret === 'object')
          return _ret.v;
      }
      return defaultProfiler;
    },
    attachProfileHandler: function attachProfileHandler(name, handler) {
      if (shouldInstrument(name)) {
        if (!profileHandlersByName.hasOwnProperty(name)) {
          profileHandlersByName[name] = [];
        }
        profileHandlersByName[name].push(handler);
      }
    },
    detachProfileHandler: function detachProfileHandler(name, handler) {
      if (shouldInstrument(name)) {
        if (profileHandlersByName.hasOwnProperty(name)) {
          removeFromArray(profileHandlersByName[name], handler);
        }
      }
    }
  };
  module.exports = RelayProfiler;
})(require('process'));
