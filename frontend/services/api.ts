import { apiClient } from '@/lib/api-client';
import {
  HealthResponse,
  PredictRequest,
  PredictResponse,
  ChatRequest,
  ChatResponse,
  ReportRequest,
  ReportResponse,
  FeedbackRequest,
  FeedbackResponse,
} from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

// Axios endpoints mappings
export const api = {
  checkHealth: async (): Promise<HealthResponse> => {
    const { data } = await apiClient.get<HealthResponse>('/health');
    return data;
  },

  predictMood: async (payload: PredictRequest): Promise<PredictResponse> => {
    const { data } = await apiClient.post<PredictResponse>('/predict', payload);
    return data;
  },

  sendChatMessage: async (payload: ChatRequest): Promise<ChatResponse> => {
    const { data } = await apiClient.post<ChatResponse>('/chat', payload);
    return data;
  },

  generateReport: async (payload: ReportRequest): Promise<ReportResponse> => {
    const { data } = await apiClient.post<ReportResponse>('/report', payload);
    return data;
  },

  submitFeedback: async (payload: FeedbackRequest): Promise<FeedbackResponse> => {
    const { data } = await apiClient.post<FeedbackResponse>('/feedback', payload);
    return data;
  },
};

// React Query hooks for states management
export function useHealthQuery() {
  return useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: api.checkHealth,
    refetchInterval: 30000, // Poll API health status check every 30 seconds
    retry: 2,
  });
}

export function usePredictMutation() {
  return useMutation<PredictResponse, Error, PredictRequest>({
    mutationFn: api.predictMood,
  });
}

export function useChatMutation() {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: api.sendChatMessage,
  });
}

export function useReportMutation() {
  return useMutation<ReportResponse, Error, ReportRequest>({
    mutationFn: api.generateReport,
  });
}

export function useFeedbackMutation() {
  return useMutation<FeedbackResponse, Error, FeedbackRequest>({
    mutationFn: api.submitFeedback,
  });
}
