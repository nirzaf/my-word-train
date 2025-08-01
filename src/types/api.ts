export interface GeminiRequest {
  lastWord: string;
  usedWords: string[];
}

export interface GeminiResponse {
  word: string;
  isValid: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}