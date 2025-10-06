# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
