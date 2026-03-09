/**
 * GameScreen - Main Game Component with Feedback Engine
 * 
 * Implements:
 * - Speech recognition integration
 * - Feedback Strategy Matrix (Recast, Metalinguistic Clue, Explicit Correction)
 * - Uptake Measurement
 * - Confidence threshold (0.85)
 * 
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSpeech, useTTS, useGame } from '@/hooks/speakcheck';
import { saveProgress, getMockGameContent, saveStudentLocal, getStudentLocal } from '@/lib/speakcheck/api';
import { CONFIDENCE_THRESHOLD, XP_VALUES } from '@/types/speakcheck';
import type { GameContent, GameType, FeedbackResult, AliceMood } from '@/types/speakcheck';
import { GameCard, GameButton, MicButton, XPBadge, ProgressBar } from './GameCard';
import { AliceAvatar, AliceMessage } from './AliceAvatar';

interface GameScreenProps {
  gameType: GameType;
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

export function GameScreen({ 
  gameType, 
  level, 
  onGameComplete,
  onExit 
}: GameScreenProps) {
  const speech = useSpeech();
  const tts = useTTS();
  const game = useGame();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aliceMood, setAliceMood] = useState<AliceMood>('neutral');
  const [aliceMessage, setAliceMessage] = useState('Welcome! Let\'s practice your English speaking skills.');
  const [showConfidence, setShowConfidence] = useState(false);
  const [questions, setQuestions] = useState<GameContent[]>([]);

  // Get student info
  const student = getStudentLocal();

  // Load content on mount
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // For demo, use mock data. In production, fetch from API
        const content = getMockGameContent(gameType, level);
        setQuestions(content);
        if (content.length > 0) {
          game.startGame(content);
          setAliceMessage(`Ready for ${gameType} practice? Read the prompt and speak!`);
          setAliceMood('encouraging');
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        setAliceMessage('Failed to load questions. Please try again.');
        setAliceMood('thinking');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [gameType, level]);

  // Handle speech result
  useEffect(() => {
    if (speech.transcript && speech.confidence > 0) {
      setShowConfidence(true);
      handleSpeechResult(speech.transcript, speech.confidence);
    }
  }, [speech.transcript, speech.confidence]);

  // Process speech result and provide feedback
  const handleSpeechResult = useCallback(async (transcript: string, confidence: number) => {
    if (!game.currentQuestion) return;

    const feedback = game.submitAnswer(transcript, confidence);
    
    // Update Alice's mood and message based on feedback
    if (feedback.isCorrect) {
      setAliceMood('success');
      setAliceMessage('🎉 Excellent! Perfect answer! Great job!');
      tts.speak('Excellent job! Perfect answer!');
    } else {
      setAliceMood('encouraging');
      setAliceMessage(feedback.message);
      tts.speak(feedback.message);
    }

    // Save progress
    if (student) {
      setIsSaving(true);
      try {
        await saveProgress({
          studentId: student.id,
          studentName: student.name,
          studentClass: student.class,
          gameType: gameType,
          promptId: game.currentQuestion.ID,
          rawSpeech: transcript,
          errorDetected: feedback.errors.join(', '),
          feedbackGiven: feedback.message,
          feedbackType: feedback.type,
          uptakeSuccess: feedback.isCorrect,
          score: feedback.score,
          confidenceLevel: confidence,
          attemptCount: game.session.attemptCount
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [game, gameType, student, tts]);

  // Handle mic button click
  const handleMicClick = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.resetTranscript();
      setShowConfidence(false);
      speech.startListening();
    }
  }, [speech]);

  // Handle next question
  const handleNext = useCallback(() => {
    if (game.session.currentQuestionIndex >= questions.length - 1) {
      // Game complete
      const correctAnswers = game.session.feedbackHistory.filter(f => f.isCorrect).length;
      onGameComplete({
        score: game.session.score,
        xpEarned: game.session.xpEarned,
        totalQuestions: questions.length,
        correctAnswers,
        feedbackHistory: game.session.feedbackHistory
      });
    } else {
      game.nextQuestion();
      setAliceMood('neutral');
      setAliceMessage('Great! Ready for the next question?');
      setShowConfidence(false);
      speech.resetTranscript();
    }
  }, [game, questions.length, onGameComplete, speech]);

  // Handle retry (for uptake measurement)
  const handleRetry = useCallback(() => {
    game.retryQuestion();
    setAliceMood('encouraging');
    setAliceMessage('Let\'s try again! You can do it!');
    setShowConfidence(false);
    speech.resetTranscript();
  }, [game, speech]);

  // Render loading state
  if (isLoading) {
    return (
      <GameCard className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#718096]">Loading questions...</p>
        </div>
      </GameCard>
    );
  }

  // Render no questions state
  if (questions.length === 0) {
    return (
      <GameCard className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#718096] mb-4">No questions available for this level.</p>
          <GameButton variant="primary" onClick={onExit}>
            Back to Dashboard
          </GameButton>
        </div>
      </GameCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">
            {gameType === 'Grammar' ? '📚 Grammar Lab' :
             gameType === 'Vocabulary' ? '📖 Vocab Builder' :
             gameType === 'Pronunciation' ? '🎤 Pronunciation Clinic' :
             '🔍 The Noticing Room'}
          </h2>
          <p className="text-sm text-[#718096]">
            Question {game.session.currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <XPBadge xp={game.session.xpEarned} showAnimation={game.phase === 'RESULT'} />
      </div>

      {/* Progress */}
      <ProgressBar 
        value={game.session.currentQuestionIndex} 
        max={questions.length} 
        showLabel={false}
      />

      {/* Main Game Area */}
      <GameCard className="min-h-[350px]">
        <div className="space-y-6">
          {/* Alice Message */}
          <AliceMessage message={aliceMessage} mood={aliceMood} />

          {/* Question Prompt */}
          {game.phase === 'PROMPT' && game.currentQuestion && (
            <div className="space-y-4">
              <div className={cn(
                'p-6 rounded-xl text-center',
                'bg-[#F0F0F3]',
                'shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]'
              )}>
                <p className="text-sm text-[#718096] mb-2">Read this aloud:</p>
                <p className="text-2xl font-semibold text-[#2D3748]">
                  {game.currentQuestion.Prompt_Text}
                </p>
              </div>

              {/* Target Keywords Hint */}
              <div className="text-center">
                <p className="text-xs text-[#718096]">
                  Keywords: {game.currentQuestion.Target_Keywords.split(',').slice(0, 3).join(', ')}
                  {game.currentQuestion.Target_Keywords.split(',').length > 3 && '...'}
                </p>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {game.phase === 'FEEDBACK' && game.feedback && (
            <div className="space-y-4">
              <div className={cn(
                'p-6 rounded-xl',
                'border-2',
                game.feedback.isCorrect 
                  ? 'border-[#50C878] bg-[#50C878]/10' 
                  : 'border-[#FFB347] bg-[#FFB347]/10'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold',
                    game.feedback.type === 'Recast' && 'bg-[#4A90E2] text-white',
                    game.feedback.type === 'MetalinguisticClue' && 'bg-[#9B59B6] text-white',
                    game.feedback.type === 'ExplicitCorrection' && 'bg-[#E74C3C] text-white',
                    game.feedback.type === 'ClarificationRequest' && 'bg-[#FFB347] text-white',
                    game.feedback.type === 'Elicitation' && 'bg-[#50C878] text-white'
                  )}>
                    {game.feedback.type}
                  </span>
                  <span className="text-sm text-[#718096]">
                    Score: {game.feedback.score}%
                  </span>
                </div>
                <p className="text-[#2D3748]">{game.feedback.message}</p>
              </div>

              {/* Transcript Display */}
              {speech.transcript && (
                <div className="p-4 rounded-xl bg-[#F0F0F3] shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]">
                  <p className="text-sm text-[#718096] mb-1">You said:</p>
                  <p className="text-[#2D3748] font-medium">"{speech.transcript}"</p>
                  {showConfidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={cn(
                        'px-2 py-1 rounded text-xs font-semibold',
                        speech.confidence >= CONFIDENCE_THRESHOLD.PASS 
                          ? 'bg-[#50C878] text-white'
                          : speech.confidence >= CONFIDENCE_THRESHOLD.ENCOURAGE
                          ? 'bg-[#FFB347] text-white'
                          : 'bg-[#E74C3C] text-white'
                      )}>
                        {Math.round(speech.confidence * 100)}% confidence
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Errors */}
              {game.feedback.errors.length > 0 && (
                <div className="p-4 rounded-xl bg-[#E74C3C]/10 border border-[#E74C3C]/20">
                  <p className="text-sm text-[#E74C3C]">
                    Missing: {game.feedback.errors.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Result Phase */}
          {game.phase === 'RESULT' && game.feedback?.isCorrect && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#50C878] mb-2">Correct!</h3>
              <p className="text-[#718096]">+{XP_VALUES.CORRECT_ANSWER} XP earned!</p>
            </div>
          )}

          {/* Mic Button */}
          {(game.phase === 'PROMPT' || game.phase === 'FEEDBACK') && !game.feedback?.isCorrect && (
            <div className="flex flex-col items-center gap-4 py-4">
              <MicButton 
                isListening={speech.isListening}
                onClick={handleMicClick}
                disabled={!speech.isSupported}
                size="lg"
              />
              <p className="text-sm text-[#718096]">
                {!speech.isSupported 
                  ? '⚠️ Speech recognition not supported. Use Chrome or Edge.'
                  : speech.isListening 
                  ? '🎤 Listening... Speak now!'
                  : 'Tap to speak'}
              </p>
              {speech.error && (
                <p className="text-sm text-[#E74C3C]">{speech.error}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {game.phase === 'FEEDBACK' && !game.feedback?.isCorrect && (
              <>
                <GameButton variant="default" onClick={handleRetry}>
                  Try Again
                </GameButton>
                <GameButton variant="primary" onClick={handleNext}>
                  Skip
                </GameButton>
              </>
            )}
            {game.phase === 'RESULT' && (
              <GameButton variant="success" onClick={handleNext}>
                {game.session.currentQuestionIndex >= questions.length - 1 
                  ? 'Finish' 
                  : 'Next Question'}
              </GameButton>
            )}
          </div>
        </div>
      </GameCard>

      {/* Exit Button */}
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

export default GameScreen;
