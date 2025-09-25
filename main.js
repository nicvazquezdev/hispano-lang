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
// Incremento en arrays
variable numeros = [1, 2, 3]
mostrar "Array inicial:"
mostrar numeros[0]
numeros[0]++
mostrar "Después de numeros[0]++:"
mostrar numeros[0]

// Incremento en objetos
variable persona = {edad: 25}
mostrar "Edad inicial:"
mostrar persona.edad
persona.edad--
mostrar "Después de persona.edad--:"
mostrar persona.edad

// Operadores de asignación compuesta
variable numero = 10
mostrar "Número inicial:"
mostrar numero

numero += 5
mostrar "Después de numero += 5:"
mostrar numero

numero *= 2
mostrar "Después de numero *= 2:"
mostrar numero

numero -= 3
mostrar "Después de numero -= 3:"
mostrar numero

numero /= 4
mostrar "Después de numero /= 4:"
mostrar numero

// Con arrays
variable numeros = [10, 20, 30]
numeros[0] += 5
mostrar "Array después de numeros[0] += 5:"
mostrar numeros[0]

// Con objetos
variable cuenta = {saldo: 1000}
cuenta.saldo += 500
mostrar "Saldo después de cuenta.saldo += 500:"
mostrar cuenta.saldo
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
