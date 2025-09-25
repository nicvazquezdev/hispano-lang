/**
 * Parser for educational programming language in Spanish
 * Converts tokens into an Abstract Syntax Tree (AST)
 */

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  /**
   * Parses tokens and returns a list of statements
   * @returns {Array} List of statements (AST)
   */
  parse() {
    const statements = [];

    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  /**
   * Parses a declaration
   * @returns {Object} Parsed declaration
   */
  declaration() {
    try {
      if (this.match("VARIABLE")) {
        return this.variableDeclaration();
      }

      if (this.match("MOSTRAR")) {
        return this.mostrarStatement();
      }

      if (this.match("SI")) {
        return this.ifStatement();
      }

      return this.expressionStatement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  /**
   * Parses a variable declaration
   * @returns {Object} Variable declaration
   */
  variableDeclaration() {
    const name = this.consume("IDENTIFIER", "Expected variable name");

    let initializer = null;
    if (this.match("EQUAL")) {
      initializer = this.expression();
    }

    return {
      type: "VariableDeclaration",
      name: name.lexeme,
      initializer,
    };
  }

  /**
   * Parses a show statement
   * @returns {Object} Show statement
   */
  mostrarStatement() {
    const value = this.expression();

    return {
      type: "MostrarStatement",
      expression: value,
    };
  }

  /**
   * Parses an if statement
   * @returns {Object} If statement
   */
  ifStatement() {
    const condition = this.expression();
    this.consume("LEFT_BRACE", "Expected { after condition");
    const thenBranch = this.block();
    this.consume("RIGHT_BRACE", "Expected } after block");
    let elseBranch = null;

    if (this.match("SINO")) {
      this.consume("LEFT_BRACE", "Expected { after else");
      elseBranch = this.block();
      this.consume("RIGHT_BRACE", "Expected } after else block");
    }

    return {
      type: "IfStatement",
      condition,
      thenBranch,
      elseBranch,
    };
  }

  /**
   * Parses a code block
   * @returns {Array} List of statements in the block
   */
  block() {
    const statements = [];

    while (!this.check("RIGHT_BRACE") && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  /**
   * Parses an expression statement
   * @returns {Object} Expression statement
   */
  expressionStatement() {
    const expr = this.expression();
    return {
      type: "ExpressionStatement",
      expression: expr,
    };
  }

  /**
   * Parses an expression
   * @returns {Object} Parsed expression
   */
  expression() {
    return this.assignment();
  }

  /**
   * Parses an assignment
   * @returns {Object} Parsed assignment
   */
  assignment() {
    const expr = this.equality();

    if (this.match("EQUAL")) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr.type === "Variable") {
        const name = expr.name;
        return {
          type: "Assign",
          name,
          value,
        };
      }

      throw new Error("Invalid assignment target");
    }

    return expr;
  }

  /**
   * Parses an equality expression
   * @returns {Object} Equality expression
   */
  equality() {
    let expr = this.comparison();

    while (this.match("EQUAL_EQUAL", "BANG_EQUAL")) {
      const operator = this.previous();
      const right = this.comparison();
      expr = {
        type: "Binary",
        left: expr,
        operator: operator.type,
        right,
      };
    }

    return expr;
  }

  /**
   * Parses a comparison expression
   * @returns {Object} Comparison expression
   */
  comparison() {
    let expr = this.term();

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      const operator = this.previous();
      const right = this.term();
      expr = {
        type: "Binary",
        left: expr,
        operator: operator.type,
        right,
      };
    }

    return expr;
  }

  /**
   * Parses a term expression
   * @returns {Object} Term expression
   */
  term() {
    let expr = this.factor();

    while (this.match("MINUS", "PLUS")) {
      const operator = this.previous();
      const right = this.factor();
      expr = {
        type: "Binary",
        left: expr,
        operator: operator.type,
        right,
      };
    }

    return expr;
  }

  /**
   * Parses a factor expression
   * @returns {Object} Factor expression
   */
  factor() {
    let expr = this.unary();

    while (this.match("SLASH", "STAR")) {
      const operator = this.previous();
      const right = this.unary();
      expr = {
        type: "Binary",
        left: expr,
        operator: operator.type,
        right,
      };
    }

    return expr;
  }

  /**
   * Parses a unary expression
   * @returns {Object} Unary expression
   */
  unary() {
    if (this.match("BANG", "MINUS")) {
      const operator = this.previous();
      const right = this.unary();
      return {
        type: "Unary",
        operator: operator.type,
        right,
      };
    }

    return this.primary();
  }

  /**
   * Parses a primary expression
   * @returns {Object} Primary expression
   */
  primary() {
    if (this.match("FALSE")) return { type: "Literal", value: false };
    if (this.match("TRUE")) return { type: "Literal", value: true };
    if (this.match("NUMBER", "STRING")) {
      return {
        type: "Literal",
        value: this.previous().literal,
      };
    }

    if (this.match("IDENTIFIER")) {
      return {
        type: "Variable",
        name: this.previous().lexeme,
      };
    }

    throw new Error("Expected expression");
  }

  /**
   * Checks if the current token matches any of the given types
   * @param {...string} types - Token types to check
   * @returns {boolean} True if it matches
   */
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if the current token is of the given type
   * @param {string} type - Token type to check
   * @returns {boolean} True if it is of the type
   */
  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * Advances to the next token
   * @returns {Object} Previous token
   */
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * Checks if we reached the end
   * @returns {boolean} True if we reached the end
   */
  isAtEnd() {
    return this.peek().type === "EOF";
  }

  /**
   * Returns the current token
   * @returns {Object} Current token
   */
  peek() {
    return this.tokens[this.current];
  }

  /**
   * Returns the previous token
   * @returns {Object} Previous token
   */
  previous() {
    return this.tokens[this.current - 1];
  }

  /**
   * Consumes a token of the expected type
   * @param {string} type - Expected token type
   * @param {string} message - Error message if it doesn't match
   * @returns {Object} Consumed token
   */
  consume(type, message) {
    if (this.check(type)) return this.advance();

    throw new Error(`${message} at line ${this.peek().line}`);
  }

  /**
   * Synchronizes the parser after an error
   */
  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === "EOF") return;

      switch (this.peek().type) {
        case "VARIABLE":
        case "MOSTRAR":
        case "SI":
          return;
      }

      this.advance();
    }
  }
}

module.exports = Parser;
