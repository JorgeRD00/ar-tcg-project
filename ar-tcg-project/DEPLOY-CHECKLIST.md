# Checklist de Despliegue - AR TCG Project

## ✅ Antes de desplegar:

### 1. Archivos necesarios:
- [x] `index.html` - Página principal
- [x] `app.js` - Lógica principal  
- [x] `assets/api/tcg-api.js` - API optimizada
- [x] `assets/effects/pink-aura.css` - Efectos visuales
- [x] `assets/cards/cards-data.js` - Datos de cartas

### 2. Funcionalidades probadas:
- [ ] Test API: Abrir `test-api.html`
- [ ] Performance: Abrir `assets/api/performance-test.html`
- [ ] AR: Abrir `index.html` con cámara
- [ ] Aura rosa: Verificar efectos visuales

### 3. Móvil:
- [ ] HTTPS requerido (todas las opciones lo dan)
- [ ] Permisos de cámara
- [ ] Marcador Hiro listo

## 🚀 Comandos de despliegue:

### Opción 1: Surge.sh (Recomendado)
```bash
npm install -g surge
cd c:/Users/jorge/Documents/GitHub/ar-tcg-project
surge
```

### Opción 2: GitHub Pages
```bash
git init
git add .
git commit -m "AR TCG App"
git branch -M main
git remote add origin https://github.com/tu-usuario/ar-tcg-project.git
git push -u origin main
```

### Opción 3: Netlify
- Arrastrar carpeta a https://netlify.com

## 📱 Para probar en móvil:
1. Despliega con tu opción preferida
2. Abre la URL en tu móvil
3. Permite cámara/sensores
4. Imprime marcador: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png

## 🔧 Marcador Hiro:
Imprime o muestra en otra pantalla esta imagen:
https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png
