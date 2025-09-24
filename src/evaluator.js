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
      case "MostrarStatement":
        return this.executeMostrarStatement(statement);
      case "ExpressionStatement":
        return this.executeExpressionStatement(statement);
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

      default:
        throw new Error(`Unrecognized expression type: ${expression.type}`);
    }
  }

  /**
   * Converts a value to string for display
   * @param {any} value - Value to convert
   * @returns {string} String representation
   */
  stringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return value;
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

module.exports = Evaluator;
