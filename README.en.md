# Educational Programming Language in Spanish

A simple and educational interpreter designed to teach programming to Spanish speakers without language barriers.

## 🎯 Objective

Create a programming language in Spanish that allows people with limited resources to learn programming without needing to know English, eliminating one of the main barriers to accessing technological education.

## ✨ Features

- **Spanish syntax**: Keywords in Spanish to facilitate learning
- **Ultra simple**: Only two essential commands to get started
- **Interpreted**: Direct execution without compilation
- **Lightweight**: Minimal and easy to understand code
- **Extensible**: Modular architecture to add new features

## 🚀 Installation and Usage

```bash
# Clone the repository
git clone https://github.com/your-username/lenguaje-programacion-espanol.git
cd lenguaje-programacion-espanol

# Install dependencies (optional)
npm install

# Run the interpreter
node main.js
```

## 📚 Language Syntax

This interpreter currently supports only two fundamental commands:

### Variables

```javascript
variable edad = 25
variable nombre = "María"
variable activo = verdadero
```

### Show information

```javascript
mostrar "Hola mundo"
mostrar edad
mostrar nombre
```

### Complete example

```javascript
variable nombre = "Ana"
variable edad = 25
mostrar "Hola, me llamo"
mostrar nombre
mostrar "y tengo"
mostrar edad
mostrar "años"
```

## 🏗️ Architecture

The interpreter is organized into separate modules:

- **Tokenizer** (`src/tokenizer.js`): Converts source code into tokens
- **Parser** (`src/parser.js`): Converts tokens into an Abstract Syntax Tree (AST)
- **Evaluator** (`src/evaluator.js`): Executes AST statements
- **Interpreter** (`src/interpreter.js`): Coordinates all modules

## 🔧 API

### Using the interpreter

```javascript
const { interpret, run, getVariables } = require("./main.js");

// Interpret code
const result = interpret(`
    variable x = 10
    mostrar x
`);

console.log(result.success); // true
console.log(result.output); // ["10"]

// Execute and get only output
const output = run(`
    variable saludo = "Hola"
    mostrar saludo
`);
console.log(output); // ["Hola"]

// View defined variables
console.log(getVariables()); // { saludo: "Hola" }
```

## 🧪 Examples

### Personal presentation

```javascript
variable nombre = "Carlos"
variable edad = 20
variable ciudad = "Madrid"

mostrar "Hola, soy"
mostrar nombre
mostrar "Tengo"
mostrar edad
mostrar "años y vivo en"
mostrar ciudad
```

### Task list

```javascript
variable tarea1 = "Estudiar programación"
variable tarea2 = "Hacer ejercicio"
variable tarea3 = "Leer un libro"

mostrar "Mis tareas de hoy:"
mostrar tarea1
mostrar tarea2
mostrar tarea3
```

### Product information

```javascript
variable producto = "Laptop"
variable precio = 800
variable marca = "TechCorp"

mostrar "Producto:"
mostrar producto
mostrar "Marca:"
mostrar marca
mostrar "Precio:"
mostrar precio
```

## 🚧 Future Features

- [ ] Basic mathematical operations (`+`, `-`, `*`, `/`)
- [ ] Conditionals (`si`, `sino`)
- [ ] Loops (`mientras`, `repetir`)
- [ ] Comparisons (`>`, `<`, `==`)
- [ ] User-defined functions
- [ ] Arrays/lists
- [ ] User input operations
- [ ] Interactive web interface
- [ ] Integrated exercises and tutorials

## 🤝 Contributing

This project is open source and free. Contributions are welcome:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Inspiration

Inspired by the need to democratize access to programming education for low-resource Spanish-speaking communities, eliminating the English language barrier.

## 📞 Contact

- GitHub: [your-username](https://github.com/your-username)
- Email: your-email@example.com

---

**Help us make programming more accessible to everyone!** 🌍
