import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { GroundingChips } from './GroundingChips';
import { generateSpeech } from '../services/geminiService';
import { base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const isBot = message.sender === Sender.BOT;
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      const base64 = await generateSpeech(message.text);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Use helper to decode raw PCM data (native decodeAudioData fails on raw PCM)
      const buffer = await decodeAudioData(base64ToUint8Array(base64), audioCtx);
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  // Error Message View
  if (message.isError) {
    return (
      <div className="flex w-full mb-6 justify-start animate-fade-in-up">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 max-w-[90%] sm:max-w-[80%]">
          <div className="flex-shrink-0 text-red-500 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium mb-1">
              Unable to generate response
            </p>
            <p className="text-red-600 text-xs mb-3 leading-relaxed">
              {message.text}
            </p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Message View
  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        
        <div className={`
          relative px-4 py-3 sm:px-5 sm:py-4 rounded-2xl text-sm md:text-base shadow-sm
          ${isBot 
            ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
            : 'bg-rose-600 text-white rounded-tr-none'}
        `}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.text}
          </div>
          
          {isBot && message.grounding && (
             <GroundingChips chunks={message.grounding} />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5 ml-1">
          <span className="text-[10px] text-slate-400">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isBot && (
            <button 
              onClick={handleSpeak}
              disabled={isPlaying}
              className={`p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors ${isPlaying ? 'text-rose-500' : ''}`}
              title="Read Aloud"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};