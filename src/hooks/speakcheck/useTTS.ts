/**
 * useTTS - Custom Hook untuk Text-to-Speech (A.L.I.C.E. Voice)
 * 
 * Mengelola SpeechSynthesis API untuk memberikan suara AI coach
 * 
 * @version 1.0.0
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  selectedVoice: SpeechSynthesisVoice | null;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
}

// Check TTS support at module level
const isTTSSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(() => isTTSSupported());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.9); // Slightly slower for learners
  const [pitch, setPitch] = useState(1.0);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!isTTSSupported()) return;

    // Load voices
    const loadVoices = () => {
      if (!mountedRef.current) return;
      
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter(
        voice => voice.lang.startsWith('en-')
      );
      setVoices(englishVoices);

      // Select default English voice (prefer female voice for A.L.I.C.E.)
      if (englishVoices.length > 0 && !selectedVoice) {
        const preferredVoice = englishVoices.find(
          voice => voice.name.includes('Samantha') || 
                   voice.name.includes('Karen') ||
                   voice.name.includes('Female') ||
                   voice.name.includes('Google UK English Female')
        ) || englishVoices[0];
        setSelectedVoice(preferredVoice);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      mountedRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!isSupported || !text) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        if (event.error !== 'canceled') {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        } else {
          resolve();
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, [isSupported, selectedVoice, rate, pitch]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    setVoice,
    selectedVoice,
    setRate,
    setPitch
  };
}

export default useTTS;
