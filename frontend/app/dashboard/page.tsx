'use client';

import React from 'react';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { ChatSidebar } from '@/features/chat/sidebar';
import { DashboardView } from '@/features/dashboard/dashboard-view';
import { useHealthQuery } from '@/services/api';
import { Menu, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
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
        Loading Diagnostics...
      </div>
    );
  }

  const backendHealthy = !!health && health.status === 'healthy';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Drawer Sidebar */}
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

      {/* Workspace Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 border-b border-border/40 bg-card/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-4 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text hover:bg-muted/10 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-4.5 w-4.5 text-primary" />
              <h1 className="text-xs font-bold text-text uppercase tracking-wider">
                Analytics Dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Analytics Scroll View */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <DashboardView
              sessions={sessions}
              onSelectSession={(id) => {
                setActiveSessionId(id);
                router.push('/chat');
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
