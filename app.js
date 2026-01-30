class ARCardDetector {
    constructor() {
        this.model = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.currentOrientation = null;
        this.lastDetectionTime = 0;
        this.tcgAPI = new TCGCardAPI();
        this.tcgCards = [];
        this.currentZoom = 1.0;
        
        this.init();
    }
    
    async init() {
        try {
            // Cargar modelo de TensorFlow para reconocimiento
            console.log('Cargando modelo de reconocimiento...');
            this.model = await mobilenet.load();
            console.log('Modelo cargado exitosamente');
            
            // Cargar cartas de la API TCG
            console.log('Cargando cartas de TCG API...');
            this.tcgCards = await this.tcgAPI.loadCardImages();
            console.log(`Se cargaron ${this.tcgCards.length} cartas de TCG`);
            
            // Configurar eventos
            this.setupEventListeners();
            
            // Iniciar detección de orientación
            this.startOrientationDetection();
            
            // Configurar control de zoom
            this.setupZoomControls();
            
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.updateStatus('Error al cargar modelo de IA');
        }
    }
    
    setupZoomControls() {
        console.log('Configurando controles de zoom...');
        
        // Forzar visibilidad de los controles
        setTimeout(() => {
            this.setupCameraZoom();
            this.forceControlsVisibility();
        }, 1000);
        
        // También intentar después de que AR.js esté completamente cargado
        setTimeout(() => {
            this.forceControlsVisibility();
        }, 3000);
        
        // Y un último intento cuando todo esté cargado
        setTimeout(() => {
            this.forceControlsVisibility();
        }, 5000);
    }
    
    forceControlsVisibility() {
        try {
            const zoomControls = document.getElementById('zoomControls');
            const controls = document.getElementById('controls');
            
            console.log('Elementos encontrados:', {
                zoomControls: !!zoomControls,
                controls: !!controls
            });
            
            if (zoomControls) {
                console.log('Forzando visibilidad de zoom controls');
                zoomControls.style.display = 'block';
                zoomControls.style.visibility = 'visible';
                zoomControls.style.opacity = '1';
                zoomControls.style.pointerEvents = 'auto';
                zoomControls.style.position = 'fixed';
                zoomControls.style.zIndex = '999999';
            }
            
            if (controls) {
                console.log('Forzando visibilidad de controls');
                controls.style.display = 'block';
                controls.style.visibility = 'visible';
                controls.style.opacity = '1';
                controls.style.pointerEvents = 'auto';
                controls.style.position = 'fixed';
                controls.style.zIndex = '999998';
            }
            
            // Encontrar y reordenar todos los elementos de AR.js
            const arElements = document.querySelectorAll('canvas, .a-canvas, [arjs]');
            console.log('Elementos AR encontrados:', arElements.length);
            
            arElements.forEach((el, index) => {
                console.log(`Elemento AR ${index}:`, el.tagName, el.className, getComputedStyle(el).zIndex);
                
                // Forzar z-index bajo para elementos AR que no son el canvas principal
                if (el.tagName !== 'CANVAS' || !el.classList.contains('a-canvas')) {
                    el.style.zIndex = '1';
                }
            });
            
            // Buscar específicamente el canvas de AR.js y ponerlo debajo
            const arCanvas = document.querySelector('canvas.a-canvas');
            if (arCanvas) {
                console.log('Canvas AR encontrado, ajustando z-index');
                arCanvas.style.zIndex = '1';
            }
            
            // Mover los controles al final del body para mayor prioridad
            if (zoomControls && zoomControls.parentNode !== document.body) {
                document.body.appendChild(zoomControls);
            }
            
            if (controls && controls.parentNode !== document.body) {
                document.body.appendChild(controls);
            }
            
        } catch (error) {
            console.warn('Error forzando visibilidad:', error);
        }
    }
    
    setupCameraZoom() {
        try {
            const video = document.querySelector('video');
            if (video) {
                // Forzar resolución nativa para reducir zoom
                video.style.transform = `scale(${this.currentZoom})`;
                video.style.transformOrigin = 'center center';
                
                // Ajustar el viewport de AR.js
                const scene = document.querySelector('a-scene');
                if (scene && scene.hasAttribute('arjs')) {
                    const arjsSystem = scene.systems.arjs;
                    if (arjsSystem && arjsSystem._arSession) {
                        // Intentar configurar la cámara con zoom normal
                        this.updateCameraSettings();
                    }
                }
            }
        } catch (error) {
            console.warn('Error configurando zoom:', error);
        }
    }
    
    updateCameraSettings() {
        try {
            const camera = document.querySelector('a-camera');
            if (camera) {
                camera.setAttribute('zoom', this.currentZoom);
                camera.setAttribute('fov', 80);
            }
            
            // Actualizar display del zoom
            const zoomLevel = document.getElementById('zoomLevel');
            if (zoomLevel) {
                zoomLevel.textContent = this.currentZoom.toFixed(1);
            }
        } catch (error) {
            console.warn('Error actualizando cámara:', error);
        }
    }
    
    zoomIn() {
        if (this.currentZoom < 2.0) {
            this.currentZoom += 0.1;
            this.applyZoom();
        }
    }
    
    zoomOut() {
        if (this.currentZoom > 0.5) {
            this.currentZoom -= 0.1;
            this.applyZoom();
        }
    }
    
    resetZoom() {
        this.currentZoom = 1.0;
        this.applyZoom();
    }
    
    applyZoom() {
        const video = document.querySelector('video');
        if (video) {
            video.style.transform = `scale(${this.currentZoom})`;
            this.updateCameraSettings();
            console.log(`Zoom aplicado: ${this.currentZoom}x`);
        }
        
        // Forzar que los controles sigan visibles después del zoom
        setTimeout(() => {
            this.forceControlsVisibility();
        }, 100);
    }
    
    setupEventListeners() {
        const recordBtn = document.getElementById('recordBtn');
        const detectBtn = document.getElementById('detectBtn');
        const galleryBtn = document.getElementById('galleryBtn');
        
        recordBtn.addEventListener('click', () => this.toggleRecording());
        detectBtn.addEventListener('click', () => this.detectCard());
        galleryBtn.addEventListener('click', () => this.showCardGallery());
        
        // Detectar cuando el marcador es visible
        const marker = document.querySelector('a-marker');
        marker.addEventListener('markerFound', () => {
            this.updateStatus('¡Carta detectada! Mostrando efectos AR');
            this.triggerAREffects();
            this.showRandomCard();
        });
        
        marker.addEventListener('markerLost', () => {
            this.updateStatus('Carta perdida');
            this.stopAREffects();
            this.hideCardInfo();
        });
    }
    
    startOrientationDetection() {
        // Usar DeviceOrientationEvent para detectar rotación del teléfono
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                this.handleOrientationChange(event);
            });
        }
        
        // Alternativa: analizar video para detectar orientación de la carta
        this.analyzeVideoOrientation();
    }
    
    handleOrientationChange(event) {
        const { alpha, beta, gamma } = event;
        
        // Detectar si el teléfono está en posición vertical u horizontal
        if (Math.abs(beta) > 45) {
            // Teléfono en horizontal
            if (this.currentOrientation !== 'horizontal') {
                this.currentOrientation = 'horizontal';
                this.onOrientationChange('horizontal');
            }
        } else {
            // Teléfono en vertical
            if (this.currentOrientation !== 'vertical') {
                this.currentOrientation = 'vertical';
                this.onOrientationChange('vertical');
            }
        }
    }
    
    async analyzeVideoOrientation() {
        const video = document.querySelector('video');
        if (!video) return;
        
        // Crear canvas para analizar frames del video
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        setInterval(async () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);
                
                // Aquí podrías agregar lógica para detectar orientación de la carta
                // basándote en características visuales
            }
        }, 1000);
    }
    
    onOrientationChange(orientation) {
        console.log(`Orientación cambiada a: ${orientation}`);
        this.updateStatus(`Orientación: ${orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}`);
        
        // Cambiar efectos AR según orientación
        const marker = document.querySelector('a-marker');
        if (marker && marker.object3D.visible) {
            this.updateAREffects(orientation);
        }
    }
    
    triggerAREffects() {
        // Activar animaciones y efectos cuando se detecta la carta
        const box = document.querySelector('a-box');
        const text = document.querySelector('a-text');
        
        if (box) {
            box.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dur: 500; dir: alternate; loop: true');
        }
        
        if (text) {
            text.setAttribute('animation', 'property: position; to: 0 1.5 0; dur: 2000; dir: alternate; loop: true');
        }
    }
    
    stopAREffects() {
        // Detener efectos cuando se pierde la carta
        const box = document.querySelector('a-box');
        const text = document.querySelector('a-text');
        
        if (box) {
            box.removeAttribute('animation');
        }
        
        if (text) {
            text.removeAttribute('animation');
        }
    }
    
    updateAREffects(orientation) {
        const box = document.querySelector('a-box');
        const text = document.querySelector('a-text');
        
        if (orientation === 'horizontal') {
            // Efectos para orientación horizontal
            if (box) {
                box.setAttribute('material', 'color: #FF6B6B');
                box.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 2000; loop: true');
            }
            if (text) {
                text.setAttribute('value', '¡Modo Horizontal Activado!');
            }
        } else {
            // Efectos para orientación vertical
            if (box) {
                box.setAttribute('material', 'color: #4CC3D9');
                box.setAttribute('animation', 'property: rotation; to: 360 0 0; dur: 2000; loop: true');
            }
            if (text) {
                text.setAttribute('value', '¡Modo Vertical Activado!');
            }
        }
    }
    
    async detectCard() {
        if (!this.model) {
            this.updateStatus('Modelo no cargado');
            return;
        }
        
        try {
            const video = document.querySelector('video');
            if (!video) {
                this.updateStatus('Video no disponible');
                return;
            }
            
            // Crear canvas para procesar el frame actual
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // Realizar predicción
            const predictions = await this.model.classify(canvas);
            console.log('Predicciones:', predictions);
            
            if (predictions.length > 0) {
                const topPrediction = predictions[0];
                this.updateStatus(`Detectado: ${topPrediction.label} (${Math.round(topPrediction.probability * 100)}%)`);
            }
            
        } catch (error) {
            console.error('Error en detección:', error);
            this.updateStatus('Error en detección de carta');
        }
    }
    
    async toggleRecording() {
        const recordBtn = document.getElementById('recordBtn');
        
        if (!this.isRecording) {
            try {
                // Iniciar grabación
                this.stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false
                });
                
                this.mediaRecorder = new MediaRecorder(this.stream);
                this.recordedChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };
                
                this.mediaRecorder.onstop = () => {
                    this.saveRecording();
                };
                
                this.mediaRecorder.start();
                this.isRecording = true;
                recordBtn.textContent = 'Detener Grabación';
                recordBtn.classList.add('recording');
                this.updateStatus('Grabando video...');
                
            } catch (error) {
                console.error('Error al iniciar grabación:', error);
                this.updateStatus('Error al iniciar grabación');
            }
        } else {
            // Detener grabación
            this.mediaRecorder.stop();
            this.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            recordBtn.textContent = 'Grabar Video';
            recordBtn.classList.remove('recording');
            this.updateStatus('Grabación detenida');
        }
    }
    
    saveRecording() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const video = document.getElementById('recordedVideo');
        video.src = url;
        video.classList.remove('hidden');
        
        // Crear enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `ar-tcg-${Date.now()}.webm`;
        a.click();
        
        this.updateStatus('Video guardado exitosamente');
    }
    
    updateStatus(message) {
        const status = document.getElementById('status');
        status.textContent = message;
    }
    
    showRandomCard() {
        if (this.tcgCards.length > 0) {
            // Usar carta real de la API TCG
            const randomCard = this.tcgCards[Math.floor(Math.random() * this.tcgCards.length)];
            this.showCardInfo(randomCard.name, randomCard.imageUrl, 'Carta oficial de TCG con aura rosa');
        } else {
            // Fallback a placeholders si no hay cartas cargadas
            const placeholders = [
                'https://picsum.photos/seed/dragon/200/280',
                'https://picsum.photos/seed/knight/200/280',
                'https://picsum.photos/seed/magic/200/280'
            ];
            
            const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
            const cardNames = ['Dragón de Fuego', 'Caballero Mágico', 'Hechicero Arcano'];
            const randomName = cardNames[Math.floor(Math.random() * cardNames.length)];
            
            this.showCardInfo(randomName, randomPlaceholder, 'Carta legendaria con poderosos efectos');
        }
    }
    
    showCardGallery() {
        this.updateStatus('Mostrando galería de cartas...');
        
        if (this.tcgCards.length > 0) {
            // Mostrar primera carta de las cartas reales cargadas
            const firstCard = this.tcgCards[0];
            this.showCardInfo(firstCard.name, firstCard.imageUrl, 'Carta oficial de TCG - Lyrical Monasterio');
        } else {
            // Fallback a placeholders
            const cards = [
                { name: 'Dragón de Fuego', image: 'https://picsum.photos/seed/dragon/200/280' },
                { name: 'Caballero Mágico', image: 'https://picsum.photos/seed/knight/200/280' },
                { name: 'Hechicero Arcano', image: 'https://picsum.photos/seed/magic/200/280' }
            ];
            
            // Mostrar primera carta de ejemplo
            this.showCardInfo(cards[0].name, cards[0].image, 'Explora la colección completa');
        }
    }
    
    showCardInfo(name, imageSrc, description) {
        const cardInfo = document.getElementById('cardInfo');
        const cardName = document.getElementById('cardName');
        const cardImage = document.getElementById('cardImage');
        const cardDescription = document.getElementById('cardDescription');
        
        cardName.textContent = name;
        cardImage.src = imageSrc;
        cardDescription.textContent = description;
        
        // Aplicar aura rosa a la imagen
        cardImage.className = 'pink-aura-image';
        
        // Crear contenedor con aura si no existe
        if (!cardImage.parentNode.classList.contains('pink-aura-container')) {
            const auraContainer = document.createElement('div');
            auraContainer.className = 'pink-aura-container';
            cardImage.parentNode.insertBefore(auraContainer, cardImage);
            auraContainer.appendChild(cardImage);
            
            // Agregar efectos de brillo
            this.addSparkleEffects(auraContainer);
        }
        
        cardInfo.classList.remove('hidden');
    }
    
    addSparkleEffects(container) {
        // Agregar pequeños puntos de brillo aleatorios
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'pink-sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(sparkle);
        }
    }
    
    hideCardInfo() {
        const cardInfo = document.getElementById('cardInfo');
        cardInfo.classList.add('hidden');
    }
}

// Funciones globales para zoom (accesibles desde HTML)
function zoomIn() {
    if (window.arDetector) {
        window.arDetector.zoomIn();
    }
}

function zoomOut() {
    if (window.arDetector) {
        window.arDetector.zoomOut();
    }
}

function resetZoom() {
    if (window.arDetector) {
        window.arDetector.resetZoom();
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.arDetector = new ARCardDetector();
});

// Solicitar permisos para sensores del dispositivo
if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ requiere permiso explícito
    document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    console.log('Permiso de orientación concedido');
                }
            })
            .catch(console.error);
    }, { once: true });
}
