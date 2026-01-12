<p align="center">
  <img src="https://raw.githubusercontent.com/nicvazquezdev/hispano-lang-website/main/public/hl-main-logo.png" alt="HispanoLang" width="180"/>
</p>

<p align="center">
  <strong>El lenguaje de programación en español</strong>
</p>

<p align="center">
  Un lenguaje de programación moderno, expresivo y completamente en español.<br/>
  Diseñado para eliminar las barreras del idioma en la educación tecnológica.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hispano-lang"><img src="https://img.shields.io/npm/v/hispano-lang?style=for-the-badge&logo=npm&logoColor=white&color=cb3837" alt="npm version"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/node/v/hispano-lang?style=for-the-badge&logo=node.js&logoColor=white&color=339933" alt="Node.js Version"/></a>
  <a href="https://www.npmjs.com/package/hispano-lang"><img src="https://img.shields.io/npm/dm/hispano-lang?style=for-the-badge&color=blue" alt="Downloads"/></a>
</p>

<p align="center">
  <a href="#inicio-rápido">Inicio Rápido</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#referencia-del-lenguaje">Documentación</a> •
  <a href="#ejemplos">Ejemplos</a> •
  <a href="#contribuir">Contribuir</a>
</p>

---

## Tabla de Contenidos

- [Acerca de HispanoLang](#acerca-de-hispanolang)
- [Inicio Rápido](#inicio-rápido)
- [Instalación](#instalación)
- [Referencia del Lenguaje](#referencia-del-lenguaje)
  - [Variables y Constantes](#variables-y-constantes)
  - [Tipos de Datos](#tipos-de-datos)
  - [Operadores](#operadores)
  - [Estructuras de Control](#estructuras-de-control)
  - [Funciones](#funciones)
  - [Programación Orientada a Objetos](#programación-orientada-a-objetos)
  - [Colecciones](#colecciones)
  - [Manejo de Errores](#manejo-de-errores)
- [Ejemplos](#ejemplos)
- [API de Node.js](#api-de-nodejs)
- [Arquitectura](#arquitectura)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Acerca de HispanoLang

HispanoLang es un lenguaje de programación interpretado con sintaxis completamente en español. Fue diseñado con un objetivo claro: **democratizar el acceso a la programación** para los más de 500 millones de hispanohablantes en el mundo.

### ¿Por qué HispanoLang?

La mayoría de los lenguajes de programación utilizan palabras clave en inglés, creando una barrera adicional para quienes están aprendiendo a programar. HispanoLang elimina esta barrera, permitiendo que los estudiantes se concentren en los **conceptos fundamentales** de la programación sin tener que lidiar simultáneamente con un idioma extranjero.

### Características

| Característica                 | Descripción                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| **Sintaxis en Español**        | Palabras clave intuitivas como `variable`, `funcion`, `si`, `mientras` |
| **Tipado Dinámico**            | Sistema de tipos flexible con conversiones automáticas                 |
| **POO Completa**               | Clases, herencia, constructores y métodos                              |
| **Funciones de Primera Clase** | Funciones como valores, closures y callbacks                           |
| **Colecciones Ricas**          | Arrays y objetos con métodos funcionales integrados                    |
| **REPL Interactivo**           | Experimenta con código en tiempo real                                  |
| **Integración Node.js**        | Usa HispanoLang como módulo en proyectos JavaScript                    |
| **TypeScript Ready**           | Definiciones de tipos incluidas                                        |

---

## Inicio Rápido

```bash
# Instalar globalmente
npm install -g hispano-lang

# Iniciar el REPL interactivo
hispano

# O ejecutar un archivo
hispano mi_programa.hl
```

Tu primer programa en HispanoLang:

```
variable mensaje = "¡Hola, mundo!"
mostrar mensaje
```

---

## Instalación

### Requisitos

- Node.js 20.0.0 o superior
- npm o yarn

### Instalación Global (Recomendada)

```bash
npm install -g hispano-lang
```

### Instalación como Dependencia

```bash
npm install hispano-lang
```

### Desde el Código Fuente

```bash
git clone https://github.com/nicvazquezdev/hispano-lang.git
cd hispano-lang
npm install
npm run build
npm link
```

### Verificar Instalación

```bash
hispano --version
```

---

## Referencia del Lenguaje

### Variables y Constantes

#### Variables

Las variables se declaran con la palabra clave `variable` y pueden ser reasignadas:

```
variable nombre = "Ana"
variable edad = 25
variable activo = verdadero

edad = 26  // Reasignación permitida
```

#### Constantes

Las constantes se declaran con `constante` y no pueden ser reasignadas:

```
constante PI = 3.14159
constante MAX_INTENTOS = 3
constante VERSION = "2.0.0"

PI = 3.14  // Error: No se puede reasignar la constante
```

---

### Tipos de Datos

| Tipo       | Ejemplo              | Descripción                    |
| ---------- | -------------------- | ------------------------------ |
| Número     | `42`, `3.14`, `-10`  | Enteros y decimales            |
| Texto      | `"Hola"`, `'Mundo'`  | Cadenas de caracteres          |
| Booleano   | `verdadero`, `falso` | Valores lógicos                |
| Arreglo    | `[1, 2, 3]`          | Colección ordenada             |
| Objeto     | `{ clave: valor }`   | Colección de pares clave-valor |
| Nulo       | `nulo`               | Ausencia intencional de valor  |
| Indefinido | `indefinido`         | Variable sin valor asignado    |
| Función    | `funcion() {}`       | Bloque de código reutilizable  |
| Clase      | `clase {}`           | Plantilla para crear objetos   |

#### Conversión de Tipos

```
entero("42")        // 42
entero(3.7)         // 3

decimal("3.14")     // 3.14

texto(123)          // "123"
texto(verdadero)    // "verdadero"

booleano(1)         // verdadero
booleano("")        // falso

tipo(42)            // "numero"
tipo("hola")        // "texto"
tipo([1, 2])        // "arreglo"
```

---

### Operadores

#### Aritméticos

| Operador | Descripción    | Ejemplo        |
| -------- | -------------- | -------------- |
| `+`      | Suma           | `5 + 3` → `8`  |
| `-`      | Resta          | `5 - 3` → `2`  |
| `*`      | Multiplicación | `5 * 3` → `15` |
| `/`      | División       | `6 / 2` → `3`  |
| `%`      | Módulo         | `7 % 3` → `1`  |

#### Comparación

| Operador | Descripción   | Ejemplo                |
| -------- | ------------- | ---------------------- |
| `==`     | Igual a       | `5 == 5` → `verdadero` |
| `!=`     | Diferente de  | `5 != 3` → `verdadero` |
| `<`      | Menor que     | `3 < 5` → `verdadero`  |
| `>`      | Mayor que     | `5 > 3` → `verdadero`  |
| `<=`     | Menor o igual | `3 <= 3` → `verdadero` |
| `>=`     | Mayor o igual | `5 >= 5` → `verdadero` |

#### Lógicos

| Operador | Descripción | Ejemplo                           |
| -------- | ----------- | --------------------------------- |
| `y`      | AND lógico  | `verdadero y falso` → `falso`     |
| `o`      | OR lógico   | `verdadero o falso` → `verdadero` |
| `!`      | NOT lógico  | `!verdadero` → `falso`            |

#### Asignación Compuesta

```
variable x = 10
x += 5   // x = 15
x -= 3   // x = 12
x *= 2   // x = 24
x /= 4   // x = 6
x %= 4   // x = 2
```

#### Incremento y Decremento

| Operador | Tipo     | Descripción                         | Ejemplo                       |
| -------- | -------- | ----------------------------------- | ----------------------------- |
| `x++`    | Postfijo | Retorna valor original, luego suma  | `x = 5; mostrar x++` → `5`    |
| `x--`    | Postfijo | Retorna valor original, luego resta | `x = 5; mostrar x--` → `5`    |
| `++x`    | Prefijo  | Suma primero, luego retorna         | `x = 5; mostrar ++x` → `6`    |
| `--x`    | Prefijo  | Resta primero, luego retorna        | `x = 5; mostrar --x` → `4`    |

```
variable contador = 5

// Postfijo: retorna el valor ANTES del cambio
mostrar contador++    // Imprime 5, contador ahora es 6
mostrar contador      // Imprime 6

// Prefijo: retorna el valor DESPUÉS del cambio
mostrar ++contador    // Imprime 7, contador ahora es 7
mostrar contador      // Imprime 7
```

Funcionan también con arrays y objetos:

```
variable nums = [1, 2, 3]
mostrar ++nums[0]     // Imprime 2, nums[0] ahora es 2

variable obj = { valor: 10 }
mostrar obj.valor++   // Imprime 10, obj.valor ahora es 11
```

---

### Estructuras de Control

#### Condicional Si/Sino

```
si edad >= 18 {
    mostrar "Mayor de edad"
} sino {
    mostrar "Menor de edad"
}
```

#### Elegir/Caso (Switch)

```
elegir opcion {
    caso 1: mostrar "Opción uno"
    caso 2: mostrar "Opción dos"
    caso 3: {
        mostrar "Opción tres"
        mostrar "Con múltiples líneas"
    }
    pordefecto: mostrar "Opción no válida"
}
```

#### Bucle Mientras

```
variable i = 0
mientras i < 5 {
    mostrar i
    i = i + 1
}
```

#### Bucle Para

```
para (variable i = 0; i < 5; i = i + 1) {
    mostrar i
}
```

#### Bucle Hacer/Mientras

```
variable x = 0
hacer {
    mostrar x
    x = x + 1
} mientras x < 3
```

#### Bucle Para Cada

```
variable frutas = ["manzana", "banana", "naranja"]
para cada fruta en frutas {
    mostrar fruta
}
```

#### Control de Flujo

```
mientras verdadero {
    si condicion {
        romper      // Sale del bucle
    }
    si otraCondicion {
        continuar   // Salta a la siguiente iteración
    }
}
```

---

### Funciones

#### Declaración y Llamada

```
funcion saludar(nombre) {
    retornar "Hola, " + nombre
}

mostrar saludar("María")  // "Hola, María"
```

#### Funciones Anónimas

```
variable duplicar = funcion(x) {
    retornar x * 2
}

mostrar duplicar(5)  // 10
```

#### Funciones Flecha

Sintaxis concisa para funciones anónimas:

```
// Un parámetro (sin paréntesis)
variable doble = x => x * 2

// Múltiples parámetros
variable suma = (a, b) => a + b

// Sin parámetros
variable saludar = () => "Hola mundo"

// Con bloque de código
variable factorial = n => {
    si (n <= 1) { retornar 1 }
    retornar n * factorial(n - 1)
}

mostrar doble(5)       // 10
mostrar suma(3, 4)     // 7
mostrar factorial(5)   // 120
```

Funciones flecha son ideales para callbacks:

```
variable numeros = [1, 2, 3, 4, 5]

numeros.mapear(x => x * 2)           // [2, 4, 6, 8, 10]
numeros.filtrar(x => x > 2)          // [3, 4, 5]
numeros.reducir((a, b) => a + b, 0)  // 15
```

#### Funciones como Parámetros

```
funcion aplicar(valor, operacion) {
    retornar operacion(valor)
}

variable resultado = aplicar(5, funcion(x) { retornar x * x })
mostrar resultado  // 25
```

#### Funciones Matemáticas Integradas

```
raiz(16)           // 4
potencia(2, 8)     // 256
absoluto(-5)       // 5
redondear(3.7)     // 4
piso(3.7)          // 3
techo(3.2)         // 4
seno(0)            // 0
coseno(0)          // 1
tangente(0)        // 0
aleatorio()        // Número entre 0 y 1
```

---

### Programación Orientada a Objetos

#### Definición de Clases

```
clase Persona {
    constructor(nombre, edad) {
        este.nombre = nombre
        este.edad = edad
    }

    saludar() {
        retornar "Hola, soy " + este.nombre
    }

    cumplirAnios() {
        este.edad = este.edad + 1
    }
}
```

#### Instanciación

```
variable persona = nuevo Persona("Carlos", 30)
mostrar persona.nombre      // "Carlos"
mostrar persona.saludar()   // "Hola, soy Carlos"

persona.cumplirAnios()
mostrar persona.edad        // 31
```

#### Herencia

```
clase Empleado extiende Persona {
    constructor(nombre, edad, cargo) {
        super(nombre, edad)
        este.cargo = cargo
    }

    presentarse() {
        retornar este.saludar() + " y trabajo como " + este.cargo
    }
}

variable emp = nuevo Empleado("Ana", 28, "Ingeniera")
mostrar emp.presentarse()  // "Hola, soy Ana y trabajo como Ingeniera"
```

#### Verificación de Tipo

```
variable p = nuevo Persona("Luis", 25)
mostrar tipo(p)  // "Persona"
```

---

### Colecciones

#### Arreglos

```
variable numeros = [1, 2, 3, 4, 5]

// Acceso y modificación
mostrar numeros[0]     // 1
numeros[0] = 10

// Propiedades y métodos básicos
numeros.longitud()     // 5
numeros.primero()      // 10
numeros.ultimo()       // 5
numeros.agregar(6)     // Añade al final
numeros.remover()      // Remueve del final
numeros.contiene(3)    // verdadero
```

#### Métodos Funcionales

```
variable nums = [1, 2, 3, 4, 5]

// Transformación
nums.mapear(funcion(x) { retornar x * 2 })
// [2, 4, 6, 8, 10]

// Filtrado
nums.filtrar(funcion(x) { retornar x > 2 })
// [3, 4, 5]

// Reducción
nums.reducir(funcion(acc, x) { retornar acc + x }, 0)
// 15

// Búsqueda
nums.buscar(funcion(x) { retornar x > 3 })
// 4

// Verificación
nums.algunos(funcion(x) { retornar x > 4 })  // verdadero
nums.todos(funcion(x) { retornar x > 0 })    // verdadero

// Ordenamiento
nums.ordenar()      // [1, 2, 3, 4, 5]
nums.invertir()     // [5, 4, 3, 2, 1]

// Manipulación
nums.cortar(1, 3)         // [2, 3]
nums.insertar(2, 99)      // Inserta 99 en posición 2
nums.unir(", ")           // "1, 2, 3, 4, 5"
```

#### Iteración

```
variable colores = ["rojo", "verde", "azul"]
colores.recorrer(funcion() {
    mostrar "Color: " + elemento + " en índice " + indice
})
```

#### Objetos

```
variable persona = {
    nombre: "Elena",
    edad: 32,
    ciudad: "Madrid"
}

mostrar persona.nombre     // "Elena"
persona.edad = 33          // Modificar
persona.profesion = "Dev"  // Añadir propiedad
```

#### Cadenas de Texto

```
variable texto = "Hola Mundo"

// Propiedades
texto.longitud()          // 10

// Transformación
texto.mayusculas()        // "HOLA MUNDO"
texto.minusculas()        // "hola mundo"
texto.recortar()          // Elimina espacios extremos
texto.invertir()          // "odnuM aloH"

// Búsqueda
texto.incluye("Mundo")    // verdadero
texto.empiezaCon("Hola")  // verdadero
texto.terminaCon("Mundo") // verdadero

// Extracción
texto.caracter(0)         // "H"
texto.subcadena(0, 4)     // "Hola"

// Manipulación
texto.dividir(" ")        // ["Hola", "Mundo"]
texto.reemplazar("Mundo", "Amigo")  // "Hola Amigo"
```

#### Interpolación de Cadenas

```
variable nombre = "María"
variable edad = 25

mostrar `Hola ${nombre}, tienes ${edad} años`
// "Hola María, tienes 25 años"

mostrar `El doble de tu edad es ${edad * 2}`
// "El doble de tu edad es 50"
```

#### Métodos Numéricos

```
variable n = 42

n.esPar()        // verdadero
n.esImpar()      // falso
n.esPositivo()   // verdadero
n.esNegativo()   // falso
n.aTexto()       // "42"
```

---

### Manejo de Errores

```
intentar {
    variable resultado = operacionRiesgosa()
    mostrar resultado
} capturar (error) {
    mostrar "Ocurrió un error: " + error
}
```

---

## Ejemplos

### Calculadora Simple

```
funcion calculadora(a, b, operacion) {
    elegir operacion {
        caso "+": retornar a + b
        caso "-": retornar a - b
        caso "*": retornar a * b
        caso "/": {
            si b == 0 {
                retornar "Error: División por cero"
            }
            retornar a / b
        }
        pordefecto: retornar "Operación no válida"
    }
}

mostrar calculadora(10, 5, "+")  // 15
mostrar calculadora(10, 5, "*")  // 50
```

### Fibonacci

```
funcion fibonacci(n) {
    si n <= 1 {
        retornar n
    }
    retornar fibonacci(n - 1) + fibonacci(n - 2)
}

para (variable i = 0; i < 10; i = i + 1) {
    mostrar fibonacci(i)
}
```

### Sistema de Gestión

```
clase Producto {
    constructor(nombre, precio) {
        este.nombre = nombre
        este.precio = precio
    }
}

clase Carrito {
    constructor() {
        este.productos = []
    }

    agregar(producto) {
        este.productos.agregar(producto)
    }

    total() {
        retornar este.productos.reducir(
            funcion(acc, p) { retornar acc + p.precio },
            0
        )
    }

    mostrarResumen() {
        mostrar "=== Carrito de Compras ==="
        para cada producto en este.productos {
            mostrar `${producto.nombre}: $${producto.precio}`
        }
        mostrar `Total: $${este.total()}`
    }
}

variable carrito = nuevo Carrito()
carrito.agregar(nuevo Producto("Laptop", 999))
carrito.agregar(nuevo Producto("Mouse", 29))
carrito.agregar(nuevo Producto("Teclado", 79))
carrito.mostrarResumen()
```

---

## API de Node.js

### Uso como Módulo

```javascript
const { interpret, run } = require("hispano-lang");

// Interpretar código y obtener resultado completo
const result = interpret(`
    variable x = 10
    mostrar x * 2
`);

console.log(result.success); // true
console.log(result.output); // ['20']
console.log(result.error); // null

// Ejecutar y obtener solo la salida
const output = run(`mostrar "Hola desde Node.js"`);
console.log(output); // ['Hola desde Node.js']
```

### TypeScript

```typescript
import { interpret, InterpretationResult } from "hispano-lang";

const result: InterpretationResult = interpret(`
    variable mensaje = "TypeScript + HispanoLang"
    mostrar mensaje
`);
```

---

## Arquitectura

HispanoLang utiliza una arquitectura de intérprete clásica con tres fases:

```
┌─────────────┐     ┌────────────┐     ┌─────────────┐
│  Tokenizer  │ ──▶ │   Parser   │ ──▶ │  Evaluator  │
│  (Léxico)   │     │ (Sintaxis) │     │ (Ejecución) │
└─────────────┘     └────────────┘     └─────────────┘
      │                   │                   │
      ▼                   ▼                   ▼
   Tokens              AST               Resultado
```

### Estructura del Proyecto

```
hispano-lang/
├── src/
│   ├── tokenizer.js    # Análisis léxico
│   ├── parser.js       # Análisis sintáctico → AST
│   ├── evaluator.js    # Evaluación del AST
│   └── interpreter.js  # Orquestador principal
├── bin/
│   └── hispano.js      # CLI
├── test/
│   └── test.js         # Suite de tests (329+)
└── dist/               # Build de producción
```

---

## Contribuir

Las contribuciones son bienvenidas. Por favor, lee las siguientes guías antes de contribuir.

### Configuración del Entorno

```bash
git clone https://github.com/nicvazquezdev/hispano-lang.git
cd hispano-lang
npm install
npm test
```

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código

- Ejecutar `npm run lint` antes de commit
- Ejecutar `npm run format` para formatear código
- Añadir tests para nuevas funcionalidades
- Mantener cobertura de tests existente

### Reportar Bugs

Abre un [issue](https://github.com/nicvazquezdev/hispano-lang/issues) incluyendo:

- Descripción del problema
- Código para reproducir
- Comportamiento esperado vs actual
- Versión de Node.js y sistema operativo

---

## Licencia

Distribuido bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más información.

---

## Autor

**Nicolas Vazquez**

- GitHub: [@nicvazquezdev](https://github.com/nicvazquezdev)
- Email: nicorvazquezs@gmail.com

---

<p align="center">
  <sub>Hecho con dedicación para la comunidad hispanohablante</sub>
</p>

<p align="center">
  <a href="https://github.com/nicvazquezdev/hispano-lang">
    <img src="https://img.shields.io/github/stars/nicvazquezdev/hispano-lang?style=social" alt="GitHub Stars"/>
  </a>
</p>
