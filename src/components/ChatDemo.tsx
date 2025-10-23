'use client';

import { useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  reaction?: string;
  isThinking?: boolean;
}

interface ChatDemoProps {
  userName: string;
  companyName: string;
  onComplete: () => void;
  onSkip: () => void;
}

export default function ChatDemo({ userName, companyName, onComplete, onSkip }: ChatDemoProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  // Reset component state when it mounts
  useEffect(() => {
    setMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
    setShowReaction(false);
  }, []);

  const demoMessages: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
    {
      type: 'user',
      content: 'Hi! I\'m the DPO at our company. We process credit card payments - what do I need to be compliant?'
    },
    {
      type: 'assistant',
      content: `Hello! I'm your Compliance Assistant. Perfect! Since ${companyName} handles card payments, I'll set up payment security protections for you. This includes:\n\n• Encrypting card data when you store it\n• Securing your payment forms\n• Setting up quarterly security checks\n• Protecting cardholder information\n\nI'll add these to your compliance checklist. Sound good?`,
      reaction: '✨'
    },
    {
      type: 'user',
      content: 'Yes, that sounds great! What about customer data privacy? We collect a lot of personal information.'
    },
    {
      type: 'assistant',
      content: `Excellent question! I'll also set up data privacy protections:\n\n• Customer consent tracking\n• Data retention policies\n• Privacy notices\n• Data access controls\n\n${companyName} operates in your region, so I've included the relevant privacy regulations. You'll get a simple checklist of what to do.`,
      reaction: '🤔'
    },
    {
      type: 'user',
      content: 'Perfect! What if we have a security incident? I need to know what to do immediately.'
    },
    {
      type: 'assistant',
      content: `I've got you covered! I'm creating an incident response plan that includes:\n\n• Who to contact immediately\n• Steps to contain the issue\n• How to notify affected customers\n• Required reporting procedures\n\nYou'll have clear instructions ready to go.\n\nReady to set all this up for ${companyName}? It'll take just a few minutes.`,
      reaction: '🛡️'
    }
  ];

  useEffect(() => {
    // Prevent duplicate messages by checking if we're already at the end
    if (currentMessageIndex >= demoMessages.length) {
      return;
    }

    const timer = setTimeout(() => {
      if (currentMessageIndex < demoMessages.length) {
        const currentMsg = demoMessages[currentMessageIndex];
        
        // Show thinking indicator for AI messages
        if (currentMsg.type === 'assistant') {
          setIsTyping(true);
          setShowReaction(true);
        }
        
        // Simulate more natural typing delays
        const typingDelay = currentMsg.type === 'assistant' 
          ? (Math.random() * 2000) + 1500 // 1.5-3.5 seconds for AI
          : (Math.random() * 800) + 500;  // 0.5-1.3 seconds for user
        
        const typingTimer = setTimeout(() => {
          setMessages(prev => {
            // Check if this message already exists to prevent duplicates
            const messageExists = prev.some(msg => 
              msg.content === currentMsg.content && 
              msg.type === currentMsg.type
            );
            
            if (messageExists) {
              return prev;
            }
            
            const newMessage: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: currentMsg.type,
              content: currentMsg.content,
              timestamp: new Date(),
              reaction: currentMsg.reaction
            };
            
            return [...prev, newMessage];
          });
          
          setIsTyping(false);
          setShowReaction(false);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingDelay);

        return () => clearTimeout(typingTimer);
      }
    }, currentMessageIndex === 0 ? 1000 : (Math.random() * 1000) + 800);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, demoMessages]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      setIsTyping(false);
      setShowReaction(false);
    };
  }, []);

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Chat Header with Hlola Brand Gradient */}
      <div className="bg-gradient-to-r from-[#41c3d6] via-[#2dd4da] to-[#26558e] p-4 relative overflow-hidden">
        <div className="relative flex items-center space-x-4">
          {/* AI Agent Avatar with Shield */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#41c3d6] to-[#26558e] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Compliance Assistant</h3>
          </div>
        </div>
      </div>

      {/* Chat Messages with Light Theme */}
      <div className="flex-1 bg-gray-50 p-6 space-y-6 overflow-y-auto max-h-96">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3`}>
              {/* Enhanced Avatar with Hlola Brand Glow */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-blue-300 to-blue-400 text-white' 
                    : 'bg-gradient-to-br from-[#41c3d6] to-[#26558e] text-white'
                }`}>
                  {message.type === 'user' ? (
                    userName.charAt(0).toUpperCase()
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Enhanced Message Bubble with Ultra Light Elegant Blue */}
              <div className={`relative px-5 py-3 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-300 to-blue-400 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-[#41c3d6]/20 shadow-md'
              }`}>
                {/* Ultra light elegant border effect */}
                <div className={`absolute inset-0 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-300 to-blue-400 opacity-6 blur-sm'
                    : 'bg-gradient-to-br from-[#41c3d6] to-[#26558e] opacity-10 blur-sm'
                }`}></div>
                
                <div className="relative text-sm leading-relaxed">
                  {formatMessage(message.content)}
                </div>
                
                {/* Favicon Reaction */}
                {message.reaction && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 animate-bounce">
                    <img 
                      src="/brand/Hlola Icon Color.svg" 
                      alt="Hlola" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Professional Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-end space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#41c3d6] to-[#26558e] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                  </svg>
                </div>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-md shadow-md border border-[#41c3d6]/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#41c3d6] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#41c3d6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#41c3d6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {showReaction && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 text-[#41c3d6] animate-pulse">
              <div className="w-2 h-2 bg-[#41c3d6] rounded-full animate-ping"></div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Action Buttons with Light Theme */}
      <div className="bg-white p-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={onComplete}
            className="flex-1 bg-gradient-to-r from-[#41c3d6] to-[#26558e] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#2dd4da] hover:to-[#1e90a0] transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#41c3d6] to-[#26558e] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="relative">Continue to Setup ✨</span>
          </button>
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-300 hover:bg-gray-100 rounded-xl"
          >
            Skip Demo
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
