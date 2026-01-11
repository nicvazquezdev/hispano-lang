# HispanoLang

<div align="center">

**Un lenguaje de programación educativo en español para enseñar programación sin barreras de idioma**

[![npm version](https://img.shields.io/npm/v/hispano-lang?style=flat-square)](https://www.npmjs.com/package/hispano-lang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/hispano-lang?style=flat-square)](https://nodejs.org/)
[![Downloads](https://img.shields.io/npm/dm/hispano-lang?style=flat-square)](https://www.npmjs.com/package/hispano-lang)

[📖 Documentación](#documentación) • [🚀 Instalación](#instalación) • [💻 Uso](#uso) • [📚 Ejemplos](#ejemplos) • [🤝 Contribuir](#contribuir)

</div>

## 🎯 ¿Por qué HispanoLang?

La mayoría de los lenguajes de programación utilizan palabras clave en inglés, lo que puede dificultar el aprendizaje para principiantes hispanohablantes. **HispanoLang** propone una sintaxis sencilla en español, enfocada en aprender conceptos esenciales de programación.

### ✨ Características principales:

- ✅ **Sintaxis 100% en español** - Sin barreras de idioma
- ⚡ **Intérprete completo** - Implementado en JavaScript/Node.js
- 🎓 **Minimalista** - Pensado para aprender lógica sin distracciones
- 📚 **Educativo** - Enfoque en conceptos fundamentales
- 🔧 **CLI Tool** - Interfaz de línea de comandos intuitiva
- 🧪 **Suite de tests** - 195+ tests para garantizar calidad
- 📦 **NPM Package** - Fácil instalación y distribución
- 🔄 **REPL Interactivo** - Modo interactivo para experimentar
- 📝 **TypeScript Support** - Definiciones de tipos incluidas
- 🌍 **Open Source** - Libre para usar, modificar y contribuir

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 20.0.0
- **npm** o **yarn**

### Instalación Global (Recomendada)

```bash
npm install -g hispano-lang
```

### Instalación Local

```bash
npm install hispano-lang
```

### Instalación desde Código Fuente

```bash
git clone https://github.com/nicvazquezdev/hispano-lang.git
cd hispano-lang
npm install
npm run build
```

## 💻 Uso

### CLI Tool

Una vez instalado globalmente, puedes usar HispanoLang desde cualquier lugar:

```bash
# Modo interactivo (REPL)
hispano

# Ejecutar archivo
hispano script.hl

# Ejecutar código directamente
hispano -e "mostrar 'Hola mundo'"

# Ver ayuda
hispano --help

# Ejecutar tests
hispano --test
```

### Como Módulo Node.js

```javascript
const { interpret, run, getVariables } = require("hispano-lang");

// Interpretar código
const result = interpret(`
  variable nombre = "Juan"
  mostrar "Hola " + nombre
`);

console.log(result.output); // ['Hola Juan']

// Ejecutar y obtener salidas
const outputs = run(`
  variable x = 10
  mostrar x * 2
`);

console.log(outputs); // ['20']
```

### TypeScript

```typescript
import { interpret, InterpretationResult } from "hispano-lang";

const result: InterpretationResult = interpret(`
  variable edad = 25
  si edad >= 18 {
    mostrar "Es mayor de edad"
  }
`);
```

## 📚 Sintaxis de HispanoLang

### 🎯 Ejemplo Rápido

```javascript
// Saludo personalizado
variable nombre = "María"
mostrar "¡Hola " + nombre + "!"

// Calculadora simple
variable a = 10
variable b = 5
variable suma = a + b
mostrar "La suma es: " + suma

// Condicional
si suma > 10 {
  mostrar "¡Es un número grande!"
} sino {
  mostrar "Es un número pequeño"
}
```

### Variables

```javascript
variable nombre = "Juan"
variable edad = 25
variable activo = verdadero
variable salario = 50000.50
```

### Entrada de datos

```javascript
// Entrada básica
leer nombre
mostrar "Hola " + nombre

// Entrada con mensaje
leer edad "¿Cuál es tu edad?"
mostrar "Tienes " + edad + " años"
```

### Condicionales

```javascript
si edad >= 18 {
  mostrar "Es mayor de edad"
} sino {
  mostrar "Es menor de edad"
}
```

### Bucles

```javascript
// Bucle mientras
variable i = 0
mientras i < 5 {
  mostrar i
  i = i + 1
}

// Bucle para
para variable j = 0; j < 3; j = j + 1 {
  mostrar j
}
```

### Funciones

```javascript
funcion saludar(nombre) {
  retornar "Hola " + nombre
}

mostrar saludar("Mundo")
```

### Arrays

```javascript
variable frutas = ["manzana", "banana", "naranja"]
mostrar frutas.longitud()  // 3
mostrar frutas.primero()   // manzana
mostrar frutas.ultimo()    // naranja

// Métodos de array
frutas.agregar("uva")      // push
frutas.remover()           // pop
frutas.contiene("banana")  // includes
```

### Objetos

```javascript
variable persona = {
  nombre: "Juan",
  edad: 30,
  ciudad: "Madrid"
}

mostrar persona.nombre     // Juan
persona.edad = 31         // Modificar propiedad
```

### Strings

```javascript
variable texto = "hola mundo"
mostrar texto.longitud()      // 10
mostrar texto.mayusculas()    // HOLA MUNDO
mostrar texto.minusculas()    // hola mundo

// Métodos adicionales
texto.dividir(" ")            // ["hola", "mundo"]
texto.reemplazar("o", "a")    // "hala munda"
texto.recortar()              // Elimina espacios al inicio y final
texto.incluye("mundo")        // verdadero
texto.empiezaCon("hola")      // verdadero
texto.terminaCon("mundo")     // verdadero
texto.caracter(0)             // "h"
texto.subcadena(0, 4)         // "hola"
texto.subcadena(5)            // "mundo"
texto.invertir()              // "odnum aloh"
```

### Interpolación de cadenas

Usa backticks (\`) para crear cadenas con expresiones embebidas usando `${expresion}`:

```javascript
variable nombre = "María"
variable edad = 25
mostrar `Hola ${nombre}, tienes ${edad} años`
// Resultado: Hola María, tienes 25 años
```

### Manejo de errores

```javascript
intentar {
  variable x = 10 / 0
} capturar (error) {
  mostrar "Error: " + error
}
```

### Valores especiales

```javascript
variable valorNulo = nulo
variable valorIndefinido = indefinido
```

## 🧪 Testing

El proyecto incluye una suite completa de tests con más de 170 casos:

```bash
npm test
```

## 🏗️ Arquitectura

```
src/
├── tokenizer.js    # Análisis léxico
├── parser.js       # Análisis sintáctico
├── evaluator.js    # Evaluación de expresiones
└── interpreter.js  # Orquestador principal

bin/
└── hispano.js      # CLI tool

test/
└── test.js         # Suite completa de tests (180+ casos)
```

## 🛠️ Desarrollo

### Configuración del entorno

```bash
# Clonar el repositorio
git clone https://github.com/nicvazquezdev/hispano-lang.git
cd hispano-lang

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Linting y formato
npm run lint
npm run format

# Build para producción
npm run build
```

### Scripts disponibles

- `npm start` - Ejecutar el intérprete
- `npm test` - Ejecutar tests
- `npm run dev` - Modo desarrollo con nodemon
- `npm run lint` - Verificar código con ESLint
- `npm run format` - Formatear código con Prettier
- `npm run build` - Construir para producción
- `npm run demo` - Ejecutar demo

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este proyecto está abierto a la comunidad.

### Cómo contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de contribución

- ✅ Sigue las convenciones de código existentes
- ✅ Añade tests para nuevas funcionalidades
- ✅ Actualiza la documentación si es necesario
- ✅ Asegúrate de que todos los tests pasen
- ✅ Usa `npm run lint` y `npm run format` antes de commitear

### Áreas donde puedes contribuir

- 🐛 **Bug fixes** - Reporta y arregla bugs
- ✨ **Nuevas funcionalidades** - Propón mejoras
- 📚 **Documentación** - Mejora ejemplos y guías
- 🧪 **Tests** - Añade casos de prueba
- 🌍 **Traducciones** - Ayuda con documentación en otros idiomas
- 🎨 **UI/UX** - Mejora la experiencia del CLI

## 🐛 Reportar bugs

Si encuentras un bug, por favor:

1. **Verifica** que no esté ya reportado en [Issues](https://github.com/nicvazquezdev/hispano-lang/issues)
2. **Crea** un nuevo issue con:
   - Descripción clara del problema
   - Código que reproduce el error
   - Versión de Node.js
   - Sistema operativo
   - Pasos para reproducir

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Nicolas Vazquez**

- 🌐 GitHub: [@nicvazquezdev](https://github.com/nicvazquezdev)
- 📧 Email: [nicorvazquezs@gmail.com](mailto:nicorvazquezs@gmail.com)

## 🙏 Agradecimientos

- 🌍 **Comunidad de desarrolladores hispanohablantes**
- 🧪 **Contribuidores y testers del proyecto**
- 📚 **Educadores que usan HispanoLang en sus clases**
- 🎓 **Estudiantes que aprenden programación con HispanoLang**

## 📊 Estadísticas

- 🧪 **195+ tests** cubriendo todas las funcionalidades
- 📦 **NPM package** listo para instalación global
- 🔧 **CLI tool** con modo interactivo
- 📝 **TypeScript support** con definiciones incluidas
- 🌍 **100% en español** para educación sin barreras

---

<div align="center">

⭐ **Si te gusta este proyecto, ¡dale una estrella!**

[![GitHub stars](https://img.shields.io/github/stars/nicvazquezdev/hispano-lang?style=social)](https://github.com/nicvazquezdev/hispano-lang)

**Hecho con ❤️ para la comunidad hispanohablante**

</div>
