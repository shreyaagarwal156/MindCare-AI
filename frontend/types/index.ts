// API & Session Types for MindCare AI

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  ollama_connected: boolean;
}

export interface PredictRequest {
  text: string;
}

export interface PredictResponse {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface ChatRequest {
  session_id?: string | null;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  prediction: string;
  confidence: number;
  crisis: boolean;
  timestamp: string;
}

export interface ReportRequest {
  session_id: string;
}

export interface ReportResponse {
  report: string;
}

export interface FeedbackRequest {
  session_id: string;
  helpful: boolean;
}

export interface FeedbackResponse {
  message: string;
}

// Frontend local models
export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  prediction?: string;
  confidence?: number;
  crisis?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
  feedbackGiven?: boolean;
  helpful?: boolean;
  report?: string; // Cache the generated session report if compiled
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  username: string;
  avatarUrl?: string;
}
