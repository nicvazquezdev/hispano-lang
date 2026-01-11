/**
 * Tokenizer for HispanoLang
 * Converts source code into tokens for the parser
 */

class Tokenizer {
  constructor() {
    this.source = "";
    this.tokens = [];
    this.current = 0;
    this.startPos = 0;
    this.currentLine = 1;
  }

  /**
   * Tokenizes source code and returns a list of tokens
   * @param {string} source - Source code to tokenize
   * @returns {Array} List of tokens
   */
  tokenize(source) {
    this.source = source;
    this.tokens = [];
    this.current = 0;

    while (!this.isAtEnd()) {
      this.scanToken();
    }

    this.tokens.push({
      type: "EOF",
      lexeme: "",
      literal: null,
      line: this.currentLine,
    });
    return this.tokens;
  }

  /**
   * Scans the next token
   */
  scanToken() {
    this.startPos = this.current;

    // Check for comments before advancing
    if (
      this.source[this.current] === "/" &&
      this.source[this.current + 1] === "/"
    ) {
      this.comment();
      return;
    }

    const char = this.advance();

    switch (char) {
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace
        break;

      case "\n":
        this.currentLine++;
        break;

      case "=":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("EQUAL_EQUAL");
        } else {
          this.addToken("EQUAL");
        }
        break;

      case "*":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("STAR_EQUAL");
        } else {
          this.addToken("STAR");
        }
        break;

      case "/":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("SLASH_EQUAL");
        } else {
          this.addToken("SLASH");
        }
        break;

      case "%":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("PERCENT_EQUAL");
        } else {
          this.addToken("PERCENT");
        }
        break;

      case ">":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("GREATER_EQUAL");
        } else {
          this.addToken("GREATER");
        }
        break;

      case "<":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("LESS_EQUAL");
        } else {
          this.addToken("LESS");
        }
        break;

      case "!":
        if (this.peek() === "=") {
          this.advance();
          this.addToken("BANG_EQUAL");
        } else {
          this.addToken("BANG");
        }
        break;

      case "+":
        if (this.peek() === "+") {
          this.advance();
          this.addToken("PLUS_PLUS");
        } else if (this.peek() === "=") {
          this.advance();
          this.addToken("PLUS_EQUAL");
        } else {
          this.addToken("PLUS");
        }
        break;

      case "-":
        if (this.peek() === "-") {
          this.advance();
          this.addToken("MINUS_MINUS");
        } else if (this.peek() === "=") {
          this.advance();
          this.addToken("MINUS_EQUAL");
        } else {
          this.addToken("MINUS");
        }
        break;

      case "{":
        this.addToken("LEFT_BRACE");
        break;

      case "}":
        this.addToken("RIGHT_BRACE");
        break;

      case "(":
        this.addToken("LEFT_PAREN");
        break;

      case ")":
        this.addToken("RIGHT_PAREN");
        break;

      case ",":
        this.addToken("COMMA");
        break;

      case ";":
        this.addToken("SEMICOLON");
        break;

      case ":":
        this.addToken("COLON");
        break;

      case "[":
        this.addToken("LEFT_BRACKET");
        break;

      case "]":
        this.addToken("RIGHT_BRACKET");
        break;

      case ".":
        this.addToken("DOT");
        break;

      case '"':
        this.string('"');
        break;

      case "'":
        this.string("'");
        break;

      case "`":
        this.templateString();
        break;

      case "/":
        if (this.peek() === "/") {
          this.comment();
        } else {
          this.addToken("SLASH");
        }
        break;

      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          throw new Error(
            `Carácter inesperado: ${char} en la línea ${this.currentLine}`,
          );
        }
        break;
    }
  }

  /**
   * Processes a string literal
   * @param {string} quoteType - Type of quote (' or ")
   */
  string(quoteType = '"') {
    while (this.peek() !== quoteType && !this.isAtEnd()) {
      if (this.peek() === "\n") this.currentLine++;
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error("Cadena no terminada");
    }

    // Consume the closing quote
    this.advance();

    // Extract the string value
    const value = this.source.substring(this.startPos + 1, this.current - 1);
    this.addToken("STRING", value);
  }

  /**
   * Processes a template string with interpolation (backticks)
   * Supports ${expression} syntax for embedding expressions
   */
  templateString() {
    const parts = []; // Literal string parts
    const expressions = []; // Expression source strings
    let currentPart = "";

    while (!this.isAtEnd()) {
      const char = this.peek();

      if (char === "`") {
        // End of template string
        this.advance();
        parts.push(currentPart);
        this.addToken("TEMPLATE_STRING", { parts, expressions });
        return;
      }

      if (char === "$" && this.peekNext() === "{") {
        // Start of interpolation
        parts.push(currentPart);
        currentPart = "";
        this.advance(); // consume $
        this.advance(); // consume {

        // Extract the expression
        let braceCount = 1;
        let expressionSource = "";

        while (!this.isAtEnd() && braceCount > 0) {
          const c = this.peek();
          if (c === "{") {
            braceCount++;
            expressionSource += c;
            this.advance();
          } else if (c === "}") {
            braceCount--;
            if (braceCount > 0) {
              expressionSource += c;
            }
            this.advance();
          } else {
            if (c === "\n") this.currentLine++;
            expressionSource += c;
            this.advance();
          }
        }

        expressions.push(expressionSource);
      } else {
        if (char === "\n") this.currentLine++;
        currentPart += char;
        this.advance();
      }
    }

    throw new Error("Cadena de plantilla no terminada");
  }

  /**
   * Scans a comment
   */
  comment() {
    // Consume the second '/'
    this.advance();

    // Skip until end of line
    while (this.peek() !== "\n" && !this.isAtEnd()) {
      this.advance();
    }

    // Don't add comment as a token - just skip it
    // The comment is now fully consumed
  }

  /**
   * Processes a number
   */
  number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for decimal part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      // Consume the dot
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = this.source.substring(this.startPos, this.current);
    this.addToken("NUMBER", parseFloat(value));
  }

  /**
   * Returns the next character without advancing
   * @returns {string} Next character
   */
  peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1];
  }

  /**
   * Processes an identifier or keyword
   */
  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.startPos, this.current);

    // Special handling for 'y' - only treat as AND in logical contexts
    if (text === "y") {
      // Check if this is a logical context by looking at previous tokens
      const prevToken = this.tokens[this.tokens.length - 1];
      if (
        prevToken &&
        (prevToken.type === "IDENTIFIER" ||
          prevToken.type === "NUMBER" ||
          prevToken.type === "STRING" ||
          prevToken.type === "TRUE" ||
          prevToken.type === "FALSE" ||
          prevToken.type === "RIGHT_PAREN" ||
          prevToken.type === "RIGHT_BRACKET")
      ) {
        // Check if the next token is a logical operator or end of expression
        const nextChar = this.peek();
        if (
          nextChar === " " ||
          nextChar === "\n" ||
          nextChar === "\t" ||
          nextChar === ")" ||
          nextChar === "}" ||
          nextChar === ";" ||
          this.isAtEnd()
        ) {
          this.addToken("AND");
        } else {
          this.addToken("IDENTIFIER");
        }
      } else {
        this.addToken("IDENTIFIER");
      }
    } else {
      const type = this.getKeywordType(text);
      this.addToken(type);
    }
  }

  /**
   * Determines if the identifier is a keyword
   * @param {string} text - Identifier text
   * @returns {string} Token type
   */
  getKeywordType(text) {
    const keywords = {
      variable: "VARIABLE",
      constante: "CONSTANTE",
      mostrar: "MOSTRAR",
      leer: "LEER",
      si: "SI",
      sino: "SINO",
      mientras: "MIENTRAS",
      para: "PARA",
      funcion: "FUNCION",
      retornar: "RETORNAR",
      verdadero: "TRUE",
      falso: "FALSE",
      o: "OR",
      romper: "ROMPER",
      continuar: "CONTINUAR",
      intentar: "INTENTAR",
      capturar: "CAPTURAR",
      nulo: "NULL",
      indefinido: "UNDEFINED",
      elegir: "ELEGIR",
      caso: "CASO",
      pordefecto: "PORDEFECTO",
      hacer: "HACER",
      cada: "CADA",
      en: "EN",
      clase: "CLASE",
      constructor: "CONSTRUCTOR",
      este: "ESTE",
      nuevo: "NUEVO",
      extiende: "EXTIENDE",
      super: "SUPER",
    };

    return keywords[text] || "IDENTIFIER";
  }

  /**
   * Advances the pointer and returns the previous character
   * @returns {string} Previous character
   */
  advance() {
    this.current++;
    return this.source[this.current - 1];
  }

  /**
   * Marks the start of the current token
   */
  get start() {
    return this.current - 1;
  }

  /**
   * Returns the current character without advancing
   * @returns {string} Current character
   */
  peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }

  /**
   * Checks if we have reached the end of the code
   * @returns {boolean} True if we reached the end
   */
  isAtEnd() {
    return this.current >= this.source.length;
  }

  /**
   * Checks if a character is a digit
   * @param {string} char - Character to check
   * @returns {boolean} True if it is a digit
   */
  isDigit(char) {
    return char >= "0" && char <= "9";
  }

  /**
   * Checks if a character is alphabetic
   * @param {string} char - Character to check
   * @returns {boolean} True if it is alphabetic
   */
  isAlpha(char) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  /**
   * Checks if a character is alphanumeric
   * @param {string} char - Character to check
   * @returns {boolean} True if it is alphanumeric
   */
  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  /**
   * Adds a token to the list
   * @param {string} type - Token type
   * @param {any} literal - Literal value of the token
   */
  addToken(type, literal = null) {
    const text = this.source.substring(this.startPos, this.current);
    this.tokens.push({
      type,
      lexeme: text,
      literal,
      line: this.currentLine,
    });
  }
}

module.exports = Tokenizer;
