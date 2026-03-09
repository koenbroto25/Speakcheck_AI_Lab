/**
 * SpeakCheck API Service
 * 
 * Service untuk komunikasi dengan Google Apps Script Backend
 * 
 * @version 1.0.0
 */

import type { 
  GameContent, 
  Student, 
  SaveProgressData, 
  ApiResponse,
  LeaderboardEntry,
  GameType
} from '@/types/speakcheck';

// API Configuration
const API_CONFIG = {
  // Replace this with your deployed Google Apps Script Web App URL
  baseUrl: process.env.NEXT_PUBLIC_GAS_API_URL || '',
  timeout: 30000
};

/**
 * Generic fetch wrapper with timeout
 */
async function fetchWithTimeout<T>(
  url: string, 
  options: RequestInit = {},
  timeout: number = API_CONFIG.timeout
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return { 
        success: false, 
        error: 'Request timeout. Please check your connection.' 
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Build URL with query parameters
 */
function buildUrl(action: string, params: Record<string, string> = {}): string {
  const url = new URL(API_CONFIG.baseUrl);
  url.searchParams.set('action', action);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// ============================================
// CONTENT API
// ============================================

/**
 * Get game content by level and type
 */
export async function getGameContent(
  level?: string, 
  type?: GameType
): Promise<ApiResponse<GameContent[]>> {
  const url = buildUrl('getContent', { 
    level: level || '', 
    type: type || '' 
  });
  
  return fetchWithTimeout<GameContent[]>(url);
}

/**
 * Get all active content
 */
export async function getAllContent(): Promise<ApiResponse<GameContent[]>> {
  const url = buildUrl('getAllContent');
  return fetchWithTimeout<GameContent[]>(url);
}

// ============================================
// STUDENT API
// ============================================

/**
 * Get student profile by ID
 */
export async function getStudentProfile(studentId: string): Promise<ApiResponse<Student>> {
  const url = buildUrl('getStudent', { studentId });
  return fetchWithTimeout<Student>(url);
}

/**
 * Create new student
 */
export async function createStudent(data: {
  studentId: string;
  name: string;
  studentClass?: string;
}): Promise<ApiResponse<Student>> {
  const url = API_CONFIG.baseUrl;
  
  return fetchWithTimeout<Student>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'createStudent',
      data
    })
  });
}

/**
 * Get student progress history
 */
export async function getStudentProgress(studentId: string): Promise<ApiResponse<unknown[]>> {
  const url = buildUrl('getProgress', { studentId });
  return fetchWithTimeout<unknown[]>(url);
}

// ============================================
// PROGRESS API
// ============================================

/**
 * Save progress data
 */
export async function saveProgress(data: SaveProgressData): Promise<ApiResponse<{ logId: string; xpEarned: number }>> {
  const url = API_CONFIG.baseUrl;
  
  return fetchWithTimeout<{ logId: string; xpEarned: number }>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'saveProgress',
      data
    })
  });
}

/**
 * Bulk save progress data
 */
export async function bulkSaveProgress(dataArray: SaveProgressData[]): Promise<ApiResponse<unknown[]>> {
  const url = API_CONFIG.baseUrl;
  
  return fetchWithTimeout<unknown[]>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'bulkSave',
      data: dataArray
    })
  });
}

// ============================================
// LEADERBOARD API
// ============================================

/**
 * Get leaderboard
 */
export async function getLeaderboard(): Promise<ApiResponse<LeaderboardEntry[]>> {
  const url = buildUrl('getLeaderboard');
  return fetchWithTimeout<LeaderboardEntry[]>(url);
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check API health
 */
export async function healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
  const url = buildUrl('health');
  return fetchWithTimeout<{ status: string; timestamp: string }>(url);
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  STUDENT_ID: 'speakcheck_student_id',
  STUDENT_NAME: 'speakcheck_student_name',
  STUDENT_CLASS: 'speakcheck_student_class',
  SETTINGS: 'speakcheck_settings'
};

/**
 * Save student to local storage
 */
export function saveStudentLocal(student: { id: string; name: string; class: string }): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.STUDENT_ID, student.id);
  localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, student.name);
  localStorage.setItem(STORAGE_KEYS.STUDENT_CLASS, student.class);
}

/**
 * Get student from local storage
 */
export function getStudentLocal(): { id: string; name: string; class: string } | null {
  if (typeof window === 'undefined') return null;
  
  const id = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
  const name = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME);
  const class_ = localStorage.getItem(STORAGE_KEYS.STUDENT_CLASS);
  
  if (!id) return null;
  
  return { id, name: name || 'Student', class: class_ || 'Unknown' };
}

/**
 * Clear student from local storage
 */
export function clearStudentLocal(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
  localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME);
  localStorage.removeItem(STORAGE_KEYS.STUDENT_CLASS);
}

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

/**
 * Get mock game content for development/testing
 */
export function getMockGameContent(type: GameType, level: string = '1'): GameContent[] {
  const mockData: Record<string, GameContent[]> = {
    Grammar: [
      {
        ID: 'G01',
        Game_Type: 'Grammar',
        Level: '1',
        Prompt_Text: 'Tell me what you did yesterday.',
        Target_Keywords: 'went,played,watched,studied',
        Feedback_Rules: 'past_tense_check',
        Is_Active: 'TRUE'
      },
      {
        ID: 'G02',
        Game_Type: 'Grammar',
        Level: '1',
        Prompt_Text: 'Ask me about my hobby.',
        Target_Keywords: 'what,your,hobby',
        Feedback_Rules: 'present_simple_question',
        Is_Active: 'TRUE'
      },
      {
        ID: 'G03',
        Game_Type: 'Grammar',
        Level: '2',
        Prompt_Text: 'Describe what you were doing at 8 PM last night.',
        Target_Keywords: 'was watching,was reading,was studying',
        Feedback_Rules: 'past_continuous',
        Is_Active: 'TRUE'
      }
    ],
    Vocabulary: [
      {
        ID: 'V01',
        Game_Type: 'Vocabulary',
        Level: '1',
        Prompt_Text: 'Describe a busy market place.',
        Target_Keywords: 'crowded,busy,noisy,people,market',
        Feedback_Rules: 'keyword_match',
        Is_Active: 'TRUE'
      },
      {
        ID: 'V02',
        Game_Type: 'Vocabulary',
        Level: '1',
        Prompt_Text: 'Describe the weather on a rainy day.',
        Target_Keywords: 'rainy,wet,cloudy,dark,umbrella',
        Feedback_Rules: 'keyword_match',
        Is_Active: 'TRUE'
      }
    ],
    Pronunciation: [
      {
        ID: 'P01',
        Game_Type: 'Pronunciation',
        Level: '1',
        Prompt_Text: 'The weather is nice today.',
        Target_Keywords: 'weather,nice,today',
        Feedback_Rules: 'phonics_check_th',
        Is_Active: 'TRUE'
      },
      {
        ID: 'P02',
        Game_Type: 'Pronunciation',
        Level: '1',
        Prompt_Text: 'She sells seashells by the seashore.',
        Target_Keywords: 'she,sells,seashells,seashore',
        Feedback_Rules: 'phonics_check_sh',
        Is_Active: 'TRUE'
      }
    ],
    Noticing: [
      {
        ID: 'N01',
        Game_Type: 'Noticing',
        Level: '1',
        Prompt_Text: 'Yesterday I go to school.',
        Target_Keywords: 'went',
        Correct_Audio_URL: 'go',
        Feedback_Rules: 'past_tense_error',
        Is_Active: 'TRUE'
      },
      {
        ID: 'N02',
        Game_Type: 'Noticing',
        Level: '1',
        Prompt_Text: 'She have a beautiful cat.',
        Target_Keywords: 'has',
        Correct_Audio_URL: 'have',
        Feedback_Rules: 'subject_verb_agreement',
        Is_Active: 'TRUE'
      }
    ]
  };

  const content = mockData[type] || [];
  return content.filter(item => item.Level === level || !level);
}

/**
 * Get mock leaderboard for development
 */
export function getMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, id: 'S001', name: 'Ahmad Rizki', class: '7A', xp: 1250 },
    { rank: 2, id: 'S002', name: 'Siti Nurhaliza', class: '7A', xp: 1100 },
    { rank: 3, id: 'S003', name: 'Budi Santoso', class: '7B', xp: 950 },
    { rank: 4, id: 'S004', name: 'Dewi Lestari', class: '7A', xp: 800 },
    { rank: 5, id: 'S005', name: 'Eko Prasetyo', class: '7B', xp: 650 }
  ];
}
