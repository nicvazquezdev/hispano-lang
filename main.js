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
variable numeros = [1, 2, 3, 4, 5]

// Caso positivo: número presente
mostrar numeros.contiene(3)

// Caso negativo: número ausente
mostrar numeros.contiene(10)

// Strings en arrays
variable palabras = ["hola", "mundo", "programacion"]
mostrar palabras.contiene("hola")
mostrar palabras.contiene("adios")

// Booleanos en arrays
variable valores = [verdadero, falso]
mostrar valores.contiene(verdadero)
mostrar valores.contiene(falso)

// Arrays mixtos
variable mixto = [1, "hola", verdadero, {clave: "valor"}]
mostrar mixto.contiene(1)
mostrar mixto.contiene("hola")
mostrar mixto.contiene(verdadero)
mostrar mixto.contiene({clave: "valor"}) // depende de si comparás por referencia o valor
mostrar mixto.contiene(99)

// Array vacío
variable vacio = []
mostrar vacio.contiene(1)
mostrar vacio.contiene("nada")

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
