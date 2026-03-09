/**
 * useSpeech - Custom Hook untuk Web Speech API
 * 
 * Mengelola Speech-to-Text functionality dengan konfigurasi:
 * - lang: 'en-US'
 * - continuous: false
 * - interimResults: false
 * 
 * @version 1.0.0
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechState, SpeechResult } from '@/types/speakcheck';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechReturn extends SpeechState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Check browser support once at module level
const getSpeechRecognitionAPI = (): typeof window.SpeechRecognition | null => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export function useSpeech(): UseSpeechReturn {
  // Initialize state with browser support check
  const [state, setState] = useState<SpeechState>(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    return {
      isListening: false,
      isSupported: !!SpeechRecognitionAPI,
      transcript: '',
      confidence: 0,
      error: SpeechRecognitionAPI 
        ? null 
        : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
    };
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStoppingRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    if (!SpeechRecognitionAPI) return;

    // Initialize recognition
    const recognition = new SpeechRecognitionAPI();
    
    // Configure recognition settings
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Handle successful recognition
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!mountedRef.current) return;
      
      const result = event.results[0][0];
      const speechResult: SpeechResult = {
        transcript: result.transcript,
        confidence: result.confidence,
        isFinal: event.results[0].isFinal
      };

      setState(prev => ({
        ...prev,
        transcript: speechResult.transcript,
        confidence: speechResult.confidence,
        isListening: false,
        error: null
      }));
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!mountedRef.current) return;
      
      let errorMessage = 'An error occurred during speech recognition.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found or microphone access denied.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage
      }));
    };

    // Handle recognition end
    recognition.onend = () => {
      if (!mountedRef.current || isStoppingRef.current) return;
      setState(prev => ({
        ...prev,
        isListening: false
      }));
    };

    // Handle recognition start
    recognition.onstart = () => {
      if (!mountedRef.current) return;
      setState(prev => ({
        ...prev,
        isListening: true,
        error: null
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      mountedRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || state.isListening) return;

    isStoppingRef.current = false;
    
    // Reset transcript before starting
    setState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      error: null
    }));

    try {
      recognitionRef.current.start();
    } catch (error) {
      // Recognition might already be started
      console.error('Error starting speech recognition:', error);
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !state.isListening) return;

    isStoppingRef.current = true;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      error: null
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript
  };
}

export default useSpeech;
