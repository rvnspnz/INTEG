import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Artwork, ChatMessage } from '../data/artworks';

interface AuctionChatProps {
  artwork: Artwork;
  onSendMessage: (message: string) => void;
}

const AuctionChat: React.FC<AuctionChatProps> = ({ artwork, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [artwork.chat, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat interface - only visible when isOpen is true */}
      {isOpen && (
        <div className="fixed bottom-0 right-4 w-[350px] h-[350px] flex flex-col border border-gray-200 rounded-t-lg bg-white shadow-lg z-10">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-[#5D4037] text-white rounded-t-lg">
            <h3 className="font-display text-lg font-medium">Auction Chat</h3>
            <button 
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {artwork.chat.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm italic">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              artwork.chat.map((chatMessage) => (
                <div key={chatMessage.id} className="mb-3">
                  <div className={`chat-message rounded-lg p-3 ${chatMessage.userName === 'You' ? 'bg-[#EFEBE9] ml-6' : 'bg-[#D7CCC8] mr-6'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-[#5D4037]">{chatMessage.userName}</span>
                      <span className="text-xs text-[#5D4037]/70">{formatTime(chatMessage.timestamp)}</span>
                    </div>
                    <p className="text-sm text-[#3E2723]">{chatMessage.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-[#EFEBE9]">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm rounded-md border border-[#D7CCC8] focus:outline-none focus:ring-1 focus:ring-[#795548]"
              />
              <button 
                type="submit"
                className="rounded-md bg-[#5D4037] hover:bg-[#4E342E] text-white p-2 transition-colors duration-300"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Chat bot avatar button */}
      {!isOpen && (
        <div 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#5D4037] text-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#4E342E] transition-colors z-20"
        >
          <MessageCircle size={22} />
        </div>
      )}
    </>
  );
};

export default AuctionChat;
