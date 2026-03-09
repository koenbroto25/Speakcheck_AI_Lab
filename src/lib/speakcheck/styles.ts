/**
 * SpeakCheck Neumorphism Styles
 * 
 * Soft UI (Neumorphism) design tokens dan utilities
 * untuk Tailwind CSS
 * 
 * Color Palette:
 * - Primary (#4A90E2): Trust, technology, calm focus
 * - Success (#50C878): Correct answers, positive reinforcement
 * - Accent (#FFB347): Warning, needs improvement
 * - Background (#F0F0F3): Easy on the eyes
 * 
 * @version 1.0.0
 */

// Color Palette
export const COLORS = {
  primary: {
    DEFAULT: '#4A90E2',
    light: '#6BA3E8',
    dark: '#3A7BC8',
    contrast: '#FFFFFF'
  },
  success: {
    DEFAULT: '#50C878',
    light: '#7DD99E',
    dark: '#3DA55E',
    contrast: '#FFFFFF'
  },
  warning: {
    DEFAULT: '#FFB347',
    light: '#FFC670',
    dark: '#E69A2E',
    contrast: '#333333'
  },
  error: {
    DEFAULT: '#E74C3C',
    light: '#EC7063',
    dark: '#C0392B',
    contrast: '#FFFFFF'
  },
  background: {
    DEFAULT: '#F0F0F3',
    light: '#F8F8FA',
    dark: '#E8E8EB'
  },
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    muted: '#718096',
    light: '#A0AEC0'
  }
} as const;

// Shadow definitions for Neumorphism
export const SHADOWS = {
  // Raised element (convex)
  raised: {
    light: '-6px -6px 14px rgba(255, 255, 255, 0.8)',
    dark: '6px 6px 14px rgba(163, 177, 198, 0.5)'
  },
  // Pressed element (concave)
  pressed: {
    light: 'inset -4px -4px 10px rgba(255, 255, 255, 0.8)',
    dark: 'inset 4px 4px 10px rgba(163, 177, 198, 0.5)'
  },
  // Flat element
  flat: {
    light: '-2px -2px 6px rgba(255, 255, 255, 0.7)',
    dark: '2px 2px 6px rgba(163, 177, 198, 0.4)'
  },
  // Deep pressed
  deep: {
    light: 'inset -6px -6px 14px rgba(255, 255, 255, 0.8)',
    dark: 'inset 6px 6px 14px rgba(163, 177, 198, 0.5)'
  }
} as const;

// Tailwind class generators
export const neumorphicClasses = {
  // Card/Container styles
  card: `
    bg-[#F0F0F3]
    rounded-2xl
    shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff]
  `,
  
  // Pressed/Input styles
  pressed: `
    bg-[#F0F0F3]
    rounded-xl
    shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]
  `,
  
  // Button styles
  button: `
    bg-[#F0F0F3]
    rounded-xl
    shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff]
    hover:shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff]
    active:shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]
    transition-all
    duration-200
  `,
  
  // Primary button
  buttonPrimary: `
    bg-[#4A90E2]
    text-white
    rounded-xl
    shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff]
    hover:bg-[#3A7BC8]
    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
    transition-all
    duration-200
  `,
  
  // Success button
  buttonSuccess: `
    bg-[#50C878]
    text-white
    rounded-xl
    shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff]
    hover:bg-[#3DA55E]
    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
    transition-all
    duration-200
  `,
  
  // Input field
  input: `
    bg-[#F0F0F3]
    rounded-xl
    px-4
    py-3
    shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff]
    focus:outline-none
    focus:ring-2
    focus:ring-[#4A90E2]
    transition-all
    duration-200
  `
} as const;

// CSS-in-JS style objects for inline styles
export const neumorphicStyles = {
  card: {
    backgroundColor: COLORS.background.DEFAULT,
    borderRadius: '16px',
    boxShadow: `${SHADOWS.raised.dark}, ${SHADOWS.raised.light}`
  },
  
  pressed: {
    backgroundColor: COLORS.background.DEFAULT,
    borderRadius: '12px',
    boxShadow: `${SHADOWS.pressed.dark}, ${SHADOWS.pressed.light}`
  },
  
  button: {
    backgroundColor: COLORS.background.DEFAULT,
    borderRadius: '12px',
    boxShadow: `${SHADOWS.raised.dark}, ${SHADOWS.raised.light}`,
    transition: 'all 0.2s ease'
  },
  
  buttonPrimary: {
    backgroundColor: COLORS.primary.DEFAULT,
    color: COLORS.primary.contrast,
    borderRadius: '12px',
    boxShadow: `${SHADOWS.raised.dark}, ${SHADOWS.raised.light}`
  },
  
  buttonActive: {
    backgroundColor: COLORS.background.DEFAULT,
    borderRadius: '12px',
    boxShadow: `${SHADOWS.deep.dark}, ${SHADOWS.deep.light}`
  }
} as const;

// Animation keyframes
export const animations = {
  pulse: {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' }
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  fadeIn: {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
} as const;

// Tailwind animation classes
export const animationClasses = {
  fadeIn: 'animate-[fadeIn_0.5s_ease-out]',
  pulse: 'animate-[pulse_2s_ease-in-out_infinite]',
  bounce: 'animate-[bounce_1s_ease-in-out_infinite]',
  spin: 'animate-spin'
} as const;

// Typography
export const typography = {
  fontFamily: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', 'Inter', sans-serif",
    mono: "'Fira Code', monospace"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  }
} as const;

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
} as const;

// Export all styles as a theme object
export const speakCheckTheme = {
  colors: COLORS,
  shadows: SHADOWS,
  neumorphicClasses,
  neumorphicStyles,
  animations,
  animationClasses,
  typography,
  spacing
} as const;

export default speakCheckTheme;
