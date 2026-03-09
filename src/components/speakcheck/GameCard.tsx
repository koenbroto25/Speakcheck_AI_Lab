/**
 * GameCard - Neumorphic Card Component
 * 
 * Reusable card component with Soft UI (Neumorphism) styling
 * 
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  children: React.ReactNode;
  variant?: 'raised' | 'pressed' | 'flat';
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  raised: 'shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff]',
  pressed: 'shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]',
  flat: 'shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff]'
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8'
};

export function GameCard({ 
  children, 
  variant = 'raised',
  padding = 'md',
  className,
  onClick 
}: GameCardProps) {
  return (
    <div 
      className={cn(
        'bg-[#F0F0F3] rounded-2xl',
        variantStyles[variant],
        paddingStyles[padding],
        onClick && 'cursor-pointer hover:scale-[1.02] transition-transform duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Game Button Component
interface GameButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const buttonVariants = {
  default: 'bg-[#F0F0F3] text-[#2D3748] shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]',
  primary: 'bg-[#4A90E2] text-white shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] hover:bg-[#3A7BC8] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]',
  success: 'bg-[#50C878] text-white shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] hover:bg-[#3DA55E] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]',
  warning: 'bg-[#FFB347] text-[#333333] shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] hover:bg-[#E69A2E]'
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl'
};

export function GameButton({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  disabled = false,
  isLoading = false
}: GameButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 focus:ring-offset-[#F0F0F3]',
        buttonVariants[variant],
        buttonSizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'cursor-wait',
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Game Input Component
interface GameInputProps {
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function GameInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled = false
}: GameInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-3',
        'bg-[#F0F0F3] rounded-xl',
        'text-[#2D3748] placeholder-[#718096]',
        'shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]',
        'focus:outline-none focus:ring-2 focus:ring-[#4A90E2]',
        'transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    />
  );
}

// XP Badge Component
interface XPBadgeProps {
  xp: number;
  showAnimation?: boolean;
  className?: string;
}

export function XPBadge({ xp, showAnimation = false, className }: XPBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-4 py-2',
      'bg-[#F0F0F3] rounded-full',
      'shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff]',
      showAnimation && 'animate-bounce',
      className
    )}>
      <span className="text-xl">⭐</span>
      <span className="font-bold text-[#FFB347]">{xp} XP</span>
    </div>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  showLabel = true,
  className 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'h-4 rounded-full overflow-hidden',
        'bg-[#F0F0F3]',
        'shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]'
      )}>
        <div 
          className="h-full bg-gradient-to-r from-[#4A90E2] to-[#50C878] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-[#718096]">
          <span>{value} XP</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

// Mic Button Component
interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

export function MicButton({ 
  isListening, 
  onClick, 
  disabled = false,
  size = 'lg',
  className 
}: MicButtonProps) {
  const sizeClasses = {
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center',
        'rounded-full transition-all duration-300',
        sizeClasses[size],
        isListening 
          ? 'bg-[#E74C3C] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]'
          : 'bg-[#4A90E2] shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] hover:bg-[#3A7BC8]',
        isListening && 'animate-pulse',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <svg 
        className={cn(
          'text-white',
          size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
        )}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V19h4v2H8v-2h4v-3.07z"/>
      </svg>
    </button>
  );
}

export default GameCard;
