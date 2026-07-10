'use client';

import { useState, useEffect } from 'react';
import { ChatSession, Message } from '@/types';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage on client mount
  useEffect(() => {
    const saved = localStorage.getItem('mindcare_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatSession[];
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse MindCare local sessions:', e);
      }
    }
    setMounted(true);
  }, []);

  // Sync to LocalStorage on modifications
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('mindcare_sessions', JSON.stringify(sessions));
  }, [sessions, mounted]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const createSession = (initialMessageText?: string): string => {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);

    const newSession: ChatSession = {
      id: newId,
      title: initialMessageText 
        ? (initialMessageText.length > 25 ? initialMessageText.substring(0, 25) + '...' : initialMessageText)
        : 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    return newId;
  };

  const addMessageToSession = (
    sessionId: string, 
    message: Omit<Message, 'id' | 'timestamp'>
  ) => {
    const newMsg: Message = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        
        const updatedMessages = [...s.messages, newMsg];
        let updatedTitle = s.title;

        // Automatically set the conversation title using the first user message
        if ((s.title === 'New Conversation' || s.title.trim() === '') && message.sender === 'user') {
          const rawTitle = message.text.replace(/[#*`]/g, '').trim();
          updatedTitle = rawTitle.length > 28 ? rawTitle.substring(0, 28) + '...' : rawTitle;
        }

        return {
          ...s,
          title: updatedTitle,
          messages: updatedMessages,
        };
      })
    );
  };

  const updateSessionFeedback = (sessionId: string, helpful: boolean) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          feedbackGiven: true,
          helpful,
        };
      })
    );
  };

  const cacheSessionReport = (sessionId: string, report: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          report,
        };
      })
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const removeLastMessage = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          messages: s.messages.slice(0, -1),
        };
      })
    );
  };

  const updateSessionId = (oldId: string, newId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== oldId) return s;
        return {
          ...s,
          id: newId,
        };
      })
    );
    setActiveSessionId((prev) => (prev === oldId ? newId : prev));
  };

  const clearAllSessions = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  return {
    sessions,
    activeSessionId,
    activeSession,
    setActiveSessionId,
    createSession,
    addMessageToSession,
    updateSessionFeedback,
    cacheSessionReport,
    deleteSession,
    clearAllSessions,
    removeLastMessage,
    updateSessionId,
    mounted,
  };
}
