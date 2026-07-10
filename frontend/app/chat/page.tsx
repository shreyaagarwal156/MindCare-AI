'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatSidebar } from '@/features/chat/sidebar';
import { MessageBubble } from '@/features/chat/message-bubble';
import { PredictionPanel } from '@/features/chat/prediction-panel';
import { ReportViewer } from '@/features/reports/report-viewer';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { useChatMutation, useHealthQuery } from '@/services/api';
import { Message } from '@/types';
import { Brain, Send, Mic, Menu, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const {
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
    mounted: sessionsMounted,
  } = useChatSessions();

  const { data: health, isLoading: healthLoading } = useHealthQuery();
  const chatMutation = useChatMutation();

  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on message updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, chatMutation.isPending, streamingMessage]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
      chatInputRef.current.style.height = `${Math.min(chatInputRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || chatMutation.isPending || !!streamingMessage) return;

    let targetSessionId = activeSessionId;
    
    // Automatically boot a new session if none is selected
    if (!targetSessionId) {
      targetSessionId = createSession(rawText);
    }

    // 1. Add User Message
    addMessageToSession(targetSessionId, {
      sender: 'user',
      text: rawText,
    });
    
    if (!textToSend) setInputText('');
    if (chatInputRef.current) chatInputRef.current.style.height = 'auto';

    // 2. Call backend /chat
    chatMutation.mutate(
      {
        session_id: targetSessionId,
        message: rawText,
      },
      {
        onSuccess: (data) => {
          const resolvedSessionId = data.session_id;
          let actualSessionId = targetSessionId;
          if (resolvedSessionId && resolvedSessionId !== targetSessionId) {
            updateSessionId(targetSessionId, resolvedSessionId);
            actualSessionId = resolvedSessionId;
          }

          // Stream assistant response word-by-word
          const words = data.reply.split(' ');
          let idx = 0;
          let currentText = '';
          
          setStreamingMessage({
            id: Math.random().toString(36).substring(2, 9),
            sender: 'assistant',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            prediction: data.prediction,
            confidence: data.confidence,
            crisis: data.crisis,
          });

          const timer = setInterval(() => {
            if (idx < words.length) {
              currentText += (idx === 0 ? '' : ' ') + words[idx];
              setStreamingMessage((prev) => prev ? { ...prev, text: currentText } : null);
              idx++;
            } else {
              clearInterval(timer);
              addMessageToSession(actualSessionId, {
                sender: 'assistant',
                text: data.reply,
                prediction: data.prediction,
                confidence: data.confidence,
                crisis: data.crisis,
              });
              setStreamingMessage(null);
            }
          }, 45); // Progressive streaming speed
        },
        onError: () => {
          // Add system warning message if offline or failed
          addMessageToSession(targetSessionId!, {
            sender: 'assistant',
            text: 'System notification: Connecting to local Llama endpoint failed. Please ensure Ollama server is running and MindCare backend is healthy.',
            prediction: 'Degraded',
            confidence: 0,
            crisis: false,
          });
        },
      }
    );
  };

  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length < 2 || !!streamingMessage) return;

    // Find last user message
    const userMsgs = activeSession.messages.filter((m) => m.sender === 'user');
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1];

    // Remove old response
    removeLastMessage(activeSession.id);

    // Call mutate again
    chatMutation.mutate(
      {
        session_id: activeSession.id,
        message: lastUserMsg.text,
      },
      {
        onSuccess: (data) => {
          const resolvedSessionId = data.session_id;
          let actualSessionId = activeSession.id;
          if (resolvedSessionId && resolvedSessionId !== activeSession.id) {
            updateSessionId(activeSession.id, resolvedSessionId);
            actualSessionId = resolvedSessionId;
          }

          const words = data.reply.split(' ');
          let idx = 0;
          let currentText = '';

          setStreamingMessage({
            id: Math.random().toString(36).substring(2, 9),
            sender: 'assistant',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            prediction: data.prediction,
            confidence: data.confidence,
            crisis: data.crisis,
          });

          const timer = setInterval(() => {
            if (idx < words.length) {
              currentText += (idx === 0 ? '' : ' ') + words[idx];
              setStreamingMessage((prev) => prev ? { ...prev, text: currentText } : null);
              idx++;
            } else {
              clearInterval(timer);
              addMessageToSession(actualSessionId, {
                sender: 'assistant',
                text: data.reply,
                prediction: data.prediction,
                confidence: data.confidence,
                crisis: data.crisis,
              });
              setStreamingMessage(null);
            }
          }, 45);
        },
        onError: () => {
          addMessageToSession(activeSession.id, {
            sender: 'assistant',
            text: 'System notification: Regenerating response failed. Please check backend connection.',
            prediction: 'Degraded',
            confidence: 0,
            crisis: false,
          });
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const welcomePrompts = [
    'I feel overwhelmed by exams and cannot sleep.',
    'I need tips to manage my daily anxiety.',
    'How do I regain focus after a stressful week?',
    'I am looking for quick breathing exercises.',
  ];

  const backendHealthy = !!health && health.status === 'healthy';

  // Extract context-aware diagnosis from the last message (backend is single source of truth)
  const lastMsg = streamingMessage || (activeSession?.messages[activeSession.messages.length - 1]);
  const activePrediction = lastMsg?.prediction;
  const activeConfidence = lastMsg?.confidence;
  const activeCrisis = lastMsg?.crisis;

  if (!sessionsMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted text-xs font-bold uppercase tracking-widest animate-pulse">
        Bootstrapping Workspace...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar - Collapsible Drawer on Mobile, Fixed Panel on Desktop */}
      <div className={`fixed inset-0 z-40 lg:relative lg:z-0 lg:flex ${sidebarOpen ? 'flex' : 'hidden lg:flex'}`}>
        {/* Mobile backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative z-50 h-full">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => {
              setActiveSessionId(id);
              setSidebarOpen(false);
            }}
            onCreateSession={() => {
              createSession();
              setSidebarOpen(false);
            }}
            onDeleteSession={deleteSession}
            onClearAll={clearAllSessions}
            backendHealthy={backendHealthy}
          />
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Workspace Top Bar */}
        <header className="h-14 border-b border-border/40 bg-card/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-4 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text hover:bg-muted/10 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xs font-bold text-text uppercase tracking-wider leading-none">
                {activeSession ? activeSession.title : 'Empathy AI Workspace'}
              </h1>
              <span className="text-[9px] text-muted font-bold mt-0.5">
                BERT NLP CLASSIFICATION MODEL ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Health status banner warning */}
            {!healthLoading && !backendHealthy && (
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/30 text-danger text-[10px] font-bold">
                <AlertCircle className="h-3 w-3" />
                <span>Backend Offline</span>
              </div>
            )}
            
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`p-2 rounded-xl text-text border border-border/40 hover:bg-muted/10 transition-colors flex items-center space-x-1 ${
                rightPanelOpen ? 'bg-primary/5 border-primary/20 text-primary' : ''
              }`}
              title="Toggle Panel"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline text-[10px] font-bold">Analysis Panel</span>
            </button>
          </div>
        </header>

        {/* Conversation Area */}
        <div className="flex-grow overflow-y-auto px-4 py-6 sm:px-6 md:px-8 select-text">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            
            {(!activeSession || activeSession.messages.length === 0) ? (
              // Empty State Welcome Card
              <div className="flex-grow flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 space-y-6">
                <div className="p-4 rounded-3xl bg-primary/10 text-primary border border-primary/20 animate-subtle-float">
                  <Brain className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold tracking-tight text-text">Discuss Your Mood Insights</h2>
                  <p className="text-xs text-muted leading-relaxed font-semibold">
                    MindCare AI evaluates the tone structure of your venting. Select one of the cards below to boot analysis, or write your own.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                  {welcomePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="p-3.5 bg-card hover:bg-muted/10 border border-border/80 hover:border-primary/30 rounded-xl text-left text-xs font-semibold text-text leading-snug transition-all duration-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Active Dialogue bubbles
              <div className="flex-grow">
                {activeSession.messages.map((msg, index) => {
                  const isLastAssistant = msg.sender === 'assistant' && index === activeSession.messages.length - 1;
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      sessionId={activeSession.id}
                      isLastAssistantMessage={isLastAssistant}
                      feedbackGiven={activeSession.feedbackGiven}
                      helpful={activeSession.helpful}
                      onFeedbackLogged={(helpful) => updateSessionFeedback(activeSession.id, helpful)}
                      onRegenerate={handleRegenerate}
                      isStreaming={false}
                    />
                  );
                })}

                {/* Simulated Progressive Word Streaming Node */}
                {streamingMessage && (
                  <MessageBubble
                    message={streamingMessage}
                    sessionId={activeSession.id}
                    isLastAssistantMessage={true}
                    isStreaming={true}
                  />
                )}

                {/* Loading state indicator */}
                {chatMutation.isPending && !streamingMessage && (
                  <div className="flex justify-start items-center space-x-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="bg-card border border-border/85 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

          </div>
        </div>

        {/* Input Dock (Fixed Bottom) */}
        <footer className="p-4 border-t border-border/40 bg-card/40 dark:bg-slate-900/40 backdrop-blur-md flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className={`relative glassmorphism rounded-2xl border border-border/60 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all duration-300 ${
              (chatMutation.isPending || !!streamingMessage) ? 'opacity-60 cursor-not-allowed' : ''
            }`}>
              <textarea
                ref={chatInputRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                disabled={chatMutation.isPending || !!streamingMessage}
                placeholder={(chatMutation.isPending || !!streamingMessage) ? "Assistant is compiling response..." : "Describe what is on your mind... (BERT classification active)"}
                rows={1}
                className="w-full bg-transparent pl-4 pr-24 py-3.5 text-sm leading-relaxed text-text placeholder-muted resize-none focus:outline-none min-h-[50px] max-h-[160px] font-semibold"
              />
              <div className="absolute right-3 bottom-2.5 flex items-center space-x-2">
                <button
                  type="button"
                  disabled={chatMutation.isPending || !!streamingMessage}
                  className="p-2 text-muted hover:text-text hover:bg-muted/15 rounded-xl border border-border/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Voice dictation (Placeholder)"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || chatMutation.isPending || !!streamingMessage}
                  className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl disabled:opacity-30 disabled:scale-100 hover:scale-105 active:scale-95 shadow-md shadow-primary/10 transition-all duration-150 disabled:cursor-not-allowed"
                  title="Send Message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-[10px] text-muted text-center mt-2.5 leading-normal font-semibold">
              MindCare AI utilizes Llama 3.2. Response speeds correspond to your server capabilities.
            </p>
          </div>
        </footer>

      </div>

      {/* Right Side Column Panel - Prediction and Report Compiler */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 384, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden xl:flex flex-col h-full border-l border-border/40 bg-card/20 dark:bg-slate-900/20 backdrop-blur-md flex-shrink-0 overflow-y-auto p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <span className="text-xs font-bold text-text uppercase tracking-wider">Analysis Hub</span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="text-[10px] font-bold text-muted hover:text-text hover:underline"
              >
                Close Panel
              </button>
            </div>

            {/* Prediction Indicator Panel */}
            <PredictionPanel
              prediction={activePrediction}
              confidence={activeConfidence}
              crisis={activeCrisis}
            />

            {/* Clinical Report Exporter (shows if we have message dialogues) */}
            {activeSession && activeSession.messages.length > 0 && (
              <ReportViewer
                sessionId={activeSession.id}
                sessionTitle={activeSession.title}
                cachedReport={activeSession.report}
                onReportCompiled={(rep) => cacheSessionReport(activeSession.id, rep)}
              />
            )}
          </motion.aside>
        )}
      </AnimatePresence>

    </div>
  );
}
