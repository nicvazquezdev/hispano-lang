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
      this.executeBlock(statement.body);
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
        this.executeBlock(statement.body);

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

      case "Logical":
        return this.evaluateLogicalExpression(expression);

      case "Call":
        return this.evaluateCallExpression(expression);

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
        this.checkNumberOperands(operator, left, right);
        return left > right;

      case "GREATER_EQUAL":
        this.checkNumberOperands(operator, left, right);
        return left >= right;

      case "LESS":
        this.checkNumberOperands(operator, left, right);
        return left < right;

      case "LESS_EQUAL":
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

module.exports = Evaluator;
