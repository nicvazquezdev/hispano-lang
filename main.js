/**
 * HispanoLang
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
 // Asignación directa
variable a = nulo
variable b = indefinido
mostrar a
mostrar b

// Comparaciones básicas
mostrar a == nulo
mostrar b == indefinido
mostrar a == indefinido
mostrar b == nulo

// Uso en condicionales
si a == nulo {
  mostrar "a es nulo"
}

si b == indefinido {
  mostrar "b es indefinido"
}

// En arrays
variable lista = [1, nulo, 3, indefinido, 5]
mostrar lista
mostrar lista.longitud()

// En objetos
variable objeto = {x: nulo, y: indefinido}
mostrar objeto

// Sobrescribir valores
objeto.x = 42
objeto.y = "texto"
mostrar objeto

// Comparaciones estrictas
mostrar nulo == nulo
mostrar indefinido == indefinido
mostrar nulo != indefinido

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
