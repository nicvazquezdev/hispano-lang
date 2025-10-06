/**
 * TypeScript Definitions Generator for HispanoLang
 * Generates .d.ts files for better TypeScript support
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate TypeScript definitions for the main module
 */
function generateMainTypes() {
  const typesContent = `/**
 * HispanoLang - TypeScript Definitions
 * Un lenguaje de programación educativo en español
 */

/**
 * Resultado de la interpretación de código
 */
export interface InterpretationResult {
  /** Indica si la ejecución fue exitosa */
  success: boolean;
  /** Array de salidas generadas durante la ejecución */
  output: string[];
  /** Mensaje de error si la ejecución falló */
  error: string | null;
}

/**
 * Token del tokenizador
 */
export interface Token {
  /** Tipo del token */
  type: string;
  /** Lexema del token */
  lexeme: string;
  /** Valor literal del token */
  literal: any;
  /** Línea donde se encontró el token */
  line: number;
}

/**
 * Nodo del AST (Abstract Syntax Tree)
 */
export interface ASTNode {
  /** Tipo del nodo */
  type: string;
  /** Propiedades específicas del nodo */
  [key: string]: any;
}

/**
 * Entorno de variables
 */
export interface Environment {
  /** Valores de las variables */
  values: { [key: string]: any };
  /** Entorno padre (para scope) */
  enclosing?: Environment;
}

/**
 * Clase principal del intérprete HispanoLang
 */
export class Interpreter {
  /** Tokenizador del intérprete */
  tokenizer: Tokenizer;
  /** Evaluador del intérprete */
  evaluator: Evaluator;

  /**
   * Crea una nueva instancia del intérprete
   */
  constructor();

  /**
   * Interpreta código fuente en español
   * @param source - Código fuente a interpretar
   * @returns Resultado de la interpretación
   */
  interpret(source: string): InterpretationResult;

  /**
   * Ejecuta código y retorna solo las salidas
   * @param source - Código fuente a ejecutar
   * @returns Array de salidas
   */
  run(source: string): string[];

  /**
   * Obtiene el entorno de variables actual
   * @returns Entorno de variables
   */
  getEnvironment(): { [key: string]: any };

  /**
   * Limpia el entorno de variables
   */
  clearEnvironment(): void;
}

/**
 * Tokenizador para HispanoLang
 */
export class Tokenizer {
  /**
   * Tokeniza código fuente y retorna una lista de tokens
   * @param source - Código fuente a tokenizar
   * @returns Lista de tokens
   */
  tokenize(source: string): Token[];
}

/**
 * Parser para HispanoLang
 */
export class Parser {
  /**
   * Crea una nueva instancia del parser
   * @param tokens - Lista de tokens a parsear
   */
  constructor(tokens: Token[]);

  /**
   * Parsea tokens y retorna una lista de declaraciones
   * @returns Lista de declaraciones (AST)
   */
  parse(): ASTNode[];
}

/**
 * Evaluador para HispanoLang
 */
export class Evaluator {
  /** Entorno de variables */
  environment: Environment;
  /** Array de salidas */
  output: string[];

  /**
   * Crea una nueva instancia del evaluador
   */
  constructor();

  /**
   * Evalúa una lista de declaraciones
   * @param statements - Lista de declaraciones AST
   * @returns Resultado de la ejecución
   */
  evaluate(statements: ASTNode[]): string[];
}

/**
 * Función principal para interpretar código
 * @param code - Código fuente en español
 * @returns Resultado de la interpretación
 */
export function interpret(code: string): InterpretationResult;

/**
 * Ejecuta código y retorna solo las salidas
 * @param code - Código fuente en español
 * @returns Lista de salidas
 */
export function run(code: string): string[];

/**
 * Obtiene las variables definidas
 * @returns Variables en el entorno actual
 */
export function getVariables(): { [key: string]: any };

/**
 * Limpia el entorno de variables
 */
export function clearVariables(): void;

/**
 * Clase del intérprete (para uso directo)
 */
export { Interpreter };

// Re-export everything as default for CommonJS compatibility
declare const _default: {
  interpret: typeof interpret;
  run: typeof run;
  getVariables: typeof getVariables;
  clearVariables: typeof clearVariables;
  Interpreter: typeof Interpreter;
  Tokenizer: typeof Tokenizer;
  Parser: typeof Parser;
  Evaluator: typeof Evaluator;
};

export = _default;
`;

  return typesContent;
}

/**
 * Generate TypeScript definitions for CLI
 */
function generateCLITypes() {
  const typesContent = `/**
 * HispanoLang CLI - TypeScript Definitions
 */

/**
 * Opciones para ejecutar código
 */
export interface ExecuteOptions {
  /** Activar modo debug */
  debug?: boolean;
  /** Desactivar colores */
  noColor?: boolean;
}

/**
 * Ejecuta código con opciones opcionales
 * @param code - Código a ejecutar
 * @param options - Opciones de ejecución
 */
export function executeCode(code: string, options?: ExecuteOptions): void;

/**
 * Inicia el modo REPL interactivo
 */
export function startREPL(): void;

/**
 * Ejecuta los tests
 */
export function runTests(): void;

/**
 * Ejecuta un archivo
 * @param filePath - Ruta del archivo
 */
export function executeFile(filePath: string): void;

/**
 * Muestra la ayuda
 */
export function showHelp(): void;

/**
 * Muestra la versión
 */
export function showVersion(): void;
`;

  return typesContent;
}

/**
 * Main function to generate all TypeScript definitions
 */
function main() {
  try {
    // Create dist directory if it doesn't exist
    const distDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Generate main types
    const mainTypes = generateMainTypes();
    fs.writeFileSync(path.join(distDir, 'index.d.ts'), mainTypes);

    // Generate CLI types
    const cliTypes = generateCLITypes();
    fs.writeFileSync(path.join(distDir, 'cli.d.ts'), cliTypes);

    console.log('✅ TypeScript definitions generated successfully!');
    console.log('📁 Files created:');
    console.log('  - dist/index.d.ts');
    console.log('  - dist/cli.d.ts');
  } catch (error) {
    console.error('❌ Error generating TypeScript definitions:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateMainTypes,
  generateCLITypes,
  main
};
