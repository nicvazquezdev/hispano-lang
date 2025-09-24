# Lenguaje de Programación Educativo en Español

Un intérprete simple y educativo diseñado para enseñar programación a hispanohablantes sin barreras de idioma.

## 🎯 Objetivo

Crear un lenguaje de programación en español que permita a personas de bajos recursos aprender programación sin necesidad de conocer inglés, eliminando una de las principales barreras para acceder a la educación tecnológica.

## ✨ Características

- **Sintaxis en español**: Palabras clave en español para facilitar el aprendizaje
- **Ultra simple**: Solo dos comandos esenciales para empezar
- **Interpretado**: Ejecución directa sin compilación
- **Ligero**: Código mínimo y fácil de entender
- **Extensible**: Arquitectura modular para agregar nuevas características

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/lenguaje-programacion-espanol.git
cd lenguaje-programacion-espanol

# Instalar dependencias (opcional)
npm install

# Ejecutar el intérprete
node main.js
```

## 📚 Sintaxis del Lenguaje

Este intérprete actualmente soporta solo dos comandos fundamentales:

### Variables

```javascript
variable edad = 25
variable nombre = "María"
variable activo = verdadero
```

### Mostrar información

```javascript
mostrar "Hola mundo"
mostrar edad
mostrar nombre
```

### Ejemplo completo

```javascript
variable nombre = "Ana"
variable edad = 25
mostrar "Hola, me llamo"
mostrar nombre
mostrar "y tengo"
mostrar edad
mostrar "años"
```

## 🏗️ Arquitectura

El intérprete está organizado en módulos separados:

- **Tokenizer** (`src/tokenizer.js`): Convierte el código fuente en tokens
- **Parser** (`src/parser.js`): Convierte tokens en un Árbol de Sintaxis Abstracta (AST)
- **Evaluator** (`src/evaluator.js`): Ejecuta las declaraciones del AST
- **Interpreter** (`src/interpreter.js`): Coordina todos los módulos

## 🔧 API

### Usar el intérprete

```javascript
const { interpret, run, getVariables } = require("./main.js");

// Interpretar código
const resultado = interpret(`
    variable x = 10
    mostrar x
`);

console.log(resultado.success); // true
console.log(resultado.output); // ["10"]

// Ejecutar y obtener solo output
const output = run(`
    variable saludo = "Hola"
    mostrar saludo
`);
console.log(output); // ["Hola"]

// Ver variables definidas
console.log(getVariables()); // { saludo: "Hola" }
```

## 🧪 Ejemplos

### Presentación personal

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

### Lista de tareas

```javascript
variable tarea1 = "Estudiar programación"
variable tarea2 = "Hacer ejercicio"
variable tarea3 = "Leer un libro"

mostrar "Mis tareas de hoy:"
mostrar tarea1
mostrar tarea2
mostrar tarea3
```

### Información de producto

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

## 🤝 Contribuir

Este proyecto es open source y gratuito. Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🌟 Inspiración

Inspirado en la necesidad de democratizar el acceso a la educación en programación para comunidades hispanohablantes de bajos recursos, eliminando la barrera del idioma inglés.

---
