/**
 * Evaluator for educational programming language in Spanish
 * Executes AST statements
 */

class Evaluator {
  constructor() {
    this.environment = new Environment();
    this.output = [];
  }

  /**
   * Evaluates a list of statements
   * @param {Array} statements - List of AST statements
   * @returns {Array} Execution result
   */
  evaluate(statements) {
    this.output = [];

    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      throw new Error(`Execution error: ${error.message}`);
    }

    return this.output;
  }

  /**
   * Executes a statement
   * @param {Object} statement - Statement to execute
   */
  execute(statement) {
    switch (statement.type) {
      case "VariableDeclaration":
        return this.executeVariableDeclaration(statement);
      case "FunctionDeclaration":
        return this.executeFunctionDeclaration(statement);
      case "MostrarStatement":
        return this.executeMostrarStatement(statement);
      case "IfStatement":
        return this.executeIfStatement(statement);
      case "WhileStatement":
        return this.executeWhileStatement(statement);
      case "ForStatement":
        return this.executeForStatement(statement);
      case "ReturnStatement":
        return this.executeReturnStatement(statement);
      case "BreakStatement":
        return this.executeBreakStatement(statement);
      case "ContinueStatement":
        return this.executeContinueStatement(statement);
      case "ExpressionStatement":
        return this.executeExpressionStatement(statement);
      case "Block":
        return this.executeBlock(statement);
    }
  }

  /**
   * Executes a variable declaration
   * @param {Object} statement - Variable declaration
   */
  executeVariableDeclaration(statement) {
    let value = null;
    if (statement.initializer !== null) {
      value = this.evaluateExpression(statement.initializer);
    }

    this.environment.define(statement.name, value);
  }

  /**
   * Executes a function declaration
   * @param {Object} statement - Function declaration
   */
  executeFunctionDeclaration(statement) {
    const functionObj = {
      type: "Function",
      name: statement.name,
      parameters: statement.parameters,
      body: statement.body,
    };

    this.environment.define(statement.name, functionObj);
  }

  /**
   * Executes a show statement
   * @param {Object} statement - Show statement
   */
  executeMostrarStatement(statement) {
    const value = this.evaluateExpression(statement.expression);
    const output = this.stringify(value);
    this.output.push(output);
    console.log(output);
  }

  /**
   * Executes an if statement
   * @param {Object} statement - If statement
   */
  executeIfStatement(statement) {
    if (this.isTruthy(this.evaluateExpression(statement.condition))) {
      this.executeBlock(statement.thenBranch);
    } else if (statement.elseBranch !== null) {
      this.executeBlock(statement.elseBranch);
    }
  }

  /**
   * Executes a while statement
   * @param {Object} statement - While statement
   */
  executeWhileStatement(statement) {
    while (this.isTruthy(this.evaluateExpression(statement.condition))) {
      try {
        this.executeBlock(statement.body);
      } catch (breakException) {
        if (breakException instanceof BreakException) {
          break;
        }
        if (breakException instanceof ContinueException) {
          continue;
        }
        throw breakException;
      }
    }
  }

  /**
   * Executes a for statement
   * @param {Object} statement - For statement
   */
  executeForStatement(statement) {
    // Execute initializer
    if (statement.initializer !== null) {
      this.execute(statement.initializer);
    }

    // Execute loop
    // If no condition is provided, don't execute the loop (like JavaScript)
    if (statement.condition !== null) {
      while (this.isTruthy(this.evaluateExpression(statement.condition))) {
        try {
          this.executeBlock(statement.body);
        } catch (breakException) {
          if (breakException instanceof BreakException) {
            break;
          }
          if (breakException instanceof ContinueException) {
            // Execute increment before continuing
            if (statement.increment !== null) {
              this.evaluateExpression(statement.increment);
            }
            continue;
          }
          throw breakException;
        }

        // Execute increment
        if (statement.increment !== null) {
          this.evaluateExpression(statement.increment);
        }
      }
    }
  }

  /**
   * Executes a return statement
   * @param {Object} statement - Return statement
   */
  executeReturnStatement(statement) {
    let value = null;
    if (statement.value !== null) {
      value = this.evaluateExpression(statement.value);
    }

    throw new ReturnException(value);
  }

  /**
   * Executes a break statement
   * @param {Object} statement - Break statement
   */
  executeBreakStatement(statement) {
    throw new BreakException();
  }

  /**
   * Executes a continue statement
   * @param {Object} statement - Continue statement
   */
  executeContinueStatement(statement) {
    throw new ContinueException();
  }

  /**
   * Executes a block of statements
   * @param {Array} statements - List of statements in the block
   */
  executeBlock(statements) {
    const previous = this.environment;

    try {
      this.environment = new Environment(previous);

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  /**
   * Executes an expression statement
   * @param {Object} statement - Expression statement
   */
  executeExpressionStatement(statement) {
    return this.evaluateExpression(statement.expression);
  }

  /**
   * Evaluates an expression
   * @param {Object} expression - Expression to evaluate
   * @returns {any} Expression result
   */
  evaluateExpression(expression) {
    switch (expression.type) {
      case "Literal":
        return expression.value;

      case "Variable":
        return this.environment.get(expression.name);

      case "Assign":
        const value = this.evaluateExpression(expression.value);
        this.environment.assign(expression.name, value);
        return value;

      case "ArrayLiteral":
        return this.evaluateArrayLiteral(expression);

      case "ArrayAccess":
        return this.evaluateArrayAccess(expression);

      case "ArrayAssign":
        return this.evaluateArrayAssign(expression);

      case "ObjectLiteral":
        return this.evaluateObjectLiteral(expression);

      case "PropertyAccess":
        return this.evaluatePropertyAccess(expression);

      case "PropertyAssign":
        return this.evaluatePropertyAssign(expression);

      case "CompoundAssign":
        return this.evaluateCompoundAssign(expression);

      case "CompoundArrayAssign":
        return this.evaluateCompoundArrayAssign(expression);

      case "CompoundPropertyAssign":
        return this.evaluateCompoundPropertyAssign(expression);

      case "Logical":
        return this.evaluateLogicalExpression(expression);

      case "Postfix":
        return this.evaluatePostfixExpression(expression);

      case "Call":
        return this.evaluateCallExpression(expression);

      case "MethodCall":
        return this.evaluateMethodCall(expression);

      case "Unary":
        const right = this.evaluateExpression(expression.right);
        return this.evaluateUnaryExpression(expression.operator, right);

      case "Binary":
        const left = this.evaluateExpression(expression.left);
        const rightOperand = this.evaluateExpression(expression.right);
        return this.evaluateBinaryExpression(
          left,
          expression.operator,
          rightOperand,
        );

      default:
        throw new Error(`Unrecognized expression type: ${expression.type}`);
    }
  }

  /**
   * Evaluates a unary expression
   * @param {string} operator - Unary operator
   * @param {any} right - Right operand
   * @returns {any} Expression result
   */
  evaluateUnaryExpression(operator, right) {
    switch (operator) {
      case "MINUS":
        this.checkNumberOperand(operator, right);
        return -right;

      case "BANG":
        return !this.isTruthy(right);

      default:
        throw new Error(`Unrecognized unary operator: ${operator}`);
    }
  }

  /**
   * Evaluates a binary expression
   * @param {any} left - Left operand
   * @param {string} operator - Binary operator
   * @param {any} right - Right operand
   * @returns {any} Expression result
   */
  evaluateBinaryExpression(left, operator, right) {
    switch (operator) {
      case "MINUS":
        this.checkNumberOperands(operator, left, right);
        return left - right;

      case "PLUS":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        // Convert numbers to strings for concatenation
        const leftStr = this.stringify(left);
        const rightStr = this.stringify(right);
        return leftStr + rightStr;

      case "SLASH":
        this.checkNumberOperands(operator, left, right);
        if (right === 0) {
          throw new Error("Division by zero");
        }
        return left / right;

      case "STAR":
        this.checkNumberOperands(operator, left, right);
        return left * right;

      case "GREATER":
        if (typeof left === "string" && typeof right === "string") {
          return left > right;
        }
        this.checkNumberOperands(operator, left, right);
        return left > right;

      case "GREATER_EQUAL":
        if (typeof left === "string" && typeof right === "string") {
          return left >= right;
        }
        this.checkNumberOperands(operator, left, right);
        return left >= right;

      case "LESS":
        if (typeof left === "string" && typeof right === "string") {
          return left < right;
        }
        this.checkNumberOperands(operator, left, right);
        return left < right;

      case "LESS_EQUAL":
        if (typeof left === "string" && typeof right === "string") {
          return left <= right;
        }
        this.checkNumberOperands(operator, left, right);
        return left <= right;

      case "EQUAL_EQUAL":
        return this.isEqual(left, right);

      case "BANG_EQUAL":
        return !this.isEqual(left, right);

      default:
        throw new Error(`Unrecognized binary operator: ${operator}`);
    }
  }

  /**
   * Checks if a value is truthy
   * @param {any} value - Value to check
   * @returns {boolean} True if it is truthy
   */
  isTruthy(value) {
    if (value === null) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    return true;
  }

  /**
   * Checks if two values are equal
   * @param {any} left - Left value
   * @param {any} right - Right value
   * @returns {boolean} True if they are equal
   */
  isEqual(left, right) {
    return left === right;
  }

  /**
   * Checks that an operand is a number
   * @param {string} operator - Operator
   * @param {any} operand - Operand
   */
  checkNumberOperand(operator, operand) {
    if (typeof operand === "number") return;
    throw new Error(`Operator ${operator} requires a number`);
  }

  /**
   * Checks that two operands are numbers
   * @param {string} operator - Operator
   * @param {any} left - Left operand
   * @param {any} right - Right operand
   */
  checkNumberOperands(operator, left, right) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`Operator ${operator} requires two numbers`);
  }

  /**
   * Evaluates a function call
   * @param {Object} expression - Call expression
   * @returns {any} Function result
   */
  evaluateCallExpression(expression) {
    // Check if it's a built-in mathematical function BEFORE evaluating the callee
    if (
      expression.callee.type === "Variable" &&
      this.isMathFunction(expression.callee.name)
    ) {
      const args = [];
      for (const argument of expression.arguments) {
        args.push(this.evaluateExpression(argument));
      }
      return this.evaluateMathFunction(expression.callee.name, args);
    }

    const callee = this.evaluateExpression(expression.callee);
    const args = [];

    for (const argument of expression.arguments) {
      args.push(this.evaluateExpression(argument));
    }

    if (callee.type !== "Function") {
      throw new Error("Can only call functions");
    }

    if (args.length !== callee.parameters.length) {
      throw new Error(
        `Expected ${callee.parameters.length} arguments but got ${args.length}`,
      );
    }

    const environment = new Environment(this.environment);

    for (let i = 0; i < args.length; i++) {
      environment.define(callee.parameters[i], args[i]);
    }

    const previous = this.environment;
    try {
      this.environment = environment;
      this.executeBlock(callee.body);
      return null;
    } catch (returnValue) {
      if (returnValue instanceof ReturnException) {
        return returnValue.value;
      }
      throw returnValue;
    } finally {
      this.environment = previous;
    }
  }

  /**
   * Evaluates a method call (array or string)
   * @param {Object} expression - Method call expression
   * @returns {any} Method result
   */
  evaluateMethodCall(expression) {
    const object = this.evaluateExpression(expression.object);

    // Determine if it's an array or string method based on the object type
    if (Array.isArray(object)) {
      return this.evaluateArrayMethod(object, expression.method);
    } else if (typeof object === "string") {
      return this.evaluateStringMethod(object, expression.method);
    } else {
      throw new Error(
        `Can only call methods on arrays or strings, got ${typeof object}`,
      );
    }
  }

  /**
   * Evaluates an array method
   * @param {Array} array - The array object
   * @param {string} method - The method name
   * @returns {any} Method result
   */
  evaluateArrayMethod(array, method) {
    switch (method) {
      case "longitud":
        return array.length;

      case "primero":
        if (array.length === 0) {
          throw new Error("Cannot get first element of empty array");
        }
        return array[0];

      case "ultimo":
        if (array.length === 0) {
          throw new Error("Cannot get last element of empty array");
        }
        return array[array.length - 1];

      default:
        throw new Error(`Unknown array method: ${method}`);
    }
  }

  /**
   * Evaluates a string method
   * @param {string} string - The string object
   * @param {string} method - The method name
   * @returns {any} Method result
   */
  evaluateStringMethod(string, method) {
    switch (method) {
      case "longitud":
        return string.length;

      default:
        throw new Error(`Unknown string method: ${method}`);
    }
  }

  /**
   * Checks if a function name is a built-in mathematical function
   * @param {string} name - Function name
   * @returns {boolean} True if it's a math function
   */
  isMathFunction(name) {
    const mathFunctions = [
      "raiz",
      "potencia",
      "seno",
      "coseno",
      "tangente",
      "logaritmo",
      "valorAbsoluto",
      "redondear",
      "techo",
      "piso",
      "aleatorio",
      "maximo",
      "minimo",
      "suma",
      "promedio",
    ];
    return mathFunctions.includes(name);
  }

  /**
   * Evaluates a mathematical function
   * @param {string} name - Function name
   * @param {Array} args - Function arguments
   * @returns {number} Function result
   */
  evaluateMathFunction(name, args) {
    switch (name) {
      case "raiz":
        if (args.length !== 1) {
          throw new Error("raiz() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("raiz() requires a number argument");
        }
        if (args[0] < 0) {
          throw new Error("Cannot take square root of negative number");
        }
        return Math.sqrt(args[0]);

      case "potencia":
        if (args.length !== 2) {
          throw new Error("potencia() requires exactly 2 arguments");
        }
        if (typeof args[0] !== "number" || typeof args[1] !== "number") {
          throw new Error("potencia() requires number arguments");
        }
        return Math.pow(args[0], args[1]);

      case "seno":
        if (args.length !== 1) {
          throw new Error("seno() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("seno() requires a number argument");
        }
        return Math.sin(args[0]);

      case "coseno":
        if (args.length !== 1) {
          throw new Error("coseno() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("coseno() requires a number argument");
        }
        return Math.cos(args[0]);

      case "tangente":
        if (args.length !== 1) {
          throw new Error("tangente() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("tangente() requires a number argument");
        }
        return Math.tan(args[0]);

      case "logaritmo":
        if (args.length !== 1) {
          throw new Error("logaritmo() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("logaritmo() requires a number argument");
        }
        if (args[0] <= 0) {
          throw new Error("Cannot take logarithm of non-positive number");
        }
        return Math.log(args[0]);

      case "valorAbsoluto":
        if (args.length !== 1) {
          throw new Error("valorAbsoluto() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("valorAbsoluto() requires a number argument");
        }
        return Math.abs(args[0]);

      case "redondear":
        if (args.length !== 1) {
          throw new Error("redondear() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("redondear() requires a number argument");
        }
        return Math.round(args[0]);

      case "techo":
        if (args.length !== 1) {
          throw new Error("techo() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("techo() requires a number argument");
        }
        return Math.ceil(args[0]);

      case "piso":
        if (args.length !== 1) {
          throw new Error("piso() requires exactly 1 argument");
        }
        if (typeof args[0] !== "number") {
          throw new Error("piso() requires a number argument");
        }
        return Math.floor(args[0]);

      case "aleatorio":
        if (args.length === 0) {
          return Math.random();
        } else if (args.length === 1) {
          if (typeof args[0] !== "number") {
            throw new Error("aleatorio() requires a number argument");
          }
          return Math.random() * args[0];
        } else if (args.length === 2) {
          if (typeof args[0] !== "number" || typeof args[1] !== "number") {
            throw new Error("aleatorio() requires number arguments");
          }
          return Math.random() * (args[1] - args[0]) + args[0];
        } else {
          throw new Error("aleatorio() accepts 0, 1, or 2 arguments");
        }

      case "maximo":
        if (args.length < 1) {
          throw new Error("maximo() requires at least 1 argument");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("maximo() requires number arguments");
          }
        }
        return Math.max(...args);

      case "minimo":
        if (args.length < 1) {
          throw new Error("minimo() requires at least 1 argument");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("minimo() requires number arguments");
          }
        }
        return Math.min(...args);

      case "suma":
        if (args.length < 1) {
          throw new Error("suma() requires at least 1 argument");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("suma() requires number arguments");
          }
        }
        return args.reduce((sum, arg) => sum + arg, 0);

      case "promedio":
        if (args.length < 1) {
          throw new Error("promedio() requires at least 1 argument");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("promedio() requires number arguments");
          }
        }
        return args.reduce((sum, arg) => sum + arg, 0) / args.length;

      default:
        throw new Error(`Unknown mathematical function: ${name}`);
    }
  }

  /**
   * Evaluates an array literal
   * @param {Object} expression - Array literal expression
   * @returns {Array} Array value
   */
  evaluateArrayLiteral(expression) {
    const elements = [];
    for (const element of expression.elements) {
      elements.push(this.evaluateExpression(element));
    }
    return elements;
  }

  /**
   * Evaluates array access
   * @param {Object} expression - Array access expression
   * @returns {any} Array element value
   */
  evaluateArrayAccess(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);

    if (!Array.isArray(array)) {
      throw new Error("Can only access elements of arrays");
    }

    if (typeof index !== "number") {
      throw new Error("Array index must be a number");
    }

    if (index < 0 || index >= array.length) {
      throw new Error("Array index out of bounds");
    }

    return array[index];
  }

  /**
   * Evaluates array assignment
   * @param {Object} expression - Array assignment expression
   * @returns {any} Assigned value
   */
  evaluateArrayAssign(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);
    const value = this.evaluateExpression(expression.value);

    if (!Array.isArray(array)) {
      throw new Error("Can only assign to elements of arrays");
    }

    if (typeof index !== "number") {
      throw new Error("Array index must be a number");
    }

    if (index < 0 || index >= array.length) {
      throw new Error("Array index out of bounds");
    }

    array[index] = value;
    return value;
  }

  /**
   * Evaluates object literal
   * @param {Object} expression - Object literal expression
   * @returns {Object} Object value
   */
  evaluateObjectLiteral(expression) {
    const object = {};

    for (const property of expression.properties) {
      const value = this.evaluateExpression(property.value);
      object[property.name] = value;
    }

    return object;
  }

  /**
   * Evaluates property access
   * @param {Object} expression - Property access expression
   * @returns {any} Property value
   */
  evaluatePropertyAccess(expression) {
    const object = this.evaluateExpression(expression.object);

    if (typeof object !== "object" || object === null) {
      throw new Error("Can only access properties of objects");
    }

    return object[expression.name];
  }

  /**
   * Evaluates property assignment
   * @param {Object} expression - Property assignment expression
   * @returns {any} Assigned value
   */
  evaluatePropertyAssign(expression) {
    const object = this.evaluateExpression(expression.object);
    const value = this.evaluateExpression(expression.value);

    if (typeof object !== "object" || object === null) {
      throw new Error("Can only assign to properties of objects");
    }

    object[expression.name] = value;
    return value;
  }

  /**
   * Evaluates logical expression
   * @param {Object} expression - Logical expression
   * @returns {any} Logical result
   */
  evaluateLogicalExpression(expression) {
    const left = this.evaluateExpression(expression.left);

    if (expression.operator === "OR") {
      // Short-circuit evaluation for OR
      if (this.isTruthy(left)) {
        return left;
      }
      return this.evaluateExpression(expression.right);
    }

    if (expression.operator === "AND") {
      // Short-circuit evaluation for AND
      if (!this.isTruthy(left)) {
        return left;
      }
      return this.evaluateExpression(expression.right);
    }

    throw new Error(`Unknown logical operator: ${expression.operator}`);
  }

  /**
   * Evaluates compound assignment
   * @param {Object} expression - Compound assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundAssign(expression) {
    const currentValue = this.environment.get(expression.name);
    const rightValue = this.evaluateExpression(expression.value);
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    this.environment.assign(expression.name, newValue);
    return newValue;
  }

  /**
   * Evaluates compound array assignment
   * @param {Object} expression - Compound array assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundArrayAssign(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);
    const rightValue = this.evaluateExpression(expression.value);

    if (!Array.isArray(array)) {
      throw new Error("Can only assign to elements of arrays");
    }
    if (typeof index !== "number") {
      throw new Error("Array index must be a number");
    }
    if (index < 0 || index >= array.length) {
      throw new Error("Array index out of bounds");
    }

    const currentValue = array[index];
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    array[index] = newValue;
    return newValue;
  }

  /**
   * Evaluates compound property assignment
   * @param {Object} expression - Compound property assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundPropertyAssign(expression) {
    const object = this.evaluateExpression(expression.object);
    const rightValue = this.evaluateExpression(expression.value);

    if (typeof object !== "object" || object === null) {
      throw new Error("Can only assign to properties of objects");
    }

    const currentValue = object[expression.name];
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    object[expression.name] = newValue;
    return newValue;
  }

  /**
   * Performs compound operation
   * @param {any} left - Left operand
   * @param {string} operator - Compound operator
   * @param {any} right - Right operand
   * @returns {any} Operation result
   */
  performCompoundOperation(left, operator, right) {
    switch (operator) {
      case "PLUS_EQUAL":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        throw new Error("Cannot add non-numeric values");

      case "MINUS_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Can only subtract numbers");
        }
        return left - right;

      case "STAR_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Can only multiply numbers");
        }
        return left * right;

      case "SLASH_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Can only divide numbers");
        }
        if (right === 0) {
          throw new Error("Division by zero");
        }
        return left / right;

      default:
        throw new Error(`Unknown compound operator: ${operator}`);
    }
  }

  /**
   * Evaluates postfix expression (increment/decrement)
   * @param {Object} expression - Postfix expression
   * @returns {any} Postfix result
   */
  evaluatePostfixExpression(expression) {
    const operand = this.evaluateExpression(expression.operand);

    if (expression.operator === "PLUS_PLUS") {
      if (typeof operand !== "number") {
        throw new Error("Can only increment numbers");
      }
      const newValue = operand + 1;

      // Update the variable if it's a variable reference
      if (expression.operand.type === "Variable") {
        this.environment.assign(expression.operand.name, newValue);
      } else if (expression.operand.type === "PropertyAccess") {
        const object = this.evaluateExpression(expression.operand.object);
        if (typeof object !== "object" || object === null) {
          throw new Error("Can only increment properties of objects");
        }
        object[expression.operand.name] = newValue;
      } else if (expression.operand.type === "ArrayAccess") {
        const array = this.evaluateExpression(expression.operand.array);
        const index = this.evaluateExpression(expression.operand.index);
        if (!Array.isArray(array)) {
          throw new Error("Can only increment elements of arrays");
        }
        if (typeof index !== "number") {
          throw new Error("Array index must be a number");
        }
        if (index < 0 || index >= array.length) {
          throw new Error("Array index out of bounds");
        }
        array[index] = newValue;
      } else {
        throw new Error("Invalid increment target");
      }

      return operand; // Return the original value (postfix behavior)
    }

    if (expression.operator === "MINUS_MINUS") {
      if (typeof operand !== "number") {
        throw new Error("Can only decrement numbers");
      }
      const newValue = operand - 1;

      // Update the variable if it's a variable reference
      if (expression.operand.type === "Variable") {
        this.environment.assign(expression.operand.name, newValue);
      } else if (expression.operand.type === "PropertyAccess") {
        const object = this.evaluateExpression(expression.operand.object);
        if (typeof object !== "object" || object === null) {
          throw new Error("Can only decrement properties of objects");
        }
        object[expression.operand.name] = newValue;
      } else if (expression.operand.type === "ArrayAccess") {
        const array = this.evaluateExpression(expression.operand.array);
        const index = this.evaluateExpression(expression.operand.index);
        if (!Array.isArray(array)) {
          throw new Error("Can only decrement elements of arrays");
        }
        if (typeof index !== "number") {
          throw new Error("Array index must be a number");
        }
        if (index < 0 || index >= array.length) {
          throw new Error("Array index out of bounds");
        }
        array[index] = newValue;
      } else {
        throw new Error("Invalid decrement target");
      }

      return operand; // Return the original value (postfix behavior)
    }

    throw new Error(`Unknown postfix operator: ${expression.operator}`);
  }

  /**
   * Converts a value to string for display
   * @param {any} value - Value to convert
   * @returns {string} String representation
   */
  stringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return "[" + value.map((v) => this.stringify(v)).join(", ") + "]";
    }
    return value.toString();
  }
}

/**
 * Class to handle variable environment
 */
class Environment {
  constructor(enclosing = null) {
    this.values = {};
    this.enclosing = enclosing;
  }

  /**
   * Defines a variable in the environment
   * @param {string} name - Variable name
   * @param {any} value - Variable value
   */
  define(name, value) {
    this.values[name] = value;
  }

  /**
   * Assigns a value to an existing variable
   * @param {string} name - Variable name
   * @param {any} value - Value to assign
   */
  assign(name, value) {
    if (name in this.values) {
      this.values[name] = value;
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new Error(`Undefined variable: ${name}`);
  }

  /**
   * Gets the value of a variable
   * @param {string} name - Variable name
   * @returns {any} Variable value
   */
  get(name) {
    if (name in this.values) {
      return this.values[name];
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new Error(`Undefined variable: ${name}`);
  }
}

/**
 * Exception class for return statements
 */
class ReturnException {
  constructor(value) {
    this.value = value;
  }
}

/**
 * Exception class for break statements
 */
class BreakException {
  constructor() {
    this.type = "break";
  }
}

/**
 * Exception class for continue statements
 */
class ContinueException {
  constructor() {
    this.type = "continue";
  }
}

module.exports = Evaluator;
