
import React, { useState, useRef, useEffect } from 'react';
import { Message, Sender, ModelType, GeoLocation, Language } from '../types';
import { generateTextResponse } from '../services/geminiService';
import { ChatMessage } from './ChatMessage';
import { TRANSLATIONS } from '../utils/translations';

interface ChatInterfaceProps {
  location: GeoLocation | null;
  lang: Language;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ location, lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: t.ui.welcomeMessage,
      sender: Sender.BOT,
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const modelMode: ModelType = ModelType.FLASH_GROUNDED;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showFaq, expandedFaq]);

  // Update welcome message when lang changes
  useEffect(() => {
    setMessages(prev => {
      const hasUserMessages = prev.some(m => m.sender === Sender.USER);
      if (!hasUserMessages) {
        return [{
          id: 'welcome',
          text: t.ui.welcomeMessage,
          sender: Sender.BOT,
          timestamp: Date.now(),
        }];
      }
      return prev;
    });
  }, [lang, t.ui.welcomeMessage]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;

    if (!textToSend.trim() || isLoading) return;

    // If sending a message, close FAQ
    setShowFaq(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: Sender.USER,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await generateTextResponse(
        userMessage.text,
        modelMode,
        history,
        location || undefined
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "...",
        sender: Sender.BOT,
        timestamp: Date.now(),
        grounding: response.groundingMetadata?.groundingChunks
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please check your connection and try again.",
        sender: Sender.BOT,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Find the last user message to resend
    // We reverse to find the most recent one
    const lastUserMsg = [...messages].reverse().find(m => m.sender === Sender.USER);
    if (lastUserMsg && !isLoading) {
      // We don't need to add the user message again, just trigger the API call logic.
      // However, handleSendMessage adds the user message. 
      // To simplify, we will just call handleSendMessage with the text. 
      // It will appear as if the user sent it again, which is acceptable UX for a retry.
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 scrollbar-hide">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onRetry={msg.isError ? handleRetry : undefined}
          />
        ))}
        {isLoading && (
          <div className="flex w-full mb-6 justify-start animate-fade-in-up">
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2 min-h-[50px]">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-rose-400 font-medium ml-1 animate-pulse">{t.ui.aiThinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Overlay */}
      {showFaq && (
        <div className="absolute inset-x-4 bottom-20 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-20 max-h-[60%] overflow-y-auto animate-fade-in-up">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center sticky top-0">
            <h3 className="font-semibold text-slate-700">{t.ui.faq}</h3>
            <button onClick={() => setShowFaq(false)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-2">
            {t.faqs.map((faq, idx) => (
              <div key={idx} className="mb-2 last:mb-0 border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800 flex justify-between items-center transition-colors"
                >
                  {faq.question}
                  <svg className={`w-4 h-4 text-slate-400 transform transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 py-3 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 p-2">
        {/* Chips */}
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide px-2">
          {t.chips.map(s => (
            <button
              key={s.id}
              onClick={() => handleSendMessage(s.prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-medium rounded-full transition-colors border border-slate-200 whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 p-1">
          {/* FAQ Button */}
          <button
            onClick={() => setShowFaq(!showFaq)}
            className={`p-2.5 rounded-xl border border-slate-200 transition-colors ${showFaq ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            title={t.ui.faq}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>

          <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-rose-500 transition-shadow">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.ui.inputPlaceholder}
              className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-slate-700 text-sm max-h-24"
              rows={1}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${isLoading || !inputText.trim()
                ? 'bg-slate-100 text-slate-300'
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
