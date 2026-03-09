/**
 * SpeakCheck: AI Feedback Lab - Type Definitions
 * 
 * Type definitions untuk aplikasi latihan berbicara bahasa Inggris
 */

// ============================================
// STUDENT TYPES
// ============================================

export interface Student {
  id: string;
  name: string;
  class: string;
  xp: number;
  createdAt: Date | string;
  settings: StudentSettings;
}

export interface StudentSettings {
  soundEnabled: boolean;
  feedbackMode: 'auto' | 'explicit' | 'implicit';
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en-US' | 'en-GB';
}

// ============================================
// CONTENT TYPES
// ============================================

export type GameType = 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Noticing';

export interface GameContent {
  ID: string;
  Game_Type: GameType;
  Level: string;
  Prompt_Text: string;
  Target_Keywords: string;
  Correct_Audio_URL?: string;
  Feedback_Rules: string;
  Is_Active: boolean | string;
}

export interface NoticingContent {
  id: string;
  level: string;
  sentence: string;
  correctWord: string;
  errorWord: string;
  feedbackRule: string;
}

// ============================================
// PROGRESS TYPES
// ============================================

export interface ProgressLog {
  Log_ID: string;
  Timestamp: Date | string;
  Student_ID: string;
  Game_Type: GameType;
  Prompt_ID: string;
  Raw_Speech_Output: string;
  Error_Detected: string;
  Feedback_Given: string;
  Feedback_Type: FeedbackType;
  Uptake_Success: boolean | string;
  Score: number;
  Confidence_Level: number;
  Attempt_Count: number;
}

export interface SaveProgressData {
  studentId: string;
  studentName?: string;
  studentClass?: string;
  gameType: GameType;
  promptId: string;
  rawSpeech: string;
  errorDetected: string;
  feedbackGiven: string;
  feedbackType: FeedbackType;
  uptakeSuccess: boolean;
  score: number;
  confidenceLevel: number;
  attemptCount: number;
}

// ============================================
// FEEDBACK TYPES
// ============================================

export type FeedbackType = 
  | 'Recast' 
  | 'ClarificationRequest' 
  | 'MetalinguisticClue' 
  | 'ExplicitCorrection' 
  | 'Elicitation'
  | 'None';

export interface FeedbackResult {
  type: FeedbackType;
  message: string;
  errors: string[];
  isCorrect: boolean;
  score: number;
}

export interface FeedbackStrategy {
  condition: string;
  strategy: FeedbackType;
  implementation: string;
}

// ============================================
// GAME STATE TYPES
// ============================================

export type GameState = 
  | 'SPLASH'
  | 'LOGIN'
  | 'DASHBOARD'
  | 'PLAYING'
  | 'FEEDBACK'
  | 'RESULT';

export type GamePhase = 
  | 'PROMPT'
  | 'LISTENING'
  | 'PROCESSING'
  | 'FEEDBACK'
  | 'RESULT';

export interface GameSession {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  xpEarned: number;
  attemptCount: number;
  startTime: Date;
  errors: string[];
  feedbackHistory: FeedbackResult[];
}

// ============================================
// SPEECH TYPES
// ============================================

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

// ============================================
// UI TYPES
// ============================================

export type AliceMood = 'happy' | 'thinking' | 'encouraging' | 'neutral' | 'success';

export interface AliceState {
  mood: AliceMood;
  message: string;
  isSpeaking: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  class: string;
  xp: number;
}

// ============================================
// CONSTANTS
// ============================================

export const CONFIDENCE_THRESHOLD = {
  PASS: 0.85,
  ENCOURAGE: 0.70,
  FAIL: 0.70
} as const;

export const XP_VALUES = {
  CORRECT_ANSWER: 100,
  PARTIAL_CORRECT: 50,
  UPTAKE_SUCCESS: 25,
  BONUS_STREAK: 10
} as const;

export const GAME_MODES = {
  GRAMMAR: {
    id: 'Grammar',
    name: 'Grammar Lab',
    description: 'Practice grammar through speaking',
    icon: '📚',
    color: '#4A90E2'
  },
  VOCABULARY: {
    id: 'Vocabulary',
    name: 'Vocab Builder',
    description: 'Build your vocabulary',
    icon: '📖',
    color: '#50C878'
  },
  PRONUNCIATION: {
    id: 'Pronunciation',
    name: 'Pronunciation Clinic',
    description: 'Perfect your pronunciation',
    icon: '🎤',
    color: '#9B59B6'
  },
  NOTICING: {
    id: 'Noticing',
    name: 'The Noticing Room',
    description: 'Spot and fix errors',
    icon: '🔍',
    color: '#FFB347'
  }
} as const;

export const FEEDBACK_STRATEGY_MATRIX: FeedbackStrategy[] = [
  {
    condition: 'Minor Error (pronunciation)',
    strategy: 'Recast',
    implementation: 'App speaks the correct sentence naturally without pausing, then asks student to repeat.'
  },
  {
    condition: 'Major Error (grammar confusion)',
    strategy: 'ClarificationRequest',
    implementation: 'App says: "Sorry, I didn\'t understand that part." Forces student to self-repair.'
  },
  {
    condition: 'Repeated Error',
    strategy: 'ExplicitCorrection',
    implementation: 'App displays the correct form in green text and plays the audio model.'
  },
  {
    condition: 'Logic Check Needed',
    strategy: 'MetalinguisticClue',
    implementation: 'App asks a question about the rule: "Is this verb past or present?"'
  },
  {
    condition: 'Vocabulary Recall',
    strategy: 'Elicitation',
    implementation: 'App provides hints: "You can also use words like [M_ss_]" to prompt recall.'
  }
];
