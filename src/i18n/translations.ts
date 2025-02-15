export type Language = 'en' | 'es';

export const translations = {
  en: {
    // General
    gameName: 'The Mind',
    gameDescription: 'A game of mental synchronization',
    
    // Auth & Setup
    enterName: 'Your Name',
    enterNamePlaceholder: 'Enter your name',
    continue: 'Continue',
    createRoom: 'Create Room',
    joinRoom: 'Join Room',
    enterRoomCode: 'Enter Room Code',
    roomCode: 'Room Code',
    copied: 'Room code copied!',
    
    // Game Setup
    playersInRoom: 'Players in room',
    players: 'Players',
    cardsPerPlayer: 'Cards per Player',
    startGame: 'Start Game',
    waitingForHost: 'Waiting for the host to start the game...',
    you: 'You',
    host: 'Host',
    
    // Game Play
    yourCards: 'Your Cards',
    playedCards: 'Played Cards',
    noCardsInHand: 'No cards in hand',
    noCardsPlayed: 'No cards played yet',
    preparingGame: 'Preparing game...',
    startingNewRound: 'Starting new round...',
    gameOver: 'Game Over!',
    
    // Messages
    victory: 'Victory! All cards played correctly',
    defeat: 'We lost! Card {card} was played when {lowest} was the lowest',
    pleaseEnterName: 'Please enter your name',
    roomCodeRequired: 'Room code must be 6 characters',
    
    // Language
    language: 'Language',
    english: 'English',
    spanish: 'Spanish'
  },
  es: {
    // General
    gameName: 'The Mind',
    gameDescription: 'Un juego de sincronización mental',
    
    // Auth & Setup
    enterName: 'Tu Nombre',
    enterNamePlaceholder: 'Ingresá tu nombre',
    continue: 'Continuar',
    createRoom: 'Crear Sala',
    joinRoom: 'Unirse a una Sala',
    enterRoomCode: 'Ingresá el Código de Sala',
    roomCode: 'Código de Sala',
    copied: 'Código copiado!',
    
    // Game Setup
    playersInRoom: 'Jugadores en la sala',
    players: 'Jugadores',
    cardsPerPlayer: 'Cartas por Jugador',
    startGame: 'Iniciar Juego',
    waitingForHost: 'Esperando a que el anfitrión inicie el juego...',
    you: 'Vos',
    host: 'Anfitrión',
    
    // Game Play
    yourCards: 'Tus Cartas',
    playedCards: 'Cartas Jugadas',
    noCardsInHand: 'No tienés cartas',
    noCardsPlayed: 'Todavía no se han jugado cartas',
    preparingGame: 'Preparando juego...',
    startingNewRound: 'Iniciando nueva ronda...',
    gameOver: 'Juego terminado!',
    
    // Messages
    victory: 'GANARON! Todas las cartas jugadas correctamente',
    defeat: 'perdimos! Se jugó {card} cuando el menor era {lowest}',
    pleaseEnterName: 'Por favor ingresá tu nombre',
    roomCodeRequired: 'El código tiene que tener 6 caracteres',
    
    // Language
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español'
  }
} as const;

export type TranslationKey = keyof typeof translations.en;