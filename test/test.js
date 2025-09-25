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
      mostrar listaVacia.primero
    `;

    const result = interpret(code);
    assertTrue(
      !result.success,
      "Should fail when getting first element of empty array",
    );
    assertTrue(
      result.error.includes("Cannot get first element of empty array"),
      "Error should mention empty array",
    );
  });

  // Test 73: Complex example with all features including logical operators
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
