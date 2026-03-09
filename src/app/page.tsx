/**
 * Speak Check AI Lab - Main Application
 * 
 * Aplikasi latihan berbicara bahasa Inggris untuk siswa SMP
 * dengan AI-powered feedback berbasis Web Speech API
 * 
 * @version 1.0.0
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { GameType, Student, FeedbackResult } from '@/types/speakcheck';
import { 
  Login, 
  Dashboard, 
  GameScreen, 
  NoticingRoom, 
  Results,
  AliceAvatar 
} from '@/components/speakcheck';

// Application states
type AppState = 
  | 'loading'
  | 'login'
  | 'dashboard'
  | 'playing'
  | 'results';

// Session data for results
interface GameSession {
  score: number;
  xpEarned: number;
  totalQuestions: number;
  correctAnswers: number;
  feedbackHistory: FeedbackResult[];
}

export default function Home() {
  // State management
  const [appState, setAppState] = useState<AppState>('loading');
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  
  // Ref to track if initial check has been done
  const initialCheckDone = useRef(false);

  // Check for existing session
  const checkExistingSession = useCallback(() => {
    const storedId = localStorage.getItem('speakcheck_student_id');
    const storedName = localStorage.getItem('speakcheck_student_name');
    const storedClass = localStorage.getItem('speakcheck_student_class');

    if (storedId && storedName) {
      setStudent({
        id: storedId,
        name: storedName,
        class: storedClass || 'Unknown',
        xp: 0,
        createdAt: new Date(),
        settings: {
          soundEnabled: true,
          feedbackMode: 'auto',
          difficulty: 'medium',
          language: 'en-US'
        }
      });
      setAppState('dashboard');
    } else {
      setAppState('login');
    }
  }, []);

  // Splash screen timer and initial session check
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      checkExistingSession();
    }, 2000);
    return () => clearTimeout(timer);
  }, [checkExistingSession]);

  // Handle login
  const handleLogin = useCallback((loggedInStudent: Student) => {
    setStudent(loggedInStudent);
    setAppState('dashboard');
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('speakcheck_student_id');
    localStorage.removeItem('speakcheck_student_name');
    localStorage.removeItem('speakcheck_student_class');
    setStudent(null);
    setAppState('login');
  }, []);

  // Handle game selection
  const handleSelectGame = useCallback((gameType: GameType, level: string) => {
    setSelectedGameType(gameType);
    setSelectedLevel(level);
    setAppState('playing');
  }, []);

  // Handle game completion
  const handleGameComplete = useCallback((session: GameSession) => {
    setGameSession(session);
    setAppState('results');
    
    // Update student XP
    if (student) {
      setStudent(prev => prev ? {
        ...prev,
        xp: prev.xp + session.xpEarned
      } : null);
    }
  }, [student]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (selectedGameType) {
      setAppState('playing');
      setGameSession(null);
    }
  }, [selectedGameType]);

  // Handle back to dashboard
  const handleDashboard = useCallback(() => {
    setAppState('dashboard');
    setSelectedGameType(null);
    setGameSession(null);
  }, []);

  // Render splash screen
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4A90E2] to-[#50C878]">
        <div className="animate-bounce mb-8">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <AliceAvatar mood="happy" size="lg" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Speak Check AI Lab</h1>
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // Render loading
  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#718096]">Loading...</p>
        </div>
      </div>
    );
  }

  // Render login
  if (appState === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Render dashboard
  if (appState === 'dashboard' && student) {
    return (
      <div className="min-h-screen bg-[#F0F0F3] p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Dashboard
            student={student}
            onSelectGame={handleSelectGame}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  // Render game (NoticingRoom has special handling)
  if (appState === 'playing' && selectedGameType) {
    return (
      <div className="min-h-screen bg-[#F0F0F3] p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {selectedGameType === 'Noticing' ? (
            <NoticingRoom
              level={selectedLevel}
              onGameComplete={handleGameComplete}
              onExit={handleDashboard}
            />
          ) : (
            <GameScreen
              gameType={selectedGameType}
              level={selectedLevel}
              onGameComplete={handleGameComplete}
              onExit={handleDashboard}
            />
          )}
        </div>
      </div>
    );
  }

  // Render results
  if (appState === 'results' && gameSession && selectedGameType) {
    return (
      <div className="min-h-screen bg-[#F0F0F3] p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Results
            session={gameSession}
            gameType={selectedGameType}
            onRetry={handleRetry}
            onDashboard={handleDashboard}
          />
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F3]">
      <p className="text-[#718096]">Something went wrong. Please refresh the page.</p>
    </div>
  );
}