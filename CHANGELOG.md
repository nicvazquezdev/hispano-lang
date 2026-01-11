# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 11-01-2026

### ✨ Programación Orientada a Objetos (POO)
- **Clases** con sintaxis `clase NombreClase { ... }`
- **Constructores** con `constructor(parametros) { ... }`
- **Métodos de instancia** definidos dentro de las clases
- **Palabra clave `este`** para acceder a propiedades y métodos de la instancia
- **Instanciación** con `nuevo NombreClase(argumentos)`
- **Herencia** con `clase Hijo extiende Padre { ... }`
- **Llamadas a super** con `super(argumentos)` para invocar el constructor padre
- **`tipo()` mejorado** para retornar el nombre de la clase en instancias

### ✨ Constantes
- **Declaración de constantes** con `constante NOMBRE = valor`
- **Protección contra reasignación** - error si se intenta modificar una constante
- **Requerimiento de inicialización** - las constantes deben inicializarse al declararse

### ✨ Funciones de Conversión de Tipos
- **`entero(valor)`** - Convierte a número entero
- **`decimal(valor)`** - Convierte a número decimal
- **`texto(valor)`** - Convierte a cadena de texto
- **`booleano(valor)`** - Convierte a valor booleano
- **`tipo(valor)`** - Retorna el tipo del valor como string

### ✨ Métodos Numéricos
- **`numero.esPar()`** - Verifica si el número es par
- **`numero.esImpar()`** - Verifica si el número es impar
- **`numero.esPositivo()`** - Verifica si el número es positivo
- **`numero.esNegativo()`** - Verifica si el número es negativo
- **`numero.aTexto()`** - Convierte el número a texto

### 🔧 Mejorado
- **313 tests** cubriendo todas las funcionalidades (antes 210+)
- **Mensajes de error** consistentes en español
- **Parser mejorado** para soportar nuevas estructuras de POO
- **Evaluator extendido** con soporte para clases e instancias

### 🐛 Corregido
- Tests actualizados para usar mensajes de error en español
- Corrección de conflicto con palabra reservada `nuevo` en tests
- Manejo correcto de propiedades y métodos en instancias de clases

### 📝 Documentación
- README actualizado con sección completa de POO
- Ejemplos de clases, herencia y métodos
- Documentación de constantes y funciones de conversión

---

## [1.1.7] - 06-10-2025

### 🌍 Internacionalización
- **Todos los mensajes de error** ahora están completamente en español
- **Consistencia total** del lenguaje educativo en español
- **Experiencia de usuario** 100% en español para estudiantes

### 🔧 Mejorado
- **Mensajes de error descriptivos** en español para mejor comprensión
- **Consistencia del idioma** en toda la experiencia de programación
- **Mejor experiencia educativa** para hispanohablantes

### 🐛 Corregido
- **117+ mensajes de error** traducidos al español
- **Mensajes de validación** de tipos y operadores en español
- **Errores de sintaxis** con descripciones claras en español
- **Mensajes de runtime** completamente localizados

### 📝 Detalles Técnicos
- **Evaluator.js**: 105+ mensajes traducidos
- **Parser.js**: 10+ mensajes traducidos
- **Tokenizer.js**: 2+ mensajes traducidos
- **Mensajes de CLI**: Ya estaban en español
- **Mensajes de test**: Mantenidos en inglés para desarrollo

### 🧪 Verificado
- ✅ División por cero: "División por cero"
- ✅ Operadores: "El operador X requiere dos números"
- ✅ Caracteres: "Carácter inesperado: ^ en la línea 1"
- ✅ Arrays: "Índice del arreglo fuera de rango"
- ✅ Asignaciones: "Solo se pueden asignar elementos de arreglos"

## [1.0.0] - 06-10-2025

### ✨ Añadido
- **Intérprete completo** de HispanoLang con sintaxis 100% en español
- **CLI tool** con modo interactivo (REPL) y ejecución de archivos
- **Suite de tests** con 170+ casos de prueba
- **Soporte para TypeScript** con definiciones de tipos incluidas
- **Funcionalidades completas**:
  - Variables y tipos de datos (números, strings, booleanos, arrays, objetos)
  - Operadores aritméticos, lógicos y de comparación
  - Estructuras de control (si, mientras, para)
  - Funciones con parámetros y retorno de valores
  - Arrays con métodos (longitud, primero, ultimo, agregar, remover, contiene, recorrer)
  - Strings con métodos (longitud, mayusculas, minusculas)
  - Objetos con acceso a propiedades
  - Manejo de errores (intentar/capturar)
  - Operadores de incremento/decremento (++, --)
  - Asignación compuesta (+=, -=, *=, /=, %=)
  - Funciones matemáticas integradas (raiz, potencia, seno, coseno, etc.)
  - Valores nulos e indefinidos
  - Comentarios de línea (//)
  - Entrada de datos (leer)

### 🔧 Mejorado
- **Arquitectura modular** con separación clara de responsabilidades
- **Manejo de errores** robusto con mensajes descriptivos
- **Performance optimizada** para interpretación rápida
- **Documentación completa** con ejemplos y guías

### 🐛 Corregido
- Manejo correcto de operadores lógicos (y, o)
- Precedencia de operadores matemáticos
- Scope de variables en funciones
- Manejo de arrays vacíos y objetos

### 📚 Documentación
- README completo con ejemplos y guías de uso
- Documentación de API con TypeScript
- Guías de contribución
- Ejemplos avanzados y casos de uso

### 🧪 Testing
- 170+ tests cubriendo todas las funcionalidades
- Tests de regresión para bugs conocidos
- Tests de performance para operaciones complejas
- Cobertura completa de casos edge

### 🚀 Distribución
- **NPM package** listo para instalación global
- **CLI tool** con comandos intuitivos
- **Módulo Node.js** para uso programático
- **TypeScript definitions** incluidas
