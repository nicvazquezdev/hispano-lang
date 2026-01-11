/**
 * Evaluator for HispanoLang
 * Executes AST statements
 */

class Evaluator {
  constructor() {
    this.environment = new Environment();
    this.output = [];
  }

  /**
   * Evaluates a list of statements
   * @param {Array} statements - List of AST statements
   * @returns {Array} Execution result
   */
  evaluate(statements) {
    this.output = [];

    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      throw new Error(`Error de ejecución: ${error.message}`);
    }

    return this.output;
  }

  /**
   * Executes a statement
   * @param {Object} statement - Statement to execute
   */
  execute(statement) {
    switch (statement.type) {
      case "VariableDeclaration":
        return this.executeVariableDeclaration(statement);
      case "FunctionDeclaration":
        return this.executeFunctionDeclaration(statement);
      case "MostrarStatement":
        return this.executeMostrarStatement(statement);
      case "LeerStatement":
        return this.executeLeerStatement(statement);
      case "IfStatement":
        return this.executeIfStatement(statement);
      case "WhileStatement":
        return this.executeWhileStatement(statement);
      case "ForStatement":
        return this.executeForStatement(statement);
      case "ReturnStatement":
        return this.executeReturnStatement(statement);
      case "BreakStatement":
        return this.executeBreakStatement(statement);
      case "ContinueStatement":
        return this.executeContinueStatement(statement);
      case "TryCatch":
        return this.executeTryCatch(statement);
      case "ExpressionStatement":
        return this.executeExpressionStatement(statement);
      case "Block":
        return this.executeBlock(statement);
    }
  }

  /**
   * Executes a variable declaration
   * @param {Object} statement - Variable declaration
   */
  executeVariableDeclaration(statement) {
    let value = null;
    if (statement.initializer !== null) {
      value = this.evaluateExpression(statement.initializer);
    }

    this.environment.define(statement.name, value);
  }

  /**
   * Executes a function declaration
   * @param {Object} statement - Function declaration
   */
  executeFunctionDeclaration(statement) {
    const functionObj = {
      type: "Function",
      name: statement.name,
      parameters: statement.parameters,
      body: statement.body,
    };

    this.environment.define(statement.name, functionObj);
  }

  /**
   * Executes a show statement
   * @param {Object} statement - Show statement
   */
  executeMostrarStatement(statement) {
    const value = this.evaluateExpression(statement.expression);
    const output = this.stringify(value);
    this.output.push(output);
    console.log(output);
  }

  /**
   * Executes a read statement
   * @param {Object} statement - Read statement
   */
  executeLeerStatement(statement) {
    // Show prompt if provided
    if (statement.prompt) {
      console.log(statement.prompt);
    }

    // Try different methods for input
    let input = "";

    try {
      // Method 1: Try readline-sync
      const readlineSync = require("readline-sync");
      input = readlineSync.question("");
    } catch (error1) {
      try {
        // Method 2: Try fs.readFileSync with stdin
        const fs = require("fs");
        input = fs.readFileSync(0, "utf8").trim();
      } catch (error2) {
        try {
          // Method 3: Try process.stdin
          const readline = require("readline");
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          // This is a simplified approach - in a real implementation
          // you'd need to handle this asynchronously
          input = "";
        } catch (error3) {
          // Fallback: use empty string
          input = "";
          console.log("(Entrada no disponible en este entorno)");
        }
      }
    }

    // Try to parse as number first, then as string
    let value = input;
    if (!isNaN(input) && input.trim() !== "") {
      value = parseFloat(input);
    }

    // Store the value in the environment
    this.environment.define(statement.variable, value);
  }

  /**
   * Executes an if statement
   * @param {Object} statement - If statement
   */
  executeIfStatement(statement) {
    if (this.isTruthy(this.evaluateExpression(statement.condition))) {
      this.executeBlock(statement.thenBranch);
    } else if (statement.elseBranch !== null) {
      this.executeBlock(statement.elseBranch);
    }
  }

  /**
   * Executes a while statement
   * @param {Object} statement - While statement
   */
  executeWhileStatement(statement) {
    while (this.isTruthy(this.evaluateExpression(statement.condition))) {
      try {
        this.executeBlock(statement.body);
      } catch (breakException) {
        if (breakException instanceof BreakException) {
          break;
        }
        if (breakException instanceof ContinueException) {
          continue;
        }
        throw breakException;
      }
    }
  }

  /**
   * Executes a for statement
   * @param {Object} statement - For statement
   */
  executeForStatement(statement) {
    // Execute initializer
    if (statement.initializer !== null) {
      this.execute(statement.initializer);
    }

    // Execute loop
    // If no condition is provided, don't execute the loop (like JavaScript)
    if (statement.condition !== null) {
      while (this.isTruthy(this.evaluateExpression(statement.condition))) {
        try {
          this.executeBlock(statement.body);
        } catch (breakException) {
          if (breakException instanceof BreakException) {
            break;
          }
          if (breakException instanceof ContinueException) {
            // Execute increment before continuing
            if (statement.increment !== null) {
              this.evaluateExpression(statement.increment);
            }
            continue;
          }
          throw breakException;
        }

        // Execute increment
        if (statement.increment !== null) {
          this.evaluateExpression(statement.increment);
        }
      }
    }
  }

  /**
   * Executes a return statement
   * @param {Object} statement - Return statement
   */
  executeReturnStatement(statement) {
    let value = null;
    if (statement.value !== null) {
      value = this.evaluateExpression(statement.value);
    }

    throw new ReturnException(value);
  }

  /**
   * Executes a break statement
   * @param {Object} statement - Break statement
   */
  executeBreakStatement(statement) {
    throw new BreakException();
  }

  /**
   * Executes a continue statement
   * @param {Object} statement - Continue statement
   */
  executeContinueStatement(statement) {
    throw new ContinueException();
  }

  /**
   * Executes a block of statements
   * @param {Array} statements - List of statements in the block
   */
  executeBlock(statements) {
    const previous = this.environment;

    try {
      this.environment = new Environment(previous);

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  /**
   * Executes an expression statement
   * @param {Object} statement - Expression statement
   */
  executeExpressionStatement(statement) {
    return this.evaluateExpression(statement.expression);
  }

  /**
   * Evaluates an expression
   * @param {Object} expression - Expression to evaluate
   * @returns {any} Expression result
   */
  evaluateExpression(expression) {
    switch (expression.type) {
      case "Literal":
        return expression.value;

      case "TemplateString":
        return this.evaluateTemplateString(expression);

      case "Variable":
        return this.environment.get(expression.name);

      case "AnonymousFunction":
        return {
          type: "Function",
          name: null,
          parameters: expression.parameters,
          body: expression.body,
        };

      case "Assign":
        const value = this.evaluateExpression(expression.value);
        this.environment.assign(expression.name, value);
        return value;

      case "ArrayLiteral":
        return this.evaluateArrayLiteral(expression);

      case "ArrayAccess":
        return this.evaluateArrayAccess(expression);

      case "ArrayAssign":
        return this.evaluateArrayAssign(expression);

      case "ObjectLiteral":
        return this.evaluateObjectLiteral(expression);

      case "PropertyAccess":
        return this.evaluatePropertyAccess(expression);

      case "PropertyAssign":
        return this.evaluatePropertyAssign(expression);

      case "CompoundAssign":
        return this.evaluateCompoundAssign(expression);

      case "CompoundArrayAssign":
        return this.evaluateCompoundArrayAssign(expression);

      case "CompoundPropertyAssign":
        return this.evaluateCompoundPropertyAssign(expression);

      case "Logical":
        return this.evaluateLogicalExpression(expression);

      case "Postfix":
        return this.evaluatePostfixExpression(expression);

      case "Call":
        return this.evaluateCallExpression(expression);

      case "MethodCall":
        return this.evaluateMethodCall(expression);

      case "Unary":
        const right = this.evaluateExpression(expression.right);
        return this.evaluateUnaryExpression(expression.operator, right);

      case "Binary":
        const left = this.evaluateExpression(expression.left);
        const rightOperand = this.evaluateExpression(expression.right);
        return this.evaluateBinaryExpression(
          left,
          expression.operator,
          rightOperand,
        );

      default:
        throw new Error(`Tipo de expresión no reconocido: ${expression.type}`);
    }
  }

  /**
   * Evaluates a unary expression
   * @param {string} operator - Unary operator
   * @param {any} right - Right operand
   * @returns {any} Expression result
   */
  evaluateUnaryExpression(operator, right) {
    switch (operator) {
      case "MINUS":
        this.checkNumberOperand(operator, right);
        return -right;

      case "BANG":
        return !this.isTruthy(right);

      default:
        throw new Error(`Operador unario no reconocido: ${operator}`);
    }
  }

  /**
   * Evaluates a binary expression
   * @param {any} left - Left operand
   * @param {string} operator - Binary operator
   * @param {any} right - Right operand
   * @returns {any} Expression result
   */
  evaluateBinaryExpression(left, operator, right) {
    switch (operator) {
      case "MINUS":
        this.checkNumberOperands(operator, left, right);
        return left - right;

      case "PLUS":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        // Convert numbers to strings for concatenation
        const leftStr = this.stringify(left);
        const rightStr = this.stringify(right);
        return leftStr + rightStr;

      case "SLASH":
        this.checkNumberOperands(operator, left, right);
        if (right === 0) {
          throw new Error("División por cero");
        }
        return left / right;

      case "STAR":
        this.checkNumberOperands(operator, left, right);
        return left * right;

      case "PERCENT":
        this.checkNumberOperands(operator, left, right);
        if (right === 0) {
          throw new Error("Módulo por cero");
        }
        return left % right;

      case "GREATER":
        if (typeof left === "string" && typeof right === "string") {
          return left > right;
        }
        this.checkNumberOperands(operator, left, right);
        return left > right;

      case "GREATER_EQUAL":
        if (typeof left === "string" && typeof right === "string") {
          return left >= right;
        }
        this.checkNumberOperands(operator, left, right);
        return left >= right;

      case "LESS":
        if (typeof left === "string" && typeof right === "string") {
          return left < right;
        }
        this.checkNumberOperands(operator, left, right);
        return left < right;

      case "LESS_EQUAL":
        if (typeof left === "string" && typeof right === "string") {
          return left <= right;
        }
        this.checkNumberOperands(operator, left, right);
        return left <= right;

      case "EQUAL_EQUAL":
        return this.isEqual(left, right);

      case "BANG_EQUAL":
        return !this.isEqual(left, right);

      default:
        throw new Error(`Operador binario no reconocido: ${operator}`);
    }
  }

  /**
   * Checks if a value is truthy
   * @param {any} value - Value to check
   * @returns {boolean} True if it is truthy
   */
  isTruthy(value) {
    if (value === null) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    return true;
  }

  /**
   * Checks if two values are equal
   * @param {any} left - Left value
   * @param {any} right - Right value
   * @returns {boolean} True if they are equal
   */
  isEqual(left, right) {
    return left === right;
  }

  /**
   * Checks that an operand is a number
   * @param {string} operator - Operator
   * @param {any} operand - Operand
   */
  checkNumberOperand(operator, operand) {
    if (typeof operand === "number") return;
    throw new Error(`El operador ${operator} requiere un número`);
  }

  /**
   * Checks that two operands are numbers
   * @param {string} operator - Operator
   * @param {any} left - Left operand
   * @param {any} right - Right operand
   */
  checkNumberOperands(operator, left, right) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`El operador ${operator} requiere dos números`);
  }

  /**
   * Evaluates a function call
   * @param {Object} expression - Call expression
   * @returns {any} Function result
   */
  evaluateCallExpression(expression) {
    // Check if it's a built-in mathematical function BEFORE evaluating the callee
    if (
      expression.callee.type === "Variable" &&
      this.isMathFunction(expression.callee.name)
    ) {
      const args = [];
      for (const argument of expression.arguments) {
        args.push(this.evaluateExpression(argument));
      }
      return this.evaluateMathFunction(expression.callee.name, args);
    }

    const callee = this.evaluateExpression(expression.callee);
    const args = [];

    for (const argument of expression.arguments) {
      args.push(this.evaluateExpression(argument));
    }

    if (callee.type !== "Function") {
      throw new Error("Solo se pueden llamar funciones");
    }

    if (args.length !== callee.parameters.length) {
      throw new Error(
        `Se esperaban ${callee.parameters.length} argumentos pero se recibieron ${args.length}`,
      );
    }

    const environment = new Environment(this.environment);

    for (let i = 0; i < args.length; i++) {
      environment.define(callee.parameters[i], args[i]);
    }

    const previous = this.environment;
    try {
      this.environment = environment;
      this.executeBlock(callee.body);
      return null;
    } catch (returnValue) {
      if (returnValue instanceof ReturnException) {
        return returnValue.value;
      }
      throw returnValue;
    } finally {
      this.environment = previous;
    }
  }

  /**
   * Evaluates a method call (array or string)
   * @param {Object} expression - Method call expression
   * @returns {any} Method result
   */
  evaluateMethodCall(expression) {
    const object = this.evaluateExpression(expression.object);

    // Determine if it's an array or string method based on the object type
    if (Array.isArray(object)) {
      return this.evaluateArrayMethod(
        object,
        expression.method,
        expression.arguments,
      );
    } else if (typeof object === "string") {
      // Check if the method is valid for strings
      if (
        expression.method === "agregar" ||
        expression.method === "remover" ||
        expression.method === "recorrer" ||
        expression.method === "primero" ||
        expression.method === "ultimo"
      ) {
        throw new Error(
          `El método ${expression.method}() solo se puede llamar en arreglos`,
        );
      }
      return this.evaluateStringMethod(
        object,
        expression.method,
        expression.arguments,
      );
    } else {
      throw new Error(
        `Solo se pueden llamar métodos en arreglos o cadenas, se recibió ${typeof object}`,
      );
    }
  }

  /**
   * Evaluates an array method
   * @param {Array} array - The array object
   * @param {string} method - The method name
   * @param {Array} args - Method arguments (optional)
   * @returns {any} Method result
   */
  evaluateArrayMethod(array, method, args = []) {
    switch (method) {
      case "longitud":
        return array.length;

      case "primero":
        if (array.length === 0) {
          throw new Error(
            "No se puede obtener el primer elemento de un arreglo vacío",
          );
        }
        return array[0];

      case "ultimo":
        if (array.length === 0) {
          throw new Error(
            "No se puede obtener el último elemento de un arreglo vacío",
          );
        }
        return array[array.length - 1];

      case "agregar":
        // Evaluate all arguments and add them to the array
        for (const arg of args) {
          const value = this.evaluateExpression(arg);
          array.push(value);
        }
        return array.length; // Return the new length

      case "remover":
        // Remove and return the last element
        if (array.length === 0) {
          throw new Error(
            "No se puede eliminar un elemento de un arreglo vacío",
          );
        }
        return array.pop(); // Return the removed element

      case "contiene":
        // Check if array contains the specified element
        if (args.length !== 1) {
          throw new Error(
            "El método contiene() requiere exactamente un argumento",
          );
        }
        const searchElement = this.evaluateExpression(args[0]);
        return array.includes(searchElement);

      case "recorrer":
        // Iterate through array and call function for each element
        if (args.length !== 1) {
          throw new Error(
            "El método recorrer() requiere exactamente un argumento",
          );
        }
        const callback = this.evaluateExpression(args[0]);
        if (callback.type !== "Function") {
          throw new Error(
            "El método recorrer() requiere una función como argumento",
          );
        }

        // Call the function for each element
        for (let i = 0; i < array.length; i++) {
          // Create a new environment for the callback function
          const callbackEnv = new Environment(this.environment);

          // Handle function parameters
          if (callback.parameters.length === 0) {
            // No parameters - use automatic variables
            callbackEnv.define("elemento", array[i]);
            callbackEnv.define("indice", i);
          } else if (callback.parameters.length === 1) {
            // One parameter - element only
            callbackEnv.define(callback.parameters[0], array[i]);
            callbackEnv.define("indice", i);
          } else if (callback.parameters.length === 2) {
            // Two parameters - element and index
            callbackEnv.define(callback.parameters[0], array[i]);
            callbackEnv.define(callback.parameters[1], i);
          } else {
            throw new Error(
              "La función en recorrer() puede tener máximo 2 parámetros",
            );
          }

          // Execute the callback function
          const previousEnv = this.environment;
          this.environment = callbackEnv;
          try {
            this.executeBlock(callback.body);
          } finally {
            this.environment = previousEnv;
          }
        }
        return null; // forEach doesn't return anything

      default:
        throw new Error(`Método de arreglo desconocido: ${method}`);
    }
  }

  /**
   * Evaluates a string method
   * @param {string} string - The string object
   * @param {string} method - The method name
   * @param {Array} args - Method arguments (optional)
   * @returns {any} Method result
   */
  evaluateStringMethod(string, method, args = []) {
    switch (method) {
      case "longitud":
        return string.length;

      case "mayusculas":
        return string.toUpperCase();

      case "minusculas":
        return string.toLowerCase();

      case "dividir":
        if (args.length !== 1) {
          throw new Error("dividir() requiere exactamente 1 argumento");
        }
        const separator = this.evaluateExpression(args[0]);
        if (typeof separator !== "string") {
          throw new Error("dividir() requiere un argumento de tipo cadena");
        }
        return string.split(separator);

      case "reemplazar":
        if (args.length !== 2) {
          throw new Error("reemplazar() requiere exactamente 2 argumentos");
        }
        const search = this.evaluateExpression(args[0]);
        const replacement = this.evaluateExpression(args[1]);
        if (typeof search !== "string" || typeof replacement !== "string") {
          throw new Error("reemplazar() requiere argumentos de tipo cadena");
        }
        return string.split(search).join(replacement);

      case "recortar":
        return string.trim();

      case "incluye":
        if (args.length !== 1) {
          throw new Error("incluye() requiere exactamente 1 argumento");
        }
        const substring = this.evaluateExpression(args[0]);
        if (typeof substring !== "string") {
          throw new Error("incluye() requiere un argumento de tipo cadena");
        }
        return string.includes(substring);

      case "empiezaCon":
        if (args.length !== 1) {
          throw new Error("empiezaCon() requiere exactamente 1 argumento");
        }
        const prefix = this.evaluateExpression(args[0]);
        if (typeof prefix !== "string") {
          throw new Error("empiezaCon() requiere un argumento de tipo cadena");
        }
        return string.startsWith(prefix);

      case "terminaCon":
        if (args.length !== 1) {
          throw new Error("terminaCon() requiere exactamente 1 argumento");
        }
        const suffix = this.evaluateExpression(args[0]);
        if (typeof suffix !== "string") {
          throw new Error("terminaCon() requiere un argumento de tipo cadena");
        }
        return string.endsWith(suffix);

      case "caracter":
        if (args.length !== 1) {
          throw new Error("caracter() requiere exactamente 1 argumento");
        }
        const charIndex = this.evaluateExpression(args[0]);
        if (typeof charIndex !== "number") {
          throw new Error("caracter() requiere un argumento numérico");
        }
        if (charIndex < 0 || charIndex >= string.length) {
          throw new Error("Índice fuera de rango");
        }
        return string.charAt(charIndex);

      case "subcadena":
        if (args.length < 1 || args.length > 2) {
          throw new Error("subcadena() requiere 1 o 2 argumentos");
        }
        const start = this.evaluateExpression(args[0]);
        if (typeof start !== "number") {
          throw new Error("subcadena() requiere argumentos numéricos");
        }
        if (args.length === 2) {
          const end = this.evaluateExpression(args[1]);
          if (typeof end !== "number") {
            throw new Error("subcadena() requiere argumentos numéricos");
          }
          return string.substring(start, end);
        }
        return string.substring(start);

      case "invertir":
        return string.split("").reverse().join("");

      case "contiene":
        if (args.length !== 1) {
          throw new Error("contiene() requiere exactamente 1 argumento");
        }
        const searchStr = this.evaluateExpression(args[0]);
        if (typeof searchStr !== "string") {
          throw new Error("contiene() requiere un argumento de tipo cadena");
        }
        return string.includes(searchStr);

      default:
        throw new Error(`Método de cadena desconocido: ${method}`);
    }
  }

  /**
   * Checks if a function name is a built-in mathematical function
   * @param {string} name - Function name
   * @returns {boolean} True if it's a math function
   */
  isMathFunction(name) {
    const mathFunctions = [
      "raiz",
      "potencia",
      "seno",
      "coseno",
      "tangente",
      "logaritmo",
      "valorAbsoluto",
      "redondear",
      "techo",
      "piso",
      "aleatorio",
      "maximo",
      "minimo",
      "suma",
      "promedio",
    ];
    return mathFunctions.includes(name);
  }

  /**
   * Evaluates a mathematical function
   * @param {string} name - Function name
   * @param {Array} args - Function arguments
   * @returns {number} Function result
   */
  evaluateMathFunction(name, args) {
    switch (name) {
      case "raiz":
        if (args.length !== 1) {
          throw new Error("raiz() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("raiz() requiere un argumento numérico");
        }
        if (args[0] < 0) {
          throw new Error(
            "No se puede calcular la raíz cuadrada de un número negativo",
          );
        }
        return Math.sqrt(args[0]);

      case "potencia":
        if (args.length !== 2) {
          throw new Error("potencia() requiere exactamente 2 argumentos");
        }
        if (typeof args[0] !== "number" || typeof args[1] !== "number") {
          throw new Error("potencia() requiere argumentos numéricos");
        }
        return Math.pow(args[0], args[1]);

      case "seno":
        if (args.length !== 1) {
          throw new Error("seno() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("seno() requiere un argumento numérico");
        }
        return Math.sin(args[0]);

      case "coseno":
        if (args.length !== 1) {
          throw new Error("coseno() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("coseno() requiere un argumento numérico");
        }
        return Math.cos(args[0]);

      case "tangente":
        if (args.length !== 1) {
          throw new Error("tangente() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("tangente() requiere un argumento numérico");
        }
        return Math.tan(args[0]);

      case "logaritmo":
        if (args.length !== 1) {
          throw new Error("logaritmo() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("logaritmo() requiere un argumento numérico");
        }
        if (args[0] <= 0) {
          throw new Error(
            "No se puede calcular el logaritmo de un número no positivo",
          );
        }
        return Math.log(args[0]);

      case "valorAbsoluto":
        if (args.length !== 1) {
          throw new Error("valorAbsoluto() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("valorAbsoluto() requiere un argumento numérico");
        }
        return Math.abs(args[0]);

      case "redondear":
        if (args.length !== 1) {
          throw new Error("redondear() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("redondear() requiere un argumento numérico");
        }
        return Math.round(args[0]);

      case "techo":
        if (args.length !== 1) {
          throw new Error("techo() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("techo() requiere un argumento numérico");
        }
        return Math.ceil(args[0]);

      case "piso":
        if (args.length !== 1) {
          throw new Error("piso() requiere exactamente 1 argumento");
        }
        if (typeof args[0] !== "number") {
          throw new Error("piso() requiere un argumento numérico");
        }
        return Math.floor(args[0]);

      case "aleatorio":
        if (args.length === 0) {
          return Math.random();
        } else if (args.length === 1) {
          if (typeof args[0] !== "number") {
            throw new Error("aleatorio() requiere un argumento numérico");
          }
          return Math.random() * args[0];
        } else if (args.length === 2) {
          if (typeof args[0] !== "number" || typeof args[1] !== "number") {
            throw new Error("aleatorio() requiere argumentos numéricos");
          }
          return Math.random() * (args[1] - args[0]) + args[0];
        } else {
          throw new Error("aleatorio() acepta 0, 1, o 2 argumentos");
        }

      case "maximo":
        if (args.length < 1) {
          throw new Error("maximo() requiere al menos 1 argumento");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("maximo() requiere argumentos numéricos");
          }
        }
        return Math.max(...args);

      case "minimo":
        if (args.length < 1) {
          throw new Error("minimo() requiere al menos 1 argumento");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("minimo() requiere argumentos numéricos");
          }
        }
        return Math.min(...args);

      case "suma":
        if (args.length < 1) {
          throw new Error("suma() requiere al menos 1 argumento");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("suma() requiere argumentos numéricos");
          }
        }
        return args.reduce((sum, arg) => sum + arg, 0);

      case "promedio":
        if (args.length < 1) {
          throw new Error("promedio() requiere al menos 1 argumento");
        }
        for (const arg of args) {
          if (typeof arg !== "number") {
            throw new Error("promedio() requiere argumentos numéricos");
          }
        }
        return args.reduce((sum, arg) => sum + arg, 0) / args.length;

      default:
        throw new Error(`Función matemática desconocida: ${name}`);
    }
  }

  /**
   * Evaluates a template string with interpolation
   * @param {Object} expression - Template string expression
   * @returns {string} Interpolated string result
   */
  evaluateTemplateString(expression) {
    const { parts, expressions } = expression;
    let result = "";

    for (let i = 0; i < parts.length; i++) {
      result += parts[i];
      if (i < expressions.length) {
        const value = this.evaluateExpression(expressions[i]);
        result += this.stringifySpanish(value);
      }
    }

    return result;
  }

  /**
   * Evaluates an array literal
   * @param {Object} expression - Array literal expression
   * @returns {Array} Array value
   */
  evaluateArrayLiteral(expression) {
    const elements = [];
    for (const element of expression.elements) {
      elements.push(this.evaluateExpression(element));
    }
    return elements;
  }

  /**
   * Evaluates array access
   * @param {Object} expression - Array access expression
   * @returns {any} Array element value
   */
  evaluateArrayAccess(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);

    if (!Array.isArray(array)) {
      throw new Error("Solo se pueden acceder elementos de arreglos");
    }

    if (typeof index !== "number") {
      throw new Error("El índice del arreglo debe ser un número");
    }

    if (index < 0 || index >= array.length) {
      throw new Error("Índice del arreglo fuera de rango");
    }

    return array[index];
  }

  /**
   * Evaluates array assignment
   * @param {Object} expression - Array assignment expression
   * @returns {any} Assigned value
   */
  evaluateArrayAssign(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);
    const value = this.evaluateExpression(expression.value);

    if (!Array.isArray(array)) {
      throw new Error("Solo se pueden asignar elementos de arreglos");
    }

    if (typeof index !== "number") {
      throw new Error("El índice del arreglo debe ser un número");
    }

    if (index < 0 || index >= array.length) {
      throw new Error("Índice del arreglo fuera de rango");
    }

    array[index] = value;
    return value;
  }

  /**
   * Evaluates object literal
   * @param {Object} expression - Object literal expression
   * @returns {Object} Object value
   */
  evaluateObjectLiteral(expression) {
    const object = {};

    for (const property of expression.properties) {
      const value = this.evaluateExpression(property.value);
      object[property.name] = value;
    }

    return object;
  }

  /**
   * Evaluates property access
   * @param {Object} expression - Property access expression
   * @returns {any} Property value
   */
  evaluatePropertyAccess(expression) {
    const object = this.evaluateExpression(expression.object);

    if (typeof object !== "object" || object === null) {
      throw new Error("Solo se pueden acceder propiedades de objetos");
    }

    return object[expression.name];
  }

  /**
   * Evaluates property assignment
   * @param {Object} expression - Property assignment expression
   * @returns {any} Assigned value
   */
  evaluatePropertyAssign(expression) {
    const object = this.evaluateExpression(expression.object);
    const value = this.evaluateExpression(expression.value);

    if (typeof object !== "object" || object === null) {
      throw new Error("Solo se pueden asignar propiedades de objetos");
    }

    object[expression.name] = value;
    return value;
  }

  /**
   * Evaluates logical expression
   * @param {Object} expression - Logical expression
   * @returns {any} Logical result
   */
  evaluateLogicalExpression(expression) {
    const left = this.evaluateExpression(expression.left);

    if (expression.operator === "OR") {
      // Short-circuit evaluation for OR
      if (this.isTruthy(left)) {
        return left;
      }
      return this.evaluateExpression(expression.right);
    }

    if (expression.operator === "AND") {
      // Short-circuit evaluation for AND
      if (!this.isTruthy(left)) {
        return left;
      }
      return this.evaluateExpression(expression.right);
    }

    throw new Error(`Operador lógico desconocido: ${expression.operator}`);
  }

  /**
   * Evaluates compound assignment
   * @param {Object} expression - Compound assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundAssign(expression) {
    const currentValue = this.environment.get(expression.name);
    const rightValue = this.evaluateExpression(expression.value);
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    this.environment.assign(expression.name, newValue);
    return newValue;
  }

  /**
   * Evaluates compound array assignment
   * @param {Object} expression - Compound array assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundArrayAssign(expression) {
    const array = this.evaluateExpression(expression.array);
    const index = this.evaluateExpression(expression.index);
    const rightValue = this.evaluateExpression(expression.value);

    if (!Array.isArray(array)) {
      throw new Error("Solo se pueden asignar elementos de arreglos");
    }
    if (typeof index !== "number") {
      throw new Error("El índice del arreglo debe ser un número");
    }
    if (index < 0 || index >= array.length) {
      throw new Error("Índice del arreglo fuera de rango");
    }

    const currentValue = array[index];
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    array[index] = newValue;
    return newValue;
  }

  /**
   * Evaluates compound property assignment
   * @param {Object} expression - Compound property assignment expression
   * @returns {any} Assignment result
   */
  evaluateCompoundPropertyAssign(expression) {
    const object = this.evaluateExpression(expression.object);
    const rightValue = this.evaluateExpression(expression.value);

    if (typeof object !== "object" || object === null) {
      throw new Error("Solo se pueden asignar propiedades de objetos");
    }

    const currentValue = object[expression.name];
    const newValue = this.performCompoundOperation(
      currentValue,
      expression.operator,
      rightValue,
    );

    object[expression.name] = newValue;
    return newValue;
  }

  /**
   * Performs compound operation
   * @param {any} left - Left operand
   * @param {string} operator - Compound operator
   * @param {any} right - Right operand
   * @returns {any} Operation result
   */
  performCompoundOperation(left, operator, right) {
    switch (operator) {
      case "PLUS_EQUAL":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        throw new Error("No se pueden sumar valores no numéricos");

      case "MINUS_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Solo se pueden restar números");
        }
        return left - right;

      case "STAR_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Solo se pueden multiplicar números");
        }
        return left * right;

      case "SLASH_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Solo se pueden dividir números");
        }
        if (right === 0) {
          throw new Error("División por cero");
        }
        return left / right;

      case "PERCENT_EQUAL":
        if (typeof left !== "number" || typeof right !== "number") {
          throw new Error("Solo se puede hacer módulo con números");
        }
        if (right === 0) {
          throw new Error("Módulo por cero");
        }
        return left % right;

      default:
        throw new Error(`Operador compuesto desconocido: ${operator}`);
    }
  }

  /**
   * Evaluates postfix expression (increment/decrement)
   * @param {Object} expression - Postfix expression
   * @returns {any} Postfix result
   */
  evaluatePostfixExpression(expression) {
    const operand = this.evaluateExpression(expression.operand);

    if (expression.operator === "PLUS_PLUS") {
      if (typeof operand !== "number") {
        throw new Error("Solo se pueden incrementar números");
      }
      const newValue = operand + 1;

      // Update the variable if it's a variable reference
      if (expression.operand.type === "Variable") {
        this.environment.assign(expression.operand.name, newValue);
      } else if (expression.operand.type === "PropertyAccess") {
        const object = this.evaluateExpression(expression.operand.object);
        if (typeof object !== "object" || object === null) {
          throw new Error("Solo se pueden incrementar propiedades de objetos");
        }
        object[expression.operand.name] = newValue;
      } else if (expression.operand.type === "ArrayAccess") {
        const array = this.evaluateExpression(expression.operand.array);
        const index = this.evaluateExpression(expression.operand.index);
        if (!Array.isArray(array)) {
          throw new Error("Solo se pueden incrementar elementos de arreglos");
        }
        if (typeof index !== "number") {
          throw new Error("El índice del arreglo debe ser un número");
        }
        if (index < 0 || index >= array.length) {
          throw new Error("Índice del arreglo fuera de rango");
        }
        array[index] = newValue;
      } else {
        throw new Error("Objetivo de incremento inválido");
      }

      return operand; // Return the original value (postfix behavior)
    }

    if (expression.operator === "MINUS_MINUS") {
      if (typeof operand !== "number") {
        throw new Error("Solo se pueden decrementar números");
      }
      const newValue = operand - 1;

      // Update the variable if it's a variable reference
      if (expression.operand.type === "Variable") {
        this.environment.assign(expression.operand.name, newValue);
      } else if (expression.operand.type === "PropertyAccess") {
        const object = this.evaluateExpression(expression.operand.object);
        if (typeof object !== "object" || object === null) {
          throw new Error("Solo se pueden decrementar propiedades de objetos");
        }
        object[expression.operand.name] = newValue;
      } else if (expression.operand.type === "ArrayAccess") {
        const array = this.evaluateExpression(expression.operand.array);
        const index = this.evaluateExpression(expression.operand.index);
        if (!Array.isArray(array)) {
          throw new Error("Solo se pueden decrementar elementos de arreglos");
        }
        if (typeof index !== "number") {
          throw new Error("El índice del arreglo debe ser un número");
        }
        if (index < 0 || index >= array.length) {
          throw new Error("Índice del arreglo fuera de rango");
        }
        array[index] = newValue;
      } else {
        throw new Error("Objetivo de decremento inválido");
      }

      return operand; // Return the original value (postfix behavior)
    }

    throw new Error(`Operador postfijo desconocido: ${expression.operator}`);
  }

  /**
   * Converts a value to string for display
   * @param {any} value - Value to convert
   * @returns {string} String representation
   */
  stringify(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return `[${value.map((v) => this.stringify(v)).join(", ")}]`;
    }
    return value.toString();
  }

  /**
   * Converts a value to its Spanish string representation for template strings
   * @param {any} value - Value to convert
   * @returns {string} Spanish string representation
   */
  stringifySpanish(value) {
    if (value === null) return "nulo";
    if (value === undefined) return "indefinido";
    if (value === true) return "verdadero";
    if (value === false) return "falso";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return `[${value.map((v) => this.stringifySpanish(v)).join(", ")}]`;
    }
    return value.toString();
  }

  /**
   * Executes a try-catch statement
   * @param {Object} statement - Try-catch statement to execute
   */
  executeTryCatch(statement) {
    try {
      // Execute the try block
      this.executeBlock(statement.tryBlock);
    } catch (error) {
      // Check if it's a control flow exception (break/continue)
      if (
        error instanceof BreakException ||
        error instanceof ContinueException
      ) {
        throw error; // Re-throw control flow exceptions
      }

      // Store the error in the environment for the catch block
      this.environment.define(statement.errorVariable, error.message);

      // Execute the catch block
      this.executeBlock(statement.catchBlock);
    }
  }
}

/**
 * Class to handle variable environment
 */
class Environment {
  constructor(enclosing = null) {
    this.values = {};
    this.enclosing = enclosing;
  }

  /**
   * Defines a variable in the environment
   * @param {string} name - Variable name
   * @param {any} value - Variable value
   */
  define(name, value) {
    this.values[name] = value;
  }

  /**
   * Assigns a value to an existing variable
   * @param {string} name - Variable name
   * @param {any} value - Value to assign
   */
  assign(name, value) {
    if (name in this.values) {
      this.values[name] = value;
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new Error(`Variable no definida: ${name}`);
  }

  /**
   * Gets the value of a variable
   * @param {string} name - Variable name
   * @returns {any} Variable value
   */
  get(name) {
    if (name in this.values) {
      return this.values[name];
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new Error(`Variable no definida: ${name}`);
  }
}

/**
 * Exception class for return statements
 */
class ReturnException {
  constructor(value) {
    this.value = value;
  }
}

/**
 * Exception class for break statements
 */
class BreakException {
  constructor() {
    this.type = "break";
  }
}

/**
 * Exception class for continue statements
 */
class ContinueException {
  constructor() {
    this.type = "continue";
  }
}

/**
 * Exception class for try-catch errors
 */
class TryCatchException {
  constructor(message) {
    this.type = "try-catch";
    this.message = message;
  }
}

module.exports = Evaluator;
