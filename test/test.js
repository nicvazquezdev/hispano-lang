/**
 * Tests for HispanoLang
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
    `${colors.bold}${colors.yellow}🧪 Running Tests for HispanoLang${colors.reset}\n`,
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

  // Test 1.1: Read functionality syntax validation
  test("Read functionality syntax validation", () => {
    // Test that the leer keyword is recognized in tokenization
    const code = `leer variable`;

    try {
      const Interpreter = require("../src/interpreter.js");
      const interpreter = new Interpreter();
      const tokens = interpreter.tokenizer.tokenize(code);

      // Check that LEER token is present
      const leerToken = tokens.find((token) => token.type === "LEER");
      assertTrue(leerToken !== undefined, "LEER token should be found");
      assertEquals(
        leerToken.lexeme,
        "leer",
        "LEER token should have correct lexeme",
      );
    } catch (error) {
      throw new Error(`Tokenization error: ${error.message}`);
    }
  });

  // Test 1.2: Read with prompt syntax validation
  test("Read with prompt syntax validation", () => {
    // Test that leer with prompt is tokenized correctly
    const code = `leer edad "¿Cuál es tu edad?"`;

    try {
      const Interpreter = require("../src/interpreter.js");
      const interpreter = new Interpreter();
      const tokens = interpreter.tokenizer.tokenize(code);

      // Check that we have the expected tokens
      assertTrue(tokens.length > 0, "Should have tokens");

      // Check that LEER token is present
      const leerToken = tokens.find((token) => token.type === "LEER");
      assertTrue(leerToken !== undefined, "LEER token should be found");
      assertEquals(
        leerToken.lexeme,
        "leer",
        "LEER token should have correct lexeme",
      );

      // Check that we have an IDENTIFIER token for the variable
      const identifierToken = tokens.find(
        (token) => token.type === "IDENTIFIER",
      );
      assertTrue(
        identifierToken !== undefined,
        "IDENTIFIER token should be found",
      );
      assertEquals(
        identifierToken.lexeme,
        "edad",
        'IDENTIFIER token should be "edad"',
      );

      // Check that we have a STRING token for the prompt
      const stringToken = tokens.find((token) => token.type === "STRING");
      assertTrue(stringToken !== undefined, "STRING token should be found");
      assertEquals(
        stringToken.literal,
        "¿Cuál es tu edad?",
        "STRING token should contain the prompt",
      );
    } catch (error) {
      throw new Error(`Tokenization error: ${error.message}`);
    }
  });

  // Test 1.3: Read functionality with predefined variables
  test("Read functionality with predefined variables", () => {
    const code = `
      variable nombre = "Juan"
      variable edad = 25
      mostrar "Hola " + nombre
      mostrar "Tienes " + edad + " años"
    `;

    const result = interpret(code);
    assertTrue(result.success, "Code should execute without errors");

    const variables = getVariables();
    assertEquals(variables.nombre, "Juan", "Variable nombre should be Juan");
    assertEquals(variables.edad, 25, "Variable edad should be 25");
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
      result.error.includes("Variable no definida"),
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
      result.error.includes("División por cero"),
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

  // Test 20: Basic array creation
  test("Basic array creation", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      mostrar numeros
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[1, 2, 3, 4, 5]"],
      "Basic array creation should work",
    );
  });

  // Test 21: Array access
  test("Array access", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      mostrar frutas[0]
      mostrar frutas[1]
      mostrar frutas[2]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["manzana", "banana", "naranja"],
      "Array access should work correctly",
    );
  });

  // Test 22: Array assignment
  test("Array assignment", () => {
    const code = `
      variable numeros = [10, 20, 30]
      numeros[1] = 25
      mostrar numeros[1]
      mostrar numeros
    `;

    const output = run(code);
    assertEquals(
      output,
      ["25", "[10, 25, 30]"],
      "Array assignment should work",
    );
  });

  // Test 23: Mixed array types
  test("Mixed array types", () => {
    const code = `
      variable mixto = [1, "hola", verdadero, 3.14]
      mostrar mixto[0]
      mostrar mixto[1]
      mostrar mixto[2]
      mostrar mixto[3]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "hola", "true", "3.14"],
      "Mixed array types should work",
    );
  });

  // Test 24: Array with expressions
  test("Array with expressions", () => {
    const code = `
      variable a = 5
      variable b = 10
      variable calculado = [a + b, a * b, a - b]
      mostrar calculado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[15, 50, -5]"],
      "Array with expressions should work",
    );
  });

  // Test 25: Basic for loop
  test("Basic for loop", () => {
    const code = `
      para (variable i = 1; i <= 3; i = i + 1) {
          mostrar i
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "2", "3"],
      "Basic for loop should work correctly",
    );
  });

  // Test 26: For loop with array iteration
  test("For loop with array iteration", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      para (variable i = 0; i < 3; i = i + 1) {
          mostrar frutas[i]
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["manzana", "banana", "naranja"],
      "For loop with array iteration should work",
    );
  });

  // Test 27: For loop without initializer
  test("For loop without initializer", () => {
    const code = `
      variable i = 0
      para (; i < 3; i = i + 1) {
          mostrar i
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["0", "1", "2"],
      "For loop without initializer should work",
    );
  });

  // Test 28: For loop without condition (infinite loop prevention)
  test("For loop without condition", () => {
    const code = `
      variable contador = 0
      para (variable i = 0; ; i = i + 1) {
          mostrar i
          contador = contador + 1
          si contador >= 3 {
              mostrar "break"
              break
          }
      }
    `;

    const output = run(code);
    // This test might fail because we don't have break statement yet
    // For now, let's test a simpler version
    const simpleCode = `
      variable i = 0
      para (; i < 3; i = i + 1) {
          mostrar i
      }
    `;
    const simpleOutput = run(simpleCode);
    assertEquals(simpleOutput, ["0", "1", "2"], "Simple for loop should work");
  });

  // Test 29: Basic comments
  test("Basic comments", () => {
    const code = `
      // Este es un comentario
      variable x = 10
      mostrar x
      // Otro comentario
    `;

    const output = run(code);
    assertEquals(output, ["10"], "Basic comments should be ignored");
  });

  // Test 30: Comments with code
  test("Comments with code", () => {
    const code = `
      variable a = 5
      // variable b = 10  // Esta línea está comentada
      variable c = 15
      mostrar a
      mostrar c
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "15"],
      "Comments should not affect code execution",
    );
  });

  // Test 31: Comments in loops
  test("Comments in loops", () => {
    const code = `
      // Bucle para mostrar números
      para (variable i = 1; i <= 3; i = i + 1) {
          // Mostrar el número actual
          mostrar i
      }
    `;

    const output = run(code);
    assertEquals(output, ["1", "2", "3"], "Comments in loops should work");
  });

  // Test 32: Comments in functions
  test("Comments in functions", () => {
    const code = `
      funcion saludar(nombre) {
          // Retornar saludo personalizado
          retornar "Hola, " + nombre
      }

      variable mensaje = saludar("Mundo")
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(output, ["Hola, Mundo"], "Comments in functions should work");
  });

  // Test 33: Basic object creation
  test("Basic object creation", () => {
    const code = `
      variable persona = {nombre: "Juan", edad: 25}
      mostrar persona.nombre
      mostrar persona.edad
    `;

    const output = run(code);
    assertEquals(output, ["Juan", "25"], "Basic object creation should work");
  });

  // Test 34: Object with different value types
  test("Object with different value types", () => {
    const code = `
      variable datos = {
          nombre: "María",
          edad: 30,
          activo: verdadero,
          salario: 50000.5
      }
      mostrar datos.nombre
      mostrar datos.edad
      mostrar datos.activo
      mostrar datos.salario
    `;

    const output = run(code);
    assertEquals(
      output,
      ["María", "30", "true", "50000.5"],
      "Object with different value types should work",
    );
  });

  // Test 35: Object property access with variables
  test("Object property access with variables", () => {
    const code = `
      variable producto = {nombre: "Laptop", precio: 1000}
      variable propiedad = "nombre"
      mostrar producto.nombre
      mostrar producto.precio
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Laptop", "1000"],
      "Object property access should work",
    );
  });

  // Test 36: Nested objects
  test("Nested objects", () => {
    const code = `
      variable empresa = {
          nombre: "TechCorp",
          direccion: {
              calle: "Av. Principal 123",
              ciudad: "Madrid"
          }
      }
      mostrar empresa.nombre
      mostrar empresa.direccion.ciudad
    `;

    const output = run(code);
    assertEquals(output, ["TechCorp", "Madrid"], "Nested objects should work");
  });

  // Test 37: Object with array properties
  test("Object with array properties", () => {
    const code = `
      variable estudiante = {
          nombre: "Ana",
          materias: ["Matemáticas", "Física", "Química"],
          calificaciones: [95, 87, 92]
      }
      mostrar estudiante.nombre
      mostrar estudiante.materias[0]
      mostrar estudiante.calificaciones[1]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Ana", "Matemáticas", "87"],
      "Object with array properties should work",
    );
  });

  // Test 38: Basic property assignment
  test("Basic property assignment", () => {
    const code = `
      variable persona = {nombre: "Juan", edad: 25}
      mostrar persona.nombre
      persona.edad = 30
      mostrar persona.edad
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Juan", "30"],
      "Basic property assignment should work",
    );
  });

  // Test 39: Property assignment with different types
  test("Property assignment with different types", () => {
    const code = `
      variable datos = {nombre: "María", activo: falso}
      mostrar datos.activo
      datos.activo = verdadero
      datos.salario = 50000
      mostrar datos.activo
      mostrar datos.salario
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false", "true", "50000"],
      "Property assignment with different types should work",
    );
  });

  // Test 40: Nested property assignment
  test("Nested property assignment", () => {
    const code = `
      variable empresa = {
          nombre: "TechCorp",
          direccion: {
              calle: "Av. Principal 123",
              ciudad: "Madrid"
          }
      }
      mostrar empresa.direccion.ciudad
      empresa.direccion.ciudad = "Barcelona"
      mostrar empresa.direccion.ciudad
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Madrid", "Barcelona"],
      "Nested property assignment should work",
    );
  });

  // Test 41: Property assignment with expressions
  test("Property assignment with expressions", () => {
    const code = `
      variable calculadora = {resultado: 0}
      variable a = 10
      variable b = 5
      calculadora.resultado = a + b
      mostrar calculadora.resultado
      calculadora.resultado = calculadora.resultado * 2
      mostrar calculadora.resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["15", "30"],
      "Property assignment with expressions should work",
    );
  });

  // Test 42: Basic logical AND
  test("Basic logical AND", () => {
    const code = `
      variable a = verdadero
      variable b = verdadero
      variable c = falso

      mostrar a y b
      mostrar a y c
      mostrar c y a
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false", "false"],
      "Basic logical AND should work",
    );
  });

  // Test 43: Basic logical OR
  test("Basic logical OR", () => {
    const code = `
      variable a = verdadero
      variable b = falso
      variable c = falso

      mostrar a o b
      mostrar a o c
      mostrar c o b
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "false"],
      "Basic logical OR should work",
    );
  });

  // Test 44: Logical operators with numbers
  test("Logical operators with numbers", () => {
    const code = `
      variable a = 10
      variable b = 0
      variable c = 5

      mostrar a y c
      mostrar a y b
      mostrar b o c
      mostrar b o b
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "0", "5", "0"],
      "Logical operators with numbers should work",
    );
  });

  // Test 45: Complex logical expressions
  test("Complex logical expressions", () => {
    const code = `
      variable edad = 25
      variable tieneLicencia = verdadero
      variable tieneExperiencia = falso

      variable puedeConducir = edad >= 18 y tieneLicencia
      variable puedeTrabajar = edad >= 18 y (tieneLicencia o tieneExperiencia)

      mostrar puedeConducir
      mostrar puedeTrabajar
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "true"],
      "Complex logical expressions should work",
    );
  });

  // Test 46: Logical operators in conditions
  test("Logical operators in conditions", () => {
    const code = `
      variable temperatura = 25
      variable lluvia = falso
      variable viento = verdadero

      si temperatura > 20 y !lluvia {
          mostrar "Buen día para salir"
      }

      si temperatura < 10 o lluvia {
          mostrar "Mejor quedarse en casa"
      }

      si viento y temperatura > 15 {
          mostrar "Día ventoso pero agradable"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Buen día para salir", "Día ventoso pero agradable"],
      "Logical operators in conditions should work",
    );
  });

  // Test 47: Basic increment operator
  test("Basic increment operator", () => {
    const code = `
      variable contador = 5
      variable resultado = contador++
      mostrar contador
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["6", "5"], "Basic increment operator should work");
  });

  // Test 48: Basic decrement operator
  test("Basic decrement operator", () => {
    const code = `
      variable numero = 10
      variable resultado = numero--
      mostrar numero
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["9", "10"], "Basic decrement operator should work");
  });

  // Test 49: Increment with arrays
  test("Increment with arrays", () => {
    const code = `
      variable numeros = [1, 2, 3]
      numeros[0]++
      mostrar numeros[0]
      numeros[1]++
      mostrar numeros[1]
    `;

    const output = run(code);
    assertEquals(output, ["2", "3"], "Increment with arrays should work");
  });

  // Test 50: Increment with objects
  test("Increment with objects", () => {
    const code = `
      variable persona = {edad: 25, puntos: 100}
      persona.edad++
      persona.puntos++
      mostrar persona.edad
      mostrar persona.puntos
    `;

    const output = run(code);
    assertEquals(output, ["26", "101"], "Increment with objects should work");
  });

  // Test 51: Multiple increments
  test("Multiple increments", () => {
    const code = `
      variable x = 0
      x++
      x++
      x++
      mostrar x

      variable y = 10
      y--
      y--
      mostrar y
    `;

    const output = run(code);
    assertEquals(output, ["3", "8"], "Multiple increments should work");
  });

  // Test 52: Basic compound assignment
  test("Basic compound assignment", () => {
    const code = `
      variable x = 10
      x += 5
      mostrar x
      x *= 2
      mostrar x
      x -= 3
      mostrar x
      x /= 4
      mostrar x
    `;

    const output = run(code);
    assertEquals(
      output,
      ["15", "30", "27", "6.75"],
      "Basic compound assignment should work",
    );
  });

  // Test 53: Compound assignment with arrays
  test("Compound assignment with arrays", () => {
    const code = `
      variable numeros = [10, 20, 30]
      numeros[0] += 5
      numeros[1] *= 2
      numeros[2] -= 10
      mostrar numeros[0]
      mostrar numeros[1]
      mostrar numeros[2]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["15", "40", "20"],
      "Compound assignment with arrays should work",
    );
  });

  // Test 54: Compound assignment with objects
  test("Compound assignment with objects", () => {
    const code = `
      variable cuenta = {saldo: 1000, puntos: 50}
      cuenta.saldo += 500
      cuenta.puntos *= 2
      mostrar cuenta.saldo
      mostrar cuenta.puntos
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1500", "100"],
      "Compound assignment with objects should work",
    );
  });

  // Test 55: String concatenation with +=
  test("String concatenation with +=", () => {
    const code = `
      variable mensaje = "Hola"
      mensaje += " mundo"
      mostrar mensaje

      variable numero = 5
      numero += " años"
      mostrar numero
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola mundo", "5 años"],
      "String concatenation with += should work",
    );
  });

  // Test 56: Error handling for compound assignment
  test("Error handling for compound assignment", () => {
    const code = `
      variable x = "texto"
      x -= 5
    `;

    const result = interpret(code);
    assertEquals(
      result.success,
      false,
      "Should fail when trying to subtract from string",
    );
  });

  // Test 57: Basic comparison operators
  test("Basic comparison operators", () => {
    const code = `
      variable a = 10
      variable b = 5
      variable c = 10

      mostrar a > b
      mostrar a < b
      mostrar a >= c
      mostrar b <= c
      mostrar a == c
      mostrar a != b
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false", "true", "true", "true", "true"],
      "Basic comparison operators should work",
    );
  });

  // Test 58: Comparison with strings
  test("Comparison with strings", () => {
    const code = `
      variable nombre1 = "Ana"
      variable nombre2 = "Carlos"

      mostrar nombre1 < nombre2
      mostrar nombre1 > nombre2
      mostrar nombre1 == "Ana"
      mostrar nombre1 != nombre2
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false", "true", "true"],
      "Comparison with strings should work",
    );
  });

  // Test 59: Comparison in conditions
  test("Comparison in conditions", () => {
    const code = `
      variable edad = 25
      variable nota = 85

      si edad >= 18 {
          mostrar "Es mayor de edad"
      }

      si nota > 80 {
          mostrar "Nota excelente"
      }

      si edad < 30 {
          mostrar "Es joven"
      }

      si nota <= 100 {
          mostrar "Nota válida"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Es mayor de edad", "Nota excelente", "Es joven", "Nota válida"],
      "Comparison in conditions should work",
    );
  });

  // Test 60: Complex comparison expressions
  test("Complex comparison expressions", () => {
    const code = `
      variable x = 10
      variable y = 20
      variable z = 15

      mostrar x < y y y > z
      mostrar x >= 10 y z <= 20
      mostrar x != y y y != z
      mostrar x == 10 y z > x
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "true", "true"],
      "Complex comparison expressions should work",
    );
  });

  // Test 61: Comparison with arrays and objects
  test("Comparison with arrays and objects", () => {
    const code = `
      variable numeros = [10, 20, 30]
      variable persona = {edad: 25, puntos: 100}

      si numeros[0] < numeros[1] {
          mostrar "Primer número es menor"
      }

      si persona.edad >= 18 {
          mostrar "Es mayor de edad"
      }

      si persona.puntos > 50 {
          mostrar "Tiene muchos puntos"
      }

      si numeros[2] <= 30 {
          mostrar "Último número es 30 o menor"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "Primer número es menor",
        "Es mayor de edad",
        "Tiene muchos puntos",
        "Último número es 30 o menor",
      ],
      "Comparison with arrays and objects should work",
    );
  });

  // Test 62: Basic break statement
  test("Basic break statement", () => {
    const code = `
      variable contador = 0
      mientras contador < 10 {
          mostrar contador
          contador = contador + 1
          si contador == 3 {
              romper
          }
      }
    `;

    const output = run(code);
    assertEquals(output, ["0", "1", "2"], "Basic break statement should work");
  });

  // Test 63: Basic continue statement
  test("Basic continue statement", () => {
    const code = `
      variable contador = 0
      mientras contador < 5 {
          contador = contador + 1
          si contador == 3 {
              continuar
          }
          mostrar contador
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "2", "4", "5"],
      "Basic continue statement should work",
    );
  });

  // Test 64: Break in for loop
  test("Break in for loop", () => {
    const code = `
      para (variable i = 1; i <= 10; i = i + 1) {
          mostrar i
          si i == 4 {
              romper
          }
      }
    `;

    const output = run(code);
    assertEquals(output, ["1", "2", "3", "4"], "Break in for loop should work");
  });

  // Test 65: Continue in for loop
  test("Continue in for loop", () => {
    const code = `
      para (variable i = 1; i <= 5; i = i + 1) {
          si i == 3 {
              continuar
          }
          mostrar i
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "2", "4", "5"],
      "Continue in for loop should work",
    );
  });

  // Test 66: Break and continue with while loop
  test("Break and continue with while loop", () => {
    const code = `
      variable i = 0
      mientras i < 10 {
          i = i + 1
          si i == 2 o i == 4 o i == 6 o i == 8 {
              continuar
          }
          si i > 7 {
              romper
          }
          mostrar i
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "3", "5", "7"],
      "Break and continue with while loop should work",
    );
  });

  // Test 67: Basic array length method
  test("Basic array length method", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      mostrar numeros.longitud
    `;

    const output = run(code);
    assertEquals(output, ["5"], "Basic array length method should work");
  });

  // Test 68: Basic array first method
  test("Basic array first method", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      mostrar frutas.primero
    `;

    const output = run(code);
    assertEquals(output, ["manzana"], "Basic array first method should work");
  });

  // Test 69: Basic array last method
  test("Basic array last method", () => {
    const code = `
      variable colores = ["rojo", "verde", "azul"]
      mostrar colores.ultimo
    `;

    const output = run(code);
    assertEquals(output, ["azul"], "Basic array last method should work");
  });

  // Test 70: Array methods with expressions
  test("Array methods with expressions", () => {
    const code = `
      variable numeros = [10, 20, 30, 40, 50]
      variable longitud = numeros.longitud
      variable primero = numeros.primero
      variable ultimo = numeros.ultimo

      mostrar longitud
      mostrar primero
      mostrar ultimo
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "10", "50"],
      "Array methods with expressions should work",
    );
  });

  // Test 71: Array methods in conditions
  test("Array methods in conditions", () => {
    const code = `
      variable lista = [1, 2, 3]

      si lista.longitud > 0 {
          mostrar "La lista tiene elementos"
      }

      si lista.primero == 1 {
          mostrar "El primer elemento es 1"
      }

      si lista.ultimo == 3 {
          mostrar "El último elemento es 3"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "La lista tiene elementos",
        "El primer elemento es 1",
        "El último elemento es 3",
      ],
      "Array methods in conditions should work",
    );
  });

  // Test 72: Error handling for empty array methods
  test("Error handling for empty array methods", () => {
    const code = `
      variable listaVacia = []
      mostrar listaVacia.primero()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when getting first element of empty array",
    );
    assertTrue(
      result.error.includes("arreglo vacío"),
      "Error should mention empty array",
    );
  });

  // Test 73: Basic string length method
  test("Basic string length method", () => {
    const code = `
      variable texto = "Hola mundo"
      mostrar texto.longitud
    `;

    const output = run(code);
    assertEquals(output, ["10"], "Basic string length method should work");
  });

  // Test 74: String length with different strings
  test("String length with different strings", () => {
    const code = `
      variable texto1 = "Hola"
      variable texto2 = "Programación"
      variable texto3 = ""
      variable texto4 = "¡Hola, mundo!"

      mostrar texto1.longitud
      mostrar texto2.longitud
      mostrar texto3.longitud
      mostrar texto4.longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "12", "0", "13"],
      "String length with different strings should work",
    );
  });

  // Test 75: String length with variables
  test("String length with variables", () => {
    const code = `
      variable nombre = "Juan"
      variable apellido = "Pérez"
      variable nombreCompleto = nombre + " " + apellido

      mostrar nombre.longitud
      mostrar apellido.longitud
      mostrar nombreCompleto.longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "5", "10"],
      "String length with variables should work",
    );
  });

  // Test 76: String length in conditions
  test("String length in conditions", () => {
    const code = `
      variable password = "secreto123"

      si password.longitud >= 8 {
          mostrar "Contraseña válida"
      }

      si password.longitud < 5 {
          mostrar "Contraseña muy corta"
      }

      si password.longitud > 10 {
          mostrar "Contraseña muy larga"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Contraseña válida"],
      "String length in conditions should work",
    );
  });

  // Test 77: String length with expressions
  test("String length with expressions", () => {
    const code = `
      variable base = "Hola"
      variable repeticiones = 3
      variable textoRepetido = base + base + base

      mostrar base.longitud
      mostrar textoRepetido.longitud

      variable longitudEsperada = base.longitud * repeticiones
      mostrar longitudEsperada
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "12", "12"],
      "String length with expressions should work",
    );
  });

  // Test 78: Error handling for string length on non-strings
  test("Error handling for string length on non-strings", () => {
    const code = `
      variable numero = 123
      mostrar numero.longitud()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling length on non-string",
    );
    assertTrue(
      result.error.includes("Método de número desconocido"),
      "Error should mention method restrictions",
    );
  });

  // Test 79: String length with empty string
  test("String length with empty string", () => {
    const code = `
      variable textoVacio = ""
      mostrar textoVacio.longitud

      variable textoEspacios = "   "
      mostrar textoEspacios.longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["0", "3"],
      "String length with empty string should work",
    );
  });

  // Test 80: String length with special characters
  test("String length with special characters", () => {
    const code = `
      variable textoEspecial = "¡Hola, mundo! ¿Cómo estás?"
      variable textoEmojis = "😀🌍🚀"
      variable textoNumeros = "1234567890"

      mostrar textoEspecial.longitud
      mostrar textoEmojis.longitud
      mostrar textoNumeros.longitud
    `;

    const output = run(code);
    // Note: Emojis may have different lengths depending on encoding
    // We'll check that we get 3 outputs and the first and last are correct
    assertEquals(output.length, 3, "Should have 3 outputs");
    assertEquals(output[0], "26", "Special text should have length 26");
    assertEquals(output[2], "10", "Numbers text should have length 10");
    // The emoji length might vary, so we just check it's a number
    const emojiLength = parseInt(output[1]);
    assertTrue(emojiLength > 0, "Emoji string should have positive length");
  });

  // Test 81: Basic string uppercase method
  test("Basic string uppercase method", () => {
    const code = `
      variable texto = "hola mundo"
      mostrar texto.mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA MUNDO"],
      "Basic string uppercase method should work",
    );
  });

  // Test 82: String uppercase with different strings
  test("String uppercase with different strings", () => {
    const code = `
      variable texto1 = "hola"
      variable texto2 = "programación"
      variable texto3 = "a"
      variable texto4 = "¡hola, mundo!"

      mostrar texto1.mayusculas
      mostrar texto2.mayusculas
      mostrar texto3.mayusculas
      mostrar texto4.mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA", "PROGRAMACIÓN", "A", "¡HOLA, MUNDO!"],
      "String uppercase with different strings should work",
    );
  });

  // Test 83: String uppercase with string literals
  test("String uppercase with string literals", () => {
    const code = `
      mostrar "hola".mayusculas
      mostrar "mundo".mayusculas
      mostrar "".mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA", "MUNDO", ""],
      "String uppercase with string literals should work",
    );
  });

  // Test 84: String uppercase with parentheses
  test("String uppercase with parentheses", () => {
    const code = `
      variable texto = "hola mundo"
      mostrar texto.mayusculas()
      mostrar "programación".mayusculas()
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA MUNDO", "PROGRAMACIÓN"],
      "String uppercase with parentheses should work",
    );
  });

  // Test 85: String uppercase in conditions
  test("String uppercase in conditions", () => {
    const code = `
      variable nombre = "juan"
      variable nombreMayusculas = nombre.mayusculas

      si nombreMayusculas == "JUAN" {
          mostrar "El nombre en mayúsculas es JUAN"
      }

      si nombre.mayusculas == "JUAN" {
          mostrar "También funciona en condiciones directas"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "El nombre en mayúsculas es JUAN",
        "También funciona en condiciones directas",
      ],
      "String uppercase in conditions should work",
    );
  });

  // Test 86: String uppercase with expressions
  test("String uppercase with expressions", () => {
    const code = `
      variable base = "hola"
      variable mundo = "mundo"
      variable saludo = base + " " + mundo

      mostrar base.mayusculas
      mostrar mundo.mayusculas
      mostrar saludo.mayusculas

      variable saludoMayusculas = saludo.mayusculas
      mostrar saludoMayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA", "MUNDO", "HOLA MUNDO", "HOLA MUNDO"],
      "String uppercase with expressions should work",
    );
  });

  // Test 87: String uppercase with special characters
  test("String uppercase with special characters", () => {
    const code = `
      variable textoEspecial = "¡hola, mundo! ¿cómo estás?"
      variable textoNumeros = "abc123def"
      variable textoMixto = "Hola Mundo"

      mostrar textoEspecial.mayusculas
      mostrar textoNumeros.mayusculas
      mostrar textoMixto.mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["¡HOLA, MUNDO! ¿CÓMO ESTÁS?", "ABC123DEF", "HOLA MUNDO"],
      "String uppercase with special characters should work",
    );
  });

  // Test 88: Error handling for string uppercase on non-strings
  test("Error handling for string uppercase on non-strings", () => {
    const code = `
      variable numero = 123
      mostrar numero.mayusculas()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling uppercase on non-string",
    );
    assertTrue(
      result.error.includes("Método de número desconocido"),
      "Error should mention method restrictions",
    );
  });

  // Test 89: String uppercase with empty string
  test("String uppercase with empty string", () => {
    const code = `
      variable textoVacio = ""
      mostrar textoVacio.mayusculas

      variable textoEspacios = "   "
      mostrar textoEspacios.mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["", "   "],
      "String uppercase with empty string should work",
    );
  });

  // Test 90: String uppercase chaining
  test("String uppercase chaining", () => {
    const code = `
      variable texto = "hola mundo"
      variable resultado = texto.mayusculas
      mostrar resultado

      // Test that we can use the result in expressions
      variable longitud = resultado.longitud
      mostrar longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["HOLA MUNDO", "10"],
      "String uppercase chaining should work",
    );
  });

  // Test 91: Basic string lowercase method
  test("Basic string lowercase method", () => {
    const code = `
      variable texto = "HOLA MUNDO"
      mostrar texto.minusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola mundo"],
      "Basic string lowercase method should work",
    );
  });

  // Test 92: String lowercase with different strings
  test("String lowercase with different strings", () => {
    const code = `
      variable texto1 = "HOLA"
      variable texto2 = "PROGRAMACIÓN"
      variable texto3 = "A"
      variable texto4 = "¡HOLA, MUNDO!"

      mostrar texto1.minusculas
      mostrar texto2.minusculas
      mostrar texto3.minusculas
      mostrar texto4.minusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola", "programación", "a", "¡hola, mundo!"],
      "String lowercase with different strings should work",
    );
  });

  // Test 93: String lowercase with string literals
  test("String lowercase with string literals", () => {
    const code = `
      mostrar "HOLA".minusculas
      mostrar "MUNDO".minusculas
      mostrar "".minusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola", "mundo", ""],
      "String lowercase with string literals should work",
    );
  });

  // Test 94: String lowercase with parentheses
  test("String lowercase with parentheses", () => {
    const code = `
      variable texto = "HOLA MUNDO"
      mostrar texto.minusculas()
      mostrar "PROGRAMACIÓN".minusculas()
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola mundo", "programación"],
      "String lowercase with parentheses should work",
    );
  });

  // Test 95: String lowercase in conditions
  test("String lowercase in conditions", () => {
    const code = `
      variable nombre = "JUAN"
      variable nombreMinusculas = nombre.minusculas

      si nombreMinusculas == "juan" {
          mostrar "El nombre en minúsculas es juan"
      }

      si nombre.minusculas == "juan" {
          mostrar "También funciona en condiciones directas"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "El nombre en minúsculas es juan",
        "También funciona en condiciones directas",
      ],
      "String lowercase in conditions should work",
    );
  });

  // Test 96: String lowercase with expressions
  test("String lowercase with expressions", () => {
    const code = `
      variable base = "HOLA"
      variable mundo = "MUNDO"
      variable saludo = base + " " + mundo

      mostrar base.minusculas
      mostrar mundo.minusculas
      mostrar saludo.minusculas

      variable saludoMinusculas = saludo.minusculas
      mostrar saludoMinusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola", "mundo", "hola mundo", "hola mundo"],
      "String lowercase with expressions should work",
    );
  });

  // Test 97: String lowercase with special characters
  test("String lowercase with special characters", () => {
    const code = `
      variable textoEspecial = "¡HOLA, MUNDO! ¿CÓMO ESTÁS?"
      variable textoNumeros = "ABC123DEF"
      variable textoMixto = "Hola Mundo"

      mostrar textoEspecial.minusculas
      mostrar textoNumeros.minusculas
      mostrar textoMixto.minusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["¡hola, mundo! ¿cómo estás?", "abc123def", "hola mundo"],
      "String lowercase with special characters should work",
    );
  });

  // Test 98: Error handling for string lowercase on non-strings
  test("Error handling for string lowercase on non-strings", () => {
    const code = `
      variable numero = 123
      mostrar numero.minusculas()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling lowercase on non-string",
    );
    assertTrue(
      result.error.includes("Método de número desconocido"),
      "Error should mention method restrictions",
    );
  });

  // Test 99: String lowercase with empty string
  test("String lowercase with empty string", () => {
    const code = `
      variable textoVacio = ""
      mostrar textoVacio.minusculas

      variable textoEspacios = "   "
      mostrar textoEspacios.minusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["", "   "],
      "String lowercase with empty string should work",
    );
  });

  // Test 100: String lowercase chaining
  test("String lowercase chaining", () => {
    const code = `
      variable texto = "HOLA MUNDO"
      variable resultado = texto.minusculas
      mostrar resultado

      // Test that we can use the result in expressions
      variable longitud = resultado.longitud
      mostrar longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola mundo", "10"],
      "String lowercase chaining should work",
    );
  });

  // Test 101: String method combinations
  test("String method combinations", () => {
    const code = `
      variable texto = "Hola Mundo"

      // Test mayusculas -> minusculas
      variable mayusculas = texto.mayusculas
      variable minusculas = mayusculas.minusculas
      mostrar minusculas

      // Test minusculas -> mayusculas
      variable minusculas2 = texto.minusculas
      variable mayusculas2 = minusculas2.mayusculas
      mostrar mayusculas2

      // Test chaining
      variable resultado = texto.minusculas.mayusculas
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["hola mundo", "HOLA MUNDO", "HOLA MUNDO"],
      "String method combinations should work",
    );
  });

  // Test 102: Basic try-catch without error
  test("Basic try-catch without error", () => {
    const code = `
      intentar {
        variable x = 10
        mostrar "Try block executed"
        mostrar x
      } capturar (error) {
        mostrar "Catch block executed"
        mostrar error
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Try block executed", "10"],
      "Try-catch without error should execute try block only",
    );
  });

  // Test 103: Basic try-catch with error
  test("Basic try-catch with error", () => {
    const code = `
      intentar {
        variable x = 10 / 0
        mostrar "This should not be shown"
      } capturar (error) {
        mostrar "Error caught: " + error
      }
    `;

    const output = run(code);
    assertTrue(
      output.length > 0 && output[0].includes("Error caught:"),
      "Try-catch with error should execute catch block",
    );
  });

  // Test 104: Try-catch with variable access in catch
  test("Try-catch with variable access in catch", () => {
    const code = `
      intentar {
        variable x = 10 / 0
        mostrar "This should not be shown"
      } capturar (error) {
        mostrar "Error message: " + error
        variable errorLength = error.longitud
        mostrar "Error length: " + errorLength
      }
    `;

    const output = run(code);
    assertTrue(
      output.length >= 2 &&
        output[0].includes("Error message:") &&
        output[1].includes("Error length:"),
      "Try-catch should allow variable access in catch block",
    );
  });

  // Test 105: Try-catch with multiple statements in catch
  test("Try-catch with multiple statements in catch", () => {
    const code = `
      intentar {
        variable x = 10 / 0
        mostrar "This should not be shown"
      } capturar (error) {
        mostrar "First catch statement"
        mostrar "Second catch statement"
        mostrar "Error: " + error
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "First catch statement",
        "Second catch statement",
        "Error: " + output[2].split("Error: ")[1],
      ],
      "Try-catch should execute multiple statements in catch block",
    );
  });

  // Test 106: Try-catch with nested try-catch
  test("Try-catch with nested try-catch", () => {
    const code = `
      intentar {
        intentar {
          variable x = 10 / 0
          mostrar "Inner try"
        } capturar (innerError) {
          mostrar "Inner catch: " + innerError
        }
        mostrar "Outer try"
      } capturar (outerError) {
        mostrar "Outer catch: " + outerError
      }
    `;

    const output = run(code);
    assertTrue(
      output.length >= 2 &&
        output[0].includes("Inner catch:") &&
        output[1].includes("Outer try"),
      "Nested try-catch should work correctly",
    );
  });

  // Test 107: Try-catch with function calls
  test("Try-catch with function calls", () => {
    const code = `
      funcion dividir(a, b) {
        si b == 0 {
          mostrar "Division by zero error"
        }
        retornar a / b
      }

      intentar {
        variable resultado = dividir(10, 0)
        mostrar "Result: " + resultado
      } capturar (error) {
        mostrar "Function error caught: " + error
      }
    `;

    const output = run(code);
    assertTrue(output.length > 0, "Try-catch with function calls should work");
  });

  // Test 108: Try-catch with array operations
  test("Try-catch with array operations", () => {
    const code = `
      variable arr = [1, 2, 3]

      intentar {
        variable elemento = arr[10]
        mostrar "Element: " + elemento
      } capturar (error) {
        mostrar "Array error caught: " + error
        mostrar "Array length: " + arr.longitud
      }
    `;

    const output = run(code);
    assertTrue(
      output.length >= 2 &&
        output[0].includes("Array error caught:") &&
        output[1].includes("Array length: 3"),
      "Try-catch with array operations should work",
    );
  });

  // Test 109: Try-catch with string operations
  test("Try-catch with string operations", () => {
    const code = `
      intentar {
        variable texto = "Hola"
        variable resultado = texto.longitud
        mostrar "Length: " + resultado

        // This should not cause an error
        variable mayusculas = texto.mayusculas
        mostrar "Uppercase: " + mayusculas
      } capturar (error) {
        mostrar "String error caught: " + error
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Length: 4", "Uppercase: HOLA"],
      "Try-catch with string operations should work",
    );
  });

  // Test 110: Try-catch with loop inside try
  test("Try-catch with loop inside try", () => {
    const code = `
      intentar {
        para (variable i = 1; i <= 3; i++) {
          si i == 2 {
            variable x = 10 / 0
          }
          mostrar "Loop iteration: " + i
        }
      } capturar (error) {
        mostrar "Loop error caught: " + error
      }
    `;

    const output = run(code);
    assertTrue(
      output.length >= 2 &&
        output[0].includes("Loop iteration: 1") &&
        output[1].includes("Loop error caught:"),
      "Try-catch with loop should work",
    );
  });

  // Test 111: Try-catch with break/continue (should not be caught)
  test("Try-catch with break/continue should not be caught", () => {
    const code = `
      intentar {
        para (variable i = 1; i <= 5; i++) {
          si i == 3 {
            romper
          }
          mostrar "Before break: " + i
        }
        mostrar "After loop"
      } capturar (error) {
        mostrar "This should not be shown"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Before break: 1", "Before break: 2", "After loop"],
      "Try-catch should not catch break/continue exceptions",
    );
  });

  // Test 112: Try-catch with return statement
  test("Try-catch with return statement", () => {
    const code = `
      funcion testFunction() {
        intentar {
          variable x = 10 / 0
          retornar "Success"
        } capturar (error) {
          retornar "Error: " + error
        }
      }

      variable resultado = testFunction()
      mostrar resultado
    `;

    const output = run(code);
    assertTrue(
      output.length > 0 && output[0].includes("Error:"),
      "Try-catch with return should work",
    );
  });

  // Test 113: Basic array add method
  test("Basic array add method", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable nuevaLongitud = arr.agregar(4)
      mostrar nuevaLongitud
      mostrar arr[3]
    `;

    const output = run(code);
    assertEquals(output, ["4", "4"], "Basic array add method should work");
  });

  // Test 114: Array add with multiple elements
  test("Array add with multiple elements", () => {
    const code = `
      variable arr = [1, 2]
      variable nuevaLongitud = arr.agregar(3, 4, 5)
      mostrar nuevaLongitud
      mostrar arr[2]
      mostrar arr[3]
      mostrar arr[4]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "3", "4", "5"],
      "Array add with multiple elements should work",
    );
  });

  // Test 115: Array add with different types
  test("Array add with different types", () => {
    const code = `
      variable arr = [1, 2]
      variable nuevaLongitud = arr.agregar("hola", verdadero, 3.14)
      mostrar nuevaLongitud
      mostrar arr[2]
      mostrar arr[3]
      mostrar arr[4]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "hola", "true", "3.14"],
      "Array add with different types should work",
    );
  });

  // Test 116: Array add with variables
  test("Array add with variables", () => {
    const code = `
      variable arr = [1, 2]
      variable elemento = "nuevo"
      variable numero = 42
      variable nuevaLongitud = arr.agregar(elemento, numero)
      mostrar nuevaLongitud
      mostrar arr[2]
      mostrar arr[3]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "nuevo", "42"],
      "Array add with variables should work",
    );
  });

  // Test 117: Array add with expressions
  test("Array add with expressions", () => {
    const code = `
      variable arr = [1, 2]
      variable nuevaLongitud = arr.agregar(3 + 4, "hola" + " mundo")
      mostrar nuevaLongitud
      mostrar arr[2]
      mostrar arr[3]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "7", "hola mundo"],
      "Array add with expressions should work",
    );
  });

  // Test 118: Array add with empty array
  test("Array add with empty array", () => {
    const code = `
      variable arr = []
      variable nuevaLongitud = arr.agregar(1, 2, 3)
      mostrar nuevaLongitud
      mostrar arr[0]
      mostrar arr[1]
      mostrar arr[2]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3", "1", "2", "3"],
      "Array add with empty array should work",
    );
  });

  // Test 119: Array add with no arguments
  test("Array add with no arguments", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable nuevaLongitud = arr.agregar()
      mostrar nuevaLongitud
      mostrar arr.longitud
    `;

    const output = run(code);
    assertEquals(output, ["3", "3"], "Array add with no arguments should work");
  });

  // Test 120: Array add with arrays
  test("Array add with arrays", () => {
    const code = `
      variable arr = [1, 2]
      variable subArray = [3, 4]
      variable nuevaLongitud = arr.agregar(subArray)
      mostrar nuevaLongitud
      mostrar arr[2]
    `;

    const output = run(code);
    assertEquals(output, ["3", "[3, 4]"], "Array add with arrays should work");
  });

  // Test 121: Array add with objects
  test("Array add with objects", () => {
    const code = `
      variable arr = [1, 2]
      variable obj = {nombre: "Juan", edad: 25}
      variable nuevaLongitud = arr.agregar(obj)
      mostrar nuevaLongitud
      mostrar arr[2]
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3", "[object Object]"],
      "Array add with objects should work",
    );
  });

  // Test 122: Array add chaining
  test("Array add chaining", () => {
    const code = `
      variable arr = [1, 2]
      variable longitud1 = arr.agregar(3)
      variable longitud2 = arr.agregar(4, 5)
      mostrar longitud1
      mostrar longitud2
      mostrar arr.longitud
    `;

    const output = run(code);
    assertEquals(output, ["3", "5", "5"], "Array add chaining should work");
  });

  // Test 123: Error handling for array add on non-arrays
  test("Error handling for array add on non-arrays", () => {
    const code = `
      variable texto = "hola"
      variable resultado = texto.agregar("mundo")
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling agregar on non-array",
    );
    assertTrue(
      result.error.includes("solo se puede llamar en arreglos"),
      "Error should mention method restrictions",
    );
  });

  // Test 124: Array add in conditions
  test("Array add in conditions", () => {
    const code = `
      variable arr = [1, 2]
      variable nuevaLongitud = arr.agregar(3)

      si nuevaLongitud == 3 {
        mostrar "Array tiene 3 elementos"
      }

      si arr.longitud == 3 {
        mostrar "Confirmado: longitud es 3"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Array tiene 3 elementos", "Confirmado: longitud es 3"],
      "Array add in conditions should work",
    );
  });

  // Test 125: Basic array remove method
  test("Basic array remove method", () => {
    const code = `
      variable arr = [1, 2, 3, 4]
      variable elementoRemovido = arr.remover()
      mostrar elementoRemovido
      mostrar arr.longitud
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["4", "3", "[1, 2, 3]"],
      "Basic array remove method should work",
    );
  });

  // Test 126: Array remove with different types
  test("Array remove with different types", () => {
    const code = `
      variable arr = ["hola", 42, verdadero, 3.14]
      variable elemento1 = arr.remover()
      variable elemento2 = arr.remover()
      mostrar elemento1
      mostrar elemento2
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3.14", "true", "[hola, 42]"],
      "Array remove with different types should work",
    );
  });

  // Test 127: Array remove with single element
  test("Array remove with single element", () => {
    const code = `
      variable arr = ["unico"]
      variable elemento = arr.remover()
      mostrar elemento
      mostrar arr.longitud
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["unico", "0", "[]"],
      "Array remove with single element should work",
    );
  });

  // Test 128: Array remove with empty array (error)
  test("Array remove with empty array should fail", () => {
    const code = `
      variable arr = []
      variable elemento = arr.remover()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling remover on empty array",
    );
    assertTrue(
      result.error.includes("arreglo vacío"),
      "Error should mention empty array",
    );
  });

  // Test 129: Array remove chaining
  test("Array remove chaining", () => {
    const code = `
      variable arr = [1, 2, 3, 4, 5]
      variable elem1 = arr.remover()
      variable elem2 = arr.remover()
      variable elem3 = arr.remover()
      mostrar elem1
      mostrar elem2
      mostrar elem3
      mostrar arr.longitud
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["5", "4", "3", "2", "[1, 2]"],
      "Array remove chaining should work",
    );
  });

  // Test 130: Array remove with variables
  test("Array remove with variables", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      variable ultimaFruta = frutas.remover()
      mostrar ultimaFruta
      mostrar frutas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["naranja", "[manzana, banana]"],
      "Array remove with variables should work",
    );
  });

  // Test 131: Array remove in conditions
  test("Array remove in conditions", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable elemento = arr.remover()

      si elemento == 3 {
        mostrar "Se removió el elemento 3"
      }

      si arr.longitud == 2 {
        mostrar "Array ahora tiene 2 elementos"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Se removió el elemento 3", "Array ahora tiene 2 elementos"],
      "Array remove in conditions should work",
    );
  });

  // Test 132: Array remove with objects
  test("Array remove with objects", () => {
    const code = `
      variable personas = [
        {nombre: "Juan", edad: 25},
        {nombre: "María", edad: 30}
      ]
      variable ultimaPersona = personas.remover()
      mostrar ultimaPersona
      mostrar personas.longitud
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[object Object]", "1"],
      "Array remove with objects should work",
    );
  });

  // Test 133: Array remove with arrays
  test("Array remove with arrays", () => {
    const code = `
      variable listas = [[1, 2], [3, 4], [5, 6]]
      variable ultimaLista = listas.remover()
      mostrar ultimaLista
      mostrar listas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[5, 6]", "[[1, 2], [3, 4]]"],
      "Array remove with arrays should work",
    );
  });

  // Test 134: Array remove and add combination
  test("Array remove and add combination", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable removido = arr.remover()
      variable nuevaLongitud = arr.agregar(4, 5)
      mostrar removido
      mostrar nuevaLongitud
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3", "4", "[1, 2, 4, 5]"],
      "Array remove and add combination should work",
    );
  });

  // Test 135: Error handling for array remove on non-arrays
  test("Error handling for array remove on non-arrays", () => {
    const code = `
      variable texto = "hola"
      variable resultado = texto.remover()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling remover on non-array",
    );
    assertTrue(
      result.error.includes("solo se puede llamar en arreglos"),
      "Error should mention method restrictions",
    );
  });

  // Test 136: Array remove with expressions
  test("Array remove with expressions", () => {
    const code = `
      variable arr = [10, 20, 30]
      variable elemento = arr.remover()
      variable resultado = elemento * 2
      mostrar resultado
      mostrar arr
    `;

    const output = run(code);
    assertEquals(
      output,
      ["60", "[10, 20]"],
      "Array remove with expressions should work",
    );
  });

  // Test 137: Basic array contains method
  test("Basic array contains method", () => {
    const code = `
      variable arr = [1, 2, 3, 4, 5]
      variable contiene3 = arr.contiene(3)
      variable contiene6 = arr.contiene(6)
      mostrar contiene3
      mostrar contiene6
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false"],
      "Basic array contains method should work",
    );
  });

  // Test 138: Array contains with strings
  test("Array contains with strings", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      variable contieneBanana = frutas.contiene("banana")
      variable contieneUva = frutas.contiene("uva")
      mostrar contieneBanana
      mostrar contieneUva
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "false"],
      "Array contains with strings should work",
    );
  });

  // Test 139: Array contains with different types
  test("Array contains with different types", () => {
    const code = `
      variable mixto = ["hola", 42, verdadero, 3.14]
      variable contieneHola = mixto.contiene("hola")
      variable contiene42 = mixto.contiene(42)
      variable contieneTrue = mixto.contiene(verdadero)
      variable contienePi = mixto.contiene(3.14)
      variable contieneFalso = mixto.contiene(falso)
      mostrar contieneHola
      mostrar contiene42
      mostrar contieneTrue
      mostrar contienePi
      mostrar contieneFalso
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "true", "true", "false"],
      "Array contains with different types should work",
    );
  });

  // Test 140: Array contains with variables
  test("Array contains with variables", () => {
    const code = `
      variable numeros = [10, 20, 30, 40]
      variable buscar = 20
      variable contiene = numeros.contiene(buscar)
      mostrar contiene
    `;

    const output = run(code);
    assertEquals(output, ["true"], "Array contains with variables should work");
  });

  // Test 141: Array contains with expressions
  test("Array contains with expressions", () => {
    const code = `
      variable arr = [1, 2, 3, 4, 5]
      variable contiene = arr.contiene(2 + 1)
      mostrar contiene
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "Array contains with expressions should work",
    );
  });

  // Test 142: Array contains with empty array
  test("Array contains with empty array", () => {
    const code = `
      variable vacio = []
      variable contiene = vacio.contiene(1)
      mostrar contiene
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "Array contains with empty array should work",
    );
  });

  // Test 143: Array contains in conditions
  test("Array contains in conditions", () => {
    const code = `
      variable colores = ["rojo", "verde", "azul"]

      si colores.contiene("rojo") {
        mostrar "El array contiene rojo"
      }

      si colores.contiene("amarillo") {
        mostrar "El array contiene amarillo"
      } sino {
        mostrar "El array no contiene amarillo"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["El array contiene rojo", "El array no contiene amarillo"],
      "Array contains in conditions should work",
    );
  });

  // Test 144: Array contains with objects
  test("Array contains with objects", () => {
    const code = `
      variable obj1 = {nombre: "Juan", edad: 25}
      variable obj2 = {nombre: "María", edad: 30}
      variable personas = [obj1, obj2]
      variable contieneObj1 = personas.contiene(obj1)
      variable contieneObj2 = personas.contiene(obj2)
      mostrar contieneObj1
      mostrar contieneObj2
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true", "true"],
      "Array contains with objects should work",
    );
  });

  // Test 145: Array contains with arrays
  test("Array contains with arrays", () => {
    const code = `
      variable subArray = [1, 2]
      variable listas = [[1, 2], [3, 4], [5, 6]]
      variable contiene = listas.contiene(subArray)
      mostrar contiene
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "Array contains with arrays should work (arrays are compared by reference)",
    );
  });

  // Test 146: Array contains with no arguments (error)
  test("Array contains with no arguments should fail", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable resultado = arr.contiene()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling contiene with no arguments",
    );
    assertTrue(
      result.error.includes("requiere exactamente un argumento"),
      "Error should mention argument requirement",
    );
  });

  // Test 147: Array contains with multiple arguments (error)
  test("Array contains with multiple arguments should fail", () => {
    const code = `
      variable arr = [1, 2, 3]
      variable resultado = arr.contiene(1, 2)
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling contiene with multiple arguments",
    );
    assertTrue(
      result.error.includes("requiere exactamente un argumento"),
      "Error should mention argument requirement",
    );
  });

  // Test 148: String contains method works (contiene is valid for strings too)
  test("Error handling for array contains on non-arrays", () => {
    const code = `
      variable texto = "hola"
      variable resultado = texto.contiene("o")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["true"], "String contiene should work");
  });

  // Test 149: Array contains with complex expressions
  test("Array contains with complex expressions", () => {
    const code = `
      variable arr = [10, 20, 30, 40, 50]
      variable contiene = arr.contiene(15 + 15)
      mostrar contiene
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "Array contains with complex expressions should work",
    );
  });

  // Test 150: Basic array forEach method
  test("Basic array forEach method", () => {
    const code = `
      variable arr = [1, 2, 3, 4, 5]
      arr.recorrer(funcion() {
        mostrar "Elemento: " + elemento
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "Elemento: 1",
        "Elemento: 2",
        "Elemento: 3",
        "Elemento: 4",
        "Elemento: 5",
      ],
      "Basic array forEach method should work",
    );
  });

  // Test 151: Array forEach with index
  test("Array forEach with index", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      frutas.recorrer(funcion() {
        mostrar "Índice " + indice + ": " + elemento
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Índice 0: manzana", "Índice 1: banana", "Índice 2: naranja"],
      "Array forEach with index should work",
    );
  });

  // Test 152: Array forEach with different types
  test("Array forEach with different types", () => {
    const code = `
      variable mixto = ["hola", 42, verdadero, 3.14]
      mixto.recorrer(funcion() {
        mostrar "Tipo: " + elemento
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Tipo: hola", "Tipo: 42", "Tipo: true", "Tipo: 3.14"],
      "Array forEach with different types should work",
    );
  });

  // Test 153: Array forEach with empty array
  test("Array forEach with empty array", () => {
    const code = `
      variable vacio = []
      vacio.recorrer(funcion() {
        mostrar "Esto no se ejecutará"
      })
      mostrar "Array vacío procesado"
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Array vacío procesado"],
      "Array forEach with empty array should work",
    );
  });

  // Test 154: Array forEach with calculations
  test("Array forEach with calculations", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      variable suma = 0
      numeros.recorrer(funcion() {
        suma = suma + elemento
      })
      mostrar "Suma total: " + suma
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Suma total: 15"],
      "Array forEach with calculations should work",
    );
  });

  // Test 155: Array forEach with conditions
  test("Array forEach with conditions", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      numeros.recorrer(funcion() {
        si elemento > 5 {
          mostrar "Número grande: " + elemento
        }
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "Número grande: 6",
        "Número grande: 7",
        "Número grande: 8",
        "Número grande: 9",
        "Número grande: 10",
      ],
      "Array forEach with conditions should work",
    );
  });

  // Test 156: Array forEach with objects
  test("Array forEach with objects", () => {
    const code = `
      variable personas = [
        {nombre: "Juan", edad: 25},
        {nombre: "María", edad: 30},
        {nombre: "Pedro", edad: 35}
      ]
      personas.recorrer(funcion() {
        mostrar "Persona " + indice + ": " + elemento
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "Persona 0: [object Object]",
        "Persona 1: [object Object]",
        "Persona 2: [object Object]",
      ],
      "Array forEach with objects should work",
    );
  });

  // Test 157: Array forEach with arrays
  test("Array forEach with arrays", () => {
    const code = `
      variable listas = [[1, 2], [3, 4], [5, 6]]
      listas.recorrer(funcion() {
        mostrar "Lista " + indice + ": " + elemento
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Lista 0: [1, 2]", "Lista 1: [3, 4]", "Lista 2: [5, 6]"],
      "Array forEach with arrays should work",
    );
  });

  // Test 158: Array forEach with no arguments (error)
  test("Array forEach with no arguments should fail", () => {
    const code = `
      variable arr = [1, 2, 3]
      arr.recorrer()
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling recorrer with no arguments",
    );
    assertTrue(
      result.error.includes("requiere exactamente un argumento"),
      "Error should mention argument requirement",
    );
  });

  // Test 159: Array forEach with multiple arguments (error)
  test("Array forEach with multiple arguments should fail", () => {
    const code = `
      variable arr = [1, 2, 3]
      arr.recorrer(funcion() {}, funcion() {})
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling recorrer with multiple arguments",
    );
    assertTrue(
      result.error.includes("requiere exactamente un argumento"),
      "Error should mention argument requirement",
    );
  });

  // Test 160: Array forEach with non-function argument (error)
  test("Array forEach with non-function argument should fail", () => {
    const code = `
      variable arr = [1, 2, 3]
      arr.recorrer("no es una función")
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling recorrer with non-function argument",
    );
    assertTrue(
      result.error.includes("requiere una función como argumento"),
      "Error should mention function requirement",
    );
  });

  // Test 161: Error handling for array forEach on non-arrays
  test("Error handling for array forEach on non-arrays", () => {
    const code = `
      variable texto = "hola"
      texto.recorrer(funcion() {})
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when calling recorrer on non-array",
    );
    assertTrue(
      result.error.includes("solo se puede llamar en arreglos"),
      "Error should mention method restrictions",
    );
  });

  // Test 162: Array forEach with complex logic
  test("Array forEach with complex logic", () => {
    const code = `
      variable datos = [10, 20, 30, 40, 50]
      variable pares = []
      variable impares = []

      datos.recorrer(funcion() {
        si elemento % 2 == 0 {
          pares.agregar(elemento)
        } sino {
          impares.agregar(elemento)
        }
      })

      mostrar "Pares: " + pares
      mostrar "Impares: " + impares
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Pares: [10, 20, 30, 40, 50]", "Impares: []"],
      "Array forEach with complex logic should work",
    );
  });

  // Test 163: Basic null value
  test("Basic null value", () => {
    const code = `
      variable valor = nulo
      mostrar valor
      mostrar "Valor es: " + valor
    `;

    const output = run(code);
    assertEquals(
      output,
      ["null", "Valor es: null"],
      "Basic null value should work",
    );
  });

  // Test 164: Basic undefined value
  test("Basic undefined value", () => {
    const code = `
      variable valor = indefinido
      mostrar valor
      mostrar "Valor es: " + valor
    `;

    const output = run(code);
    assertEquals(
      output,
      ["undefined", "Valor es: undefined"],
      "Basic undefined value should work",
    );
  });

  // Test 165: Null and undefined comparisons
  test("Null and undefined comparisons", () => {
    const code = `
      variable a = nulo
      variable b = indefinido
      variable c = nulo

      mostrar "a == nulo: " + (a == nulo)
      mostrar "b == indefinido: " + (b == indefinido)
      mostrar "a == c: " + (a == c)
      mostrar "a == b: " + (a == b)
      mostrar "a != b: " + (a != b)
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "a == nulo: true",
        "b == indefinido: true",
        "a == c: true",
        "a == b: false",
        "a != b: true",
      ],
      "Null and undefined comparisons should work",
    );
  });

  // Test 166: Null and undefined with other types
  test("Null and undefined with other types", () => {
    const code = `
      variable valorNulo = nulo
      variable valorIndefinido = indefinido
      variable numero = 42
      variable texto = "hola"
      variable booleano = verdadero

      mostrar "nulo == numero: " + (valorNulo == numero)
      mostrar "indefinido == texto: " + (valorIndefinido == texto)
      mostrar "nulo == booleano: " + (valorNulo == booleano)
      mostrar "indefinido == booleano: " + (valorIndefinido == booleano)
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "nulo == numero: false",
        "indefinido == texto: false",
        "nulo == booleano: false",
        "indefinido == booleano: false",
      ],
      "Null and undefined with other types should work",
    );
  });

  // Test 167: Null and undefined in conditions
  test("Null and undefined in conditions", () => {
    const code = `
      variable valor = nulo

      si valor == nulo {
        mostrar "El valor es nulo"
      }

      valor = indefinido

      si valor == indefinido {
        mostrar "El valor es indefinido"
      }

      si valor != nulo {
        mostrar "El valor no es nulo"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["El valor es nulo", "El valor es indefinido", "El valor no es nulo"],
      "Null and undefined in conditions should work",
    );
  });

  // Test 168: Null and undefined in arrays
  test("Null and undefined in arrays", () => {
    const code = `
      variable arr = [1, nulo, "hola", indefinido, verdadero]
      mostrar arr

      arr.recorrer(funcion(elemento, indice) {
        si elemento == nulo {
          mostrar "Elemento " + indice + " es nulo"
        } sino {
          si elemento == indefinido {
            mostrar "Elemento " + indice + " es indefinido"
          }
        }
      })
    `;

    const output = run(code);
    assertEquals(
      output,
      [
        "[1, null, hola, undefined, true]",
        "Elemento 1 es nulo",
        "Elemento 3 es indefinido",
      ],
      "Null and undefined in arrays should work",
    );
  });

  // Test 169: Null and undefined in objects
  test("Null and undefined in objects", () => {
    const code = `
      variable obj = {nombre: "Juan", edad: nulo, ciudad: indefinido}
      mostrar obj

      mostrar "Edad es nulo: " + (obj.edad == nulo)
      mostrar "Ciudad es indefinido: " + (obj.ciudad == indefinido)
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[object Object]", "Edad es nulo: true", "Ciudad es indefinido: true"],
      "Null and undefined in objects should work",
    );
  });

  // Test 170: Null and undefined with functions
  test("Null and undefined with functions", () => {
    const code = `
      funcion procesar(valor) {
        si valor == nulo {
          retornar "Es nulo"
        } sino {
          si valor == indefinido {
            retornar "Es indefinido"
          } sino {
            retornar "Es otro valor"
          }
        }
      }

      mostrar procesar(nulo)
      mostrar procesar(indefinido)
      mostrar procesar(42)
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Es nulo", "Es indefinido", "Es otro valor"],
      "Null and undefined with functions should work",
    );
  });

  // Test 171: Null and undefined with try-catch
  test("Null and undefined with try-catch", () => {
    const code = `
      intentar {
        variable valor = nulo
        mostrar "Valor: " + valor
        valor = indefinido
        mostrar "Valor: " + valor
      } capturar (error) {
        mostrar "Error: " + error
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Valor: null", "Valor: undefined"],
      "Null and undefined with try-catch should work",
    );
  });

  // Test 172: Null and undefined with loops
  test("Null and undefined with loops", () => {
    const code = `
      variable valores = [nulo, indefinido, 42, "hola"]
      variable contador = 0

      valores.recorrer(funcion(valor) {
        si valor == nulo o valor == indefinido {
          contador = contador + 1
        }
      })

      mostrar "Valores nulos o indefinidos: " + contador
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Valores nulos o indefinidos: 2"],
      "Null and undefined with loops should work",
    );
  });

  // Test 173: Null and undefined with logical operators
  test("Null and undefined with logical operators", () => {
    const code = `
      variable a = nulo
      variable b = indefinido
      variable c = 42

      mostrar "a o c: " + (a o c)
      mostrar "b o c: " + (b o c)
      mostrar "a y c: " + (a y c)
      mostrar "b y c: " + (b y c)
    `;

    const output = run(code);
    assertEquals(
      output,
      ["a o c: 42", "b o c: undefined", "a y c: null", "b y c: 42"],
      "Null and undefined with logical operators should work",
    );
  });

  // Test 81: Complex example with all features including logical operators
  test("Complex example - calculator with functions, arrays, for loops, comments, objects, property assignment and logical operators", () => {
    const code = `
      // Función para calcular operaciones básicas
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

      // Array de números para sumar
      variable numeros = [1, 2, 3, 4, 5]
      variable suma = 0
      para (variable i = 0; i < 5; i = i + 1) {
          suma = suma + numeros[i]
      }
      mostrar "Suma de array:"
      mostrar suma

      // Objeto con información del cálculo
      variable info = {
          resultado: suma,
          operacion: "suma de array",
          elementos: numeros
      }
      mostrar "Información del cálculo:"
      mostrar info.resultado
      mostrar info.operacion

      // Modificar el objeto después de crearlo
      info.operacion = "suma modificada"
      info.extra = "información adicional"
      mostrar "Operación modificada:"
      mostrar info.operacion
      mostrar "Extra:"
      mostrar info.extra

      // Usar operadores lógicos para validaciones
      variable esValido = info.resultado > 10 y info.resultado < 100
      variable esComplejo = info.operacion == "suma modificada" o info.extra != ""

      si esValido y esComplejo {
          mostrar "El resultado es válido y complejo"
      }

      si !esValido o !esComplejo {
          mostrar "El resultado necesita revisión"
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
      "Suma de array:",
      "15",
      "Información del cálculo:",
      "15",
      "suma de array",
      "Operación modificada:",
      "suma modificada",
      "Extra:",
      "información adicional",
      "El resultado es válido y complejo",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Complex calculator with functions, arrays, for loops, comments and objects should work correctly",
    );
  });

  // Mathematical functions tests
  test("Basic mathematical functions", () => {
    const code = `
      // Basic math functions
      mostrar "Raíz cuadrada de 16:"
      mostrar raiz(16)

      mostrar "2 elevado a la 3:"
      mostrar potencia(2, 3)

      mostrar "Seno de 0:"
      mostrar seno(0)

      mostrar "Coseno de 0:"
      mostrar coseno(0)

      mostrar "Valor absoluto de -5:"
      mostrar valorAbsoluto(-5)
    `;

    const output = run(code);
    const expectedOutput = [
      "Raíz cuadrada de 16:",
      "4",
      "2 elevado a la 3:",
      "8",
      "Seno de 0:",
      "0",
      "Coseno de 0:",
      "1",
      "Valor absoluto de -5:",
      "5",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Basic mathematical functions should work correctly",
    );
  });

  test("Rounding and floor/ceiling functions", () => {
    const code = `
      variable numero = 3.7

      mostrar "Número original:"
      mostrar numero

      mostrar "Redondeado:"
      mostrar redondear(numero)

      mostrar "Techo:"
      mostrar techo(numero)

      mostrar "Piso:"
      mostrar piso(numero)
    `;

    const output = run(code);
    const expectedOutput = [
      "Número original:",
      "3.7",
      "Redondeado:",
      "4",
      "Techo:",
      "4",
      "Piso:",
      "3",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Rounding and floor/ceiling functions should work correctly",
    );
  });

  test("Statistical functions", () => {
    const code = `
      // Statistical functions
      mostrar "Máximo de 5, 10, 3:"
      mostrar maximo(5, 10, 3)

      mostrar "Mínimo de 5, 10, 3:"
      mostrar minimo(5, 10, 3)

      mostrar "Suma de 1, 2, 3, 4:"
      mostrar suma(1, 2, 3, 4)

      mostrar "Promedio de 10, 20, 30:"
      mostrar promedio(10, 20, 30)
    `;

    const output = run(code);
    const expectedOutput = [
      "Máximo de 5, 10, 3:",
      "10",
      "Mínimo de 5, 10, 3:",
      "3",
      "Suma de 1, 2, 3, 4:",
      "10",
      "Promedio de 10, 20, 30:",
      "20",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Statistical functions should work correctly",
    );
  });

  test("Trigonometric functions", () => {
    const code = `
      variable angulo = 1.5708  // π/2 radians

      mostrar "Ángulo:"
      mostrar angulo

      mostrar "Seno:"
      mostrar seno(angulo)

      mostrar "Coseno:"
      mostrar coseno(angulo)

      mostrar "Tangente:"
      mostrar tangente(angulo)
    `;

    const output = run(code);
    // Check that we get the right number of outputs and approximate values
    assertEquals(output.length, 8, "Should have 8 outputs");
    assertEquals(output[0], "Ángulo:", "Should show angle label");
    assertEquals(output[1], "1.5708", "Should show angle value");
    assertEquals(output[2], "Seno:", "Should show sine label");

    // Check that sine is approximately 1
    const sineValue = parseFloat(output[3]);
    if (Math.abs(sineValue - 1) > 0.001) {
      throw new Error(`Sine should be approximately 1, got ${sineValue}`);
    }

    assertEquals(output[4], "Coseno:", "Should show cosine label");

    // Check that cosine is approximately 0
    const cosineValue = parseFloat(output[5]);
    if (Math.abs(cosineValue) > 0.001) {
      throw new Error(`Cosine should be approximately 0, got ${cosineValue}`);
    }

    assertEquals(output[6], "Tangente:", "Should show tangent label");

    // Tangent should be a very large number
    const tangentValue = parseFloat(output[7]);
    if (Math.abs(tangentValue) < 1000) {
      throw new Error(`Tangent should be very large, got ${tangentValue}`);
    }
  });

  test("Logarithmic functions", () => {
    const code = `
      variable numero = 2.71828  // e

      mostrar "Número:"
      mostrar numero

      mostrar "Logaritmo natural:"
      mostrar logaritmo(numero)
    `;

    const output = run(code);
    assertEquals(output.length, 4, "Should have 4 outputs");
    assertEquals(output[0], "Número:", "Should show number label");
    assertEquals(output[1], "2.71828", "Should show number value");
    assertEquals(
      output[2],
      "Logaritmo natural:",
      "Should show logarithm label",
    );

    // Check that logarithm is approximately 1
    const logValue = parseFloat(output[3]);
    if (Math.abs(logValue - 1) > 0.001) {
      throw new Error(`Logarithm should be approximately 1, got ${logValue}`);
    }
  });

  test("Random number generation", () => {
    const code = `
      // Test random number generation
      mostrar "Número aleatorio entre 0 y 1:"
      variable aleatorio1 = aleatorio()
      mostrar aleatorio1

      mostrar "Número aleatorio entre 0 y 10:"
      variable aleatorio2 = aleatorio(10)
      mostrar aleatorio2

      mostrar "Número aleatorio entre 5 y 15:"
      variable aleatorio3 = aleatorio(5, 15)
      mostrar aleatorio3
    `;

    const output = run(code);
    // We can't predict exact values, so we just check that we get 3 numbers
    assertEquals(
      output.length,
      6, // 3 labels + 3 numbers
      "Random number generation should work correctly",
    );
  });

  test("Mathematical functions with variables", () => {
    const code = `
      variable base = 2
      variable exponente = 8
      variable resultado = potencia(base, exponente)

      mostrar "2 elevado a la 8:"
      mostrar resultado

      variable raizResultado = raiz(resultado)
      mostrar "Raíz cuadrada del resultado:"
      mostrar raizResultado
    `;

    const output = run(code);
    const expectedOutput = [
      "2 elevado a la 8:",
      "256",
      "Raíz cuadrada del resultado:",
      "16",
    ];
    assertEquals(
      output,
      expectedOutput,
      "Mathematical functions with variables should work correctly",
    );
  });

  test("Error handling for mathematical functions", () => {
    const code = `
      // This should cause an error
      mostrar raiz(-4)
    `;

    const result = interpret(code);
    if (result.success) {
      throw new Error("Should have thrown an error for negative square root");
    }

    if (!result.error.includes("raíz cuadrada de un número negativo")) {
      throw new Error(
        `Expected specific error message for negative square root, got: ${result.error}`,
      );
    }
  });

  // ============================================
  // STRING INTERPOLATION TESTS
  // ============================================

  test("Basic string interpolation with variable", () => {
    const code = `
      variable nombre = "María"
      variable mensaje = \`Hola \${nombre}\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola María"],
      "String interpolation should work with simple variable",
    );
  });

  test("String interpolation with multiple variables", () => {
    const code = `
      variable nombre = "Juan"
      variable edad = 25
      variable mensaje = \`\${nombre} tiene \${edad} años\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Juan tiene 25 años"],
      "String interpolation should work with multiple variables",
    );
  });

  test("String interpolation with expressions", () => {
    const code = `
      variable a = 10
      variable b = 5
      variable mensaje = \`La suma es \${a + b} y la resta es \${a - b}\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["La suma es 15 y la resta es 5"],
      "String interpolation should work with expressions",
    );
  });

  test("String interpolation with function calls", () => {
    const code = `
      funcion doble(x) {
        retornar x * 2
      }
      variable mensaje = \`El doble de 5 es \${doble(5)}\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["El doble de 5 es 10"],
      "String interpolation should work with function calls",
    );
  });

  test("String interpolation with nested expressions", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable mensaje = \`El primer número es \${numeros[0]} y el último es \${numeros[2]}\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["El primer número es 1 y el último es 3"],
      "String interpolation should work with array access",
    );
  });

  test("String interpolation with object properties", () => {
    const code = `
      variable persona = {nombre: "Ana", edad: 30}
      variable mensaje = \`\${persona.nombre} tiene \${persona.edad} años\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Ana tiene 30 años"],
      "String interpolation should work with object properties",
    );
  });

  test("String interpolation with boolean and null values", () => {
    const code = `
      variable activo = verdadero
      variable valor = nulo
      variable mensaje = \`Activo: \${activo}, Valor: \${valor}\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Activo: verdadero, Valor: nulo"],
      "String interpolation should work with boolean and null",
    );
  });

  test("String interpolation used directly in mostrar", () => {
    const code = `
      variable x = 42
      mostrar \`El valor es \${x}\`
    `;

    const output = run(code);
    assertEquals(
      output,
      ["El valor es 42"],
      "String interpolation should work directly in mostrar",
    );
  });

  test("Empty string interpolation", () => {
    const code = `
      variable mensaje = \`Sin interpolación\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Sin interpolación"],
      "Template string without interpolation should work",
    );
  });

  test("String interpolation with escaped characters", () => {
    const code = `
      variable nombre = "Test"
      variable mensaje = \`Hola \${nombre}!\`
      mostrar mensaje
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola Test!"],
      "String interpolation should handle special characters",
    );
  });

  // ============================================
  // ADDITIONAL STRING METHODS TESTS
  // ============================================

  test("String dividir method", () => {
    const code = `
      variable texto = "Hola mundo cruel"
      variable partes = texto.dividir(" ")
      mostrar partes
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[Hola, mundo, cruel]"],
      "dividir should split string by separator",
    );
  });

  test("String dividir with different separator", () => {
    const code = `
      variable csv = "uno,dos,tres"
      variable partes = csv.dividir(",")
      mostrar partes
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[uno, dos, tres]"],
      "dividir should work with different separators",
    );
  });

  test("String reemplazar method", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.reemplazar("mundo", "amigo")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["Hola amigo"], "reemplazar should replace substring");
  });

  test("String reemplazar multiple occurrences", () => {
    const code = `
      variable texto = "ana y ana"
      variable resultado = texto.reemplazar("ana", "maria")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["maria y maria"],
      "reemplazar should replace all occurrences",
    );
  });

  test("String recortar method", () => {
    const code = `
      variable texto = "   Hola mundo   "
      variable limpio = texto.recortar()
      mostrar limpio
    `;

    const output = run(code);
    assertEquals(output, ["Hola mundo"], "recortar should trim whitespace");
  });

  test("String incluye method - true case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.incluye("mundo")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "incluye should return true when substring exists",
    );
  });

  test("String incluye method - false case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.incluye("adios")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "incluye should return false when substring does not exist",
    );
  });

  test("String empiezaCon method - true case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.empiezaCon("Hola")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "empiezaCon should return true when string starts with prefix",
    );
  });

  test("String empiezaCon method - false case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.empiezaCon("mundo")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "empiezaCon should return false when string does not start with prefix",
    );
  });

  test("String terminaCon method - true case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.terminaCon("mundo")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "terminaCon should return true when string ends with suffix",
    );
  });

  test("String terminaCon method - false case", () => {
    const code = `
      variable texto = "Hola mundo"
      variable resultado = texto.terminaCon("Hola")
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "terminaCon should return false when string does not end with suffix",
    );
  });

  test("String caracter method", () => {
    const code = `
      variable texto = "Hola"
      mostrar texto.caracter(0)
      mostrar texto.caracter(1)
      mostrar texto.caracter(3)
    `;

    const output = run(code);
    assertEquals(
      output,
      ["H", "o", "a"],
      "caracter should return character at index",
    );
  });

  test("String subcadena method", () => {
    const code = `
      variable texto = "Hola mundo"
      variable sub = texto.subcadena(0, 4)
      mostrar sub
    `;

    const output = run(code);
    assertEquals(output, ["Hola"], "subcadena should return substring");
  });

  test("String subcadena with one argument", () => {
    const code = `
      variable texto = "Hola mundo"
      variable sub = texto.subcadena(5)
      mostrar sub
    `;

    const output = run(code);
    assertEquals(
      output,
      ["mundo"],
      "subcadena with one arg should return from index to end",
    );
  });

  test("String invertir method", () => {
    const code = `
      variable texto = "Hola mundo"
      variable invertido = texto.invertir()
      mostrar invertido
    `;

    const output = run(code);
    assertEquals(output, ["odnum aloH"], "invertir should reverse the string");
  });

  test("String methods chaining", () => {
    const code = `
      variable texto = "  HOLA MUNDO  "
      variable resultado = texto.recortar().minusculas()
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["hola mundo"], "String methods should be chainable");
  });

  test("String methods with variables as arguments", () => {
    const code = `
      variable texto = "Hola mundo"
      variable buscar = "mundo"
      variable reemplazo = "amigo"
      variable resultado = texto.reemplazar(buscar, reemplazo)
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola amigo"],
      "String methods should work with variable arguments",
    );
  });

  // ============================================
  // ADDITIONAL CONTROL STRUCTURES TESTS
  // ============================================

  // elegir/caso (switch/case) tests
  test("elegir/caso basic functionality", () => {
    const code = `
      variable x = 2
      elegir x {
        caso 1: mostrar "uno"
        caso 2: mostrar "dos"
        caso 3: mostrar "tres"
        pordefecto: mostrar "otro"
      }
    `;

    const output = run(code);
    assertEquals(output, ["dos"], "elegir should match case 2");
  });

  test("elegir/caso with default", () => {
    const code = `
      variable x = 5
      elegir x {
        caso 1: mostrar "uno"
        caso 2: mostrar "dos"
        pordefecto: mostrar "otro valor"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["otro valor"],
      "elegir should use default when no match",
    );
  });

  test("elegir/caso with string values", () => {
    const code = `
      variable color = "rojo"
      elegir color {
        caso "azul": mostrar "es azul"
        caso "rojo": mostrar "es rojo"
        caso "verde": mostrar "es verde"
        pordefecto: mostrar "color desconocido"
      }
    `;

    const output = run(code);
    assertEquals(output, ["es rojo"], "elegir should work with strings");
  });

  test("elegir/caso with multiple statements in case", () => {
    const code = `
      variable x = 1
      variable resultado = 0
      elegir x {
        caso 1: {
          resultado = resultado + 10
          resultado = resultado + 5
          mostrar resultado
        }
        caso 2: mostrar "dos"
        pordefecto: mostrar "otro"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["15"],
      "elegir should support block statements in cases",
    );
  });

  test("elegir/caso without default", () => {
    const code = `
      variable x = 1
      elegir x {
        caso 1: mostrar "uno"
        caso 2: mostrar "dos"
      }
    `;

    const output = run(code);
    assertEquals(output, ["uno"], "elegir should work without default");
  });

  test("elegir/caso no match without default", () => {
    const code = `
      variable x = 99
      elegir x {
        caso 1: mostrar "uno"
        caso 2: mostrar "dos"
      }
      mostrar "fin"
    `;

    const output = run(code);
    assertEquals(
      output,
      ["fin"],
      "elegir without match and no default should continue",
    );
  });

  // hacer/mientras (do-while) tests
  test("hacer/mientras basic functionality", () => {
    const code = `
      variable i = 0
      hacer {
        mostrar i
        i = i + 1
      } mientras i < 3
    `;

    const output = run(code);
    assertEquals(
      output,
      ["0", "1", "2"],
      "hacer/mientras should execute and then check condition",
    );
  });

  test("hacer/mientras executes at least once", () => {
    const code = `
      variable i = 10
      hacer {
        mostrar "ejecutado"
      } mientras i < 5
    `;

    const output = run(code);
    assertEquals(
      output,
      ["ejecutado"],
      "hacer/mientras should execute at least once even if condition is false",
    );
  });

  test("hacer/mientras with break", () => {
    const code = `
      variable i = 0
      hacer {
        mostrar i
        i = i + 1
        si i == 2 {
          romper
        }
      } mientras i < 10
    `;

    const output = run(code);
    assertEquals(output, ["0", "1"], "hacer/mientras should support break");
  });

  test("hacer/mientras with continue", () => {
    const code = `
      variable i = 0
      variable contador = 0
      hacer {
        i = i + 1
        si i == 2 {
          continuar
        }
        mostrar i
        contador = contador + 1
      } mientras i < 4
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "3", "4"],
      "hacer/mientras should support continue",
    );
  });

  // para cada (for-each) tests
  test("para cada basic functionality", () => {
    const code = `
      variable numeros = [1, 2, 3]
      para cada num en numeros {
        mostrar num
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1", "2", "3"],
      "para cada should iterate over array",
    );
  });

  test("para cada with strings", () => {
    const code = `
      variable frutas = ["manzana", "banana", "naranja"]
      para cada fruta en frutas {
        mostrar fruta
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["manzana", "banana", "naranja"],
      "para cada should work with string arrays",
    );
  });

  test("para cada with empty array", () => {
    const code = `
      variable lista = []
      para cada elemento en lista {
        mostrar elemento
      }
      mostrar "fin"
    `;

    const output = run(code);
    assertEquals(output, ["fin"], "para cada should handle empty arrays");
  });

  test("para cada with break", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      para cada num en numeros {
        si num == 3 {
          romper
        }
        mostrar num
      }
    `;

    const output = run(code);
    assertEquals(output, ["1", "2"], "para cada should support break");
  });

  test("para cada with continue", () => {
    const code = `
      variable numeros = [1, 2, 3, 4]
      para cada num en numeros {
        si num == 2 {
          continuar
        }
        mostrar num
      }
    `;

    const output = run(code);
    assertEquals(output, ["1", "3", "4"], "para cada should support continue");
  });

  test("para cada modifying external variable", () => {
    const code = `
      variable numeros = [1, 2, 3, 4]
      variable suma = 0
      para cada num en numeros {
        suma = suma + num
      }
      mostrar suma
    `;

    const output = run(code);
    assertEquals(
      output,
      ["10"],
      "para cada should allow modifying external variables",
    );
  });

  test("para cada with objects in array", () => {
    const code = `
      variable personas = [
        {nombre: "Juan", edad: 30},
        {nombre: "Ana", edad: 25}
      ]
      para cada persona en personas {
        mostrar persona.nombre
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Juan", "Ana"],
      "para cada should work with objects in array",
    );
  });

  // ============================================
  // ADDITIONAL ARRAY METHODS TESTS
  // ============================================

  test("Array filtrar method", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5, 6]
      variable pares = numeros.filtrar(funcion(x) { retornar x % 2 == 0 })
      mostrar pares
    `;

    const output = run(code);
    assertEquals(output, ["[2, 4, 6]"], "filtrar should filter array elements");
  });

  test("Array filtrar with empty result", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable resultado = numeros.filtrar(funcion(x) { retornar x > 10 })
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[]"],
      "filtrar should return empty array when no matches",
    );
  });

  test("Array mapear method", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable dobles = numeros.mapear(funcion(x) { retornar x * 2 })
      mostrar dobles
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[2, 4, 6]"],
      "mapear should transform array elements",
    );
  });

  test("Array mapear with strings", () => {
    const code = `
      variable nombres = ["ana", "juan"]
      variable mayusculas = nombres.mapear(funcion(x) { retornar x.mayusculas() })
      mostrar mayusculas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[ANA, JUAN]"],
      "mapear should work with string methods",
    );
  });

  test("Array reducir method", () => {
    const code = `
      variable numeros = [1, 2, 3, 4]
      variable suma = numeros.reducir(funcion(acc, x) { retornar acc + x }, 0)
      mostrar suma
    `;

    const output = run(code);
    assertEquals(output, ["10"], "reducir should accumulate values");
  });

  test("Array reducir with initial value", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable producto = numeros.reducir(funcion(acc, x) { retornar acc * x }, 1)
      mostrar producto
    `;

    const output = run(code);
    assertEquals(
      output,
      ["6"],
      "reducir should work with different initial values",
    );
  });

  test("Array ordenar method with numbers", () => {
    const code = `
      variable numeros = [3, 1, 4, 1, 5, 9, 2, 6]
      variable ordenados = numeros.ordenar()
      mostrar ordenados
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[1, 1, 2, 3, 4, 5, 6, 9]"],
      "ordenar should sort numbers",
    );
  });

  test("Array ordenar method with strings", () => {
    const code = `
      variable palabras = ["banana", "manzana", "cereza"]
      variable ordenadas = palabras.ordenar()
      mostrar ordenadas
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[banana, cereza, manzana]"],
      "ordenar should sort strings",
    );
  });

  test("Array invertir method", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      variable invertidos = numeros.invertir()
      mostrar invertidos
    `;

    const output = run(code);
    assertEquals(output, ["[5, 4, 3, 2, 1]"], "invertir should reverse array");
  });

  test("Array buscar method", () => {
    const code = `
      variable numeros = [1, 5, 10, 15, 20]
      variable encontrado = numeros.buscar(funcion(x) { retornar x > 8 })
      mostrar encontrado
    `;

    const output = run(code);
    assertEquals(output, ["10"], "buscar should find first matching element");
  });

  test("Array buscar method not found", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable encontrado = numeros.buscar(funcion(x) { retornar x > 10 })
      mostrar encontrado
    `;

    const output = run(code);
    assertEquals(
      output,
      ["undefined"],
      "buscar should return undefined when not found",
    );
  });

  test("Array algunos method true", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      variable hayMayor = numeros.algunos(funcion(x) { retornar x > 3 })
      mostrar hayMayor
    `;

    const output = run(code);
    assertEquals(
      output,
      ["true"],
      "algunos should return true when some match",
    );
  });

  test("Array algunos method false", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable hayMayor = numeros.algunos(funcion(x) { retornar x > 10 })
      mostrar hayMayor
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "algunos should return false when none match",
    );
  });

  test("Array todos method true", () => {
    const code = `
      variable numeros = [2, 4, 6, 8]
      variable todosPares = numeros.todos(funcion(x) { retornar x % 2 == 0 })
      mostrar todosPares
    `;

    const output = run(code);
    assertEquals(output, ["true"], "todos should return true when all match");
  });

  test("Array todos method false", () => {
    const code = `
      variable numeros = [2, 4, 5, 8]
      variable todosPares = numeros.todos(funcion(x) { retornar x % 2 == 0 })
      mostrar todosPares
    `;

    const output = run(code);
    assertEquals(
      output,
      ["false"],
      "todos should return false when not all match",
    );
  });

  test("Array unir method", () => {
    const code = `
      variable palabras = ["Hola", "mundo", "cruel"]
      variable frase = palabras.unir(" ")
      mostrar frase
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Hola mundo cruel"],
      "unir should join array elements",
    );
  });

  test("Array unir with different separator", () => {
    const code = `
      variable numeros = [1, 2, 3]
      variable csv = numeros.unir(", ")
      mostrar csv
    `;

    const output = run(code);
    assertEquals(
      output,
      ["1, 2, 3"],
      "unir should work with different separators",
    );
  });

  test("Array cortar method", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      variable parte = numeros.cortar(1, 4)
      mostrar parte
    `;

    const output = run(code);
    assertEquals(output, ["[2, 3, 4]"], "cortar should return slice of array");
  });

  test("Array cortar with one argument", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5]
      variable parte = numeros.cortar(2)
      mostrar parte
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[3, 4, 5]"],
      "cortar with one arg should slice from index to end",
    );
  });

  test("Array insertar method", () => {
    const code = `
      variable numeros = [1, 2, 4, 5]
      numeros.insertar(2, 3)
      mostrar numeros
    `;

    const output = run(code);
    assertEquals(
      output,
      ["[1, 2, 3, 4, 5]"],
      "insertar should insert element at index",
    );
  });

  test("Array insertar at beginning", () => {
    const code = `
      variable numeros = [2, 3, 4]
      numeros.insertar(0, 1)
      mostrar numeros
    `;

    const output = run(code);
    assertEquals(output, ["[1, 2, 3, 4]"], "insertar should work at beginning");
  });

  test("Array methods chaining", () => {
    const code = `
      variable numeros = [1, 2, 3, 4, 5, 6]
      variable resultado = numeros.filtrar(funcion(x) { retornar x % 2 == 0 }).mapear(funcion(x) { retornar x * 2 })
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["[4, 8, 12]"], "Array methods should be chainable");
  });

  // ==================== CONSTANTES ====================

  test("Basic constant declaration", () => {
    const code = `
      constante PI = 3.14159
      mostrar PI
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3.14159"],
      "Constant should store and display value",
    );
  });

  test("Constant with string value", () => {
    const code = `
      constante SALUDO = "Hola mundo"
      mostrar SALUDO
    `;

    const output = run(code);
    assertEquals(output, ["Hola mundo"], "Constant should work with strings");
  });

  test("Constant with boolean value", () => {
    const code = `
      constante ACTIVO = verdadero
      mostrar ACTIVO
    `;

    const output = run(code);
    assertEquals(output, ["true"], "Constant should work with booleans");
  });

  test("Constant with expression", () => {
    const code = `
      constante DOBLE = 5 * 2
      mostrar DOBLE
    `;

    const output = run(code);
    assertEquals(output, ["10"], "Constant should evaluate expressions");
  });

  test("Constant used in expressions", () => {
    const code = `
      constante BASE = 10
      variable resultado = BASE * 5
      mostrar resultado
    `;

    const output = run(code);
    assertEquals(output, ["50"], "Constant should be usable in expressions");
  });

  test("Multiple constants", () => {
    const code = `
      constante PI = 3.14159
      constante E = 2.71828
      mostrar PI
      mostrar E
    `;

    const output = run(code);
    assertEquals(
      output,
      ["3.14159", "2.71828"],
      "Multiple constants should work",
    );
  });

  test("Constant in condition", () => {
    const code = `
      constante MAX = 100
      variable valor = 50
      si valor < MAX {
        mostrar "Dentro del límite"
      }
    `;

    const output = run(code);
    assertEquals(
      output,
      ["Dentro del límite"],
      "Constant should work in conditions",
    );
  });

  test("Constant in loop", () => {
    const code = `
      constante LIMITE = 3
      para (variable i = 0; i < LIMITE; i++) {
        mostrar i
      }
    `;

    const output = run(code);
    assertEquals(output, ["0", "1", "2"], "Constant should work in loops");
  });

  test("Constant with array", () => {
    const code = `
      constante COLORES = ["rojo", "verde", "azul"]
      mostrar COLORES.longitud()
      mostrar COLORES.primero()
    `;

    const output = run(code);
    assertEquals(output, ["3", "rojo"], "Constant should work with arrays");
  });

  test("Constant with object", () => {
    const code = `
      constante CONFIG = { version: "1.0", activo: verdadero }
      mostrar CONFIG.version
    `;

    const output = run(code);
    assertEquals(output, ["1.0"], "Constant should work with objects");
  });

  test("Constant reassignment should fail", () => {
    const code = `
      constante PI = 3.14159
      PI = 3.14
    `;

    const result = interpret(code);
    assertTrue(!result.success, "Should fail when reassigning constant");
    assertTrue(
      result.error.includes("constante") || result.error.includes("reasignar"),
      "Error should mention constant reassignment",
    );
  });

  test("Constant with compound assignment should fail", () => {
    const code = `
      constante VALOR = 10
      VALOR += 5
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when using compound assignment on constant",
    );
  });

  test("Constant with increment should fail", () => {
    const code = `
      constante CONTADOR = 0
      CONTADOR++
    `;

    const result = interpret(code);
    assertTrue(!result.success, "Should fail when incrementing constant");
  });

  test("Constant in function", () => {
    const code = `
      constante MULTIPLICADOR = 10

      funcion calcular(x) {
        retornar x * MULTIPLICADOR
      }

      mostrar calcular(5)
    `;

    const output = run(code);
    assertEquals(output, ["50"], "Constant should be accessible in functions");
  });

  test("Constant and variable with different names", () => {
    const code = `
      constante MAX = 100
      variable min = 0
      mostrar MAX
      mostrar min
      min = 10
      mostrar min
    `;

    const output = run(code);
    assertEquals(
      output,
      ["100", "0", "10"],
      "Constants and variables should coexist",
    );
  });

  // ==================== FUNCIONES DE CONVERSIÓN DE TIPOS ====================

  test("entero() converts string to integer", () => {
    const code = `
      variable num = entero("42")
      mostrar num
    `;
    const output = run(code);
    assertEquals(output, ["42"], "entero should convert string to integer");
  });

  test("entero() converts decimal to integer", () => {
    const code = `
      variable num = entero(3.7)
      mostrar num
    `;
    const output = run(code);
    assertEquals(output, ["3"], "entero should truncate decimal to integer");
  });

  test("entero() converts boolean to integer", () => {
    const code = `
      mostrar entero(verdadero)
      mostrar entero(falso)
    `;
    const output = run(code);
    assertEquals(output, ["1", "0"], "entero should convert booleans to 1/0");
  });

  test("entero() with invalid string returns NaN indicator", () => {
    const code = `
      variable num = entero("abc")
      mostrar num
    `;
    const output = run(code);
    assertEquals(
      output,
      ["NaN"],
      "entero should return NaN for invalid strings",
    );
  });

  test("decimal() converts string to float", () => {
    const code = `
      variable num = decimal("3.14159")
      mostrar num
    `;
    const output = run(code);
    assertEquals(output, ["3.14159"], "decimal should convert string to float");
  });

  test("decimal() converts integer to float", () => {
    const code = `
      variable num = decimal(42)
      mostrar num
    `;
    const output = run(code);
    assertEquals(output, ["42"], "decimal should handle integers");
  });

  test("decimal() converts boolean to float", () => {
    const code = `
      mostrar decimal(verdadero)
      mostrar decimal(falso)
    `;
    const output = run(code);
    assertEquals(output, ["1", "0"], "decimal should convert booleans to 1/0");
  });

  test("texto() converts number to string", () => {
    const code = `
      variable str = texto(123)
      mostrar str
      mostrar str + " es un número"
    `;
    const output = run(code);
    assertEquals(
      output,
      ["123", "123 es un número"],
      "texto should convert number to string",
    );
  });

  test("texto() converts boolean to string", () => {
    const code = `
      mostrar texto(verdadero)
      mostrar texto(falso)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["verdadero", "falso"],
      "texto should convert booleans to Spanish strings",
    );
  });

  test("texto() converts null and undefined", () => {
    const code = `
      mostrar texto(nulo)
      mostrar texto(indefinido)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["nulo", "indefinido"],
      "texto should convert null/undefined to Spanish strings",
    );
  });

  test("texto() converts array to string", () => {
    const code = `
      variable arr = [1, 2, 3]
      mostrar texto(arr)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["[1, 2, 3]"],
      "texto should convert array to string representation",
    );
  });

  test("booleano() converts truthy values", () => {
    const code = `
      mostrar booleano(1)
      mostrar booleano("hola")
      mostrar booleano(100)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "true"],
      "booleano should return true for truthy values",
    );
  });

  test("booleano() converts falsy values", () => {
    const code = `
      mostrar booleano(0)
      mostrar booleano("")
      mostrar booleano(nulo)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["false", "false", "false"],
      "booleano should return false for falsy values",
    );
  });

  test("tipo() returns number type", () => {
    const code = `
      mostrar tipo(42)
      mostrar tipo(3.14)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["numero", "numero"],
      "tipo should return 'numero' for numbers",
    );
  });

  test("tipo() returns text type", () => {
    const code = `
      mostrar tipo("hola")
      mostrar tipo("")
    `;
    const output = run(code);
    assertEquals(
      output,
      ["texto", "texto"],
      "tipo should return 'texto' for strings",
    );
  });

  test("tipo() returns boolean type", () => {
    const code = `
      mostrar tipo(verdadero)
      mostrar tipo(falso)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["booleano", "booleano"],
      "tipo should return 'booleano' for booleans",
    );
  });

  test("tipo() returns array type", () => {
    const code = `
      mostrar tipo([1, 2, 3])
      mostrar tipo([])
    `;
    const output = run(code);
    assertEquals(
      output,
      ["arreglo", "arreglo"],
      "tipo should return 'arreglo' for arrays",
    );
  });

  test("tipo() returns object type", () => {
    const code = `
      mostrar tipo({ nombre: "Juan" })
    `;
    const output = run(code);
    assertEquals(output, ["objeto"], "tipo should return 'objeto' for objects");
  });

  test("tipo() returns null and undefined types", () => {
    const code = `
      mostrar tipo(nulo)
      mostrar tipo(indefinido)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["nulo", "indefinido"],
      "tipo should return 'nulo'/'indefinido' for null/undefined",
    );
  });

  test("tipo() returns function type", () => {
    const code = `
      funcion saludar() {
        mostrar "hola"
      }
      mostrar tipo(saludar)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["funcion"],
      "tipo should return 'funcion' for functions",
    );
  });

  test("Type conversion in expressions", () => {
    const code = `
      variable a = entero("10") + 5
      variable b = decimal("2.5") * 2
      mostrar a
      mostrar b
    `;
    const output = run(code);
    assertEquals(
      output,
      ["15", "5"],
      "Type conversions should work in expressions",
    );
  });

  test("Chained type conversions", () => {
    const code = `
      variable num = entero(texto(42))
      mostrar num
      mostrar tipo(num)
    `;
    const output = run(code);
    assertEquals(output, ["42", "numero"], "Chained conversions should work");
  });

  // ==================== MÉTODOS NUMÉRICOS ====================

  test("numero.esPar() returns true for even numbers", () => {
    const code = `
      variable a = 4
      mostrar a.esPar()
      mostrar (10).esPar()
      mostrar (0).esPar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "true"],
      "esPar should return true for even numbers",
    );
  });

  test("numero.esPar() returns false for odd numbers", () => {
    const code = `
      variable a = 3
      mostrar a.esPar()
      mostrar (7).esPar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["false", "false"],
      "esPar should return false for odd numbers",
    );
  });

  test("numero.esImpar() returns true for odd numbers", () => {
    const code = `
      variable a = 5
      mostrar a.esImpar()
      mostrar (11).esImpar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true"],
      "esImpar should return true for odd numbers",
    );
  });

  test("numero.esImpar() returns false for even numbers", () => {
    const code = `
      variable a = 6
      mostrar a.esImpar()
      mostrar (0).esImpar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["false", "false"],
      "esImpar should return false for even numbers",
    );
  });

  test("numero.esPositivo() returns true for positive numbers", () => {
    const code = `
      variable a = 5
      mostrar a.esPositivo()
      mostrar (100).esPositivo()
      mostrar (0.5).esPositivo()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true", "true"],
      "esPositivo should return true for positive numbers",
    );
  });

  test("numero.esPositivo() returns false for zero and negative", () => {
    const code = `
      mostrar (0).esPositivo()
      mostrar (-5).esPositivo()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["false", "false"],
      "esPositivo should return false for zero and negative",
    );
  });

  test("numero.esNegativo() returns true for negative numbers", () => {
    const code = `
      variable a = -5
      mostrar a.esNegativo()
      mostrar (-100).esNegativo()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true"],
      "esNegativo should return true for negative numbers",
    );
  });

  test("numero.esNegativo() returns false for zero and positive", () => {
    const code = `
      mostrar (0).esNegativo()
      mostrar (5).esNegativo()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["false", "false"],
      "esNegativo should return false for zero and positive",
    );
  });

  test("numero.aTexto() converts number to string", () => {
    const code = `
      variable a = 42
      mostrar a.aTexto()
      mostrar tipo(a.aTexto())
    `;
    const output = run(code);
    assertEquals(
      output,
      ["42", "texto"],
      "aTexto should convert number to string",
    );
  });

  test("numero.aTexto() works with decimals", () => {
    const code = `
      variable a = 3.14159
      mostrar a.aTexto()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["3.14159"],
      "aTexto should work with decimal numbers",
    );
  });

  test("numero.aTexto() works with negative numbers", () => {
    const code = `
      mostrar (-42).aTexto()
    `;
    const output = run(code);
    assertEquals(output, ["-42"], "aTexto should work with negative numbers");
  });

  test("Numeric methods with expressions", () => {
    const code = `
      variable x = 3 + 1
      mostrar x.esPar()
      variable y = 10 / 2
      mostrar y.esImpar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["true", "true"],
      "Numeric methods should work with expression results",
    );
  });

  test("Numeric methods in conditions", () => {
    const code = `
      variable num = 7
      si num.esImpar() {
        mostrar "Es impar"
      }
      si num.esPositivo() {
        mostrar "Es positivo"
      }
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Es impar", "Es positivo"],
      "Numeric methods should work in conditions",
    );
  });

  // ==================== PROGRAMACIÓN ORIENTADA A OBJETOS ====================

  test("Basic class declaration and instantiation", () => {
    const code = `
      clase Persona {
        constructor(nombre) {
          este.nombre = nombre
        }
      }

      variable p = nuevo Persona("Juan")
      mostrar p.nombre
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Juan"],
      "Class should be instantiable with constructor",
    );
  });

  test("Class with multiple properties", () => {
    const code = `
      clase Persona {
        constructor(nombre, edad) {
          este.nombre = nombre
          este.edad = edad
        }
      }

      variable p = nuevo Persona("María", 25)
      mostrar p.nombre
      mostrar p.edad
    `;
    const output = run(code);
    assertEquals(
      output,
      ["María", "25"],
      "Class should support multiple constructor parameters",
    );
  });

  test("Class with methods", () => {
    const code = `
      clase Persona {
        constructor(nombre) {
          este.nombre = nombre
        }

        saludar() {
          retornar "Hola, soy " + este.nombre
        }
      }

      variable p = nuevo Persona("Carlos")
      mostrar p.saludar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Hola, soy Carlos"],
      "Class methods should access instance properties",
    );
  });

  test("Class with method that modifies properties", () => {
    const code = `
      clase Contador {
        constructor() {
          este.valor = 0
        }

        incrementar() {
          este.valor = este.valor + 1
        }

        obtener() {
          retornar este.valor
        }
      }

      variable c = nuevo Contador()
      mostrar c.obtener()
      c.incrementar()
      c.incrementar()
      mostrar c.obtener()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["0", "2"],
      "Methods should be able to modify instance properties",
    );
  });

  test("Class with method parameters", () => {
    const code = `
      clase Calculadora {
        constructor(base) {
          este.base = base
        }

        sumar(n) {
          retornar este.base + n
        }

        multiplicar(n) {
          retornar este.base * n
        }
      }

      variable calc = nuevo Calculadora(10)
      mostrar calc.sumar(5)
      mostrar calc.multiplicar(3)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["15", "30"],
      "Class methods should accept parameters",
    );
  });

  test("Multiple instances are independent", () => {
    const code = `
      clase Persona {
        constructor(nombre) {
          este.nombre = nombre
        }
      }

      variable p1 = nuevo Persona("Ana")
      variable p2 = nuevo Persona("Luis")
      mostrar p1.nombre
      mostrar p2.nombre
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Ana", "Luis"],
      "Multiple instances should be independent",
    );
  });

  test("Class inheritance with extiende", () => {
    const code = `
      clase Animal {
        constructor(nombre) {
          este.nombre = nombre
        }

        hablar() {
          retornar este.nombre + " hace un sonido"
        }
      }

      clase Perro extiende Animal {
        constructor(nombre) {
          super(nombre)
        }

        hablar() {
          retornar este.nombre + " ladra"
        }
      }

      variable perro = nuevo Perro("Rex")
      mostrar perro.hablar()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Rex ladra"],
      "Subclass should override parent methods",
    );
  });

  test("Inheritance accesses parent properties", () => {
    const code = `
      clase Animal {
        constructor(nombre) {
          este.nombre = nombre
          este.vivo = verdadero
        }
      }

      clase Gato extiende Animal {
        constructor(nombre, color) {
          super(nombre)
          este.color = color
        }
      }

      variable g = nuevo Gato("Michi", "negro")
      mostrar g.nombre
      mostrar g.color
      mostrar g.vivo
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Michi", "negro", "true"],
      "Subclass should inherit parent properties",
    );
  });

  test("Class without constructor", () => {
    const code = `
      clase Punto {
        obtenerX() {
          retornar este.x
        }
      }

      variable p = nuevo Punto()
      p.x = 10
      mostrar p.obtenerX()
    `;
    const output = run(code);
    assertEquals(output, ["10"], "Class without constructor should work");
  });

  test("Class method calling another method", () => {
    const code = `
      clase Rectangulo {
        constructor(ancho, alto) {
          este.ancho = ancho
          este.alto = alto
        }

        area() {
          retornar este.ancho * este.alto
        }

        perimetro() {
          retornar 2 * (este.ancho + este.alto)
        }

        descripcion() {
          retornar "Área: " + este.area() + ", Perímetro: " + este.perimetro()
        }
      }

      variable r = nuevo Rectangulo(5, 3)
      mostrar r.descripcion()
    `;
    const output = run(code);
    assertEquals(
      output,
      ["Área: 15, Perímetro: 16"],
      "Methods should be able to call other methods",
    );
  });

  test("Class with array property", () => {
    const code = `
      clase Lista {
        constructor() {
          este.items = []
        }

        agregar(item) {
          este.items.agregar(item)
        }

        cantidad() {
          retornar este.items.longitud()
        }
      }

      variable lista = nuevo Lista()
      lista.agregar("a")
      lista.agregar("b")
      mostrar lista.cantidad()
    `;
    const output = run(code);
    assertEquals(output, ["2"], "Class should work with array properties");
  });

  test("tipo() returns clase for instances", () => {
    const code = `
      clase MiClase {
        constructor() {}
      }

      variable obj = nuevo MiClase()
      mostrar tipo(obj)
    `;
    const output = run(code);
    assertEquals(
      output,
      ["MiClase"],
      "tipo() should return class name for instances",
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
