// Base de datos de cartas TCG con imágenes locales
const CARDS_DATABASE = {
    'dragon-fire': {
        name: 'Dragón de Fuego',
        image: 'assets/cards/dragon-fire.jpg',
        description: 'Un dragón legendario que quema todo a su paso',
        rarity: 'legendary',
        attack: 8,
        defense: 6
    },
    'shield-knight': {
        name: 'Caballero del Escudo',
        image: 'assets/cards/shield-knight.jpg',
        description: 'Defensor impenetrable del reino',
        rarity: 'epic',
        attack: 4,
        defense: 9
    },
    'lightning-bolt': {
        name: 'Rayo Eléctrico',
        image: 'assets/cards/lightning-bolt.jpg',
        description: 'Poder mágico instantáneo',
        rarity: 'rare',
        attack: 7,
        defense: 2
    },
    'forest-spirit': {
        name: 'Espíritu del Bosque',
        image: 'assets/cards/forest-spirit.jpg',
        description: 'Guardián de la naturaleza',
        rarity: 'rare',
        attack: 5,
        defense: 5
    },
    'ice-wizard': {
        name: 'Mago de Hielo',
        image: 'assets/cards/ice-wizard.jpg',
        description: 'Domina los poderes del hielo',
        rarity: 'epic',
        attack: 6,
        defense: 4
    }
};

// Cartas placeholder (puedes reemplazar con imágenes reales)
const PLACEHOLDER_CARDS = [
    'https://picsum.photos/seed/dragon/200/280',
    'https://picsum.photos/seed/knight/200/280',
    'https://picsum.photos/seed/lightning/200/280',
    'https://picsum.photos/seed/forest/200/280',
    'https://picsum.photos/seed/ice/200/280'
];

// Función para obtener carta aleatoria
function getRandomCard() {
    const cards = Object.keys(CARDS_DATABASE);
    const randomKey = cards[Math.floor(Math.random() * cards.length)];
    return CARDS_DATABASE[randomKey];
}

// Función para buscar carta por nombre
function findCardByName(searchTerm) {
    const cards = Object.values(CARDS_DATABASE);
    return cards.find(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Función para obtener todas las cartas
function getAllCards() {
    return Object.values(CARDS_DATABASE);
}
