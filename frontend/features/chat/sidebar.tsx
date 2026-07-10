'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Plus, MessageSquare, Trash2, LayoutDashboard, Settings, Home, Activity } from 'lucide-react';
import { ChatSession } from '@/types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  backendHealthy: boolean;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onClearAll,
  backendHealthy,
}: ChatSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-full border-r border-border/40 bg-card/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between flex-shrink-0">
      
      {/* Sidebar Header & New Session Trigger */}
      <div className="p-4 space-y-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 px-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-text leading-tight">MindCare AI</span>
            <div className="flex items-center mt-0.5 space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${backendHealthy ? 'bg-success' : 'bg-danger animate-pulse'}`} />
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider">
                {backendHealthy ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </Link>

        {/* New Chat Button */}
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/15 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat Session</span>
        </button>
      </div>

      {/* Scrollable Session Log History */}
      <div className="flex-grow overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Conversation Log</span>
          {sessions.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[9px] font-bold text-danger hover:text-danger/80 hover:underline uppercase tracking-wide"
            >
              Clear All
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-xs text-muted leading-relaxed font-semibold">No discussions logged yet. Write your thoughts to start.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-primary/10 border-l-2 border-primary text-primary' 
                    : 'text-text/75 hover:bg-muted/10 hover:text-text'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden flex-grow mr-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-70" />
                  <span className="text-xs font-semibold truncate leading-none">
                    {session.title || 'Untitled Session'}
                  </span>
                </div>

                {/* Individual delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all"
                  title="Delete Session"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Operations */}
      <div className="p-4 border-t border-border/40 space-y-1.5">
        <Link
          href="/dashboard"
          className="flex items-center space-x-3 py-2.5 px-3 rounded-xl text-xs font-bold text-text hover:bg-muted/10 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4 text-muted" />
          <span>Analytics Dashboard</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center space-x-3 py-2.5 px-3 rounded-xl text-xs font-bold text-text hover:bg-muted/10 transition-colors"
        >
          <Settings className="h-4 w-4 text-muted" />
          <span>Workspace Settings</span>
        </Link>
        <Link
          href="/"
          className="flex items-center space-x-3 py-2.5 px-3 rounded-xl text-xs font-bold text-text hover:bg-muted/10 transition-colors"
        >
          <Home className="h-4 w-4 text-muted" />
          <span>Return Home</span>
        </Link>
      </div>

    </aside>
  );
}
