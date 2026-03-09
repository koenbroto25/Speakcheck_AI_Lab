/**
 * Results - Performance Summary Component
 * 
 * Displays game completion results:
 * - Score breakdown
 * - XP earned
 * - Noticing Report
 * - Feedback summary
 * 
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { FeedbackResult, GameType } from '@/types/speakcheck';
import { GAME_MODES } from '@/types/speakcheck';
import { GameCard, GameButton, XPBadge, ProgressBar } from './GameCard';
import { AliceAvatar, AliceMessage } from './AliceAvatar';

interface ResultsProps {
  session: {
    score: number;
    xpEarned: number;
    totalQuestions: number;
    correctAnswers: number;
    feedbackHistory: FeedbackResult[];
  };
  gameType: GameType;
  onRetry: () => void;
  onDashboard: () => void;
}

export function Results({ 
  session, 
  gameType,
  onRetry,
  onDashboard 
}: ResultsProps) {
  const accuracy = session.totalQuestions > 0 
    ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
    : 0;

  const grade = accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 70 ? 'C' : accuracy >= 60 ? 'D' : 'F';
  const gradeColor = accuracy >= 80 ? '#50C878' : accuracy >= 60 ? '#FFB347' : '#E74C3C';

  const modeInfo = Object.values(GAME_MODES).find(m => m.id === gameType);

  // Count feedback types
  const feedbackCounts = session.feedbackHistory.reduce((acc, fb) => {
    acc[fb.type] = (acc[fb.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-block animate-bounce">
          <AliceAvatar mood="success" size="lg" />
        </div>
        <h1 
          className="text-3xl font-bold mt-4 animate-[fadeIn_0.5s_ease-out]"
          style={{ color: gradeColor }}
        >
          {accuracy >= 80 ? '🎉 Excellent!' : accuracy >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
        </h1>
      </div>

      {/* Score Card */}
      <GameCard className="animate-[fadeIn_0.5s_ease-out_0.2s_both]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-[#718096]">Score</p>
            <p className="text-3xl font-bold text-[#2D3748]">{session.score}</p>
          </div>
          <div>
            <p className="text-sm text-[#718096]">Accuracy</p>
            <p className="text-3xl font-bold" style={{ color: gradeColor }}>{accuracy}%</p>
          </div>
          <div>
            <p className="text-sm text-[#718096]">Grade</p>
            <p className="text-3xl font-bold" style={{ color: gradeColor }}>{grade}</p>
          </div>
        </div>
      </GameCard>

      {/* XP Earned */}
      <GameCard 
        variant="pressed"
        className="animate-[fadeIn_0.5s_ease-out_0.3s_both]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⭐</div>
            <div>
              <p className="font-bold text-[#2D3748]">XP Earned</p>
              <p className="text-sm text-[#718096]">Keep practicing to level up!</p>
            </div>
          </div>
          <XPBadge xp={session.xpEarned} showAnimation />
        </div>
      </GameCard>

      {/* Performance Summary */}
      <GameCard className="animate-[fadeIn_0.5s_ease-out_0.4s_both]">
        <h3 className="font-bold text-[#2D3748] mb-4">📊 Performance Summary</h3>
        
        <div className="space-y-4">
          {/* Questions */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#718096]">Questions Completed</span>
              <span className="font-medium text-[#2D3748]">{session.totalQuestions}</span>
            </div>
            <ProgressBar 
              value={session.totalQuestions} 
              max={session.totalQuestions} 
              showLabel={false} 
            />
          </div>

          {/* Correct Answers */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#718096]">Correct Answers</span>
              <span className="font-medium text-[#50C878]">{session.correctAnswers}/{session.totalQuestions}</span>
            </div>
            <ProgressBar 
              value={session.correctAnswers} 
              max={session.totalQuestions} 
              showLabel={false} 
            />
          </div>
        </div>
      </GameCard>

      {/* Noticing Report */}
      {session.feedbackHistory.length > 0 && (
        <GameCard className="animate-[fadeIn_0.5s_ease-out_0.5s_both]">
          <h3 className="font-bold text-[#2D3748] mb-4">🔍 Noticing Report</h3>
          
          <div className="space-y-2">
            {Object.entries(feedbackCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  type === 'None' && 'bg-[#50C878]/10 text-[#50C878]',
                  type === 'Recast' && 'bg-[#4A90E2]/10 text-[#4A90E2]',
                  type === 'MetalinguisticClue' && 'bg-[#9B59B6]/10 text-[#9B59B6]',
                  type === 'ExplicitCorrection' && 'bg-[#E74C3C]/10 text-[#E74C3C]',
                  type === 'ClarificationRequest' && 'bg-[#FFB347]/10 text-[#FFB347]',
                  type === 'Elicitation' && 'bg-[#50C878]/10 text-[#50C878]'
                )}>
                  {type === 'None' ? '✓ Correct' : type}
                </span>
                <span className="font-medium text-[#2D3748]">{count}x</span>
              </div>
            ))}
          </div>
        </GameCard>
      )}

      {/* Tips from A.L.I.C.E. */}
      <AliceMessage 
        message={accuracy >= 80 
          ? "Amazing work! You're making great progress with your English speaking. Keep up the excellent practice!"
          : accuracy >= 60
          ? "Good effort! Focus on the areas where you struggled. Practice makes perfect!"
          : "Don't give up! Every mistake is a learning opportunity. Try again and you'll improve!"
        }
        mood={accuracy >= 80 ? 'success' : accuracy >= 60 ? 'encouraging' : 'encouraging'}
        className="animate-[fadeIn_0.5s_ease-out_0.6s_both]"
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.5s_ease-out_0.7s_both]">
        <GameButton variant="default" onClick={onDashboard}>
          🏠 Dashboard
        </GameButton>
        <GameButton variant="primary" onClick={onRetry}>
          🔄 Try Again
        </GameButton>
      </div>

      {/* Share */}
      <div className="text-center animate-[fadeIn_0.5s_ease-out_0.8s_both]">
        <p className="text-sm text-[#718096] mb-2">Share your achievement!</p>
        <div className="flex justify-center gap-4">
          <button className="p-3 rounded-full bg-[#F0F0F3] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all">
            📱
          </button>
          <button className="p-3 rounded-full bg-[#F0F0F3] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all">
            📧
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
