'use client';

import React from 'react';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { ChatSidebar } from '@/features/chat/sidebar';
import { useHealthQuery } from '@/services/api';
import { Menu, BookOpen, Brain, ShieldCheck, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    clearAllSessions,
    mounted,
  } = useChatSessions();

  const { data: health } = useHealthQuery();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const router = useRouter();

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted text-xs font-bold uppercase tracking-widest animate-pulse">
        Loading workspace...
      </div>
    );
  }

  const backendHealthy = !!health && health.status === 'healthy';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar Navigation */}
      <div className={`fixed inset-0 z-40 lg:relative lg:z-0 lg:flex ${sidebarOpen ? 'flex' : 'hidden lg:flex'}`}>
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
              router.push('/chat');
            }}
            onCreateSession={() => {
              createSession();
              router.push('/chat');
            }}
            onDeleteSession={deleteSession}
            onClearAll={clearAllSessions}
            backendHealthy={backendHealthy}
          />
        </div>
      </div>

      {/* Main Workspace Scroll Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-card/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-4 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text hover:bg-muted/10 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              <h1 className="text-xs font-bold text-text uppercase tracking-wider">
                About the Technology
              </h1>
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 select-text">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Mission Statement */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Vision</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
                Bridging NLP Architecture and Empathy
              </h2>
              <p className="text-sm text-muted font-medium leading-relaxed">
                MindCare AI is built to provide clinical-grade mood analysis diagnostics and conversation support workspace. By combining fast, objective sequence classification (BERT) with generative local language models (Llama 3.2), we offer real-time sentiment breakdowns, letting individuals evaluate emotional trends while retaining complete control of their data.
              </p>
            </div>

            {/* Architecture Timeline Flowchart */}
            <div className="glassmorphism-card rounded-2xl p-6 sm:p-8 border border-border/40 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Data Pipeline Flow</h3>
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Under the hood request architecture</span>
              </div>

              {/* Steps Layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                <div className="p-4 bg-muted/5 border border-border/40 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-primary">PHASE 1</div>
                  <h4 className="text-xs font-extrabold text-text">User Vent</h4>
                  <p className="text-[10px] text-muted font-semibold leading-relaxed">
                    User inputs dialogue text in the active chat workspace.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-primary">PHASE 2</div>
                  <h4 className="text-xs font-extrabold text-text flex items-center">
                    BERT Classifier
                  </h4>
                  <p className="text-[10px] text-muted font-semibold leading-relaxed">
                    FastAPI processes the string using BERT weights, extracting sentiment metrics.
                  </p>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-accent">PHASE 3</div>
                  <h4 className="text-xs font-extrabold text-text">Llama 3.2 Pipeline</h4>
                  <p className="text-[10px] text-muted font-semibold leading-relaxed">
                    The backend queries the Llama endpoint using prompt matrices formatted with the BERT mood indicators.
                  </p>
                </div>

                <div className="p-4 bg-success/5 border border-success/20 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-success">PHASE 4</div>
                  <h4 className="text-xs font-extrabold text-text">Response & Export</h4>
                  <p className="text-[10px] text-muted font-semibold leading-relaxed">
                    Empathetic response and logs are updated in the browser. A markdown clinician report compiles when requested.
                  </p>
                </div>
              </div>
            </div>

            {/* Models Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 - BERT */}
              <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
                <div className="p-2 w-fit bg-primary/10 text-primary border border-primary/20 rounded-xl">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-text">BERT sequence classification</h3>
                <p className="text-xs text-muted leading-relaxed font-semibold">
                  A custom fine-tuned transformer weights matrix parses vocabulary semantic associations, predicting mental health states (Anxiety, Stress, Sadness, Joy, Neutral) and risk logs instantly.
                </p>
              </div>

              {/* Card 2 - Llama */}
              <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
                <div className="p-2 w-fit bg-accent/10 text-accent border border-accent/20 rounded-xl">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-text">Llama 3.2 Ollama Service</h3>
                <p className="text-xs text-muted leading-relaxed font-semibold">
                  A localized Llama 3.2 model functions as the primary supportive responder. Prompt matrix injection formats responses depending on predicted emotional intensity.
                </p>
              </div>

              {/* Card 3 - Privacy Standard */}
              <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
                <div className="p-2 w-fit bg-success/10 text-success border border-success/20 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-text">Zero Backend Persistence</h3>
                <p className="text-xs text-muted leading-relaxed font-semibold">
                  All discussion logs reside in browser LocalStorage. Communication is direct, securing medical privacy by avoiding central telemetry cloud databases.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
