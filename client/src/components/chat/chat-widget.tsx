import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@shared/schema";
import { aiChatService } from "@/lib/ai-chat";
import { nanoid } from "nanoid";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      message: "Hi! I'm your AI support assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      message: inputValue,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => msg.message);
      const aiResponse = await aiChatService.generateResponse(inputValue, conversationHistory);
      
      const aiMessage: ChatMessage = {
        id: nanoid(),
        message: aiResponse.message,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: nanoid(),
        message: "I apologize, but I'm having trouble responding right now. Please try again or create a support ticket for assistance.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors"
      >
        <i className="fas fa-comments text-xl"></i>
      </div>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200">
          <div className="bg-primary text-white px-4 py-3 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI Support Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-slate-200"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'items-start'}`}>
                {!message.isUser && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-robot text-white text-sm"></i>
                  </div>
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-xs ${
                    message.isUser
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <div className="bg-slate-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-slate-200 p-4">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
