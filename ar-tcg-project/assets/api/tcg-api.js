// API para obtener cartas de TCGCSV con filtros específicos optimizada
class TCGCardAPI {
    constructor() {
        this.baseURL = 'https://tcgcsv.com/tcgplayer';
        this.cache = new Map();
        this.batchSize = 100; // Procesar en lotes
    }
    
    async fetchCards(setId = '16', productId = '23513') {
        try {
            const url = `${this.baseURL}/${setId}/${productId}/products`;
            console.log('Fetching cards from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Raw data:', data);
            
            // Extraer el array de resultados del objeto
            const cards = data.results || [];
            console.log('Cards array extracted:', cards.length);
            
            // Filtrar cartas según criterios específicos (optimizado)
            const filteredCards = await this.filterCardsOptimized(cards);
            console.log('Filtered cards:', filteredCards);
            
            return filteredCards;
            
        } catch (error) {
            console.error('Error fetching TCG cards:', error);
            return [];
        }
    }
    
    // Versión optimizada con procesamiento por lotes y caching
    async filterCardsOptimized(cards) {
        console.log(`Processing ${cards.length} cards in batches of ${this.batchSize}`);
        
        const results = [];
        
        // Procesar en lotes para no bloquear el UI
        for (let i = 0; i < cards.length; i += this.batchSize) {
            const batch = cards.slice(i, i + this.batchSize);
            
            // Usar Promise.all para procesamiento paralelo del batch
            const batchResults = await Promise.all(
                batch.map(card => this.processCardAsync(card))
            );
            
            // Filtrar resultados nulos y agregar al array final
            const validCards = batchResults.filter(card => card !== null);
            results.push(...validCards);
            
            // Pequeña pausa para no sobrecargar el browser
            if (i + this.batchSize < cards.length) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        return results;
    }
    
    // Procesamiento asíncrono individual de cada carta
    async processCardAsync(card) {
        try {
            // Verificación rápida de imageUrl
            if (!card.imageUrl) {
                return null;
            }
            
            // Verificación optimizada de extendedData
            if (!card.extendedData || !Array.isArray(card.extendedData)) {
                return null;
            }
            
            // Búsqueda optimizada: crear mapa de extendedData para acceso O(1)
            const dataMap = new Map();
            card.extendedData.forEach(item => {
                dataMap.set(item.name, item.value);
            });
            
            // Verificaciones rápidas usando el mapa
            const hasUnit = dataMap.get('Unit') === 'Normal Unit';
            const hasCorrectNation = dataMap.get('Nation') === 'Lyrical Monasterio';
            
            if (!hasUnit || !hasCorrectNation) {
                return null;
            }
            
            // Pre-cargar imagen asíncronamente (opcional, para mejor UX)
            // Comentado por ahora para mayor velocidad
            /*
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = card.imageUrl;
            });
            */
            
            return {
                id: card.productId || card.name,
                name: card.name,
                imageUrl: card.imageUrl,
                extendedData: card.extendedData
            };
            
        } catch (error) {
            console.warn(`Error processing card ${card.name}:`, error);
            return null;
        }
    }
    
    filterCards(cards) {
        console.log('Total cards received:', cards.length);
        
        return cards.filter(card => {
            // Verificar que tenga imageUrl
            if (!card.imageUrl) {
                console.log('Card without imageUrl:', card.name);
                return false;
            }
            
            // Verificar que en extendedData exista "name": "Unit" con "value": "Normal Unit"
            const hasUnit = card.extendedData && 
                           card.extendedData.some(data => 
                               data.name === 'Unit' && 
                               data.value === 'Normal Unit'
                           );
            
            if (!hasUnit) {
                console.log('Card without Unit type:', card.name);
                console.log('Extended data:', card.extendedData);
                return false;
            }
            
            // Verificar que exista Nation con valor "Lyrical Monasterio"
            const hasCorrectNation = card.extendedData && 
                                   card.extendedData.some(data => 
                                       data.name === 'Nation' && 
                                       data.value === 'Lyrical Monasterio'
                                   );
            
            if (!hasCorrectNation) {
                console.log('Card without correct Nation:', card.name);
                return false;
            }
            
            console.log('Card passed all filters:', card.name);
            return true;
        });
    }
    
    async loadCardImages() {
        const cards = await this.fetchCards();
        const cardImages = [];
        
        // Cargar imágenes en paralelo para mayor velocidad
        const imagePromises = cards.map(async (card) => {
            try {
                // Solo verificar que la URL sea válida, no cargar la imagen
                if (card.imageUrl && card.imageUrl.startsWith('http')) {
                    return {
                        id: card.productId || card.name,
                        name: card.name,
                        imageUrl: card.imageUrl,
                        extendedData: card.extendedData
                    };
                }
                return null;
            } catch (error) {
                console.warn(`Failed to validate image for ${card.name}:`, error);
                return null;
            }
        });
        
        const results = await Promise.all(imagePromises);
        return results.filter(card => card !== null);
    }
    
    // Método para obtener una carta aleatoria del conjunto filtrado
    async getRandomCard() {
        const cards = await this.loadCardImages();
        if (cards.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * cards.length);
        return cards[randomIndex];
    }
    
    // Método para buscar con parámetros dinámicos
    async fetchCardsWithParams(setId, productId, filters = {}) {
        const cacheKey = `${setId}-${productId}-${JSON.stringify(filters)}`;
        
        if (this.cache.has(cacheKey)) {
            console.log('Returning cached results for:', cacheKey);
            return this.cache.get(cacheKey);
        }
        
        try {
            const url = `${this.baseURL}/${setId}/${productId}/products`;
            const response = await fetch(url);
            const data = await response.json();
            const cards = data.results || [];
            
            // Aplicar filtros dinámicos
            const filteredCards = await this.filterCardsWithDynamicFilters(cards, filters);
            
            // Cache de resultados (máximo 50 entradas)
            if (this.cache.size >= 50) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(cacheKey, filteredCards);
            
            return filteredCards;
        } catch (error) {
            console.error('Error fetching cards with params:', error);
            return [];
        }
    }
    
    async filterCardsWithDynamicFilters(cards, filters) {
        const results = [];
        
        for (let i = 0; i < cards.length; i += this.batchSize) {
            const batch = cards.slice(i, i + this.batchSize);
            
            const batchResults = await Promise.all(
                batch.map(card => this.processCardWithFilters(card, filters))
            );
            
            const validCards = batchResults.filter(card => card !== null);
            results.push(...validCards);
            
            if (i + this.batchSize < cards.length) {
                await new Promise(resolve => setTimeout(resolve, 5));
            }
        }
        
        return results;
    }
    
    async processCardWithFilters(card, filters) {
        if (!card.imageUrl || !card.extendedData) {
            return null;
        }
        
        const dataMap = new Map();
        card.extendedData.forEach(item => {
            dataMap.set(item.name, item.value);
        });
        
        // Aplicar filtros dinámicamente
        for (const [key, value] of Object.entries(filters)) {
            if (dataMap.get(key) !== value) {
                return null;
            }
        }
        
        return {
            id: card.productId || card.name,
            name: card.name,
            imageUrl: card.imageUrl,
            extendedData: card.extendedData
        };
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TCGCardAPI = TCGCardAPI;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = TCGCardAPI;
}
