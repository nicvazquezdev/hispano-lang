/**
 * Educational Programming Language in Spanish
 * A simple interpreter to teach programming without language barriers
 *
 * Features:
 * - Variables: variable nombre = valor
 * - Show: mostrar "texto" o mostrar variable
 */

const Interpreter = require("./src/interpreter");

// Create an interpreter instance
const interpreter = new Interpreter();

/**
 * Main function to interpret code
 * @param {string} code - Source code in Spanish
 * @returns {Object} Interpretation result
 */
function interpret(code) {
  return interpreter.interpret(code);
}

/**
 * Executes code and returns only the output
 * @param {string} code - Source code in Spanish
 * @returns {Array} List of outputs
 */
function run(code) {
  return interpreter.run(code);
}

/**
 * Gets the defined variables
 * @returns {Object} Variables in the current environment
 */
function getVariables() {
  return interpreter.getEnvironment();
}

/**
 * Clears the variable environment
 */
function clearVariables() {
  interpreter.clearEnvironment();
}

// Example usage

const exampleCode = `
variable numeros = [1, 2, 3]

// Agregar un número
numeros.agregar(4)
mostrar numeros
mostrar numeros.longitud()

// Agregar un string
numeros.agregar("hola")
mostrar numeros
mostrar numeros.longitud()

// Agregar un booleano
numeros.agregar(verdadero)
mostrar numeros
mostrar numeros.longitud()

// Agregar otro array
numeros.agregar([5, 6])
mostrar numeros
mostrar numeros.longitud()

// Agregar un objeto
numeros.agregar({clave: "valor"})
mostrar numeros

`;

console.log("Code to execute:");
console.log(exampleCode);
console.log("Result:");

const result = interpret(exampleCode);

if (result.success) {
  console.log("✓ Execution successful");
  console.log("Defined variables:", getVariables());
} else {
  console.log("✗ Error:", result.error);
}

// Export functions for use in other modules
module.exports = {
  interpret,
  run,
  getVariables,
  clearVariables,
  Interpreter,
};
