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

// Recorrer números y mostrarlos
numeros.recorrer(funcion(elemento) {
  mostrar elemento
})

// Recorrer con índice
numeros.recorrer(funcion(elemento, indice) {
  mostrar "Elemento: " + elemento + " en índice " + indice
})

// Recorrer strings
variable palabras = ["hola", "mundo", "programacion"]
palabras.recorrer(funcion(palabra) {
  mostrar palabra.mayusculas()
})

// Recorrer array mixto
variable mixto = [1, "hola", verdadero, {clave: "valor"}]
mixto.recorrer(funcion(item) {
  mostrar item
})

// Recorrer array vacío
variable vacio = []
vacio.recorrer(funcion(item) {
  mostrar "Esto no debería ejecutarse"
})

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
