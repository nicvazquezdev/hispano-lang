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
- 🧪 **Suite de tests** - 290+ tests para garantizar calidad
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

### Constantes

```javascript
constante PI = 3.14159
constante MAX_USUARIOS = 100
constante NOMBRE_APP = "MiApp"

// Las constantes no pueden ser reasignadas
PI = 3.14  // Error: No se puede reasignar la constante: PI
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

// Bucle hacer/mientras (ejecuta al menos una vez)
variable x = 0
hacer {
  mostrar x
  x = x + 1
} mientras x < 3

// Bucle para cada (for-each)
variable frutas = ["manzana", "banana", "naranja"]
para cada fruta en frutas {
  mostrar fruta
}
```

### Elegir/Caso (Switch)

```javascript
variable opcion = 2
elegir opcion {
  caso 1: mostrar "Opción uno"
  caso 2: mostrar "Opción dos"
  caso 3: mostrar "Opción tres"
  pordefecto: mostrar "Opción no válida"
}

// Con bloques de código
elegir opcion {
  caso 1: {
    mostrar "Seleccionaste uno"
    mostrar "Buena elección"
  }
  caso 2: mostrar "Seleccionaste dos"
  pordefecto: mostrar "Otra opción"
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

// Métodos básicos de array
frutas.agregar("uva")      // push
frutas.remover()           // pop
frutas.contiene("banana")  // includes

// Métodos de transformación
variable numeros = [1, 2, 3, 4, 5]

// Filtrar elementos
variable pares = numeros.filtrar(funcion(x) { retornar x % 2 == 0 })
// [2, 4]

// Transformar elementos
variable dobles = numeros.mapear(funcion(x) { retornar x * 2 })
// [2, 4, 6, 8, 10]

// Reducir a un valor
variable suma = numeros.reducir(funcion(acc, x) { retornar acc + x }, 0)
// 15

// Ordenar (números o strings)
variable ordenados = numeros.ordenar()           // [1, 2, 3, 4, 5]
variable palabras = ["banana", "manzana", "cereza"]
variable ordenadas = palabras.ordenar()          // [banana, cereza, manzana]

// Invertir orden
variable invertidos = numeros.invertir()         // [5, 4, 3, 2, 1]

// Buscar elemento
variable encontrado = numeros.buscar(funcion(x) { retornar x > 3 })
// 4

// Verificar condiciones
variable hayGrandes = numeros.algunos(funcion(x) { retornar x > 3 })
// verdadero
variable todosPares = numeros.todos(funcion(x) { retornar x % 2 == 0 })
// falso

// Unir en string
variable texto = numeros.unir(", ")              // "1, 2, 3, 4, 5"

// Cortar sublista
variable sublista = numeros.cortar(1, 3)         // [2, 3]

// Insertar en posición
numeros.insertar(2, "nuevo")                     // [1, 2, "nuevo", 3, 4, 5]
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

### Conversión de tipos

```javascript
// Convertir a entero
entero("42")           // 42
entero(3.7)            // 3
entero(verdadero)      // 1

// Convertir a decimal
decimal("3.14")        // 3.14
decimal(42)            // 42

// Convertir a texto
texto(123)             // "123"
texto(verdadero)       // "verdadero"
texto(nulo)            // "nulo"
texto([1, 2, 3])       // "[1, 2, 3]"

// Convertir a booleano
booleano(1)            // verdadero
booleano(0)            // falso
booleano("hola")       // verdadero
booleano("")           // falso

// Obtener tipo de un valor
tipo(42)               // "numero"
tipo("hola")           // "texto"
tipo(verdadero)        // "booleano"
tipo([1, 2])           // "arreglo"
tipo({ a: 1 })         // "objeto"
tipo(nulo)             // "nulo"
tipo(miFuncion)        // "funcion"
```

### Métodos numéricos

```javascript
variable num = 42

// Verificar paridad
num.esPar()            // verdadero
num.esImpar()          // falso

// Verificar signo
num.esPositivo()       // verdadero
num.esNegativo()       // falso

// Convertir a texto
num.aTexto()           // "42"

// También funciona con literales (usando paréntesis)
(7).esImpar()          // verdadero
(-5).esNegativo()      // verdadero
(3.14).aTexto()        // "3.14"
```

### Programación Orientada a Objetos

HispanoLang soporta clases con constructores, métodos y herencia.

```javascript
// Definición de clase básica
clase Persona {
  constructor(nombre, edad) {
    este.nombre = nombre
    este.edad = edad
  }

  saludar() {
    retornar "Hola, soy " + este.nombre
  }

  cumplir() {
    este.edad = este.edad + 1
  }
}

// Crear instancias
variable p = nuevo Persona("Juan", 25)
mostrar p.nombre           // Juan
mostrar p.saludar()        // Hola, soy Juan

// Modificar propiedades via métodos
p.cumplir()
mostrar p.edad             // 26

// Herencia con extiende
clase Estudiante extiende Persona {
  constructor(nombre, edad, carrera) {
    super(nombre, edad)    // Llamar constructor padre
    este.carrera = carrera
  }

  estudiar() {
    retornar este.nombre + " está estudiando " + este.carrera
  }
}

variable e = nuevo Estudiante("María", 20, "Ingeniería")
mostrar e.saludar()        // Hola, soy María (método heredado)
mostrar e.estudiar()       // María está estudiando Ingeniería
mostrar e.carrera          // Ingeniería

// Clase sin constructor
clase Contador {
  incrementar() {
    si este.valor == indefinido {
      este.valor = 0
    }
    este.valor = este.valor + 1
  }

  obtener() {
    retornar este.valor
  }
}

variable c = nuevo Contador()
c.incrementar()
c.incrementar()
mostrar c.obtener()        // 2

// tipo() retorna el nombre de la clase para instancias
mostrar tipo(p)            // Persona
mostrar tipo(e)            // Estudiante
```

## 🧪 Testing

El proyecto incluye una suite completa de tests con más de 290 casos:

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
└── test.js         # Suite completa de tests (290+ casos)
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

- 🧪 **290+ tests** cubriendo todas las funcionalidades
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
