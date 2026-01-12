/**
 * Evaluator for HispanoLang
 * Executes AST statements
 */

class Evaluator {
  constructor() {
    this.environment = new Environment();
    this.output = [];
    this.currentInstance = null; // For tracking 'este' (this)
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
      throw new Error(error.message);
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
      case "ConstantDeclaration":
        return this.executeConstantDeclaration(statement);
      case "FunctionDeclaration":
        return this.executeFunctionDeclaration(statement);
      case "ClassDeclaration":
        return this.executeClassDeclaration(statement);
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
      case "ElegirStatement":
        return this.executeElegirStatement(statement);
      case "HacerMientrasStatement":
        return this.executeHacerMientrasStatement(statement);
      case "ForEachStatement":
        return this.executeForEachStatement(statement);
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
   * Executes a constant declaration
   * @param {Object} statement - Constant declaration
   */
  executeConstantDeclaration(statement) {
    const value = this.evaluateExpression(statement.initializer);
    this.environment.defineConstant(statement.name, value);
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
   * Executes a class declaration
   * @param {Object} statement - Class declaration
   */
  executeClassDeclaration(statement) {
    const classObj = {
      type: "Class",
      name: statement.name,
      superclass: statement.superclass,
      constructor: statement.constructor,
      methods: statement.methods,
    };

    this.environment.define(statement.name, classObj);
  }

  /**
   * Executes a show statement
   * @param {Object} statement - Show statement
   */
  executeMostrarStatement(statement) {
    const value = this.evaluateExpression(statement.expression);
    const output = this.stringify(value);
    this.output.push(output);
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
      // Check if elseBranch is another IfStatement (sino si) or a block
      if (statement.elseBranch.type === "IfStatement") {
        this.executeIfStatement(statement.elseBranch);
      } else {
        this.executeBlock(statement.elseBranch);
      }
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
   * Executes a function body (handles both block and arrow expression bodies)
   * @param {Object} func - Function object with body and isArrowExpression flag
   * @returns {any} Result of the function execution
   */
  executeFunctionBody(func) {
    if (func.isArrowExpression) {
      return this.evaluateExpression(func.body);
    }
    try {
      for (const statement of func.body) {
        this.execute(statement);
      }
      return null;
    } catch (returnValue) {
      if (returnValue instanceof ReturnException) {
        return returnValue.value;
      }
      throw returnValue;
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

      case "ArrowFunction":
        return {
          type: "Function",
          name: null,
          parameters: expression.parameters,
          body: expression.body,
          isArrowExpression: expression.isExpression,
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

      case "Prefix":
        return this.evaluatePrefixExpression(expression);

      case "Call":
        return this.evaluateCallExpression(expression);

      case "MethodCall":
        return this.evaluateMethodCall(expression);

      case "NewExpression":
        return this.evaluateNewExpression(expression);

      case "This":
        if (this.currentInstance === null) {
          throw new Error(
            "'este' solo se puede usar dentro de un método de clase",
          );
        }
        return this.currentInstance;

      case "ThisPropertyAccess":
        return this.evaluateThisPropertyAccess(expression);

      case "ThisPropertyAssign":
        return this.evaluateThisPropertyAssign(expression);

      case "ThisMethodCall":
        return this.evaluateThisMethodCall(expression);

      case "SuperCall":
        return this.evaluateSuperCall(expression);

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

    // Check if it's a built-in type conversion function
    if (
      expression.callee.type === "Variable" &&
      this.isConversionFunction(expression.callee.name)
    ) {
      const args = [];
      for (const argument of expression.arguments) {
        args.push(this.evaluateExpression(argument));
      }
      return this.evaluateConversionFunction(expression.callee.name, args);
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
      // Arrow functions with expression body return the expression directly
      if (callee.isArrowExpression) {
        return this.evaluateExpression(callee.body);
      }
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
   * Evaluates a method call (array, string, number, or instance)
   * @param {Object} expression - Method call expression
   * @returns {any} Method result
   */
  evaluateMethodCall(expression) {
    const object = this.evaluateExpression(expression.object);

    // Determine if it's an array, string, number, or instance method
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
    } else if (typeof object === "number") {
      return this.evaluateNumberMethod(
        object,
        expression.method,
        expression.arguments,
      );
    } else if (object && object.type === "Instance") {
      return this.evaluateInstanceMethodCall(
        object,
        expression.method,
        expression.arguments,
      );
    } else {
      throw new Error(
        `Solo se pueden llamar métodos en arreglos, cadenas, números o instancias`,
      );
    }
  }

  /**
   * Evaluates an instance method call
   * @param {Object} instance - The instance object
   * @param {string} methodName - The method name
   * @param {Array} args - Method arguments
   * @returns {any} Method result
   */
  evaluateInstanceMethodCall(instance, methodName, args) {
    // Find the method in the class
    let method = null;
    const classObj = instance.classObj;

    for (const m of classObj.methods) {
      if (m.name === methodName) {
        method = m;
        break;
      }
    }

    // If not found, check parent class
    if (!method && instance.parentClass) {
      for (const m of instance.parentClass.methods) {
        if (m.name === methodName) {
          method = m;
          break;
        }
      }
    }

    if (!method) {
      throw new Error(
        `Método '${methodName}' no encontrado en la clase '${instance.className}'`,
      );
    }

    // Evaluate arguments
    const evaluatedArgs = [];
    for (const arg of args) {
      evaluatedArgs.push(this.evaluateExpression(arg));
    }

    // Check argument count
    if (method.parameters.length !== evaluatedArgs.length) {
      throw new Error(
        `El método '${methodName}' espera ${method.parameters.length} argumentos pero recibió ${evaluatedArgs.length}`,
      );
    }

    // Set up method environment
    const methodEnv = new Environment(this.environment);
    for (let i = 0; i < evaluatedArgs.length; i++) {
      methodEnv.define(method.parameters[i], evaluatedArgs[i]);
    }

    const previousInstance = this.currentInstance;
    const previousEnv = this.environment;
    this.currentInstance = instance;
    this.environment = methodEnv;

    try {
      this.executeBlock(method.body);
      return null;
    } catch (returnValue) {
      if (returnValue instanceof ReturnException) {
        return returnValue.value;
      }
      throw returnValue;
    } finally {
      this.environment = previousEnv;
      this.currentInstance = previousInstance;
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
            this.executeFunctionBody(callback);
          } finally {
            this.environment = previousEnv;
          }
        }
        return null; // forEach doesn't return anything

      case "filtrar":
        // Filter array elements based on a predicate function
        if (args.length !== 1) {
          throw new Error("filtrar() requiere exactamente 1 argumento");
        }
        const filterCallback = this.evaluateExpression(args[0]);
        if (filterCallback.type !== "Function") {
          throw new Error("filtrar() requiere una función como argumento");
        }
        const filteredArray = [];
        for (let i = 0; i < array.length; i++) {
          const filterEnv = new Environment(this.environment);
          if (filterCallback.parameters.length >= 1) {
            filterEnv.define(filterCallback.parameters[0], array[i]);
          }
          if (filterCallback.parameters.length >= 2) {
            filterEnv.define(filterCallback.parameters[1], i);
          }
          const prevEnv = this.environment;
          this.environment = filterEnv;
          try {
            const result = this.executeFunctionBody(filterCallback);
            if (this.isTruthy(result)) {
              filteredArray.push(array[i]);
            }
          } finally {
            this.environment = prevEnv;
          }
        }
        return filteredArray;

      case "mapear":
        // Transform each element using a function
        if (args.length !== 1) {
          throw new Error("mapear() requiere exactamente 1 argumento");
        }
        const mapCallback = this.evaluateExpression(args[0]);
        if (mapCallback.type !== "Function") {
          throw new Error("mapear() requiere una función como argumento");
        }
        const mappedArray = [];
        for (let i = 0; i < array.length; i++) {
          const mapEnv = new Environment(this.environment);
          if (mapCallback.parameters.length >= 1) {
            mapEnv.define(mapCallback.parameters[0], array[i]);
          }
          if (mapCallback.parameters.length >= 2) {
            mapEnv.define(mapCallback.parameters[1], i);
          }
          const prevEnv = this.environment;
          this.environment = mapEnv;
          try {
            const result = this.executeFunctionBody(mapCallback);
            mappedArray.push(result);
          } finally {
            this.environment = prevEnv;
          }
        }
        return mappedArray;

      case "reducir":
        // Reduce array to a single value
        if (args.length < 1 || args.length > 2) {
          throw new Error("reducir() requiere 1 o 2 argumentos");
        }
        const reduceCallback = this.evaluateExpression(args[0]);
        if (reduceCallback.type !== "Function") {
          throw new Error(
            "reducir() requiere una función como primer argumento",
          );
        }
        let accumulator =
          args.length === 2 ? this.evaluateExpression(args[1]) : array[0];
        const startIndex = args.length === 2 ? 0 : 1;
        for (let i = startIndex; i < array.length; i++) {
          const reduceEnv = new Environment(this.environment);
          if (reduceCallback.parameters.length >= 1) {
            reduceEnv.define(reduceCallback.parameters[0], accumulator);
          }
          if (reduceCallback.parameters.length >= 2) {
            reduceEnv.define(reduceCallback.parameters[1], array[i]);
          }
          if (reduceCallback.parameters.length >= 3) {
            reduceEnv.define(reduceCallback.parameters[2], i);
          }
          const prevEnv = this.environment;
          this.environment = reduceEnv;
          try {
            accumulator = this.executeFunctionBody(reduceCallback);
          } finally {
            this.environment = prevEnv;
          }
        }
        return accumulator;

      case "ordenar":
        // Sort array (optionally with comparison function)
        if (args.length === 0) {
          // Default sort (numeric or string)
          return [...array].sort((a, b) => {
            if (typeof a === "number" && typeof b === "number") {
              return a - b;
            }
            return String(a).localeCompare(String(b));
          });
        } else if (args.length === 1) {
          const sortCallback = this.evaluateExpression(args[0]);
          if (sortCallback.type !== "Function") {
            throw new Error("ordenar() requiere una función como argumento");
          }
          return [...array].sort((a, b) => {
            const sortEnv = new Environment(this.environment);
            if (sortCallback.parameters.length >= 1) {
              sortEnv.define(sortCallback.parameters[0], a);
            }
            if (sortCallback.parameters.length >= 2) {
              sortEnv.define(sortCallback.parameters[1], b);
            }
            const prevEnv = this.environment;
            this.environment = sortEnv;
            try {
              return this.executeFunctionBody(sortCallback) || 0;
            } finally {
              this.environment = prevEnv;
            }
          });
        } else {
          throw new Error("ordenar() acepta 0 o 1 argumentos");
        }

      case "invertir":
        // Reverse array (returns new array)
        return [...array].reverse();

      case "buscar":
        // Find first element matching predicate
        if (args.length !== 1) {
          throw new Error("buscar() requiere exactamente 1 argumento");
        }
        const findCallback = this.evaluateExpression(args[0]);
        if (findCallback.type !== "Function") {
          throw new Error("buscar() requiere una función como argumento");
        }
        for (let i = 0; i < array.length; i++) {
          const findEnv = new Environment(this.environment);
          if (findCallback.parameters.length >= 1) {
            findEnv.define(findCallback.parameters[0], array[i]);
          }
          if (findCallback.parameters.length >= 2) {
            findEnv.define(findCallback.parameters[1], i);
          }
          const prevEnv = this.environment;
          this.environment = findEnv;
          try {
            const result = this.executeFunctionBody(findCallback);
            if (this.isTruthy(result)) {
              return array[i];
            }
          } finally {
            this.environment = prevEnv;
          }
        }
        return undefined;

      case "algunos":
        // Check if some elements match predicate
        if (args.length !== 1) {
          throw new Error("algunos() requiere exactamente 1 argumento");
        }
        const someCallback = this.evaluateExpression(args[0]);
        if (someCallback.type !== "Function") {
          throw new Error("algunos() requiere una función como argumento");
        }
        for (let i = 0; i < array.length; i++) {
          const someEnv = new Environment(this.environment);
          if (someCallback.parameters.length >= 1) {
            someEnv.define(someCallback.parameters[0], array[i]);
          }
          if (someCallback.parameters.length >= 2) {
            someEnv.define(someCallback.parameters[1], i);
          }
          const prevEnv = this.environment;
          this.environment = someEnv;
          try {
            const result = this.executeFunctionBody(someCallback);
            if (this.isTruthy(result)) {
              return true;
            }
          } finally {
            this.environment = prevEnv;
          }
        }
        return false;

      case "todos":
        // Check if all elements match predicate
        if (args.length !== 1) {
          throw new Error("todos() requiere exactamente 1 argumento");
        }
        const everyCallback = this.evaluateExpression(args[0]);
        if (everyCallback.type !== "Function") {
          throw new Error("todos() requiere una función como argumento");
        }
        for (let i = 0; i < array.length; i++) {
          const everyEnv = new Environment(this.environment);
          if (everyCallback.parameters.length >= 1) {
            everyEnv.define(everyCallback.parameters[0], array[i]);
          }
          if (everyCallback.parameters.length >= 2) {
            everyEnv.define(everyCallback.parameters[1], i);
          }
          const prevEnv = this.environment;
          this.environment = everyEnv;
          try {
            const result = this.executeFunctionBody(everyCallback);
            if (!this.isTruthy(result)) {
              return false;
            }
          } finally {
            this.environment = prevEnv;
          }
        }
        return true;

      case "unir":
        // Join array elements into string
        if (args.length !== 1) {
          throw new Error("unir() requiere exactamente 1 argumento");
        }
        const separator = this.evaluateExpression(args[0]);
        if (typeof separator !== "string") {
          throw new Error("unir() requiere un argumento de tipo cadena");
        }
        return array.join(separator);

      case "cortar":
        // Slice array (returns subarray)
        if (args.length < 1 || args.length > 2) {
          throw new Error("cortar() requiere 1 o 2 argumentos");
        }
        const sliceStart = this.evaluateExpression(args[0]);
        if (typeof sliceStart !== "number") {
          throw new Error("cortar() requiere argumentos numéricos");
        }
        if (args.length === 2) {
          const sliceEnd = this.evaluateExpression(args[1]);
          if (typeof sliceEnd !== "number") {
            throw new Error("cortar() requiere argumentos numéricos");
          }
          return array.slice(sliceStart, sliceEnd);
        }
        return array.slice(sliceStart);

      case "insertar":
        // Insert element at position (modifies array)
        if (args.length !== 2) {
          throw new Error("insertar() requiere exactamente 2 argumentos");
        }
        const insertIndex = this.evaluateExpression(args[0]);
        const insertValue = this.evaluateExpression(args[1]);
        if (typeof insertIndex !== "number") {
          throw new Error("insertar() requiere un índice numérico");
        }
        array.splice(insertIndex, 0, insertValue);
        return array.length;

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
   * Evaluates a number method
   * @param {number} number - The number object
   * @param {string} method - The method name
   * @param {Array} args - Method arguments (optional)
   * @returns {any} Method result
   */
  evaluateNumberMethod(number, method, args = []) {
    switch (method) {
      case "esPar":
        return number % 2 === 0;

      case "esImpar":
        return number % 2 !== 0;

      case "esPositivo":
        return number > 0;

      case "esNegativo":
        return number < 0;

      case "aTexto":
        return String(number);

      default:
        throw new Error(`Método de número desconocido: ${method}`);
    }
  }

  /**
   * Evaluates a new expression (class instantiation)
   * @param {Object} expression - New expression
   * @returns {Object} Instance object
   */
  evaluateNewExpression(expression) {
    const className = expression.className;
    const classObj = this.environment.get(className);

    if (!classObj || classObj.type !== "Class") {
      throw new Error(`'${className}' no es una clase`);
    }

    // Create a new instance
    const instance = {
      type: "Instance",
      className: className,
      classObj: classObj,
      properties: {},
    };

    // Evaluate constructor arguments
    const args = [];
    for (const arg of expression.arguments) {
      args.push(this.evaluateExpression(arg));
    }

    // If class extends another, get parent class
    let parentClass = null;
    if (classObj.superclass) {
      parentClass = this.environment.get(classObj.superclass);
      if (!parentClass || parentClass.type !== "Class") {
        throw new Error(`Clase padre '${classObj.superclass}' no encontrada`);
      }
      instance.parentClass = parentClass;
    }

    // Execute constructor if present
    if (classObj.constructor) {
      const previousInstance = this.currentInstance;
      this.currentInstance = instance;

      const constructorEnv = new Environment(this.environment);

      // Bind constructor parameters
      if (classObj.constructor.parameters.length !== args.length) {
        throw new Error(
          `El constructor de '${className}' espera ${classObj.constructor.parameters.length} argumentos pero recibió ${args.length}`,
        );
      }
      for (let i = 0; i < args.length; i++) {
        constructorEnv.define(classObj.constructor.parameters[i], args[i]);
      }

      const previousEnv = this.environment;
      this.environment = constructorEnv;

      try {
        this.executeBlock(classObj.constructor.body);
      } catch (returnValue) {
        if (!(returnValue instanceof ReturnException)) {
          throw returnValue;
        }
      } finally {
        this.environment = previousEnv;
        this.currentInstance = previousInstance;
      }
    }

    return instance;
  }

  /**
   * Evaluates this property access (este.propiedad)
   * @param {Object} expression - ThisPropertyAccess expression
   * @returns {any} Property value
   */
  evaluateThisPropertyAccess(expression) {
    if (this.currentInstance === null) {
      throw new Error("'este' solo se puede usar dentro de un método de clase");
    }

    const property = expression.property;

    // Check if it's a property
    if (property in this.currentInstance.properties) {
      return this.currentInstance.properties[property];
    }

    // Check if it's a method
    const classObj = this.currentInstance.classObj;
    for (const method of classObj.methods) {
      if (method.name === property) {
        // Return a bound method
        return {
          type: "BoundMethod",
          method: method,
          instance: this.currentInstance,
        };
      }
    }

    // Check parent class methods
    if (this.currentInstance.parentClass) {
      for (const method of this.currentInstance.parentClass.methods) {
        if (method.name === property) {
          return {
            type: "BoundMethod",
            method: method,
            instance: this.currentInstance,
          };
        }
      }
    }

    return undefined;
  }

  /**
   * Evaluates this property assignment (este.propiedad = valor)
   * @param {Object} expression - ThisPropertyAssign expression
   * @returns {any} Assigned value
   */
  evaluateThisPropertyAssign(expression) {
    if (this.currentInstance === null) {
      throw new Error("'este' solo se puede usar dentro de un método de clase");
    }

    const value = this.evaluateExpression(expression.value);
    this.currentInstance.properties[expression.property] = value;
    return value;
  }

  /**
   * Evaluates this method call (este.metodo())
   * @param {Object} expression - ThisMethodCall expression
   * @returns {any} Method result
   */
  evaluateThisMethodCall(expression) {
    if (this.currentInstance === null) {
      throw new Error("'este' solo se puede usar dentro de un método de clase");
    }

    return this.evaluateInstanceMethodCall(
      this.currentInstance,
      expression.method,
      expression.arguments,
    );
  }

  /**
   * Evaluates super() call
   * @param {Object} expression - SuperCall expression
   * @returns {any} Result of parent constructor
   */
  evaluateSuperCall(expression) {
    if (this.currentInstance === null) {
      throw new Error(
        "'super' solo se puede usar dentro de un método de clase",
      );
    }

    const parentClass = this.currentInstance.parentClass;
    if (!parentClass) {
      throw new Error(
        "'super' solo se puede usar en clases que extienden otra clase",
      );
    }

    // Evaluate arguments
    const args = [];
    for (const arg of expression.arguments) {
      args.push(this.evaluateExpression(arg));
    }

    // Execute parent constructor
    if (parentClass.constructor) {
      const constructorEnv = new Environment(this.environment);

      if (parentClass.constructor.parameters.length !== args.length) {
        throw new Error(
          `El constructor padre espera ${parentClass.constructor.parameters.length} argumentos pero recibió ${args.length}`,
        );
      }
      for (let i = 0; i < args.length; i++) {
        constructorEnv.define(parentClass.constructor.parameters[i], args[i]);
      }

      const previousEnv = this.environment;
      this.environment = constructorEnv;

      try {
        this.executeBlock(parentClass.constructor.body);
      } catch (returnValue) {
        if (!(returnValue instanceof ReturnException)) {
          throw returnValue;
        }
      } finally {
        this.environment = previousEnv;
      }
    }

    return null;
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
   * Checks if a function name is a built-in type conversion function
   * @param {string} name - Function name
   * @returns {boolean} True if it's a conversion function
   */
  isConversionFunction(name) {
    const conversionFunctions = [
      "entero",
      "decimal",
      "texto",
      "booleano",
      "tipo",
    ];
    return conversionFunctions.includes(name);
  }

  /**
   * Evaluates a type conversion function
   * @param {string} name - Function name
   * @param {Array} args - Function arguments
   * @returns {any} Converted value
   */
  evaluateConversionFunction(name, args) {
    if (args.length !== 1) {
      throw new Error(`${name}() requiere exactamente 1 argumento`);
    }

    const value = args[0];

    switch (name) {
      case "entero":
        // Convert to integer
        if (typeof value === "number") {
          return Math.trunc(value);
        }
        if (typeof value === "string") {
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? NaN : parsed;
        }
        if (typeof value === "boolean") {
          return value ? 1 : 0;
        }
        if (value === null || value === undefined) {
          return 0;
        }
        throw new Error("No se puede convertir a entero");

      case "decimal":
        // Convert to float
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? NaN : parsed;
        }
        if (typeof value === "boolean") {
          return value ? 1 : 0;
        }
        if (value === null || value === undefined) {
          return 0;
        }
        throw new Error("No se puede convertir a decimal");

      case "texto":
        // Convert to string (Spanish representation)
        if (value === null) return "nulo";
        if (value === undefined) return "indefinido";
        if (typeof value === "boolean") return value ? "verdadero" : "falso";
        if (typeof value === "string") return value;
        if (Array.isArray(value)) {
          return `[${value.map((v) => this.stringifyForTexto(v)).join(", ")}]`;
        }
        if (typeof value === "object") {
          return "[objeto]";
        }
        return String(value);

      case "booleano":
        // Convert to boolean
        if (value === null || value === undefined) return false;
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") return value.length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;

      case "tipo":
        // Return type as Spanish string
        if (value === null) return "nulo";
        if (value === undefined) return "indefinido";
        if (typeof value === "number") return "numero";
        if (typeof value === "string") return "texto";
        if (typeof value === "boolean") return "booleano";
        if (Array.isArray(value)) return "arreglo";
        if (typeof value === "object" && value.type === "Function")
          return "funcion";
        if (typeof value === "object" && value.type === "Instance")
          return value.className;
        if (typeof value === "object" && value.type === "Class") return "clase";
        if (typeof value === "object") return "objeto";
        return "desconocido";

      default:
        throw new Error(`Función de conversión desconocida: ${name}`);
    }
  }

  /**
   * Helper to stringify values for texto() function
   * @param {any} value - Value to stringify
   * @returns {string} String representation
   */
  stringifyForTexto(value) {
    if (value === null) return "nulo";
    if (value === undefined) return "indefinido";
    if (typeof value === "boolean") return value ? "verdadero" : "falso";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return `[${value.map((v) => this.stringifyForTexto(v)).join(", ")}]`;
    }
    return String(value);
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

    // Handle Instance objects
    if (object.type === "Instance") {
      // Check if it's a property
      if (expression.name in object.properties) {
        return object.properties[expression.name];
      }

      // Check if it's a method (will be called later via MethodCall)
      const classObj = object.classObj;
      for (const method of classObj.methods) {
        if (method.name === expression.name) {
          return {
            type: "BoundMethod",
            method: method,
            instance: object,
          };
        }
      }

      // Check parent class methods
      if (object.parentClass) {
        for (const method of object.parentClass.methods) {
          if (method.name === expression.name) {
            return {
              type: "BoundMethod",
              method: method,
              instance: object,
            };
          }
        }
      }

      return undefined;
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

    // Handle Instance objects
    if (object.type === "Instance") {
      object.properties[expression.name] = value;
      return value;
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
   * Evaluates prefix expression (increment/decrement)
   * @param {Object} expression - Prefix expression
   * @returns {any} New value after increment/decrement
   */
  evaluatePrefixExpression(expression) {
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

      return newValue; // Return the new value (prefix behavior)
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

      return newValue; // Return the new value (prefix behavior)
    }

    throw new Error(`Operador prefijo desconocido: ${expression.operator}`);
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

  /**
   * Executes an elegir (switch) statement
   * @param {Object} statement - Elegir statement to execute
   */
  executeElegirStatement(statement) {
    const discriminantValue = this.evaluateExpression(statement.discriminant);

    // Try to find a matching case
    for (const caseClause of statement.cases) {
      const testValue = this.evaluateExpression(caseClause.test);
      if (discriminantValue === testValue) {
        // Execute the matching case
        for (const stmt of caseClause.consequent) {
          this.execute(stmt);
        }
        return; // Exit after executing the matching case (no fall-through)
      }
    }

    // If no case matched, execute default if present
    if (statement.defaultCase) {
      for (const stmt of statement.defaultCase.consequent) {
        this.execute(stmt);
      }
    }
  }

  /**
   * Executes a hacer/mientras (do-while) statement
   * @param {Object} statement - HacerMientras statement to execute
   */
  executeHacerMientrasStatement(statement) {
    do {
      try {
        this.executeBlock(statement.body);
      } catch (error) {
        if (error instanceof BreakException) {
          break;
        }
        if (error instanceof ContinueException) {
          continue;
        }
        throw error;
      }
    } while (this.isTruthy(this.evaluateExpression(statement.condition)));
  }

  /**
   * Executes a para cada (for-each) statement
   * @param {Object} statement - ForEach statement to execute
   */
  executeForEachStatement(statement) {
    const iterable = this.evaluateExpression(statement.iterable);

    if (!Array.isArray(iterable)) {
      throw new Error("para cada solo puede iterar sobre arreglos");
    }

    for (const element of iterable) {
      // Create a new environment for each iteration
      const loopEnv = new Environment(this.environment);
      loopEnv.define(statement.iterator, element);

      const previousEnv = this.environment;
      this.environment = loopEnv;

      try {
        this.executeBlock(statement.body);
      } catch (error) {
        if (error instanceof BreakException) {
          this.environment = previousEnv;
          break;
        }
        if (error instanceof ContinueException) {
          this.environment = previousEnv;
          continue;
        }
        this.environment = previousEnv;
        throw error;
      }

      this.environment = previousEnv;
    }
  }
}

/**
 * Class to handle variable environment
 */
class Environment {
  constructor(enclosing = null) {
    this.values = {};
    this.constants = new Set();
    this.enclosing = enclosing;
  }

  /**
   * Defines a variable in the environment
   * @param {string} name - Variable name
   * @param {any} value - Variable value
   */
  define(name, value) {
    // Remove from constants if it was previously defined as one
    this.constants.delete(name);
    this.values[name] = value;
  }

  /**
   * Defines a constant in the environment
   * @param {string} name - Constant name
   * @param {any} value - Constant value
   */
  defineConstant(name, value) {
    this.values[name] = value;
    this.constants.add(name);
  }

  /**
   * Checks if a name is a constant
   * @param {string} name - Name to check
   * @returns {boolean} True if it's a constant
   */
  isConstant(name) {
    if (this.constants.has(name)) {
      return true;
    }
    if (this.enclosing !== null) {
      return this.enclosing.isConstant(name);
    }
    return false;
  }

  /**
   * Assigns a value to an existing variable
   * @param {string} name - Variable name
   * @param {any} value - Value to assign
   */
  assign(name, value) {
    if (this.isConstant(name)) {
      throw new Error(`No se puede reasignar la constante: ${name}`);
    }

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
