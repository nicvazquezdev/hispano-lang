/**
 * Tests for Educational Programming Language in Spanish
 * Validates basic interpreter functionality
 */

const { interpret, run, getVariables, clearVariables } = require("../main.js");

// Colors for output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

let testsPassed = 0;
let testsFailed = 0;

/**
 * Executes an individual test
 * @param {string} description - Test description
 * @param {Function} testFunction - Function that executes the test
 */
function test(description, testFunction) {
  try {
    clearVariables(); // Clear variables before each test
    testFunction();
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  Error: ${error.message}`);
    testsFailed++;
  }
}

/**
 * Verifies that two values are equal
 * @param {any} actual - Actual value
 * @param {any} expected - Expected value
 * @param {string} message - Error message
 */
function assertEquals(actual, expected, message = "") {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message} - Expected: ${JSON.stringify(
        expected,
      )}, Actual: ${JSON.stringify(actual)}`,
    );
  }
}

/**
 * Verifies that a condition is true
 * @param {boolean} condition - Condition to verify
 * @param {string} message - Error message
 */
function assertTrue(condition, message = "") {
  if (!condition) {
    throw new Error(`${message} - Expected true but got false`);
  }
}

/**
 * Executes all tests
 */
function runTests() {
  console.log(
    `${colors.bold}${colors.yellow}🧪 Running Tests for Educational Programming Language in Spanish${colors.reset}\n`,
  );

  // Test 1: Basic variables
  test("Basic variable declarations", () => {
    const code = `
      variable numero = 42
      variable texto = "hola"
      variable booleano = verdadero
    `;

    const result = interpret(code);
    assertTrue(result.success, "Code should execute without errors");

    const variables = getVariables();
    assertEquals(variables.numero, 42, "Variable numero should be 42");
    assertEquals(variables.texto, "hola", 'Variable texto should be "hola"');
    assertEquals(variables.booleano, true, "Variable booleano should be true");
  });

  // Test 2: Show values
  test("Show command with different types", () => {
    const code = `
      variable x = 10
      mostrar x
      mostrar "texto directo"
    `;

    const output = run(code);
    assertEquals(
      output,
      ["10", "texto directo"],
      "Output should show correct values",
    );
  });

  // Test 3: Show variables
  test("Show variables", () => {
    const code = `
      variable nombre = "Juan"
      variable apellido = "Pérez"
      mostrar nombre
      mostrar apellido
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Juan", "Pérez"],
      "Should show variable values correctly",
    );
  });

  // Test 4: Arithmetic operations
  test("Arithmetic operations", () => {
    const code = `
      variable a = 20
      variable b = 4
      variable suma = a + b
      variable resta = a - b
      variable multiplicacion = a * b
      variable division = a / b
      mostrar suma
      mostrar resta
      mostrar multiplicacion
      mostrar division
    `;

    const output = run(code);
    assertEquals(
      output,
      ["24", "16", "80", "5"],
      "Arithmetic operations should work correctly",
    );
  });

  // Test 5: String concatenation
  test("String concatenation", () => {
    const code = `
      variable nombre = "Juan"
      variable apellido = "Pérez"
      variable nombreCompleto = nombre + " " + apellido
      mostrar nombreCompleto
    `;

    const output = run(code);
    assertEquals(output, ["Juan Pérez"], "String concatenation should work");
  });

  // Test 6: Comparison operators
  test("Comparison operators", () => {
    const code = `
      variable a = 10
      variable b = 5
      variable mayor = a > b
      variable menor = a < b
      variable igual = a == 10
      variable diferente = a != b
      mostrar mayor
      mostrar menor
      mostrar igual
      mostrar diferente
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false", "true", "true"],
      "Comparison operators should work correctly",
    );
  });

  // Test 7: Basic conditional (if)
  test("Basic if statement", () => {
    const code = `
      variable edad = 18
      si edad >= 18 {
          mostrar "mayor de edad"
      }
    `;

    const output = run(code);
    assertEquals(output, ["mayor de edad"], "Basic if statement should work");
  });

  // Test 8: If-else statement
  test("If-else statement", () => {
    const code = `
      variable edad = 16
      si edad >= 18 {
          mostrar "mayor de edad"
      } sino {
          mostrar "menor de edad"
      }
    `;

    const output = run(code);
    assertEquals(output, ["menor de edad"], "If-else statement should work");
  });

  // Test 9: Multiple conditions
  test("Multiple conditions", () => {
    const code = `
      variable a = 10
      variable b = 5
      si a > b {
          mostrar "a es mayor"
      }
      si a == 10 {
          mostrar "a es igual a 10"
      }
      si b < 10 {
          mostrar "b es menor que 10"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["a es mayor", "a es igual a 10", "b es menor que 10"],
      "Multiple conditions should work",
    );
  });

  // Test 10: Error handling - undefined variable
  test("Error handling - undefined variable", () => {
    const code = `
      mostrar variableNoDefinida
    `;

    const result = interpret(code);
    assertTrue(!result.success, "Should fail when using undefined variable");
    assertTrue(
      result.error.includes("Undefined variable"),
      "Error should mention undefined variable",
    );
  });

  // Test 11: Unary operators
  test("Unary operators", () => {
    const code = `
      variable a = 10
      variable negativo = -a
      variable booleano = verdadero
      variable negacion = !booleano
      mostrar negativo
      mostrar negacion
    `;

    const output = run(code);
    assertEquals(
      output,
      ["-10", "false"],
      "Unary operators should work correctly",
    );
  });

  // Test 12: Division by zero error
  test("Error handling - division by zero", () => {
    const code = `
      variable resultado = 10 / 0
    `;

    const result = interpret(code);
    assertTrue(!result.success, "Should fail when dividing by zero");
    assertTrue(
      result.error.includes("Division by zero"),
      "Error should mention division by zero",
    );
  });

  // Test 13: Basic while loop
  test("Basic while loop", () => {
    const code = `
      variable contador = 1
      mientras contador <= 3 {
          mostrar contador
          contador = contador + 1
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "2", "3"],
      "Basic while loop should work correctly",
    );
  });

  // Test 14: While loop with condition
  test("While loop with condition", () => {
    const code = `
      variable i = 5
      mientras i > 0 {
          mostrar i
          i = i - 1
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "4", "3", "2", "1"],
      "While loop with condition should work",
    );
  });

  // Test 15: While loop that never executes
  test("While loop that never executes", () => {
    const code = `
      variable x = 10
      mientras x < 5 {
          mostrar "esto no se ejecuta"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [],
      "While loop with false condition should not execute",
    );
  });

  // Test 16: Basic function declaration
  test("Basic function declaration", () => {
    const code = `
      funcion saludar() {
          mostrar "Hola mundo"
      }
      saludar()
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola mundo"],
      "Basic function should work correctly",
    );
  });

  // Test 17: Function with parameters
  test("Function with parameters", () => {
    const code = `
      funcion sumar(a, b) {
          retornar a + b
      }
      variable resultado = sumar(5, 3)
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["8"], "Function with parameters should work");
  });

  // Test 18: Function with return value
  test("Function with return value", () => {
    const code = `
      funcion multiplicar(x, y) {
          retornar x * y
      }
      variable producto = multiplicar(4, 6)
      mostrar producto
    `;

    const output = run(code);
    assertEquals(output, ["24"], "Function with return value should work");
  });

  // Test 19: Function without return
  test("Function without return", () => {
    const code = `
      funcion mostrarMensaje() {
          mostrar "Función sin retorno"
      }
      variable resultado = mostrarMensaje()
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Función sin retorno", "null"],
      "Function without return should work",
    );
  });

  // Test 20: Complex example with all features
  test("Complex example - calculator with functions", () => {
    const code = `
      funcion calcular(a, b) {
          variable suma = a + b
          variable producto = a * b
          mostrar "Suma:"
          mostrar suma
          mostrar "Producto:"
          mostrar producto
          retornar suma
      }
      
      variable resultado = calcular(10, 5)
      mostrar "Resultado final:"
      mostrar resultado
      
      si resultado > 10 {
          mostrar "El resultado es mayor que 10"
      }
    `;

    const output = run(code);
    const expectedOutput = [
      "Suma:",
      "15",
      "Producto:",
      "50",
      "Resultado final:",
      "15",
      "El resultado es mayor que 10",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Complex calculator with functions should work correctly",
    );
  });

  // Show results
  console.log(`\n${colors.bold}📊 Test Results:${colors.reset}`);
  console.log(`${colors.green}Tests passed: ${testsPassed}${colors.reset}`);
  console.log(`${colors.red}Tests failed: ${testsFailed}${colors.reset}`);

  const totalTests = testsPassed + testsFailed;
  const successRate =
    totalTests > 0 ? ((testsPassed / totalTests) * 100).toFixed(1) : 0;

  console.log(`\nSuccess rate: ${successRate}%`);

  if (testsFailed === 0) {
    console.log(
      `\n${colors.green}${colors.bold}🎉 All tests passed! The interpreter is working correctly.${colors.reset}`,
    );
  } else {
    console.log(
      `\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Check the implementation.${colors.reset}`,
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { test, assertEquals, assertTrue, runTests };
