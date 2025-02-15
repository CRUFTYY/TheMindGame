import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Users } from 'lucide-react';
import { socketManager } from '../lib/socket';
import { ChatMessage, Player } from '../types';

interface ChatRoomProps {
  roomCode: string;
  messages: ChatMessage[];
  players: Player[];
  currentUser: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomCode,
  messages,
  players,
  currentUser
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await socketManager.sendMessage(roomCode, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketManager.emit('chat:typing', { roomCode, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketManager.emit('chat:typing', { roomCode, isTyping: false });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-semibold">Chat Room</h2>
        </div>
        <div className="flex items-center">
          <Users className="w-5 h-5 text-purple-400 mr-2" />
          <span className="text-sm text-gray-400">
            {players.filter(p => p.isOnline).length} online
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === currentUser
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {message.sender === currentUser ? 'You' : message.sender}
              </div>
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};