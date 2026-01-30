# AR TCG Publicidad

Aplicación de Realidad Aumentada para publicidad de Trading Card Games (TCGs) usando JavaScript y tecnologías gratuitas.

## Características

- ✅ Reconocimiento de cartas con Computer Vision
- ✅ Detección de orientación (vertical/horizontal)
- ✅ Efectos AR dinámicos según orientación
- ✅ Grabación de video
- ✅ Compatible con dispositivos móviles
- ✅ 100% tecnología gratuita

## Tecnologías Utilizadas

- **AR.js** - Realidad aumentada para web
- **A-Frame** - Framework para 3D/AR
- **TensorFlow.js + MobileNet** - Reconocimiento de imágenes
- **MediaRecorder API** - Grabación de video
- **DeviceOrientation API** - Detección de orientación

## Cómo Usar

1. **Abrir en un servidor web** (debido a políticas de CORS):
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # O usando Node.js
   npx serve .
   ```

2. **Acceder desde un móvil**:
   - Abre `http://localhost:8000` en tu móvil
   - Permite acceso a la cámara y sensores
   - Imprime el marcador Hiro o ábrelo en otra pantalla

3. **Funcionalidades**:
   - Apunta la cámara al marcador para ver efectos AR
   - Gira el móvil para cambiar entre modo vertical/horizontal
   - Usa "Detectar Carta" para reconocimiento con IA
   - Usa "Grabar Video" para capturar la experiencia

## Marcador AR

La aplicación usa el marcador "Hiro" por defecto. Puedes imprimirlo desde:
https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png

## Estructura del Proyecto

```
ar-tcg-project/
├── index.html          # Página principal
├── app.js             # Lógica de la aplicación
├── README.md          # Documentación
└── assets/            # Recursos (imágenes, modelos 3D, etc.)
```

## Personalización

### Cambiar Efectos AR
Edita las funciones `triggerAREffects()` y `updateAREffects()` en `app.js`.

### Agregar Nuevos Marcadores
Modifica el HTML para agregar más marcadores:
```html
<a-marker type="pattern" url="path/to/pattern.patt">
    <!-- Tus efectos AR aquí -->
</a-marker>
```

### Mejorar Reconocimiento
Reemplaza MobileNet con modelos más específicos entrenados con tus propias cartas.

## Notas Técnicas

- **Compatibilidad**: Funciona mejor en Chrome/Android y Safari/iOS
- **Rendimiento**: Optimizado para dispositivos móviles modernos
- **Offline**: La aplicación funciona sin conexión una vez cargada

## Problemas Comunes

**"La cámara no se inicia"**: Asegúrate de usar HTTPS o localhost
**"No detecta orientación"**: iOS requiere permiso manual para sensores
**"Marcador no se reconoce"**: Mejora la iluminación y contraste del marcador

## Licencia

MIT - Usa y modifica libremente
