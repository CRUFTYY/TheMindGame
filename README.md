# The Mind Game

[English](#english) | [Español](#espa%C3%B1ol)

---

## English

### 🧠 Overview

**The Mind** is a cooperative card game where players must work together to play numbered cards in ascending order **without communicating**. Each player gets a set of cards and must play them at the right moment, relying only on **intuition and mental synchronization**.

### 🎮 Features

- Real-time multiplayer gameplay  
- Room-based system for multiple concurrent games  
- Customizable number of cards per player (1-5)  
- Bilingual support (English/Spanish)  
- Responsive design for desktop and mobile  
- Real-time game state synchronization  
- Intuitive user interface  
- In-game chat system  

### 🕹️ How to Play

1. Enter your name to start  
2. Create a new room or join an existing one with a room code  
3. Wait for other players to join (2–10 players)  
4. The host selects the number of cards per player and starts the game  
5. Each player gets their cards  
6. Players must play their cards in ascending order without communicating  
7. If a card is played out of order, the game ends  
8. Win by successfully playing all cards in order  

### 📏 Game Rules

- Each player receives 1–5 cards (determined by the host)  
- Cards have values from 1 to 100  
- Players must play cards in ascending order  
- **No verbal or non-verbal communication** about card values is allowed  
- The game is won when all cards are played correctly  
- The game is lost if any card is played out of sequence  

### ⚙️ Technical Details

- Built with **React**, **TypeScript**, and **Socket.IO**  
- Real-time WebSocket communication  
- Styled with **Tailwind CSS**  
- Development and build with **Vite**  
- Backend: **Express.js**

### 🛠 Development

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build
```

### 🔐 Security Notes

- Encrypted communication for all connections  
- Secure random number generation for cards  
- Server-side validation of all actions  
- Protection against game state manipulation  

### 💻 System Requirements

- Node.js 18 or higher  
- Modern browser with WebSocket support  
- Stable internet connection  

---

## Español

### 🧠 Descripción General

**The Mind** es un juego de cartas cooperativo donde los jugadores tienen que coordinarse para jugar cartas numeradas en orden ascendente **sin comunicarse**. Cada uno recibe un conjunto de cartas y tiene que jugarlas en el momento justo, usando solo **intuición y sincronización mental**.

### 🎮 Características

- Multijugador en tiempo real  
- Sistema de salas para múltiples partidas  
- Cantidad de cartas personalizable por jugador (1–5)  
- Soporte bilingüe (Inglés/Español)  
- Diseño adaptable para escritorio y móvil  
- Sincronización en tiempo real del estado del juego  
- Interfaz intuitiva  
- Sistema de chat en el juego  

### 🕹️ Cómo Jugar

1. Poné tu nombre para empezar  
2. Creá una sala o uníte a una con un código  
3. Esperá a que se unan otros jugadores (2–10)  
4. El host elige cuántas cartas recibe cada jugador e inicia la partida  
5. Cada jugador recibe sus cartas  
6. Todos tienen que jugar sus cartas en orden ascendente sin hablar  
7. Si alguien juega fuera de orden, el juego termina  
8. Ganan si logran jugar todas las cartas en orden  

### 📏 Reglas del Juego

- Cada jugador recibe entre 1 y 5 cartas (lo decide el anfitrión)  
- Las cartas van del 1 al 100  
- Se deben jugar en orden ascendente  
- **No se permite ningún tipo de comunicación** sobre los valores  
- Ganan si juegan todas las cartas correctamente  
- Pierden si alguien juega una carta fuera de secuencia  

### ⚙️ Detalles Técnicos

- Hecho con **React**, **TypeScript** y **Socket.IO**  
- Comunicación en tiempo real con WebSockets  
- Estilos con **Tailwind CSS**  
- Desarrollo y compilación con **Vite**  
- Backend en **Express.js**

### 🛠 Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (frontend + backend)
npm run dev

# Compilar para producción
npm run build
```

### 🔐 Notas de Seguridad

- Comunicación cifrada en todas las conexiones  
- Generación segura de números aleatorios para las cartas  
- Validación de todas las acciones en el servidor  
- Protección contra manipulación del estado del juego  

### 💻 Requisitos del Sistema

- Node.js 18 o superior  
- Navegador moderno con soporte para WebSocket  
- Conexión a internet estable  

---

## 📝 License

**MIT License**  
Copyright (c) 2025 **The Mind Game**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND**, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
