import React, { useEffect, useState } from 'react';
import { useLiveSession } from '../hooks/useLiveSession';

interface LiveInterfaceProps {
  onClose: () => void;
}

export const LiveInterface: React.FC<LiveInterfaceProps> = ({ onClose }) => {
  const [transcripts, setTranscripts] = useState<{text: string, isUser: boolean}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { isActive, isConnecting, connect, disconnect } = useLiveSession({
    onTranscript: (text, isUser) => {
        setTranscripts(prev => [...prev.slice(-4), { text, isUser }]);
    },
    onError: (err) => setError(err)
  });

  // Auto connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-rose-950 to-rose-900 text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium tracking-wide uppercase text-rose-200">
                {isConnecting ? 'CONNECTING...' : isActive ? 'AI CALL ACTIVE' : 'DISCONNECTED'}
            </span>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Visualizer (Simulated) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Animated Rings */}
        <div className="relative flex items-center justify-center">
            <div className={`absolute w-64 h-64 border-2 border-rose-500/30 rounded-full ${isActive ? 'animate-[ping_3s_ease-in-out_infinite]' : ''}`} />
            <div className={`absolute w-48 h-48 border-2 border-rose-500/50 rounded-full ${isActive ? 'animate-[ping_2s_ease-in-out_infinite]' : ''}`} />
            <div className="w-32 h-32 bg-rose-600 rounded-full shadow-[0_0_50px_rgba(225,29,72,0.5)] flex items-center justify-center z-10">
                 <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
        </div>
        
        {error && (
            <div className="mt-8 bg-red-500/20 text-red-200 px-4 py-2 rounded-lg text-sm border border-red-500/30">
                {error}
            </div>
        )}

        <div className="mt-12 text-center max-w-md px-6 min-h-[100px]">
            {transcripts.length > 0 ? (
                <p className="text-xl md:text-2xl font-light leading-relaxed animate-fade-in text-rose-50">
                    "{transcripts[transcripts.length - 1].text}"
                </p>
            ) : (
                <p className="text-rose-300">Listening... (Speak in Russian or English)</p>
            )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 flex justify-center pb-12">
        <button 
           onClick={isActive ? disconnect : connect}
           className={`px-8 py-3 rounded-full font-semibold tracking-wide transition-all transform hover:scale-105 ${isActive ? 'bg-rose-900/50 hover:bg-rose-900 text-white border border-rose-500' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
        >
            {isActive ? 'End Call' : 'Start Call'}
        </button>
      </div>
    </div>
  );
};