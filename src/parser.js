/**
 * Parser for HispanoLang
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

      // Consume semicolon if present between statements
      if (this.match("SEMICOLON")) {
        // Semicolon consumed
      }
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

      if (this.match("CONSTANTE")) {
        return this.constantDeclaration();
      }

      if (this.match("FUNCION")) {
        return this.functionDeclaration();
      }

      if (this.match("MOSTRAR")) {
        return this.mostrarStatement();
      }

      if (this.match("LEER")) {
        return this.leerStatement();
      }

      if (this.match("SI")) {
        return this.ifStatement();
      }

      if (this.match("MIENTRAS")) {
        return this.whileStatement();
      }

      if (this.match("PARA")) {
        // Check if it's "para cada" (for-each) or regular "para" (for)
        if (this.match("CADA")) {
          return this.forEachStatement();
        }
        return this.forStatement();
      }

      if (this.match("ELEGIR")) {
        return this.elegirStatement();
      }

      if (this.match("HACER")) {
        return this.hacerMientrasStatement();
      }

      if (this.match("RETORNAR")) {
        return this.returnStatement();
      }

      if (this.match("ROMPER")) {
        return this.breakStatement();
      }

      if (this.match("CONTINUAR")) {
        return this.continueStatement();
      }

      if (this.match("INTENTAR")) {
        return this.tryStatement();
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
    let name;
    if (this.match("IDENTIFIER")) {
      name = this.previous();
    } else if (this.match("AND")) {
      name = this.previous();
    } else {
      throw new Error("Se esperaba un nombre de variable");
    }

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
   * Parses a constant declaration
   * @returns {Object} Constant declaration
   */
  constantDeclaration() {
    let name;
    if (this.match("IDENTIFIER")) {
      name = this.previous();
    } else {
      throw new Error("Se esperaba un nombre de constante");
    }

    if (!this.match("EQUAL")) {
      throw new Error("Las constantes deben ser inicializadas");
    }

    const initializer = this.expression();

    return {
      type: "ConstantDeclaration",
      name: name.lexeme,
      initializer,
    };
  }

  /**
   * Parses a function declaration
   * @returns {Object} Function declaration
   */
  functionDeclaration() {
    const name = this.consume("IDENTIFIER", "Expected function name");
    this.consume("LEFT_PAREN", "Expected ( after function name");

    const parameters = [];
    if (!this.check("RIGHT_PAREN")) {
      do {
        if (parameters.length >= 255) {
          throw new Error("No se pueden tener más de 255 parámetros");
        }
        let param;
        if (this.match("IDENTIFIER")) {
          param = this.previous();
        } else if (this.match("AND")) {
          param = this.previous();
        } else {
          throw new Error("Se esperaba un nombre de parámetro");
        }
        parameters.push(param.lexeme);
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_PAREN", "Expected ) after parameters");
    this.consume("LEFT_BRACE", "Expected { before function body");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after function body");

    return {
      type: "FunctionDeclaration",
      name: name.lexeme,
      parameters,
      body,
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
   * Parses a read statement
   * @returns {Object} Read statement
   */
  leerStatement() {
    // Parse the variable name to store the input
    const variableName = this.consume(
      "IDENTIFIER",
      "Expected variable name after leer",
    );

    // Optional prompt message
    let prompt = null;
    if (this.match("STRING")) {
      prompt = this.previous().literal;
    }

    return {
      type: "LeerStatement",
      variable: variableName.lexeme,
      prompt: prompt,
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
   * Parses a while statement
   * @returns {Object} While statement
   */
  whileStatement() {
    const condition = this.expression();
    this.consume("LEFT_BRACE", "Expected { after condition");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after block");

    return {
      type: "WhileStatement",
      condition,
      body,
    };
  }

  /**
   * Parses a for statement
   * @returns {Object} For statement
   */
  forStatement() {
    this.consume("LEFT_PAREN", "Expected ( after para");

    // Initializer (optional)
    let initializer = null;
    if (!this.check("SEMICOLON")) {
      if (this.match("VARIABLE")) {
        initializer = this.variableDeclaration();
      } else {
        initializer = this.expressionStatement();
      }
      // Consume the semicolon after initializer
      this.consume("SEMICOLON", "Expected ; after for initializer");
    } else {
      // Skip the first semicolon if no initializer
      this.advance();
    }

    // Condition (optional)
    let condition = null;
    if (!this.check("SEMICOLON")) {
      condition = this.expression();
    }
    this.consume("SEMICOLON", "Expected ; after condition");

    // Increment (optional)
    let increment = null;
    if (!this.check("RIGHT_PAREN")) {
      increment = this.expression();
    }
    this.consume("RIGHT_PAREN", "Expected ) after for clause");

    this.consume("LEFT_BRACE", "Expected { after for clause");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after block");

    return {
      type: "ForStatement",
      initializer,
      condition,
      increment,
      body,
    };
  }

  /**
   * Parses a return statement
   * @returns {Object} Return statement
   */
  returnStatement() {
    const keyword = this.previous();
    let value = null;
    if (!this.check("RIGHT_BRACE")) {
      value = this.expression();
    }

    return {
      type: "ReturnStatement",
      keyword,
      value,
    };
  }

  /**
   * Parses a break statement
   * @returns {Object} Break statement
   */
  breakStatement() {
    const keyword = this.previous();
    return {
      type: "BreakStatement",
      keyword,
    };
  }

  /**
   * Parses a continue statement
   * @returns {Object} Continue statement
   */
  continueStatement() {
    const keyword = this.previous();
    return {
      type: "ContinueStatement",
      keyword,
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
   * Parses a complete expression that can be followed by array access
   * @returns {Object} Parsed expression
   */
  parseExpression() {
    let expr = this.equality();

    while (this.match("LEFT_BRACKET")) {
      expr = this.finishArrayAccess(expr);
    }

    return expr;
  }

  /**
   * Parses an assignment
   * @returns {Object} Parsed assignment
   */
  assignment() {
    const expr = this.logicalOr();

    if (this.match("EQUAL")) {
      const equals = this.previous();
      const value = this.logicalOr();

      if (expr.type === "Variable") {
        const name = expr.name;
        return {
          type: "Assign",
          name,
          value,
        };
      }

      if (expr.type === "ArrayAccess") {
        return {
          type: "ArrayAssign",
          array: expr.array,
          index: expr.index,
          value,
        };
      }

      if (expr.type === "PropertyAccess") {
        return {
          type: "PropertyAssign",
          object: expr.object,
          name: expr.name,
          value,
        };
      }

      throw new Error("Objetivo de asignación inválido");
    }

    // Handle compound assignment operators
    if (
      this.match(
        "PLUS_EQUAL",
        "MINUS_EQUAL",
        "STAR_EQUAL",
        "SLASH_EQUAL",
        "PERCENT_EQUAL",
      )
    ) {
      const operator = this.previous();
      const value = this.logicalOr();

      if (expr.type === "Variable") {
        const name = expr.name;
        return {
          type: "CompoundAssign",
          name,
          operator: operator.type,
          value,
        };
      }

      if (expr.type === "ArrayAccess") {
        return {
          type: "CompoundArrayAssign",
          array: expr.array,
          index: expr.index,
          operator: operator.type,
          value,
        };
      }

      if (expr.type === "PropertyAccess") {
        return {
          type: "CompoundPropertyAssign",
          object: expr.object,
          name: expr.name,
          operator: operator.type,
          value,
        };
      }

      throw new Error("Objetivo de asignación compuesta inválido");
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
   * Parses a logical AND expression
   * @returns {Object} Logical AND expression
   */
  logicalAnd() {
    let expr = this.equality();

    while (this.match("AND")) {
      const operator = this.previous();
      const right = this.equality();
      expr = {
        type: "Logical",
        left: expr,
        operator: operator.type,
        right,
      };
    }

    return expr;
  }

  /**
   * Parses a logical OR expression
   * @returns {Object} Logical OR expression
   */
  logicalOr() {
    let expr = this.logicalAnd();

    while (this.match("OR")) {
      const operator = this.previous();
      const right = this.logicalAnd();
      expr = {
        type: "Logical",
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

    while (this.match("SLASH", "STAR", "PERCENT")) {
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

    return this.postfix();
  }

  /**
   * Parses a postfix expression (increment/decrement)
   * @returns {Object} Postfix expression
   */
  postfix() {
    let expr = this.call();

    while (this.match("PLUS_PLUS", "MINUS_MINUS")) {
      const operator = this.previous();
      expr = {
        type: "Postfix",
        operator: operator.type,
        operand: expr,
      };
    }

    return expr;
  }

  /**
   * Parses a call expression (function calls and array access)
   * @returns {Object} Call expression
   */
  call() {
    let expr = this.primary();

    while (true) {
      if (this.match("LEFT_BRACKET")) {
        expr = this.finishArrayAccess(expr);
      } else if (this.match("DOT")) {
        expr = this.finishPropertyAccess(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * Parses a primary expression
   * @returns {Object} Primary expression
   */
  primary() {
    if (this.match("FALSE")) return { type: "Literal", value: false };
    if (this.match("TRUE")) return { type: "Literal", value: true };
    if (this.match("NULL")) return { type: "Literal", value: null };
    if (this.match("UNDEFINED")) return { type: "Literal", value: undefined };
    if (this.match("NUMBER", "STRING")) {
      return {
        type: "Literal",
        value: this.previous().literal,
      };
    }

    if (this.match("TEMPLATE_STRING")) {
      return this.templateStringExpression();
    }

    if (this.match("IDENTIFIER")) {
      const identifier = this.previous();
      if (this.check("LEFT_PAREN")) {
        this.advance(); // Consume the LEFT_PAREN
        return this.finishCall(identifier);
      }
      return {
        type: "Variable",
        name: identifier.lexeme,
      };
    }

    if (this.match("AND")) {
      const identifier = this.previous();
      if (this.check("LEFT_PAREN")) {
        this.advance(); // Consume the LEFT_PAREN
        return this.finishCall(identifier);
      }
      return {
        type: "Variable",
        name: identifier.lexeme,
      };
    }

    if (this.match("LEFT_PAREN")) {
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "Expected ) after expression");
      return expr;
    }

    if (this.match("LEFT_BRACKET")) {
      return this.arrayLiteral();
    }

    if (this.match("LEFT_BRACE")) {
      return this.objectLiteral();
    }

    if (this.match("FUNCION")) {
      return this.anonymousFunction();
    }

    throw new Error("Se esperaba una expresión");
  }

  /**
   * Parses a template string expression
   * @returns {Object} Template string expression with parsed expressions
   */
  templateStringExpression() {
    const token = this.previous();
    const { parts, expressions } = token.literal;
    const Tokenizer = require("./tokenizer.js");

    // Parse each expression string into an AST
    const parsedExpressions = expressions.map((exprSource) => {
      const tokenizer = new Tokenizer();
      const exprTokens = tokenizer.tokenize(exprSource);
      const exprParser = new Parser(exprTokens);
      return exprParser.expression();
    });

    return {
      type: "TemplateString",
      parts,
      expressions: parsedExpressions,
    };
  }

  /**
   * Parses an anonymous function
   * @returns {Object} Anonymous function expression
   */
  anonymousFunction() {
    this.consume("LEFT_PAREN", "Expected ( after funcion");

    const parameters = [];
    if (!this.check("RIGHT_PAREN")) {
      do {
        if (parameters.length >= 255) {
          throw new Error("No se pueden tener más de 255 parámetros");
        }
        let param;
        if (this.match("IDENTIFIER")) {
          param = this.previous();
        } else if (this.match("AND")) {
          param = this.previous();
        } else {
          throw new Error("Se esperaba un nombre de parámetro");
        }
        parameters.push(param.lexeme);
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_PAREN", "Expected ) after parameters");
    this.consume("LEFT_BRACE", "Expected { before function body");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after function body");

    return {
      type: "AnonymousFunction",
      parameters,
      body,
    };
  }

  /**
   * Finishes parsing an array access
   * @param {Object} array - The array being accessed
   * @returns {Object} Array access expression
   */
  finishArrayAccess(array) {
    const index = this.expression();
    this.consume("RIGHT_BRACKET", "Expected ] after array index");

    return {
      type: "ArrayAccess",
      array,
      index,
    };
  }

  /**
   * Finishes parsing a property access
   * @param {Object} object - The object being accessed
   * @returns {Object} Property access expression
   */
  finishPropertyAccess(object) {
    this.consume("IDENTIFIER", "Expected property name after .");
    const name = this.previous();

    // Check if this is a method call (array or string)
    if (
      name.lexeme === "longitud" ||
      name.lexeme === "primero" ||
      name.lexeme === "ultimo" ||
      name.lexeme === "agregar" ||
      name.lexeme === "remover" ||
      name.lexeme === "contiene" ||
      name.lexeme === "recorrer" ||
      name.lexeme === "mayusculas" ||
      name.lexeme === "minusculas" ||
      name.lexeme === "dividir" ||
      name.lexeme === "reemplazar" ||
      name.lexeme === "recortar" ||
      name.lexeme === "incluye" ||
      name.lexeme === "empiezaCon" ||
      name.lexeme === "terminaCon" ||
      name.lexeme === "caracter" ||
      name.lexeme === "subcadena" ||
      name.lexeme === "invertir" ||
      name.lexeme === "filtrar" ||
      name.lexeme === "mapear" ||
      name.lexeme === "reducir" ||
      name.lexeme === "ordenar" ||
      name.lexeme === "buscar" ||
      name.lexeme === "algunos" ||
      name.lexeme === "todos" ||
      name.lexeme === "unir" ||
      name.lexeme === "cortar" ||
      name.lexeme === "insertar"
    ) {
      // Check if there are parentheses (method call syntax)
      if (this.match("LEFT_PAREN")) {
        // Consume the opening parenthesis
        // Check if there are arguments
        if (!this.check("RIGHT_PAREN")) {
          // Handle methods that accept arguments
          if (
            name.lexeme === "agregar" ||
            name.lexeme === "contiene" ||
            name.lexeme === "recorrer" ||
            name.lexeme === "dividir" ||
            name.lexeme === "reemplazar" ||
            name.lexeme === "incluye" ||
            name.lexeme === "empiezaCon" ||
            name.lexeme === "terminaCon" ||
            name.lexeme === "caracter" ||
            name.lexeme === "subcadena" ||
            name.lexeme === "filtrar" ||
            name.lexeme === "mapear" ||
            name.lexeme === "reducir" ||
            name.lexeme === "buscar" ||
            name.lexeme === "algunos" ||
            name.lexeme === "todos" ||
            name.lexeme === "unir" ||
            name.lexeme === "cortar" ||
            name.lexeme === "insertar"
          ) {
            const args = [];
            do {
              args.push(this.expression());
            } while (this.match("COMMA"));
            this.consume("RIGHT_PAREN", "Expected ) after method call");

            return {
              type: "MethodCall",
              object,
              method: name.lexeme,
              arguments: args,
            };
          } else {
            throw new Error(`El método ${name.lexeme}() no acepta argumentos`);
          }
        }
        // Consume the closing parenthesis
        this.consume("RIGHT_PAREN", "Expected ) after method call");
      }

      return {
        type: "MethodCall",
        object,
        method: name.lexeme,
      };
    }

    return {
      type: "PropertyAccess",
      object,
      name: name.lexeme,
    };
  }

  /**
   * Finishes parsing a function call
   * @param {Object} callee - The function being called
   * @returns {Object} Function call expression
   */
  finishCall(callee) {
    const args = [];

    if (!this.check("RIGHT_PAREN")) {
      do {
        if (args.length >= 255) {
          throw new Error("Cannot have more than 255 arguments");
        }
        args.push(this.expression());
      } while (this.match("COMMA"));
    }

    const paren = this.consume("RIGHT_PAREN", "Expected ) after arguments");

    return {
      type: "Call",
      callee: {
        type: "Variable",
        name: callee.lexeme,
      },
      arguments: args,
    };
  }

  /**
   * Parses an array literal
   * @returns {Object} Array literal
   */
  arrayLiteral() {
    const elements = [];

    if (!this.check("RIGHT_BRACKET")) {
      do {
        elements.push(this.expression());
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_BRACKET", "Expected ] after array elements");

    return {
      type: "ArrayLiteral",
      elements,
    };
  }

  /**
   * Parses an object literal
   * @returns {Object} Object literal
   */
  objectLiteral() {
    const properties = [];

    if (!this.check("RIGHT_BRACE")) {
      do {
        // Parse property name (identifier or string)
        let name;
        if (this.match("IDENTIFIER")) {
          name = this.previous().lexeme;
        } else if (this.match("STRING")) {
          name = this.previous().literal;
        } else {
          throw new Error("Se esperaba un nombre de propiedad");
        }

        this.consume("COLON", "Expected : after property name");
        const value = this.expression();

        properties.push({
          type: "Property",
          name,
          value,
        });
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_BRACE", "Expected } after object properties");

    return {
      type: "ObjectLiteral",
      properties,
    };
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

    throw new Error(`${message} en la línea ${this.peek().line}`);
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
        case "CONSTANTE":
        case "FUNCION":
        case "MOSTRAR":
        case "LEER":
        case "SI":
        case "MIENTRAS":
        case "PARA":
        case "RETORNAR":
        case "ROMPER":
        case "CONTINUAR":
        case "INTENTAR":
        case "CAPTURAR":
          return;
      }

      this.advance();
    }
  }

  /**
   * Parses a try-catch statement
   * @returns {Object} Try-catch statement
   */
  tryStatement() {
    // Parse the try block
    this.consume("LEFT_BRACE", "Expected { after intentar");
    const tryBlock = this.block();
    this.consume("RIGHT_BRACE", "Expected } after intentar block");

    // Look for catch block
    if (this.match("CAPTURAR")) {
      // Parse catch parameter (error variable name)
      this.consume("LEFT_PAREN", "Expected ( after capturar");
      const errorVariable = this.consume(
        "IDENTIFIER",
        "Expected error variable name",
      );
      this.consume("RIGHT_PAREN", "Expected ) after error variable");

      // Parse catch block
      this.consume("LEFT_BRACE", "Expected { after capturar");
      const catchBlock = this.block();
      this.consume("RIGHT_BRACE", "Expected } after capturar block");

      return {
        type: "TryCatch",
        tryBlock,
        catchBlock,
        errorVariable: errorVariable.lexeme,
      };
    } else {
      throw new Error("Se esperaba capturar después del bloque intentar");
    }
  }

  /**
   * Parses an elegir (switch) statement
   * @returns {Object} Elegir statement
   */
  elegirStatement() {
    const discriminant = this.expression();
    this.consume("LEFT_BRACE", "Expected { after elegir expression");

    const cases = [];
    let defaultCase = null;

    while (!this.check("RIGHT_BRACE") && !this.isAtEnd()) {
      if (this.match("CASO")) {
        const testValue = this.expression();
        this.consume("COLON", "Expected : after caso value");

        let consequent;
        if (this.check("LEFT_BRACE")) {
          this.advance();
          consequent = this.block();
          this.consume("RIGHT_BRACE", "Expected } after caso block");
        } else {
          consequent = [this.declaration()];
        }

        cases.push({
          test: testValue,
          consequent,
        });
      } else if (this.match("PORDEFECTO")) {
        this.consume("COLON", "Expected : after pordefecto");

        let consequent;
        if (this.check("LEFT_BRACE")) {
          this.advance();
          consequent = this.block();
          this.consume("RIGHT_BRACE", "Expected } after pordefecto block");
        } else {
          consequent = [this.declaration()];
        }

        defaultCase = {
          consequent,
        };
      } else {
        throw new Error("Se esperaba caso o pordefecto dentro de elegir");
      }
    }

    this.consume("RIGHT_BRACE", "Expected } after elegir block");

    return {
      type: "ElegirStatement",
      discriminant,
      cases,
      defaultCase,
    };
  }

  /**
   * Parses a hacer/mientras (do-while) statement
   * @returns {Object} HacerMientras statement
   */
  hacerMientrasStatement() {
    this.consume("LEFT_BRACE", "Expected { after hacer");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after hacer block");

    this.consume("MIENTRAS", "Expected mientras after hacer block");
    const condition = this.expression();

    return {
      type: "HacerMientrasStatement",
      body,
      condition,
    };
  }

  /**
   * Parses a para cada (for-each) statement
   * @returns {Object} ForEach statement
   */
  forEachStatement() {
    const iteratorName = this.consume(
      "IDENTIFIER",
      "Expected iterator variable name after cada",
    );
    this.consume("EN", "Expected en after iterator variable");
    const iterable = this.expression();

    this.consume("LEFT_BRACE", "Expected { after iterable");
    const body = this.block();
    this.consume("RIGHT_BRACE", "Expected } after para cada block");

    return {
      type: "ForEachStatement",
      iterator: iteratorName.lexeme,
      iterable,
      body,
    };
  }
}

module.exports = Parser;
