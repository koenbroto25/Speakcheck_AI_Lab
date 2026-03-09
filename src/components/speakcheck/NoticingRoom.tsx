/**
 * NoticingRoom - Special Mode for Noticing Hypothesis
 * 
 * Implements Schmidt's Noticing Hypothesis:
 * - Students identify errors in simulated AI speech
 * - Interactive word tapping to select errors
 * - Follow-up questions to test understanding
 * 
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/speakcheck';
import { saveProgress, getMockGameContent, getStudentLocal } from '@/lib/speakcheck/api';
import type { GameContent, AliceMood, FeedbackResult } from '@/types/speakcheck';
import { GameCard, GameButton, XPBadge } from './GameCard';
import { AliceAvatar, AliceMessage } from './AliceAvatar';

interface NoticingRoomProps {
  level: string;
  onGameComplete: (session: {
    score: number;
    xpEarned: number;
    totalQuestions: number;
    correctAnswers: number;
    feedbackHistory: FeedbackResult[];
  }) => void;
  onExit: () => void;
}

interface WordToken {
  word: string;
  index: number;
  isError: boolean;
  isSelected: boolean;
}

type Phase = 'intro' | 'listening' | 'selecting' | 'question' | 'feedback' | 'result';

export function NoticingRoom({ 
  level, 
  onGameComplete,
  onExit 
}: NoticingRoomProps) {
  const tts = useTTS();
  const [questions, setQuestions] = useState<GameContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [wordTokens, setWordTokens] = useState<WordToken[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [aliceMood, setAliceMood] = useState<AliceMood>('neutral');
  const [aliceMessage, setAliceMessage] = useState('Welcome to The Noticing Room! Listen carefully and find the error.');
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const student = getStudentLocal();
  const currentQuestion = questions[currentIndex];

  // Load content
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const content = getMockGameContent('Noticing', level);
        setQuestions(content);
        if (content.length > 0) {
          initializeQuestion(content[0]);
        }
      } catch (error) {
        console.error('Failed to load Noticing content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [level]);

  // Initialize a question with word tokens
  const initializeQuestion = (question: GameContent) => {
    const words = question.Prompt_Text.split(' ');
    const errorWord = question.Correct_Audio_URL || ''; // The word with error
    
    const tokens: WordToken[] = words.map((word, index) => ({
      word: word.replace(/[.,!?]/g, ''),
      index,
      isError: word.toLowerCase().includes(errorWord.toLowerCase()),
      isSelected: false
    }));

    setWordTokens(tokens);
    setSelectedWord(null);
    setPhase('intro');
    setShowHint(false);
    setAttemptCount(0);
    setAliceMessage('Listen to the sentence carefully. Can you spot the error?');
    setAliceMood('thinking');
  };

  // Handle word tap
  const handleWordTap = (index: number) => {
    if (phase !== 'selecting') return;

    const newTokens = wordTokens.map((token, i) => ({
      ...token,
      isSelected: i === index ? !token.isSelected : false
    }));
    setWordTokens(newTokens);

    const selected = newTokens.find(t => t.isSelected);
    setSelectedWord(selected?.word || null);
  };

  // Start listening to the sentence
  const handleStartListening = useCallback(() => {
    if (!currentQuestion) return;

    setPhase('listening');
    setAliceMood('neutral');
    setAliceMessage('Listen carefully...');

    // Speak the sentence with the error
    tts.speak(currentQuestion.Prompt_Text).then(() => {
      setPhase('selecting');
      setAliceMood('encouraging');
      setAliceMessage('Now tap on the word that sounds wrong!');
    });
  }, [currentQuestion, tts]);

  // Submit answer
  const handleSubmit = useCallback(() => {
    if (!selectedWord || !currentQuestion) return;

    const errorWord = currentQuestion.Correct_Audio_URL?.toLowerCase() || '';
    const isCorrect = selectedWord.toLowerCase() === errorWord;

    if (isCorrect) {
      setPhase('question');
      setAliceMood('success');
      setAliceMessage('🎉 Correct! You found the error!');
    } else {
      // Handle incorrect selection
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (newAttemptCount >= 2) {
        setShowHint(true);
        setAliceMood('encouraging');
        setAliceMessage(`Hint: Look at the verb. The sentence talks about the past.`);
      } else {
        setAliceMood('encouraging');
        setAliceMessage('Not quite. Listen again and try once more!');
        
        // Re-enable listening
        setTimeout(() => {
          setPhase('intro');
        }, 2000);
      }
    }
  }, [selectedWord, currentQuestion, attemptCount]);

  // Handle follow-up question answer
  const handleFollowUpAnswer = useCallback((answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === 'correct';
    const pointsEarned = isCorrect ? 100 : 50;
    const xpEarnedThis = isCorrect ? 100 : 25;

    setScore(prev => prev + pointsEarned);
    setXpEarned(prev => prev + xpEarnedThis);
    if (isCorrect) setCorrectAnswers(prev => prev + 1);

    setPhase('feedback');
    setAliceMood(isCorrect ? 'success' : 'encouraging');
    setAliceMessage(isCorrect 
      ? 'Perfect understanding! You really noticed the grammar rule!' 
      : `Good effort! The error was "${currentQuestion.Correct_Audio_URL}" should be "${currentQuestion.Target_Keywords}".`);

    // Save progress
    if (student) {
      saveProgress({
        studentId: student.id,
        studentName: student.name,
        studentClass: student.class,
        gameType: 'Noticing',
        promptId: currentQuestion.ID,
        rawSpeech: selectedWord || '',
        errorDetected: currentQuestion.Correct_Audio_URL || '',
        feedbackGiven: aliceMessage,
        feedbackType: isCorrect ? 'None' : 'ExplicitCorrection',
        uptakeSuccess: isCorrect,
        score: pointsEarned,
        confidenceLevel: 1,
        attemptCount: attemptCount + 1
      });
    }
  }, [currentQuestion, student, selectedWord, aliceMessage, attemptCount]);

  // Next question
  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      // Game complete
      onGameComplete({
        score,
        xpEarned,
        totalQuestions: questions.length,
        correctAnswers,
        feedbackHistory: [] // Noticing room doesn't use standard feedback history yet
      });
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      initializeQuestion(questions[nextIndex]);
    }
  }, [currentIndex, questions, score, xpEarned, correctAnswers, onGameComplete]);

  // Render loading
  if (isLoading) {
    return (
      <GameCard className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFB347] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#718096]">Loading Noticing Room...</p>
        </div>
      </GameCard>
    );
  }

  // Render no questions
  if (questions.length === 0) {
    return (
      <GameCard className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#718096] mb-4">No noticing exercises available.</p>
          <GameButton variant="primary" onClick={onExit}>Back to Dashboard</GameButton>
        </div>
      </GameCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">🔍 The Noticing Room</h2>
          <p className="text-sm text-[#718096]">
            Exercise {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <XPBadge xp={xpEarned} />
      </div>

      {/* Main Content */}
      <GameCard className="min-h-[400px]">
        <div className="space-y-6">
          {/* Alice Message */}
          <AliceMessage message={aliceMessage} mood={aliceMood} />

          {/* Intro Phase */}
          {phase === 'intro' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👂</div>
              <p className="text-[#718096] mb-6">
                Listen to the AI speak. Can you find the mistake?
              </p>
              <GameButton variant="primary" onClick={handleStartListening}>
                🔊 Listen to Sentence
              </GameButton>
            </div>
          )}

          {/* Listening Phase */}
          {phase === 'listening' && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <AliceAvatar mood="neutral" size="lg" isSpeaking />
              </div>
              <p className="text-[#718096]">Speaking...</p>
            </div>
          )}

          {/* Selecting Phase */}
          {phase === 'selecting' && (
            <div className="space-y-6">
              <p className="text-center text-sm text-[#718096]">Tap the word that is wrong:</p>
              
              {/* Word Tokens */}
              <div className="flex flex-wrap justify-center gap-2 p-6 rounded-xl bg-[#F0F0F3] shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]">
                {wordTokens.map((token, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordTap(index)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200',
                      'hover:scale-105',
                      token.isSelected 
                        ? 'bg-[#FFB347] text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2)]'
                        : 'bg-white text-[#2D3748] shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff]'
                    )}
                  >
                    {token.word}
                  </button>
                ))}
              </div>

              {/* Hint */}
              {showHint && (
                <div className="p-4 rounded-xl bg-[#FFB347]/10 border border-[#FFB347]/20 text-center">
                  <p className="text-[#FFB347]">
                    💡 Hint: Look for a verb that doesn't match the time reference!
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <GameButton 
                  variant="default" 
                  onClick={handleStartListening}
                >
                  🔊 Listen Again
                </GameButton>
                <GameButton 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={!selectedWord}
                >
                  Submit Answer
                </GameButton>
              </div>
            </div>
          )}

          {/* Question Phase */}
          {phase === 'question' && currentQuestion && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[#2D3748] mb-4">Great! Now answer this:</p>
                <div className={cn(
                  'p-6 rounded-xl',
                  'bg-[#F0F0F3]',
                  'shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]'
                )}>
                  <p className="text-lg text-[#2D3748]">
                    Why is "{currentQuestion.Correct_Audio_URL}" wrong in this sentence?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                <GameButton 
                  variant="default"
                  onClick={() => handleFollowUpAnswer('correct')}
                  className="text-left"
                >
                  A. Wrong verb tense
                </GameButton>
                <GameButton 
                  variant="default"
                  onClick={() => handleFollowUpAnswer('wrong')}
                  className="text-left"
                >
                  B. Wrong spelling
                </GameButton>
                <GameButton 
                  variant="default"
                  onClick={() => handleFollowUpAnswer('wrong')}
                  className="text-left"
                >
                  C. Wrong word order
                </GameButton>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === 'feedback' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-[#2D3748]">
                  {currentQuestion && (
                    <>
                      Correct form: <span className="font-bold text-[#50C878]">{currentQuestion.Target_Keywords}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-center">
                <GameButton variant="success" onClick={handleNext}>
                  {currentIndex >= questions.length - 1 ? 'Finish' : 'Next Exercise'}
                </GameButton>
              </div>
            </div>
          )}
        </div>
      </GameCard>

      {/* Exit */}
      <div className="text-center">
        <button 
          onClick={onExit}
          className="text-[#718096] hover:text-[#4A90E2] transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NoticingRoom;