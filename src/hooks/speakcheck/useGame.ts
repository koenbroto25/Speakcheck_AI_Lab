/**
 * useGame - Custom Hook untuk Game Logic dan Feedback Engine
 * 
 * Mengimplementasikan:
 * - Feedback Strategy Matrix
 * - Uptake Measurement
 * - Grading dengan threshold 0.85
 * 
 * @version 1.0.0
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { 
  GameContent, 
  GameSession, 
  GamePhase,
  FeedbackResult,
  FeedbackType,
  SaveProgressData,
  GameType
} from '@/types/speakcheck';
import { CONFIDENCE_THRESHOLD, XP_VALUES, FEEDBACK_STRATEGY_MATRIX } from '@/types/speakcheck';

interface UseGameReturn {
  session: GameSession;
  phase: GamePhase;
  currentQuestion: GameContent | null;
  feedback: FeedbackResult | null;
  startGame: (questions: GameContent[]) => void;
  submitAnswer: (transcript: string, confidence: number) => FeedbackResult;
  nextQuestion: () => void;
  retryQuestion: () => void;
  endGame: () => GameSession;
  calculateScore: (transcript: string, targetKeywords: string) => { score: number; errors: string[]; matchedKeywords: string[] };
  determineFeedback: (attemptCount: number, errors: string[], confidence: number, gameType: GameType) => FeedbackResult;
}

export function useGame(): UseGameReturn {
  const [session, setSession] = useState<GameSession>({
    currentQuestionIndex: 0,
    totalQuestions: 0,
    score: 0,
    xpEarned: 0,
    attemptCount: 0,
    startTime: new Date(),
    errors: [],
    feedbackHistory: []
  });

  const [phase, setPhase] = useState<GamePhase>('PROMPT');
  const [currentQuestion, setCurrentQuestion] = useState<GameContent | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [questions, setQuestions] = useState<GameContent[]>([]);
  
  const previousErrorsRef = useRef<string[]>([]);

  /**
   * Calculate score based on keyword matching
   */
  const calculateScore = useCallback((
    transcript: string, 
    targetKeywords: string
  ): { score: number; errors: string[]; matchedKeywords: string[] } => {
    if (!targetKeywords || !transcript) {
      return { score: 0, errors: [], matchedKeywords: [] };
    }

    const keywords = targetKeywords.split(',').map(k => k.trim().toLowerCase());
    const lowerTranscript = transcript.toLowerCase();
    
    const matchedKeywords: string[] = [];
    const errors: string[] = [];

    keywords.forEach(keyword => {
      if (keyword && lowerTranscript.includes(keyword)) {
        matchedKeywords.push(keyword);
      } else if (keyword) {
        errors.push(keyword);
      }
    });

    // Calculate score percentage
    const score = keywords.length > 0 
      ? Math.round((matchedKeywords.length / keywords.length) * 100)
      : 0;

    return { score, errors, matchedKeywords };
  }, []);

  /**
   * Determine feedback based on Feedback Strategy Matrix
   */
  const determineFeedback = useCallback((
    attemptCount: number,
    errors: string[],
    confidence: number,
    gameType: GameType
  ): FeedbackResult => {
    const isCorrect = errors.length === 0 && confidence >= CONFIDENCE_THRESHOLD.PASS;
    const isRepeatedError = errors.some(e => previousErrorsRef.current.includes(e));
    
    let feedbackType: FeedbackType;
    let message: string;
    let score: number;

    if (isCorrect) {
      return {
        type: 'None',
        message: 'Excellent job! Perfect pronunciation and grammar!',
        errors: [],
        isCorrect: true,
        score: 100
      };
    }

    // Check confidence level first
    if (confidence < CONFIDENCE_THRESHOLD.FAIL) {
      // Very low confidence - Explicit Correction
      feedbackType = 'ExplicitCorrection';
      message = `Let me help you. The correct answer includes: ${errors.join(', ')}. Listen carefully and try again.`;
      score = 20;
    } else if (confidence < CONFIDENCE_THRESHOLD.ENCOURAGE) {
      // Low confidence - need explicit help
      feedbackType = 'MetalinguisticClue';
      message = `I noticed some difficulties. Think about the words: ${errors.join(', ')}. What might be missing?`;
      score = 40;
    } else if (attemptCount === 0) {
      // First attempt with errors - use Recast (implicit)
      feedbackType = 'Recast';
      message = `I heard: "${errors.length > 0 ? 'something close' : 'that'}. Let me repeat the correct way.`;
      score = 60;
    } else if (isRepeatedError || attemptCount >= 2) {
      // Repeated error or multiple attempts - Explicit Correction
      feedbackType = 'ExplicitCorrection';
      message = `The correct answer uses: ${errors.join(', ')}. Try saying: "${errors.join(' ')}"`;
      score = 30;
    } else if (attemptCount === 1) {
      // Second attempt - Metalinguistic Clue
      feedbackType = 'MetalinguisticClue';
      message = `Check your words carefully. You might have missed: ${errors.join(', ')}. Think about the grammar rules.`;
      score = 50;
    } else {
      // Default - Clarification Request
      feedbackType = 'ClarificationRequest';
      message = `I'm not sure I understood correctly. Could you try again with different words?`;
      score = 40;
    }

    // Adjust message based on game type
    if (gameType === 'Pronunciation') {
      message = `Focus on pronunciation. ${errors.length > 0 ? `Pay attention to: ${errors.join(', ')}.` : ''} Try again slowly.`;
      if (attemptCount >= 2) {
        feedbackType = 'ExplicitCorrection';
      }
    } else if (gameType === 'Grammar') {
      message = `Let's check the grammar. ${errors.length > 0 ? `Look at: ${errors.join(', ')}.` : ''} What form should it be?`;
    } else if (gameType === 'Vocabulary') {
      if (attemptCount >= 1) {
        feedbackType = 'Elicitation';
        const hint = errors[0] ? `${errors[0][0]}${'_'.repeat(errors[0].length - 2)}${errors[0][errors[0].length - 1]}` : '';
        message = `Try to recall the word. Hint: ${hint}`;
      }
    }

    return {
      type: feedbackType,
      message,
      errors,
      isCorrect: false,
      score
    };
  }, []);

  /**
   * Start a new game session
   */
  const startGame = useCallback((gameQuestions: GameContent[]) => {
    if (gameQuestions.length === 0) return;

    setQuestions(gameQuestions);
    setCurrentQuestion(gameQuestions[0]);
    setPhase('PROMPT');
    setFeedback(null);
    previousErrorsRef.current = [];
    setSession({
      currentQuestionIndex: 0,
      totalQuestions: gameQuestions.length,
      score: 0,
      xpEarned: 0,
      attemptCount: 0,
      startTime: new Date(),
      errors: [],
      feedbackHistory: []
    });
  }, []);

  /**
   * Submit an answer and get feedback
   */
  const submitAnswer = useCallback((
    transcript: string, 
    confidence: number
  ): FeedbackResult => {
    if (!currentQuestion) {
      return {
        type: 'None',
        message: 'No question loaded',
        errors: [],
        isCorrect: false,
        score: 0
      };
    }

    const result = calculateScore(transcript, currentQuestion.Target_Keywords);
    const feedbackResult = determineFeedback(
      session.attemptCount,
      result.errors,
      confidence,
      currentQuestion.Game_Type
    );

    // Update previous errors for tracking
    if (result.errors.length > 0) {
      previousErrorsRef.current = [...new Set([...previousErrorsRef.current, ...result.errors])];
    }

    setFeedback(feedbackResult);
    setPhase(feedbackResult.isCorrect ? 'RESULT' : 'FEEDBACK');

    // Update session
    setSession(prev => {
      const newXP = feedbackResult.isCorrect 
        ? XP_VALUES.CORRECT_ANSWER 
        : Math.round(feedbackResult.score * 0.5);

      return {
        ...prev,
        score: prev.score + feedbackResult.score,
        xpEarned: prev.xpEarned + newXP,
        attemptCount: prev.attemptCount + 1,
        errors: [...prev.errors, ...result.errors],
        feedbackHistory: [...prev.feedbackHistory, feedbackResult]
      };
    });

    return feedbackResult;
  }, [currentQuestion, session.attemptCount, calculateScore, determineFeedback]);

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    setSession(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= questions.length) {
        setPhase('RESULT');
        return prev;
      }

      setCurrentQuestion(questions[nextIndex]);
      setPhase('PROMPT');
      setFeedback(null);
      previousErrorsRef.current = [];

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        attemptCount: 0
      };
    });
  }, [questions]);

  /**
   * Retry current question (for uptake measurement)
   */
  const retryQuestion = useCallback(() => {
    setPhase('PROMPT');
    setFeedback(null);
    setSession(prev => ({
      ...prev,
      attemptCount: prev.attemptCount
    }));
  }, []);

  /**
   * End game session
   */
  const endGame = useCallback((): GameSession => {
    setPhase('RESULT');
    return session;
  }, [session]);

  return {
    session,
    phase,
    currentQuestion,
    feedback,
    startGame,
    submitAnswer,
    nextQuestion,
    retryQuestion,
    endGame,
    calculateScore,
    determineFeedback
  };
}

export default useGame;
