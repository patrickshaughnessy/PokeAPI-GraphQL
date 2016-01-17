/* */ 
(function(process) {
  'use strict';
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.parse = parse;
  exports.parseValue = parseValue;
  exports.parseConstValue = parseConstValue;
  exports.parseType = parseType;
  exports.parseNamedType = parseNamedType;
  var _source = require('./source');
  var _error = require('../error/index');
  var _lexer = require('./lexer');
  var _kinds = require('./kinds');
  function parse(source, options) {
    var sourceObj = source instanceof _source.Source ? source : new _source.Source(source);
    var parser = makeParser(sourceObj, options || {});
    return parseDocument(parser);
  }
  function parseValue(source, options) {
    var sourceObj = source instanceof _source.Source ? source : new _source.Source(source);
    var parser = makeParser(sourceObj, options || {});
    return parseValueLiteral(parser);
  }
  function parseName(parser) {
    var token = expect(parser, _lexer.TokenKind.NAME);
    return {
      kind: _kinds.NAME,
      value: token.value,
      loc: loc(parser, token.start)
    };
  }
  function parseDocument(parser) {
    var start = parser.token.start;
    var definitions = [];
    do {
      definitions.push(parseDefinition(parser));
    } while (!skip(parser, _lexer.TokenKind.EOF));
    return {
      kind: _kinds.DOCUMENT,
      definitions: definitions,
      loc: loc(parser, start)
    };
  }
  function parseDefinition(parser) {
    if (peek(parser, _lexer.TokenKind.BRACE_L)) {
      return parseOperationDefinition(parser);
    }
    if (peek(parser, _lexer.TokenKind.NAME)) {
      switch (parser.token.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return parseOperationDefinition(parser);
        case 'fragment':
          return parseFragmentDefinition(parser);
        case 'type':
        case 'interface':
        case 'union':
        case 'scalar':
        case 'enum':
        case 'input':
        case 'extend':
          return parseTypeDefinition(parser);
      }
    }
    throw unexpected(parser);
  }
  function parseOperationDefinition(parser) {
    var start = parser.token.start;
    if (peek(parser, _lexer.TokenKind.BRACE_L)) {
      return {
        kind: _kinds.OPERATION_DEFINITION,
        operation: 'query',
        name: null,
        variableDefinitions: null,
        directives: [],
        selectionSet: parseSelectionSet(parser),
        loc: loc(parser, start)
      };
    }
    var operationToken = expect(parser, _lexer.TokenKind.NAME);
    var operation = operationToken.value;
    var name;
    if (peek(parser, _lexer.TokenKind.NAME)) {
      name = parseName(parser);
    }
    return {
      kind: _kinds.OPERATION_DEFINITION,
      operation: operation,
      name: name,
      variableDefinitions: parseVariableDefinitions(parser),
      directives: parseDirectives(parser),
      selectionSet: parseSelectionSet(parser),
      loc: loc(parser, start)
    };
  }
  function parseVariableDefinitions(parser) {
    return peek(parser, _lexer.TokenKind.PAREN_L) ? many(parser, _lexer.TokenKind.PAREN_L, parseVariableDefinition, _lexer.TokenKind.PAREN_R) : [];
  }
  function parseVariableDefinition(parser) {
    var start = parser.token.start;
    return {
      kind: _kinds.VARIABLE_DEFINITION,
      variable: parseVariable(parser),
      type: (expect(parser, _lexer.TokenKind.COLON), parseType(parser)),
      defaultValue: skip(parser, _lexer.TokenKind.EQUALS) ? parseValueLiteral(parser, true) : null,
      loc: loc(parser, start)
    };
  }
  function parseVariable(parser) {
    var start = parser.token.start;
    expect(parser, _lexer.TokenKind.DOLLAR);
    return {
      kind: _kinds.VARIABLE,
      name: parseName(parser),
      loc: loc(parser, start)
    };
  }
  function parseSelectionSet(parser) {
    var start = parser.token.start;
    return {
      kind: _kinds.SELECTION_SET,
      selections: many(parser, _lexer.TokenKind.BRACE_L, parseSelection, _lexer.TokenKind.BRACE_R),
      loc: loc(parser, start)
    };
  }
  function parseSelection(parser) {
    return peek(parser, _lexer.TokenKind.SPREAD) ? parseFragment(parser) : parseField(parser);
  }
  function parseField(parser) {
    var start = parser.token.start;
    var nameOrAlias = parseName(parser);
    var alias;
    var name;
    if (skip(parser, _lexer.TokenKind.COLON)) {
      alias = nameOrAlias;
      name = parseName(parser);
    } else {
      alias = null;
      name = nameOrAlias;
    }
    return {
      kind: _kinds.FIELD,
      alias: alias,
      name: name,
      arguments: parseArguments(parser),
      directives: parseDirectives(parser),
      selectionSet: peek(parser, _lexer.TokenKind.BRACE_L) ? parseSelectionSet(parser) : null,
      loc: loc(parser, start)
    };
  }
  function parseArguments(parser) {
    return peek(parser, _lexer.TokenKind.PAREN_L) ? many(parser, _lexer.TokenKind.PAREN_L, parseArgument, _lexer.TokenKind.PAREN_R) : [];
  }
  function parseArgument(parser) {
    var start = parser.token.start;
    return {
      kind: _kinds.ARGUMENT,
      name: parseName(parser),
      value: (expect(parser, _lexer.TokenKind.COLON), parseValueLiteral(parser, false)),
      loc: loc(parser, start)
    };
  }
  function parseFragment(parser) {
    var start = parser.token.start;
    expect(parser, _lexer.TokenKind.SPREAD);
    if (peek(parser, _lexer.TokenKind.NAME) && parser.token.value !== 'on') {
      return {
        kind: _kinds.FRAGMENT_SPREAD,
        name: parseFragmentName(parser),
        directives: parseDirectives(parser),
        loc: loc(parser, start)
      };
    }
    var typeCondition = null;
    if (parser.token.value === 'on') {
      advance(parser);
      typeCondition = parseNamedType(parser);
    }
    return {
      kind: _kinds.INLINE_FRAGMENT,
      typeCondition: typeCondition,
      directives: parseDirectives(parser),
      selectionSet: parseSelectionSet(parser),
      loc: loc(parser, start)
    };
  }
  function parseFragmentDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'fragment');
    return {
      kind: _kinds.FRAGMENT_DEFINITION,
      name: parseFragmentName(parser),
      typeCondition: (expectKeyword(parser, 'on'), parseNamedType(parser)),
      directives: parseDirectives(parser),
      selectionSet: parseSelectionSet(parser),
      loc: loc(parser, start)
    };
  }
  function parseFragmentName(parser) {
    if (parser.token.value === 'on') {
      throw unexpected(parser);
    }
    return parseName(parser);
  }
  function parseValueLiteral(parser, isConst) {
    var token = parser.token;
    switch (token.kind) {
      case _lexer.TokenKind.BRACKET_L:
        return parseList(parser, isConst);
      case _lexer.TokenKind.BRACE_L:
        return parseObject(parser, isConst);
      case _lexer.TokenKind.INT:
        advance(parser);
        return {
          kind: _kinds.INT,
          value: token.value,
          loc: loc(parser, token.start)
        };
      case _lexer.TokenKind.FLOAT:
        advance(parser);
        return {
          kind: _kinds.FLOAT,
          value: token.value,
          loc: loc(parser, token.start)
        };
      case _lexer.TokenKind.STRING:
        advance(parser);
        return {
          kind: _kinds.STRING,
          value: token.value,
          loc: loc(parser, token.start)
        };
      case _lexer.TokenKind.NAME:
        if (token.value === 'true' || token.value === 'false') {
          advance(parser);
          return {
            kind: _kinds.BOOLEAN,
            value: token.value === 'true',
            loc: loc(parser, token.start)
          };
        } else if (token.value !== 'null') {
          advance(parser);
          return {
            kind: _kinds.ENUM,
            value: token.value,
            loc: loc(parser, token.start)
          };
        }
        break;
      case _lexer.TokenKind.DOLLAR:
        if (!isConst) {
          return parseVariable(parser);
        }
        break;
    }
    throw unexpected(parser);
  }
  function parseConstValue(parser) {
    return parseValueLiteral(parser, true);
  }
  function parseValueValue(parser) {
    return parseValueLiteral(parser, false);
  }
  function parseList(parser, isConst) {
    var start = parser.token.start;
    var item = isConst ? parseConstValue : parseValueValue;
    return {
      kind: _kinds.LIST,
      values: any(parser, _lexer.TokenKind.BRACKET_L, item, _lexer.TokenKind.BRACKET_R),
      loc: loc(parser, start)
    };
  }
  function parseObject(parser, isConst) {
    var start = parser.token.start;
    expect(parser, _lexer.TokenKind.BRACE_L);
    var fields = [];
    while (!skip(parser, _lexer.TokenKind.BRACE_R)) {
      fields.push(parseObjectField(parser, isConst));
    }
    return {
      kind: _kinds.OBJECT,
      fields: fields,
      loc: loc(parser, start)
    };
  }
  function parseObjectField(parser, isConst) {
    var start = parser.token.start;
    return {
      kind: _kinds.OBJECT_FIELD,
      name: parseName(parser),
      value: (expect(parser, _lexer.TokenKind.COLON), parseValueLiteral(parser, isConst)),
      loc: loc(parser, start)
    };
  }
  function parseDirectives(parser) {
    var directives = [];
    while (peek(parser, _lexer.TokenKind.AT)) {
      directives.push(parseDirective(parser));
    }
    return directives;
  }
  function parseDirective(parser) {
    var start = parser.token.start;
    expect(parser, _lexer.TokenKind.AT);
    return {
      kind: _kinds.DIRECTIVE,
      name: parseName(parser),
      arguments: parseArguments(parser),
      loc: loc(parser, start)
    };
  }
  function parseType(parser) {
    var start = parser.token.start;
    var type;
    if (skip(parser, _lexer.TokenKind.BRACKET_L)) {
      type = parseType(parser);
      expect(parser, _lexer.TokenKind.BRACKET_R);
      type = {
        kind: _kinds.LIST_TYPE,
        type: type,
        loc: loc(parser, start)
      };
    } else {
      type = parseNamedType(parser);
    }
    if (skip(parser, _lexer.TokenKind.BANG)) {
      return {
        kind: _kinds.NON_NULL_TYPE,
        type: type,
        loc: loc(parser, start)
      };
    }
    return type;
  }
  function parseNamedType(parser) {
    var start = parser.token.start;
    return {
      kind: _kinds.NAMED_TYPE,
      name: parseName(parser),
      loc: loc(parser, start)
    };
  }
  function parseTypeDefinition(parser) {
    if (!peek(parser, _lexer.TokenKind.NAME)) {
      throw unexpected(parser);
    }
    switch (parser.token.value) {
      case 'type':
        return parseObjectTypeDefinition(parser);
      case 'interface':
        return parseInterfaceTypeDefinition(parser);
      case 'union':
        return parseUnionTypeDefinition(parser);
      case 'scalar':
        return parseScalarTypeDefinition(parser);
      case 'enum':
        return parseEnumTypeDefinition(parser);
      case 'input':
        return parseInputObjectTypeDefinition(parser);
      case 'extend':
        return parseTypeExtensionDefinition(parser);
      default:
        throw unexpected(parser);
    }
  }
  function parseObjectTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'type');
    var name = parseName(parser);
    var interfaces = parseImplementsInterfaces(parser);
    var fields = any(parser, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
    return {
      kind: _kinds.OBJECT_TYPE_DEFINITION,
      name: name,
      interfaces: interfaces,
      fields: fields,
      loc: loc(parser, start)
    };
  }
  function parseImplementsInterfaces(parser) {
    var types = [];
    if (parser.token.value === 'implements') {
      advance(parser);
      do {
        types.push(parseNamedType(parser));
      } while (!peek(parser, _lexer.TokenKind.BRACE_L));
    }
    return types;
  }
  function parseFieldDefinition(parser) {
    var start = parser.token.start;
    var name = parseName(parser);
    var args = parseArgumentDefs(parser);
    expect(parser, _lexer.TokenKind.COLON);
    var type = parseType(parser);
    return {
      kind: _kinds.FIELD_DEFINITION,
      name: name,
      arguments: args,
      type: type,
      loc: loc(parser, start)
    };
  }
  function parseArgumentDefs(parser) {
    if (!peek(parser, _lexer.TokenKind.PAREN_L)) {
      return [];
    }
    return many(parser, _lexer.TokenKind.PAREN_L, parseInputValueDef, _lexer.TokenKind.PAREN_R);
  }
  function parseInputValueDef(parser) {
    var start = parser.token.start;
    var name = parseName(parser);
    expect(parser, _lexer.TokenKind.COLON);
    var type = parseType(parser);
    var defaultValue = null;
    if (skip(parser, _lexer.TokenKind.EQUALS)) {
      defaultValue = parseConstValue(parser);
    }
    return {
      kind: _kinds.INPUT_VALUE_DEFINITION,
      name: name,
      type: type,
      defaultValue: defaultValue,
      loc: loc(parser, start)
    };
  }
  function parseInterfaceTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'interface');
    var name = parseName(parser);
    var fields = any(parser, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
    return {
      kind: _kinds.INTERFACE_TYPE_DEFINITION,
      name: name,
      fields: fields,
      loc: loc(parser, start)
    };
  }
  function parseUnionTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'union');
    var name = parseName(parser);
    expect(parser, _lexer.TokenKind.EQUALS);
    var types = parseUnionMembers(parser);
    return {
      kind: _kinds.UNION_TYPE_DEFINITION,
      name: name,
      types: types,
      loc: loc(parser, start)
    };
  }
  function parseUnionMembers(parser) {
    var members = [];
    do {
      members.push(parseNamedType(parser));
    } while (skip(parser, _lexer.TokenKind.PIPE));
    return members;
  }
  function parseScalarTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'scalar');
    var name = parseName(parser);
    return {
      kind: _kinds.SCALAR_TYPE_DEFINITION,
      name: name,
      loc: loc(parser, start)
    };
  }
  function parseEnumTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'enum');
    var name = parseName(parser);
    var values = many(parser, _lexer.TokenKind.BRACE_L, parseEnumValueDefinition, _lexer.TokenKind.BRACE_R);
    return {
      kind: _kinds.ENUM_TYPE_DEFINITION,
      name: name,
      values: values,
      loc: loc(parser, start)
    };
  }
  function parseEnumValueDefinition(parser) {
    var start = parser.token.start;
    var name = parseName(parser);
    return {
      kind: _kinds.ENUM_VALUE_DEFINITION,
      name: name,
      loc: loc(parser, start)
    };
  }
  function parseInputObjectTypeDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'input');
    var name = parseName(parser);
    var fields = any(parser, _lexer.TokenKind.BRACE_L, parseInputValueDef, _lexer.TokenKind.BRACE_R);
    return {
      kind: _kinds.INPUT_OBJECT_TYPE_DEFINITION,
      name: name,
      fields: fields,
      loc: loc(parser, start)
    };
  }
  function parseTypeExtensionDefinition(parser) {
    var start = parser.token.start;
    expectKeyword(parser, 'extend');
    var definition = parseObjectTypeDefinition(parser);
    return {
      kind: _kinds.TYPE_EXTENSION_DEFINITION,
      definition: definition,
      loc: loc(parser, start)
    };
  }
  function makeParser(source, options) {
    var _lexToken = (0, _lexer.lex)(source);
    return {
      _lexToken: _lexToken,
      source: source,
      options: options,
      prevEnd: 0,
      token: _lexToken()
    };
  }
  function loc(parser, start) {
    if (parser.options.noLocation) {
      return null;
    }
    if (parser.options.noSource) {
      return {
        start: start,
        end: parser.prevEnd
      };
    }
    return {
      start: start,
      end: parser.prevEnd,
      source: parser.source
    };
  }
  function advance(parser) {
    var prevEnd = parser.token.end;
    parser.prevEnd = prevEnd;
    parser.token = parser._lexToken(prevEnd);
  }
  function peek(parser, kind) {
    return parser.token.kind === kind;
  }
  function skip(parser, kind) {
    var match = parser.token.kind === kind;
    if (match) {
      advance(parser);
    }
    return match;
  }
  function expect(parser, kind) {
    var token = parser.token;
    if (token.kind === kind) {
      advance(parser);
      return token;
    }
    throw (0, _error.syntaxError)(parser.source, token.start, 'Expected ' + (0, _lexer.getTokenKindDesc)(kind) + ', found ' + (0, _lexer.getTokenDesc)(token));
  }
  function expectKeyword(parser, value) {
    var token = parser.token;
    if (token.kind === _lexer.TokenKind.NAME && token.value === value) {
      advance(parser);
      return token;
    }
    throw (0, _error.syntaxError)(parser.source, token.start, 'Expected "' + value + '", found ' + (0, _lexer.getTokenDesc)(token));
  }
  function unexpected(parser, atToken) {
    var token = atToken || parser.token;
    return (0, _error.syntaxError)(parser.source, token.start, 'Unexpected ' + (0, _lexer.getTokenDesc)(token));
  }
  function any(parser, openKind, parseFn, closeKind) {
    expect(parser, openKind);
    var nodes = [];
    while (!skip(parser, closeKind)) {
      nodes.push(parseFn(parser));
    }
    return nodes;
  }
  function many(parser, openKind, parseFn, closeKind) {
    expect(parser, openKind);
    var nodes = [parseFn(parser)];
    while (!skip(parser, closeKind)) {
      nodes.push(parseFn(parser));
    }
    return nodes;
  }
})(require('process'));
