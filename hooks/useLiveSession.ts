import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';

interface UseLiveSessionProps {
  onTranscript: (text: string, isUser: boolean) => void;
  onError: (error: string) => void;
}

export const useLiveSession = ({ onTranscript, onError }: UseLiveSessionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const cleanup = useCallback(() => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
        try { session.close(); } catch(e) { console.warn("Session close error", e) }
      });
      sessionPromiseRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        
        const client = new GoogleGenAI({ apiKey });
        
        // Initialize Audio Contexts
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const outputCtx = new AudioContextClass({ sampleRate: 24000 });
        const inputCtx = new AudioContextClass({ sampleRate: 16000 });
        
        audioContextRef.current = outputCtx;
        inputContextRef.current = inputCtx;
        nextStartTimeRef.current = 0;

        // Get User Media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Setup Session
        const sessionPromise = client.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: "You are a bilingual (Russian/Kazakh) assistant for a blood lab. Be helpful and brief.",
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            inputAudioTranscription: {}, 
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              setIsConnecting(false);
              setIsActive(true);
              
              // Setup Input Processing
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
              
              sourceRef.current = source;
              processorRef.current = processor;
            },
            onmessage: async (msg: LiveServerMessage) => {
              // Handle Audio Output
              const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData && outputCtx) {
                 const buffer = await decodeAudioData(base64ToUint8Array(audioData), outputCtx);
                 const source = outputCtx.createBufferSource();
                 source.buffer = buffer;
                 source.connect(outputCtx.destination);
                 
                 const startTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                 source.start(startTime);
                 nextStartTimeRef.current = startTime + buffer.duration;
              }

              // Handle Transcription
              if (msg.serverContent?.inputTranscription?.text) {
                 onTranscript(msg.serverContent.inputTranscription.text, true);
              }
              if (msg.serverContent?.outputTranscription?.text) {
                 onTranscript(msg.serverContent.outputTranscription.text, false);
              }
              
              // Handle Interruption
               if (msg.serverContent?.interrupted) {
                 // In a real app, we would track sources and stop them.
                 // For simplicity, we just reset time.
                 nextStartTimeRef.current = 0;
               }
            },
            onclose: () => {
              cleanup();
            },
            onerror: (e) => {
              console.error("Live API Error", e);
              onError("Connection error");
              cleanup();
            }
          }
        });

        sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      onError(err.message || "Failed to start live session");
      cleanup();
    }
  }, [isActive, isConnecting, onTranscript, onError, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isActive,
    isConnecting,
    connect,
    disconnect: cleanup
  };
};
