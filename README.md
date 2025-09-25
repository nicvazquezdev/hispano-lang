# HispanoLang 🇪🇸

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-182%20passed-brightgreen)](https://github.com/nicvazquezdev/hispano-lang)

**HispanoLang** es un lenguaje de programación educativo diseñado en español para enseñar los fundamentos de la programación sin barreras de idioma.

## 🎯 ¿Por qué HispanoLang?

La mayoría de los lenguajes de programación utilizan palabras clave en inglés, lo que puede dificultar el aprendizaje para principiantes hispanohablantes. HispanoLang propone una sintaxis sencilla en español, enfocada en aprender conceptos esenciales.

### Características principales:

- ✅ **Sintaxis 100% en español** - Sin barreras de idioma
- ✅ **Intérprete completo** - Implementado en JavaScript/Node.js
- ✅ **Minimalista** - Pensado para aprender lógica sin distracciones
- ✅ **Educativo** - Enfoque en conceptos fundamentales
- ✅ **Open Source** - Libre para usar, modificar y contribuir

## 🚀 Instalación y uso

### Prerrequisitos

- Node.js >= 20.0.0
- npm o yarn

### Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/nicvazquezdev/hispano-lang.git
   cd hispano-lang
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Ejecuta el intérprete:**

   ```bash
   npm start
   # o
   node main.js
   ```

4. **Ejecuta los tests:**
   ```bash
   npm test
   ```

## 📚 Sintaxis de HispanoLang

### Variables

```javascript
variable nombre = "Juan"
variable edad = 25
variable activo = verdadero
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
mostrar texto.longitud()    // 10
mostrar texto.mayusculas()  // HOLA MUNDO
mostrar texto.minusculas()  // hola mundo
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

El proyecto incluye una suite completa de tests:

```bash
npm test
```

## 🏗️ Arquitectura

```
src/
├── tokenizer.js    # Análisis léxico
├── parser.js       # Análisis sintáctico
├── evaluator.js    # Evaluación de expresiones
└── interpreter.js   # Orquestador principal

test/
└── test.js         # Suite completa de tests
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de contribución

- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que todos los tests pasen

## 🐛 Reportar bugs

Si encuentras un bug, por favor:

1. Verifica que no esté ya reportado en [Issues](https://github.com/nicvazquezdev/hispano-lang/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Código que reproduce el error
   - Versión de Node.js
   - Sistema operativo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Nicolas Vazquez**

- GitHub: [@nicvazquezdev](https://github.com/nicvazquezdev)
- Email: [nicorvazquezs@gmail.com]

## 🙏 Agradecimientos

- Comunidad de desarrolladores hispanohablantes
- Contribuidores y testers del proyecto

---

⭐ **Si te gusta este proyecto, ¡dale una estrella en GitHub!**
