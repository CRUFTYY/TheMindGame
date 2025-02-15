# The Mind Game 🧠

A real-time multiplayer card game where players must work together to play cards in ascending order without any verbal communication.

[English](#english) | [Español](#español)

---

## English

### Overview

The Mind is a cooperative card game where players must work together to play numbered cards in ascending order without communicating. Each player receives a set of cards and must play them at the right moment, using only their intuition and mental synchronization with other players.

### Features

- Real-time multiplayer gameplay
- Room-based system for multiple concurrent games
- Customizable number of cards per player (1-5)
- Bilingual support (English/Spanish)
- Responsive design for desktop and mobile
- Real-time game state synchronization
- Intuitive user interface

### How to Play

1. Enter your name to start
2. Create a new room or join an existing one with a room code
3. Wait for other players to join (2-10 players)
4. The host can select the number of cards per player and start the game
5. Each player receives their cards
6. Players must play their cards in ascending order without communicating
7. If a card is played out of order, the game ends
8. Win by successfully playing all cards in ascending order

### Technical Details

- Built with React, TypeScript, and Socket.IO
- Real-time WebSocket communication
- Tailwind CSS for styling
- Vite for development and building
- Express.js backend server

### Development

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build
```

---

## Español

### Descripción General

The Mind es un juego de cartas cooperativo donde los jugadores deben trabajar juntos para jugar cartas numeradas en orden ascendente sin comunicarse. Cada jugador recibe un conjunto de cartas y debe jugarlas en el momento adecuado, usando solo su intuición y sincronización mental con otros jugadores.

### Características

- Juego multijugador en tiempo real
- Sistema de salas para múltiples partidas simultáneas
- Número personalizable de cartas por jugador (1-5)
- Soporte bilingüe (Inglés/Español)
- Diseño responsivo para escritorio y móvil
- Sincronización del estado del juego en tiempo real
- Interfaz de usuario intuitiva

### Cómo Jugar

1. Ingresa tu nombre para comenzar
2. Crea una nueva sala o únete a una existente con un código de sala
3. Espera a que otros jugadores se unan (2-10 jugadores)
4. El anfitrión puede seleccionar el número de cartas por jugador e iniciar el juego
5. Cada jugador recibe sus cartas
6. Los jugadores deben jugar sus cartas en orden ascendente sin comunicarse
7. Si se juega una carta fuera de orden, el juego termina
8. Gana jugando exitosamente todas las cartas en orden ascendente

### Detalles Técnicos

- Construido con React, TypeScript y Socket.IO
- Comunicación en tiempo real mediante WebSocket
- Tailwind CSS para estilos
- Vite para desarrollo y compilación
- Servidor backend con Express.js

### Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (frontend + backend)
npm run dev

# Compilar para producción
npm run build
```

### Notas de Seguridad

- Todas las comunicaciones del juego están encriptadas
- Generación segura de números aleatorios para las cartas
- Validación de todas las acciones del juego en el servidor
- Protección contra manipulación del estado del juego

### Requisitos del Sistema

- Node.js 18 o superior
- Navegador web moderno con soporte para WebSocket
- Conexión a Internet estable

---

## License / Licencia

MIT License

Copyright (c) 2024 The Mind Game

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.