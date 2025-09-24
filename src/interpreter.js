/**
 * Main interpreter for educational programming language in Spanish
 * Coordinates tokenizer, parser and evaluator
 */

const Tokenizer = require("./tokenizer");
const Parser = require("./parser");
const Evaluator = require("./evaluator");

class Interpreter {
  constructor() {
    this.tokenizer = new Tokenizer();
    this.evaluator = new Evaluator();
  }

  /**
   * Interprets source code
   * @param {string} source - Source code to interpret
   * @returns {Object} Interpretation result
   */
  interpret(source) {
    try {
      // 1. Tokenize source code
      const tokens = this.tokenizer.tokenize(source);

      // 2. Parse tokens into AST
      const parser = new Parser(tokens);
      const statements = parser.parse();

      // 3. Evaluate statements
      const output = this.evaluator.evaluate(statements);

      return {
        success: true,
        output: output,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error.message,
      };
    }
  }

  /**
   * Interprets source code and returns only the output
   * @param {string} source - Source code to interpret
   * @returns {Array} List of outputs
   */
  run(source) {
    const result = this.interpret(source);
    return result.output;
  }

  /**
   * Gets the current variable environment
   * @returns {Object} Variable environment
   */
  getEnvironment() {
    return this.evaluator.environment.values;
  }

  /**
   * Clears the variable environment
   */
  clearEnvironment() {
    this.evaluator = new Evaluator();
  }
}

module.exports = Interpreter;
