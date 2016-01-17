/* */ 
(function(process) {
  'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var invariant = require('fbjs/lib/invariant');
  var EventSubscriptionVendor = (function() {
    function EventSubscriptionVendor() {
      _classCallCheck(this, EventSubscriptionVendor);
      this._subscriptionsForType = {};
      this._currentSubscription = null;
    }
    EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
      !(subscription.subscriber === this) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : invariant(false) : undefined;
      if (!this._subscriptionsForType[eventType]) {
        this._subscriptionsForType[eventType] = [];
      }
      var key = this._subscriptionsForType[eventType].length;
      this._subscriptionsForType[eventType].push(subscription);
      subscription.eventType = eventType;
      subscription.key = key;
      return subscription;
    };
    EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
      if (eventType === undefined) {
        this._subscriptionsForType = {};
      } else {
        delete this._subscriptionsForType[eventType];
      }
    };
    EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
      var eventType = subscription.eventType;
      var key = subscription.key;
      var subscriptionsForType = this._subscriptionsForType[eventType];
      if (subscriptionsForType) {
        delete subscriptionsForType[key];
      }
    };
    EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
      return this._subscriptionsForType[eventType];
    };
    return EventSubscriptionVendor;
  })();
  module.exports = EventSubscriptionVendor;
})(require('process'));
