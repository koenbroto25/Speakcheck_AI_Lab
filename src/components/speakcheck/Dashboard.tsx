/**
 * Dashboard - Main Hub Component
 * 
 * Displays:
 * - Student profile and XP
 * - Game mode selection
 * - Daily challenges
 * - Leaderboard preview
 * 
 * @version 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { GameType, LeaderboardEntry, Student } from '@/types/speakcheck';
import { GAME_MODES } from '@/types/speakcheck';
import { getLeaderboard, getMockLeaderboard } from '@/lib/speakcheck/api';
import { GameCard, GameButton, ProgressBar, XPBadge } from './GameCard';
import { AliceAvatar } from './AliceAvatar';

interface DashboardProps {
  student: Student;
  onSelectGame: (gameType: GameType, level: string) => void;
  onLogout: () => void;
}

export function Dashboard({ student, onSelectGame, onLogout }: DashboardProps) {
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Use mock data for demo
        const data = getMockLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    if (xp >= 2000) return 3;
    if (xp >= 500) return 2;
    return 1;
  };

  const studentLevel = calculateLevel(student.xp);
  const nextLevelXP = studentLevel === 1 ? 500 : studentLevel === 2 ? 2000 : 10000;
  const prevLevelXP = studentLevel === 1 ? 0 : studentLevel === 2 ? 500 : 2000;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AliceAvatar mood="happy" size="md" />
          <div>
            <h1 className="text-2xl font-bold text-[#2D3748]">Hi, {student.name}! 👋</h1>
            <p className="text-[#718096]">Ready to practice your English?</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-[#718096] hover:text-[#E74C3C] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* XP Progress Card */}
      <GameCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#718096]">Total XP</p>
            <p className="text-3xl font-bold text-[#FFB347]">{student.xp}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#718096]">Level</p>
            <p className="text-3xl font-bold text-[#4A90E2]">{studentLevel}</p>
          </div>
        </div>
        <ProgressBar value={student.xp - prevLevelXP} max={nextLevelXP - prevLevelXP} />
        <p className="text-xs text-[#718096] mt-2 text-center">
          {nextLevelXP - student.xp} XP to Level {studentLevel + 1}
        </p>
      </GameCard>

      {/* Level Selection */}
      <GameCard padding="sm">
        <p className="text-sm text-[#718096] mb-3 text-center">Select Difficulty</p>
        <div className="flex gap-2 justify-center">
          {['1', '2', '3'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                'px-6 py-2 rounded-xl font-semibold transition-all duration-200',
                selectedLevel === level
                  ? 'bg-[#4A90E2] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]'
                  : 'bg-[#F0F0F3] text-[#2D3748] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff]'
              )}
            >
              {level === '1' ? 'Easy' : level === '2' ? 'Medium' : 'Hard'}
            </button>
          ))}
        </div>
      </GameCard>

      {/* Game Modes */}
      <div className="grid grid-cols-2 gap-4">
        {Object.values(GAME_MODES).map(mode => (
          <GameCard
            key={mode.id}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
            padding="md"
            onClick={() => onSelectGame(mode.id as GameType, selectedLevel)}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{mode.icon}</div>
              <h3 className="font-bold text-[#2D3748]">{mode.name}</h3>
              <p className="text-xs text-[#718096] mt-1">{mode.description}</p>
            </div>
          </GameCard>
        ))}
      </div>

      {/* Daily Challenge */}
      <GameCard variant="pressed">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🏆</div>
          <div className="flex-1">
            <h3 className="font-bold text-[#2D3748]">Daily Challenge</h3>
            <p className="text-sm text-[#718096]">Complete 3 exercises today!</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={cn(
                    'w-8 h-2 rounded-full',
                    i <= 1 ? 'bg-[#50C878]' : 'bg-[#E8E8EB]'
                  )}
                />
              ))}
            </div>
          </div>
          <XPBadge xp={150} />
        </div>
      </GameCard>

      {/* Leaderboard */}
      <GameCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#2D3748]">🏆 Leaderboard</h3>
          <span className="text-xs text-[#718096]">Top 5</span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-xl',
                  entry.id === student.id && 'bg-[#4A90E2]/10 border border-[#4A90E2]/20'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 && 'bg-[#FFD700] text-white',
                  index === 1 && 'bg-[#C0C0C0] text-white',
                  index === 2 && 'bg-[#CD7F32] text-white',
                  index > 2 && 'bg-[#E8E8EB] text-[#718096]'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-[#2D3748]">{entry.name}</p>
                  <p className="text-xs text-[#718096]">Class {entry.class}</p>
                </div>
                <span className="font-bold text-[#FFB347]">{entry.xp} XP</span>
              </div>
            ))}
          </div>
        )}
      </GameCard>

      {/* Tips from A.L.I.C.E. */}
      <GameCard variant="pressed">
        <div className="flex items-start gap-4">
          <AliceAvatar mood="encouraging" size="sm" />
          <div>
            <p className="font-semibold text-[#2D3748]">💡 Tip from A.L.I.C.E.</p>
            <p className="text-sm text-[#718096] mt-1">
              Practice speaking in a quiet environment for better voice recognition!
            </p>
          </div>
        </div>
      </GameCard>
    </div>
  );
}

export default Dashboard;
