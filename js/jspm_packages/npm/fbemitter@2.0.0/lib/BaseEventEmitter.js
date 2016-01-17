/* */ 
(function(process) {
  'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var EmitterSubscription = require('./EmitterSubscription');
  var EventSubscriptionVendor = require('./EventSubscriptionVendor');
  var emptyFunction = require('fbjs/lib/emptyFunction');
  var invariant = require('fbjs/lib/invariant');
  var BaseEventEmitter = (function() {
    function BaseEventEmitter() {
      _classCallCheck(this, BaseEventEmitter);
      this._subscriber = new EventSubscriptionVendor();
      this._currentSubscription = null;
    }
    BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
      return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
    };
    BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
      var emitter = this;
      return this.addListener(eventType, function() {
        emitter.removeCurrentListener();
        listener.apply(context, arguments);
      });
    };
    BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
      this._subscriber.removeAllSubscriptions(eventType);
    };
    BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
      !!!this._currentSubscription ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : invariant(false) : undefined;
      this._subscriber.removeSubscription(this._currentSubscription);
    };
    BaseEventEmitter.prototype.listeners = function listeners(eventType) {
      var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
      return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function(subscription) {
        return subscription.listener;
      }) : [];
    };
    BaseEventEmitter.prototype.emit = function emit(eventType) {
      var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
      if (subscriptions) {
        var keys = Object.keys(subscriptions);
        for (var ii = 0; ii < keys.length; ii++) {
          var key = keys[ii];
          var subscription = subscriptions[key];
          if (subscription) {
            this._currentSubscription = subscription;
            this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
          }
        }
        this._currentSubscription = null;
      }
    };
    BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
      var args = Array.prototype.slice.call(arguments, 2);
      subscription.listener.apply(subscription.context, args);
    };
    return BaseEventEmitter;
  })();
  module.exports = BaseEventEmitter;
})(require('process'));
