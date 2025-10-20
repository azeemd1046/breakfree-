import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAIChatResponse } from '../services/geminiService';

interface ChatScreenProps {
  initialPrompt?: string | null;
  clearInitialPrompt?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ initialPrompt, clearInitialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am here to support you on your journey. How are you feeling today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (initialPrompt && clearInitialPrompt) {
      // Send the prompt and immediately clear it from the parent state
      // to prevent re-sending on component re-renders.
      const promptToSend = initialPrompt;
      clearInitialPrompt();

      const send = async () => {
        setMessages(prev => [...prev, { role: 'user', text: promptToSend }]);
        setIsLoading(true);
        const aiResponse = await getAIChatResponse(promptToSend);
        setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
        setIsLoading(false);
      };

      send();
    }
  }, [initialPrompt, clearInitialPrompt]);

  const handleSend = async () => {
    if (userInput.trim() === '' || isLoading) return;
    
    const currentInput = userInput;
    setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
    setUserInput('');
    setIsLoading(true);

    const aiResponse = await getAIChatResponse(currentInput);

    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)]">
      <h1 className="text-2xl font-bold text-slate-900 mb-4 sr-only">AI Companion</h1>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 text-slate-800 p-3 rounded-lg">
              <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Talk about your urges or goals..."
          className="flex-grow bg-white text-slate-800 placeholder-slate-400 rounded-l-lg p-3 border border-r-0 border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-green-500 text-white font-bold p-3 rounded-r-lg disabled:bg-slate-300 hover:bg-green-600 transition-colors border border-l-0 border-green-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;