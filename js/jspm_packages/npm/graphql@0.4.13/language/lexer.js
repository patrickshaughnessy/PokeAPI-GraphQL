/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.lex = lex;
exports.getTokenDesc = getTokenDesc;
exports.getTokenKindDesc = getTokenKindDesc;
var _error = require('../error/index');
function lex(source) {
  var prevPosition = 0;
  return function nextToken(resetPosition) {
    var token = readToken(source, resetPosition === undefined ? prevPosition : resetPosition);
    prevPosition = token.end;
    return token;
  };
}
var TokenKind = {
  EOF: 1,
  BANG: 2,
  DOLLAR: 3,
  PAREN_L: 4,
  PAREN_R: 5,
  SPREAD: 6,
  COLON: 7,
  EQUALS: 8,
  AT: 9,
  BRACKET_L: 10,
  BRACKET_R: 11,
  BRACE_L: 12,
  PIPE: 13,
  BRACE_R: 14,
  NAME: 15,
  VARIABLE: 16,
  INT: 17,
  FLOAT: 18,
  STRING: 19
};
exports.TokenKind = TokenKind;
function getTokenDesc(token) {
  return token.value ? getTokenKindDesc(token.kind) + ' "' + token.value + '"' : getTokenKindDesc(token.kind);
}
function getTokenKindDesc(kind) {
  return tokenDescription[kind];
}
var tokenDescription = {};
tokenDescription[TokenKind.EOF] = 'EOF';
tokenDescription[TokenKind.BANG] = '!';
tokenDescription[TokenKind.DOLLAR] = '$';
tokenDescription[TokenKind.PAREN_L] = '(';
tokenDescription[TokenKind.PAREN_R] = ')';
tokenDescription[TokenKind.SPREAD] = '...';
tokenDescription[TokenKind.COLON] = ':';
tokenDescription[TokenKind.EQUALS] = '=';
tokenDescription[TokenKind.AT] = '@';
tokenDescription[TokenKind.BRACKET_L] = '[';
tokenDescription[TokenKind.BRACKET_R] = ']';
tokenDescription[TokenKind.BRACE_L] = '{';
tokenDescription[TokenKind.PIPE] = '|';
tokenDescription[TokenKind.BRACE_R] = '}';
tokenDescription[TokenKind.NAME] = 'Name';
tokenDescription[TokenKind.VARIABLE] = 'Variable';
tokenDescription[TokenKind.INT] = 'Int';
tokenDescription[TokenKind.FLOAT] = 'Float';
tokenDescription[TokenKind.STRING] = 'String';
var charCodeAt = String.prototype.charCodeAt;
var slice = String.prototype.slice;
function makeToken(kind, start, end, value) {
  return {
    kind: kind,
    start: start,
    end: end,
    value: value
  };
}
function printCharCode(code) {
  return (isNaN(code) ? '<EOF>' : code < 0x007F ? JSON.stringify(String.fromCharCode(code)) : '"\\u' + ('00' + code.toString(16).toUpperCase()).slice(-4) + '"');
}
function readToken(source, fromPosition) {
  var body = source.body;
  var bodyLength = body.length;
  var position = positionAfterWhitespace(body, fromPosition);
  if (position >= bodyLength) {
    return makeToken(TokenKind.EOF, position, position);
  }
  var code = charCodeAt.call(body, position);
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000A && code !== 0x000D) {
    throw (0, _error.syntaxError)(source, position, 'Invalid character ' + printCharCode(code) + '.');
  }
  switch (code) {
    case 33:
      return makeToken(TokenKind.BANG, position, position + 1);
    case 36:
      return makeToken(TokenKind.DOLLAR, position, position + 1);
    case 40:
      return makeToken(TokenKind.PAREN_L, position, position + 1);
    case 41:
      return makeToken(TokenKind.PAREN_R, position, position + 1);
    case 46:
      if (charCodeAt.call(body, position + 1) === 46 && charCodeAt.call(body, position + 2) === 46) {
        return makeToken(TokenKind.SPREAD, position, position + 3);
      }
      break;
    case 58:
      return makeToken(TokenKind.COLON, position, position + 1);
    case 61:
      return makeToken(TokenKind.EQUALS, position, position + 1);
    case 64:
      return makeToken(TokenKind.AT, position, position + 1);
    case 91:
      return makeToken(TokenKind.BRACKET_L, position, position + 1);
    case 93:
      return makeToken(TokenKind.BRACKET_R, position, position + 1);
    case 123:
      return makeToken(TokenKind.BRACE_L, position, position + 1);
    case 124:
      return makeToken(TokenKind.PIPE, position, position + 1);
    case 125:
      return makeToken(TokenKind.BRACE_R, position, position + 1);
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
    case 85:
    case 86:
    case 87:
    case 88:
    case 89:
    case 90:
    case 95:
    case 97:
    case 98:
    case 99:
    case 100:
    case 101:
    case 102:
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
    case 108:
    case 109:
    case 110:
    case 111:
    case 112:
    case 113:
    case 114:
    case 115:
    case 116:
    case 117:
    case 118:
    case 119:
    case 120:
    case 121:
    case 122:
      return readName(source, position);
    case 45:
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return readNumber(source, position, code);
    case 34:
      return readString(source, position);
  }
  throw (0, _error.syntaxError)(source, position, 'Unexpected character ' + printCharCode(code) + '.');
}
function positionAfterWhitespace(body, startPosition) {
  var bodyLength = body.length;
  var position = startPosition;
  while (position < bodyLength) {
    var code = charCodeAt.call(body, position);
    if (code === 0xFEFF || code === 0x0009 || code === 0x0020 || code === 0x000A || code === 0x000D || code === 0x002C) {
      ++position;
    } else if (code === 35) {
      ++position;
      while (position < bodyLength && (code = charCodeAt.call(body, position)) !== null && (code > 0x001F || code === 0x0009) && code !== 0x000A && code !== 0x000D) {
        ++position;
      }
    } else {
      break;
    }
  }
  return position;
}
function readNumber(source, start, firstCode) {
  var code = firstCode;
  var body = source.body;
  var position = start;
  var isFloat = false;
  if (code === 45) {
    code = charCodeAt.call(body, ++position);
  }
  if (code === 48) {
    code = charCodeAt.call(body, ++position);
    if (code >= 48 && code <= 57) {
      throw (0, _error.syntaxError)(source, position, 'Invalid number, unexpected digit after 0: ' + printCharCode(code) + '.');
    }
  } else {
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }
  if (code === 46) {
    isFloat = true;
    code = charCodeAt.call(body, ++position);
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = charCodeAt.call(body, ++position);
    if (code === 43 || code === 45) {
      code = charCodeAt.call(body, ++position);
    }
    position = readDigits(source, position, code);
  }
  return makeToken(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, slice.call(body, start, position));
}
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    do {
      code = charCodeAt.call(body, ++position);
    } while (code >= 48 && code <= 57);
    return position;
  }
  throw (0, _error.syntaxError)(source, position, 'Invalid number, expected digit but got: ' + printCharCode(code) + '.');
}
function readString(source, start) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';
  while (position < body.length && (code = charCodeAt.call(body, position)) !== null && code !== 0x000A && code !== 0x000D && code !== 34) {
    if (code < 0x0020 && code !== 0x0009) {
      throw (0, _error.syntaxError)(source, position, 'Invalid character within String: ' + printCharCode(code) + '.');
    }
    ++position;
    if (code === 92) {
      value += slice.call(body, chunkStart, position - 1);
      code = charCodeAt.call(body, position);
      switch (code) {
        case 34:
          value += '"';
          break;
        case 47:
          value += '\/';
          break;
        case 92:
          value += '\\';
          break;
        case 98:
          value += '\b';
          break;
        case 102:
          value += '\f';
          break;
        case 110:
          value += '\n';
          break;
        case 114:
          value += '\r';
          break;
        case 116:
          value += '\t';
          break;
        case 117:
          var charCode = uniCharCode(charCodeAt.call(body, position + 1), charCodeAt.call(body, position + 2), charCodeAt.call(body, position + 3), charCodeAt.call(body, position + 4));
          if (charCode < 0) {
            throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: ' + ('\\u' + body.slice(position + 1, position + 5) + '.'));
          }
          value += String.fromCharCode(charCode);
          position += 4;
          break;
        default:
          throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: \\' + String.fromCharCode(code) + '.');
      }
      ++position;
      chunkStart = position;
    }
  }
  if (code !== 34) {
    throw (0, _error.syntaxError)(source, position, 'Unterminated string.');
  }
  value += slice.call(body, chunkStart, position);
  return makeToken(TokenKind.STRING, start, position + 1, value);
}
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : a >= 65 && a <= 70 ? a - 55 : a >= 97 && a <= 102 ? a - 87 : -1;
}
function readName(source, position) {
  var body = source.body;
  var bodyLength = body.length;
  var end = position + 1;
  var code = 0;
  while (end !== bodyLength && (code = charCodeAt.call(body, end)) !== null && (code === 95 || code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122)) {
    ++end;
  }
  return makeToken(TokenKind.NAME, position, end, slice.call(body, position, end));
}
