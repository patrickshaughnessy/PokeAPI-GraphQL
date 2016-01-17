/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.isValidJSValue = isValidJSValue;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0,
        arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
var _typeDefinition = require('../type/definition');
function isValidJSValue(_x, _x2) {
  var _again = true;
  _function: while (_again) {
    var value = _x,
        type = _x2;
    ofType = itemType = fields = errors = _iteratorNormalCompletion = _didIteratorError = _iteratorError = _iteratorNormalCompletion2 = _didIteratorError2 = _iteratorError2 = parseResult = undefined;
    _again = false;
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var ofType = type.ofType;
      if ((0, _jsutilsIsNullish2['default'])(value)) {
        if (ofType.name) {
          return ['Expected "' + ofType.name + '!", found null.'];
        }
        return ['Expected non-null value, found null.'];
      }
      _x = value;
      _x2 = ofType;
      _again = true;
      continue _function;
    }
    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return [];
    }
    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (Array.isArray(value)) {
        return value.reduce(function(acc, item, index) {
          var errors = isValidJSValue(item, itemType);
          return acc.concat(errors.map(function(error) {
            return 'In element #' + index + ': ' + error;
          }));
        }, []);
      }
      _x = value;
      _x2 = itemType;
      _again = true;
      continue _function;
    }
    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      if (typeof value !== 'object') {
        return ['Expected "' + type.name + '", found not an object.'];
      }
      var fields = type.getFields();
      var errors = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = Object.keys(value)[Symbol.iterator](),
            _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var providedField = _step.value;
          if (!fields[providedField]) {
            errors.push('In field "${providedField}": Unknown field.');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;
      try {
        for (var _iterator2 = Object.keys(fields)[Symbol.iterator](),
            _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fieldName = _step2.value;
          var newErrors = isValidJSValue(value[fieldName], fields[fieldName].type);
          errors.push.apply(errors, _toConsumableArray(newErrors.map(function(error) {
            return 'In field "' + fieldName + '": ' + error;
          })));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
      return errors;
    }
    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLScalarType || type instanceof _typeDefinition.GraphQLEnumType, 'Must be input type');
    var parseResult = type.parseValue(value);
    if ((0, _jsutilsIsNullish2['default'])(parseResult)) {
      return ['Expected type "' + type.name + '", found ' + JSON.stringify(value) + '.'];
    }
    return [];
  }
}
