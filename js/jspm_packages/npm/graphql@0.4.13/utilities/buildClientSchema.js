/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.buildClientSchema = buildClientSchema;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsKeyMap = require('../jsutils/keyMap');
var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);
var _jsutilsKeyValMap = require('../jsutils/keyValMap');
var _jsutilsKeyValMap2 = _interopRequireDefault(_jsutilsKeyValMap);
var _valueFromAST = require('./valueFromAST');
var _languageParser = require('../language/parser');
var _typeSchema = require('../type/schema');
var _typeDefinition = require('../type/definition');
var _typeScalars = require('../type/scalars');
var _typeDirectives = require('../type/directives');
var _typeIntrospection = require('../type/introspection');
function buildClientSchema(introspection) {
  var schemaIntrospection = introspection.__schema;
  var typeIntrospectionMap = (0, _jsutilsKeyMap2['default'])(schemaIntrospection.types, function(type) {
    return type.name;
  });
  var typeDefCache = {
    String: _typeScalars.GraphQLString,
    Int: _typeScalars.GraphQLInt,
    Float: _typeScalars.GraphQLFloat,
    Boolean: _typeScalars.GraphQLBoolean,
    ID: _typeScalars.GraphQLID
  };
  function getType(typeRef) {
    if (typeRef.kind === _typeIntrospection.TypeKind.LIST) {
      var itemRef = typeRef.ofType;
      if (!itemRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      return new _typeDefinition.GraphQLList(getType(itemRef));
    }
    if (typeRef.kind === _typeIntrospection.TypeKind.NON_NULL) {
      var nullableRef = typeRef.ofType;
      if (!nullableRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      var nullableType = getType(nullableRef);
      return new _typeDefinition.GraphQLNonNull(nullableType);
    }
    return getNamedType(typeRef.name);
  }
  function getNamedType(typeName) {
    if (typeDefCache[typeName]) {
      return typeDefCache[typeName];
    }
    var typeIntrospection = typeIntrospectionMap[typeName];
    if (!typeIntrospection) {
      throw new Error('Invalid or incomplete schema, unknown type: ' + typeName + '. Ensure ' + 'that a full introspection query is used in order to build a ' + 'client schema.');
    }
    var typeDef = buildType(typeIntrospection);
    typeDefCache[typeName] = typeDef;
    return typeDef;
  }
  function getInputType(typeRef) {
    var type = getType(typeRef);
    (0, _jsutilsInvariant2['default'])((0, _typeDefinition.isInputType)(type), 'Introspection must provide input type for arguments.');
    return type;
  }
  function getOutputType(typeRef) {
    var type = getType(typeRef);
    (0, _jsutilsInvariant2['default'])((0, _typeDefinition.isOutputType)(type), 'Introspection must provide output type for fields.');
    return type;
  }
  function getObjectType(typeRef) {
    var type = getType(typeRef);
    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLObjectType, 'Introspection must provide object type for possibleTypes.');
    return type;
  }
  function getInterfaceType(typeRef) {
    var type = getType(typeRef);
    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLInterfaceType, 'Introspection must provide interface type for interfaces.');
    return type;
  }
  function buildType(type) {
    switch (type.kind) {
      case _typeIntrospection.TypeKind.SCALAR:
        return buildScalarDef(type);
      case _typeIntrospection.TypeKind.OBJECT:
        return buildObjectDef(type);
      case _typeIntrospection.TypeKind.INTERFACE:
        return buildInterfaceDef(type);
      case _typeIntrospection.TypeKind.UNION:
        return buildUnionDef(type);
      case _typeIntrospection.TypeKind.ENUM:
        return buildEnumDef(type);
      case _typeIntrospection.TypeKind.INPUT_OBJECT:
        return buildInputObjectDef(type);
      default:
        throw new Error('Invalid or incomplete schema, unknown kind: ' + type.kind + '. Ensure ' + 'that a full introspection query is used in order to build a ' + 'client schema.');
    }
  }
  function buildScalarDef(scalarIntrospection) {
    return new _typeDefinition.GraphQLScalarType({
      name: scalarIntrospection.name,
      description: scalarIntrospection.description,
      serialize: function serialize() {
        return null;
      },
      parseValue: function parseValue() {
        return false;
      },
      parseLiteral: function parseLiteral() {
        return false;
      }
    });
  }
  function buildObjectDef(objectIntrospection) {
    return new _typeDefinition.GraphQLObjectType({
      name: objectIntrospection.name,
      description: objectIntrospection.description,
      interfaces: objectIntrospection.interfaces.map(getInterfaceType),
      fields: function fields() {
        return buildFieldDefMap(objectIntrospection);
      }
    });
  }
  function buildInterfaceDef(interfaceIntrospection) {
    return new _typeDefinition.GraphQLInterfaceType({
      name: interfaceIntrospection.name,
      description: interfaceIntrospection.description,
      fields: function fields() {
        return buildFieldDefMap(interfaceIntrospection);
      },
      resolveType: function resolveType() {
        throw new Error('Client Schema cannot be used for execution.');
      }
    });
  }
  function buildUnionDef(unionIntrospection) {
    return new _typeDefinition.GraphQLUnionType({
      name: unionIntrospection.name,
      description: unionIntrospection.description,
      types: unionIntrospection.possibleTypes.map(getObjectType),
      resolveType: function resolveType() {
        throw new Error('Client Schema cannot be used for execution.');
      }
    });
  }
  function buildEnumDef(enumIntrospection) {
    return new _typeDefinition.GraphQLEnumType({
      name: enumIntrospection.name,
      description: enumIntrospection.description,
      values: (0, _jsutilsKeyValMap2['default'])(enumIntrospection.enumValues, function(valueIntrospection) {
        return valueIntrospection.name;
      }, function(valueIntrospection) {
        return {
          description: valueIntrospection.description,
          deprecationReason: valueIntrospection.deprecationReason
        };
      })
    });
  }
  function buildInputObjectDef(inputObjectIntrospection) {
    return new _typeDefinition.GraphQLInputObjectType({
      name: inputObjectIntrospection.name,
      description: inputObjectIntrospection.description,
      fields: function fields() {
        return buildInputValueDefMap(inputObjectIntrospection.inputFields);
      }
    });
  }
  function buildFieldDefMap(typeIntrospection) {
    return (0, _jsutilsKeyValMap2['default'])(typeIntrospection.fields, function(fieldIntrospection) {
      return fieldIntrospection.name;
    }, function(fieldIntrospection) {
      return {
        description: fieldIntrospection.description,
        deprecationReason: fieldIntrospection.deprecationReason,
        type: getOutputType(fieldIntrospection.type),
        args: buildInputValueDefMap(fieldIntrospection.args),
        resolve: function resolve() {
          throw new Error('Client Schema cannot be used for execution.');
        }
      };
    });
  }
  function buildInputValueDefMap(inputValueIntrospections) {
    return (0, _jsutilsKeyValMap2['default'])(inputValueIntrospections, function(inputValue) {
      return inputValue.name;
    }, buildInputValue);
  }
  function buildInputValue(inputValueIntrospection) {
    var type = getInputType(inputValueIntrospection.type);
    var defaultValue = inputValueIntrospection.defaultValue ? (0, _valueFromAST.valueFromAST)((0, _languageParser.parseValue)(inputValueIntrospection.defaultValue), type) : null;
    return {
      name: inputValueIntrospection.name,
      description: inputValueIntrospection.description,
      type: type,
      defaultValue: defaultValue
    };
  }
  function buildDirective(directiveIntrospection) {
    return new _typeDirectives.GraphQLDirective({
      name: directiveIntrospection.name,
      description: directiveIntrospection.description,
      args: directiveIntrospection.args.map(buildInputValue),
      onOperation: directiveIntrospection.onOperation,
      onFragment: directiveIntrospection.onFragment,
      onField: directiveIntrospection.onField
    });
  }
  schemaIntrospection.types.forEach(function(typeIntrospection) {
    return getNamedType(typeIntrospection.name);
  });
  var queryType = getObjectType(schemaIntrospection.queryType);
  var mutationType = schemaIntrospection.mutationType ? getObjectType(schemaIntrospection.mutationType) : null;
  var subscriptionType = schemaIntrospection.subscriptionType ? getObjectType(schemaIntrospection.subscriptionType) : null;
  var directives = schemaIntrospection.directives ? schemaIntrospection.directives.map(buildDirective) : [];
  return new _typeSchema.GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    subscription: subscriptionType,
    directives: directives
  });
}
