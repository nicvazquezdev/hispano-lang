#!/usr/bin/env node

/**
 * HispanoLang CLI Tool
 * Command-line interface for the HispanoLang interpreter
 */

const fs = require('fs');
const path = require('path');

// Try to require from different possible locations
let hispanoLang;
try {
  // Try from dist/ (when installed globally)
  hispanoLang = require('../dist/index.js');
} catch (error1) {
  try {
    // Try from main.js (when running locally)
    hispanoLang = require('../main.js');
  } catch (error2) {
    try {
      // Try from current directory (fallback)
    hispanoLang = require('./index.js');
    } catch (error3) {
      console.error('❌ Error: No se pudo cargar HispanoLang. Verifica la instalación.');
      process.exit(1);
    }
  }
}

const { interpret, run, getVariables, clearVariables, Interpreter } = hispanoLang;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

/**
 * Display help information
 */
function showHelp() {
  console.log(`
${colors.bold}${colors.cyan}HispanoLang - Intérprete de Lenguaje de Programación en Español${colors.reset}

${colors.bold}Uso:${colors.reset}
  hispano [opciones] [archivo]
  hispano-lang [opciones] [archivo]

${colors.bold}Opciones:${colors.reset}
  -h, --help          Mostrar esta ayuda
  -v, --version       Mostrar la versión
  -i, --interactive    Modo interactivo (REPL)
  -e, --eval <código>  Ejecutar código directamente
  -t, --test          Ejecutar tests
  -d, --debug         Modo debug (mostrar tokens y AST)
  --no-color          Desactivar colores en la salida

${colors.bold}Ejemplos:${colors.reset}
  hispano                    # Modo interactivo
  hispano script.hl          # Ejecutar archivo
  hispano -e "mostrar 'Hola'" # Ejecutar código
  hispano --interactive      # Modo interactivo
  hispano --test            # Ejecutar tests

${colors.bold}Archivos soportados:${colors.reset}
  .hl, .hispano, .hispano-lang

${colors.bold}Documentación:${colors.reset}
  https://github.com/nicvazquezdev/hispano-lang
`);
}

/**
 * Display version information
 */
function showVersion() {
  const packageJson = require('../package.json');
  console.log(`${colors.bold}HispanoLang v${packageJson.version}${colors.reset}`);
  console.log(`${colors.dim}${packageJson.description}${colors.reset}`);
}

/**
 * Execute code with optional debug information
 */
function executeCode(code, options = {}) {
  try {
    if (options.debug) {
      console.log(`${colors.yellow}🔍 Modo Debug Activado${colors.reset}\n`);

      // Show tokens
      const interpreter = new Interpreter();
      const tokens = interpreter.tokenizer.tokenize(code);
      console.log(`${colors.blue}📝 Tokens:${colors.reset}`);
      tokens.forEach((token, index) => {
        if (token.type !== 'EOF') {
          console.log(`  ${index}: ${token.type} "${token.lexeme}" (${token.literal})`);
        }
      });
      console.log();
    }

    const result = interpret(code);

    if (result.success) {
      if (result.output && result.output.length > 0) {
        result.output.forEach(output => {
          console.log(output);
        });
      }
    } else {
      console.error(`${colors.red}❌ Error: ${result.error}${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error inesperado: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Interactive REPL mode
 */
function startREPL() {
  const readline = require('readline');

  console.log(`${colors.bold}${colors.green}🚀 HispanoLang REPL${colors.reset}`);
  console.log(`${colors.dim}Escribe código en español. Escribe 'salir' para terminar.${colors.reset}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${colors.cyan}hispano> ${colors.reset}`
  });

  rl.prompt();

  rl.on('line', (input) => {
    const trimmedInput = input.trim();

    if (trimmedInput === 'salir' || trimmedInput === 'exit' || trimmedInput === 'quit') {
      console.log(`${colors.green}¡Hasta luego! 👋${colors.reset}`);
      rl.close();
      return;
    }

    if (trimmedInput === 'limpiar' || trimmedInput === 'clear') {
      clearVariables();
      console.log(`${colors.yellow}Variables limpiadas${colors.reset}`);
      rl.prompt();
      return;
    }

    if (trimmedInput === 'variables' || trimmedInput === 'vars') {
      const variables = getVariables();
      if (Object.keys(variables).length === 0) {
        console.log(`${colors.dim}No hay variables definidas${colors.reset}`);
      } else {
        console.log(`${colors.blue}Variables definidas:${colors.reset}`);
        Object.entries(variables).forEach(([name, value]) => {
          console.log(`  ${name}: ${JSON.stringify(value)}`);
        });
      }
      rl.prompt();
      return;
    }

    if (trimmedInput === 'ayuda' || trimmedInput === 'help') {
      console.log(`${colors.blue}Comandos disponibles:${colors.reset}`);
      console.log(`  ${colors.cyan}salir${colors.reset} - Terminar el REPL`);
      console.log(`  ${colors.cyan}limpiar${colors.reset} - Limpiar variables`);
      console.log(`  ${colors.cyan}variables${colors.reset} - Mostrar variables definidas`);
      console.log(`  ${colors.cyan}ayuda${colors.reset} - Mostrar esta ayuda`);
      rl.prompt();
      return;
    }

    if (trimmedInput === '') {
      rl.prompt();
      return;
    }

    try {
      executeCode(trimmedInput);
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

/**
 * Run tests
 */
function runTests() {
  console.log(`${colors.bold}${colors.yellow}🧪 Ejecutando Tests de HispanoLang${colors.reset}\n`);

  try {
    require('../test/test.js');
  } catch (error) {
    console.error(`${colors.red}❌ Error ejecutando tests: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Read and execute file
 */
function executeFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    console.log(`${colors.blue}📄 Ejecutando: ${filePath}${colors.reset}\n`);
    executeCode(code);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    } else {
      console.error(`${colors.red}❌ Error leyendo archivo: ${error.message}${colors.reset}`);
    }
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  let options = {
    debug: false,
    noColor: false
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);

      case '-v':
      case '--version':
        showVersion();
        process.exit(0);

      case '-i':
      case '--interactive':
        startREPL();
        return;

      case '-e':
      case '--eval':
        if (i + 1 < args.length) {
          let code = args[i + 1];
          // Handle multiple arguments for eval
          if (i + 2 < args.length) {
            // Join remaining arguments
            const remainingArgs = args.slice(i + 1);
            code = remainingArgs.join(' ');
          }
          executeCode(code, options);
          process.exit(0);
        } else {
          console.error(`${colors.red}❌ Error: --eval requiere código${colors.reset}`);
          process.exit(1);
        }

      case '-t':
      case '--test':
        runTests();
        process.exit(0);

      case '-d':
      case '--debug':
        options.debug = true;
        break;

      case '--no-color':
        options.noColor = true;
        // Disable colors
        Object.keys(colors).forEach(key => {
          colors[key] = '';
        });
        break;

      default:
        // Check if it's a file
        if (!arg.startsWith('-')) {
          const filePath = path.resolve(arg);
          const ext = path.extname(filePath);

          // Check if it's a supported file
          if (['.hl', '.hispano', '.hispano-lang', '.js'].includes(ext) ||
              fs.existsSync(filePath)) {
            executeFile(filePath);
            return;
          }
        }
        break;
    }
  }

  // If no arguments, start interactive mode
  if (args.length === 0) {
    startREPL();
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  executeCode,
  startREPL,
  runTests,
  executeFile,
  showHelp,
  showVersion
};
