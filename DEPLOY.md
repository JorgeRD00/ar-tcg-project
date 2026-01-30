# Opciones de Despliegue Gratuitas

## 1. GitHub Pages (Recomendado)

### Pasos:
1. Sube tu proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona "Deploy from a branch"
4. Elige `main` y `/root`
5. Tu sitio estará en: `https://username.github.io/ar-tcg-project`

### Comandos Git:
```bash
git init
git add .
git commit -m "AR TCG App"
git branch -M main
git remote add origin https://github.com/tu-usuario/ar-tcg-project.git
git push -u origin main
```

## 2. Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta del proyecto
3. Obtienes una URL aleatoria: `https://random-name.netlify.app`

## 3. Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel` en tu carpeta
3. Obtienes URL: `https://your-project.vercel.app`

## 4. Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar proyecto
firebase init hosting

# Desplegar
firebase deploy
```

## 5. Surge.sh (Más rápido)

```bash
# Instalar
npm install -g surge

# Desplegar
surge

# Te da URL como: ar-tcg-project.surge.sh
```

## 6. Glitch

1. Ve a [glitch.com](https://glitch.com)
2. Crea nuevo proyecto "hello-express"
3. Reemplaza archivos con los tuyos
4. Obtienes URL instantánea

## ⚡ Recomendación: Surge.sh

Es el más rápido para probar:

```bash
npm install -g surge
cd c:/Users/jorge/Documents/GitHub/ar-tcg-project
surge
```

Te dará una URL pública en 30 segundos.

## 📱 Importante para Móvil

- **HTTPS es obligatorio** para acceder a la cámara
- Todas las opciones anteriores dan HTTPS automáticamente
- En iOS, necesitas https (no localhost)

## 🔧 Si usas GitHub Pages

Agrega este archivo para forzar HTTPS:

### .nojekyll
```
# Archivo vacío para desactivar Jekyll
```

Y asegúrate que todos los enlaces usen rutas relativas.
