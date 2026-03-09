/**
 * AliceAvatar - A.L.I.C.E. AI Coach Character Component
 * 
 * Displays an animated AI avatar with mood-based expressions
 * 
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AliceMood } from '@/types/speakcheck';

interface AliceAvatarProps {
  mood?: AliceMood;
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  className?: string;
}

const moodStyles: Record<AliceMood, { eyes: string; mouth: string; animation: string }> = {
  happy: {
    eyes: '＾ ▽ ＾',
    mouth: '‿',
    animation: 'animate-bounce'
  },
  thinking: {
    eyes: '-  _  -',
    mouth: '―',
    animation: 'animate-pulse'
  },
  encouraging: {
    eyes: '◕ ◡ ◕',
    mouth: '◡',
    animation: ''
  },
  neutral: {
    eyes: '•  •',
    mouth: '―',
    animation: ''
  },
  success: {
    eyes: '★ ★',
    mouth: '▽',
    animation: 'animate-bounce'
  }
};

const sizeStyles = {
  sm: { container: 'w-16 h-16', face: 'text-sm' },
  md: { container: 'w-24 h-24', face: 'text-base' },
  lg: { container: 'w-32 h-32', face: 'text-lg' }
};

export function AliceAvatar({ 
  mood = 'neutral', 
  size = 'md',
  isSpeaking = false,
  className 
}: AliceAvatarProps) {
  const currentMood = moodStyles[mood];
  const currentSize = sizeStyles[size];

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        currentSize.container,
        'rounded-full',
        'bg-gradient-to-br from-[#6BA3E8] to-[#4A90E2]',
        'shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff]',
        currentMood.animation,
        isSpeaking && 'animate-pulse',
        className
      )}
    >
      {/* Face Container */}
      <div className={cn(
        'flex flex-col items-center justify-center',
        'bg-[#F0F0F3]',
        'rounded-full',
        'w-[85%] h-[85%]',
        'shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]'
      )}>
        {/* Eyes */}
        <div className={cn(
          'font-bold text-[#4A90E2]',
          currentSize.face,
          'tracking-widest'
        )}>
          {currentMood.eyes}
        </div>
        
        {/* Mouth */}
        <div className={cn(
          'text-[#50C878]',
          currentSize.face,
          'text-2xl'
        )}>
          {currentMood.mouth}
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {/* Glow Effect for Success */}
      {mood === 'success' && (
        <div className="absolute inset-0 rounded-full bg-[#50C878] opacity-30 animate-ping" />
      )}
    </div>
  );
}

// Alice Message Component
interface AliceMessageProps {
  message: string;
  mood?: AliceMood;
  isTyping?: boolean;
  className?: string;
}

export function AliceMessage({ 
  message, 
  mood = 'neutral',
  isTyping = false,
  className 
}: AliceMessageProps) {
  return (
    <div className={cn(
      'flex items-start gap-4',
      className
    )}>
      <AliceAvatar mood={mood} size="sm" />
      
      <div className={cn(
        'flex-1 p-4 rounded-2xl',
        'bg-[#F0F0F3]',
        'shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff]',
        'text-[#2D3748]'
      )}>
        {isTyping ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}

export default AliceAvatar;