# Assets - Recursos del Proyecto

## Estructura recomendada:

```
assets/
├── markers/           # Marcadores AR
│   ├── hiro.png      # Marcador Hiro (por defecto)
│   └── custom/       # Marcadores personalizados
├── cards/            # Imágenes de cartas para entrenamiento
│   ├── card1.jpg
│   ├── card2.jpg
│   └── ...
├── models/           # Modelos 3D (opcional)
│   └── .glb/.gltf
├── textures/         # Texturas para efectos AR
│   └── .jpg/.png
└── icons/            # Iconos de la UI
    └── .svg/.png
```

## Imágenes Locales vs Enlaces

### ✅ Ventajas de imágenes locales:
- Carga más rápida
- Funciona offline
- Sin dependencias externas
- Control total sobre los recursos

### ✅ Ventajas de enlaces externos:
- Menor tamaño del proyecto
- Actualizaciones sin redesplegar
- Ahorro de almacenamiento

## Recomendación para TCGs:

Usa imágenes locales para:
- Marcadores AR
- Texturas de efectos
- Iconos de la interfaz

Puedes usar enlaces para:
- Imágenes de referencia de cartas (si son muchas)
- Modelos 3D pesados
