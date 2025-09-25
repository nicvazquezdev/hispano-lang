# Guía de Contribución a HispanoLang

¡Gracias por tu interés en contribuir a HispanoLang! 🎉

## 🚀 Cómo contribuir

### 1. Fork y Clone

1. Haz fork del repositorio en GitHub
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/nicvazquezdev/hispano-lang
   cd hispano-lang
   ```

### 2. Configuración del entorno

```bash
# Instala las dependencias
npm install

# Ejecuta los tests para verificar que todo funciona
npm test
```

### 3. Crear una rama

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-bug
```

## 📝 Tipos de contribuciones

### 🐛 Reportar bugs

1. Verifica que el bug no esté ya reportado en [Issues](https://github.com/nicvazquezdev/hispano-lang/issues)
2. Crea un nuevo issue con:
   - **Título claro** que describa el problema
   - **Descripción detallada** del comportamiento esperado vs actual
   - **Código de ejemplo** que reproduzca el error
   - **Información del sistema**: Node.js version, OS, etc.

### ✨ Proponer nuevas funcionalidades

1. Crea un issue con la etiqueta `enhancement`
2. Describe claramente:
   - **Qué funcionalidad** quieres agregar
   - **Por qué** es útil para HispanoLang
   - **Ejemplos de uso** de la nueva funcionalidad
3. Espera feedback antes de implementar

### 🔧 Implementar cambios

#### Para nuevas funcionalidades:

1. **Actualiza el tokenizer** (`src/tokenizer.js`) si necesitas nuevos tokens
2. **Actualiza el parser** (`src/parser.js`) para la sintaxis
3. **Implementa la evaluación** (`src/evaluator.js`)
4. **Añade tests** en `test/test.js`
5. **Actualiza la documentación** si es necesario

#### Para fixes de bugs:

1. **Identifica la causa** del problema
2. **Implementa la solución** mínima necesaria
3. **Añade tests** que verifiquen el fix
4. **Verifica** que no rompas funcionalidad existente

## 🧪 Testing

### Ejecutar tests

```bash
# Todos los tests
npm test

# Tests específicos (modifica test.js)
node test/test.js
```

### Escribir tests

Los tests siguen este patrón:

```javascript
test('Descripción del test', () => {
  const code = `
    // Código HispanoLang a probar
    variable x = 5
    mostrar x
  `;
  const result = interpret(code);
  assertTrue(result.success, 'El código debe ejecutarse correctamente');
  assertEquals(result.output, ['5'], 'La salida debe ser correcta');
});
```

### Criterios para tests

- ✅ **Cobertura completa**: Cada funcionalidad debe tener tests
- ✅ **Casos edge**: Probar límites y casos especiales
- ✅ **Manejo de errores**: Verificar mensajes de error apropiados
- ✅ **Nombres descriptivos**: Que expliquen qué se está probando

## 📚 Convenciones de código

### JavaScript

- **Indentación**: 2 espacios
- **Nombres**: camelCase para variables y funciones
- **Comentarios**: JSDoc para funciones públicas
- **Consistencia**: Sigue el estilo del código existente

### HispanoLang

- **Palabras clave**: En español (variable, mostrar, si, etc.)
- **Consistencia**: Sigue la sintaxis establecida
- **Simplicidad**: Mantén la sintaxis simple y clara

## 📖 Documentación

### Actualizar README

Si agregas nuevas funcionalidades:

1. **Actualiza la sección de sintaxis** con ejemplos
2. **Añade ejemplos** en la sección correspondiente
3. **Actualiza la lista de características** si es necesario

### Comentarios en código

```javascript
/**
 * Evalúa una expresión de array
 * @param {Object} expression - AST de la expresión
 * @returns {Array} El array evaluado
 */
function evaluateArray(expression) {
  // Implementación...
}
```

## 🔄 Proceso de Pull Request

### Antes de crear el PR

1. **Ejecuta todos los tests**: `npm test`
2. **Verifica que no hay errores de linting**
3. **Actualiza la documentación** si es necesario
4. **Commit con mensajes claros**

### Mensajes de commit

```
feat: agregar soporte para arrays
fix: corregir error en evaluación de strings
docs: actualizar README con nuevos ejemplos
test: añadir tests para manejo de errores
```

### Crear el Pull Request

1. **Título claro** que describa el cambio
2. **Descripción detallada** de qué hace el PR
3. **Referencia issues** relacionados (#123)
4. **Screenshots** si hay cambios visuales
5. **Checklist** de verificación

### Template de PR

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Tipo de cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Tests

- [ ] Tests añadidos/actualizados
- [ ] Todos los tests pasan
- [ ] Cobertura mantenida

## Checklist

- [ ] Código sigue las convenciones del proyecto
- [ ] Documentación actualizada
- [ ] No hay conflictos de merge
```

## 🏷️ Etiquetas de Issues

- `bug`: Algo no funciona como debería
- `enhancement`: Nueva funcionalidad o mejora
- `documentation`: Mejoras en documentación
- `good first issue`: Bueno para nuevos contribuidores
- `help wanted`: Se necesita ayuda extra
- `question`: Pregunta o discusión

## 💬 Comunicación

- **Issues**: Para bugs y propuestas
- **Discussions**: Para preguntas generales
- **Pull Requests**: Para código y documentación

## 🎯 Roadmap

Si quieres contribuir con funcionalidades grandes, consulta el roadmap:

- [ ] Playground web
- [ ] Más funciones matemáticas
- [ ] Soporte para módulos
- [ ] IDE con syntax highlighting

## ❓ Preguntas frecuentes

**¿Puedo contribuir sin experiencia previa?**
¡Absolutamente! Busca issues con la etiqueta `good first issue`.

**¿Qué nivel de JavaScript necesito?**
Básico a intermedio. El código es educativo y bien documentado.

**¿Puedo proponer cambios grandes?**
Sí, pero discute primero en un issue para obtener feedback.

## 🙏 Reconocimientos

¡Gracias por contribuir a HispanoLang! Tu ayuda hace que el proyecto sea mejor para todos los desarrolladores hispanohablantes.

---

¿Tienes dudas? ¡Abre un issue y te ayudamos! 🚀
