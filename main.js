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
// Casos con .minusculas()

// String literal
mostrar "Hola".minusculas()

// Variable string
variable texto = "Hola"
mostrar texto.minusculas()

// String vacío
mostrar "".minusculas()

// String con espacios
mostrar "   ".minusculas()

// Caracteres especiales
mostrar "¡Hola, mundo!".minusculas()

// Unicode / acentos / emojis
mostrar "canción".minusculas()
mostrar "ñandú".minusculas()
mostrar "😀".minusculas()

// Concatenación
variable saludo = "hola"
variable nombre = "nico"
mostrar (saludo + " " + nombre).minusculas().longitud()

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
