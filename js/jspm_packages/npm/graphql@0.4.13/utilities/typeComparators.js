/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.isEqualType = isEqualType;
exports.isTypeSubTypeOf = isTypeSubTypeOf;
var _typeDefinition = require('../type/definition');
function isEqualType(_x, _x2) {
  var _again = true;
  _function: while (_again) {
    var typeA = _x,
        typeB = _x2;
    _again = false;
    if (typeA === typeB) {
      return true;
    }
    if (typeA instanceof _typeDefinition.GraphQLNonNull && typeB instanceof _typeDefinition.GraphQLNonNull) {
      _x = typeA.ofType;
      _x2 = typeB.ofType;
      _again = true;
      continue _function;
    }
    if (typeA instanceof _typeDefinition.GraphQLList && typeB instanceof _typeDefinition.GraphQLList) {
      _x = typeA.ofType;
      _x2 = typeB.ofType;
      _again = true;
      continue _function;
    }
    return false;
  }
}
function isTypeSubTypeOf(_x3, _x4) {
  var _again2 = true;
  _function2: while (_again2) {
    var maybeSubType = _x3,
        superType = _x4;
    _again2 = false;
    if (maybeSubType === superType) {
      return true;
    }
    if (superType instanceof _typeDefinition.GraphQLNonNull) {
      if (maybeSubType instanceof _typeDefinition.GraphQLNonNull) {
        _x3 = maybeSubType.ofType;
        _x4 = superType.ofType;
        _again2 = true;
        continue _function2;
      }
      return false;
    } else if (maybeSubType instanceof _typeDefinition.GraphQLNonNull) {
      _x3 = maybeSubType.ofType;
      _x4 = superType;
      _again2 = true;
      continue _function2;
    }
    if (superType instanceof _typeDefinition.GraphQLList) {
      if (maybeSubType instanceof _typeDefinition.GraphQLList) {
        _x3 = maybeSubType.ofType;
        _x4 = superType.ofType;
        _again2 = true;
        continue _function2;
      }
      return false;
    } else if (maybeSubType instanceof _typeDefinition.GraphQLList) {
      return false;
    }
    if ((0, _typeDefinition.isAbstractType)(superType) && maybeSubType instanceof _typeDefinition.GraphQLObjectType && superType.isPossibleType(maybeSubType)) {
      return true;
    }
    return false;
  }
}
