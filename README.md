# The Mind Game 

Un juego de cartas multijugador en tiempo real donde los jugadores tienen que coordinarse para jugar las cartas en orden ascendente sin decir ni una palabra.

[English](#english) | [Español](#español)

---

## **English**

### **Overview**

The Mind is a cooperative card game where players must work together to play numbered cards in ascending order without communicating. Each player gets a set of cards and must play them at the right moment, relying only on intuition and mental synchronization.

### **Features**

- Real-time multiplayer gameplay  
- Room-based system for multiple concurrent games  
- Customizable number of cards per player (1-5)  
- Bilingual support (English/Spanish)  
- Responsive design for desktop and mobile  
- Real-time game state synchronization  
- Intuitive user interface  

### **How to Play**

1. Enter your name to start  
2. Create a new room or join an existing one with a room code  
3. Wait for other players to join (2-10 players)  
4. The host selects the number of cards per player and starts the game  
5. Each player gets their cards  
6. Players must play their cards in ascending order without communicating  
7. If a card is played out of order, the game ends  
8. Win by successfully playing all cards in order  

### **Technical Details**

- Built with React, TypeScript, and Socket.IO  
- Real-time WebSocket communication  
- Tailwind CSS for styling  
- Vite for development and building  
- Express.js backend server  

### **Development**

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build
```

---

## **Español**

### **Descripción General**

The Mind es un juego de cartas cooperativo donde los jugadores tienen que coordinarse para jugar cartas numeradas en orden ascendente sin comunicarse. Cada uno recibe un conjunto de cartas y tiene que jugarlas en el momento justo, usando solo intuición y sincronización mental.

### **Características**

- Multijugador en tiempo real  
- Sistema de salas para múltiples partidas  
- Cantidad de cartas personalizable por jugador (1-5)  
- Soporte bilingüe (Inglés/Español)  
- Diseño adaptable para escritorio y móvil  
- Sincronización en tiempo real del estado del juego  
- Interfaz intuitiva  

### **Cómo Jugar**

1. Poné tu nombre para empezar  
2. Creá una sala o uníte a una con un código  
3. Esperá a que se unan otros jugadores (2-10)  
4. El host elige cuántas cartas recibe cada jugador e inicia la partida  
5. Cada jugador recibe sus cartas  
6. Todos tienen que jugar sus cartas en orden ascendente sin hablar  
7. Si alguien juega fuera de orden, el juego termina  
8. Ganan si logran jugar todas las cartas en orden  

### **Detalles Técnicos**

- Hecho con React, TypeScript y Socket.IO  
- Comunicación en tiempo real con WebSockets  
- Estilos con Tailwind CSS  
- Vite para desarrollo y compilación  
- Backend en Express.js  

### **Desarrollo**

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (frontend + backend)
npm run dev

# Compilar para producción
npm run build
```

### **Notas de Seguridad**

- Comunicación cifrada en todas las conexiones  
- Generación segura de números aleatorios para las cartas  
- Validación de todas las acciones en el servidor  
- Protección contra manipulación del estado del juego  

### **Requisitos del Sistema**

- Node.js 18 o superior  
- Navegador moderno con soporte para WebSocket  
- Conexión a Internet estable  

---

## **Licencia**

MIT License

Copyright (c) 2025 The Mind Game (CRUFTY)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
