'use client';

import React, { useState } from 'react';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { ChatSidebar } from '@/features/chat/sidebar';
import { useTheme } from '@/components/theme-provider';
import { useHealthQuery } from '@/services/api';
import { Menu, Settings, Sun, Moon, Bell, Trash2, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    clearAllSessions,
    mounted,
  } = useChatSessions();

  const { theme, setTheme } = useTheme();
  const { data: health } = useHealthQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Settings State
  const [username, setUsername] = useState('Jane Doe');
  const [notifications, setNotifications] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted text-xs font-bold uppercase tracking-widest animate-pulse">
        Loading Workspace...
      </div>
    );
  }

  const backendHealthy = !!health && health.status === 'healthy';

  const handleSaveSettings = () => {
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2500);
  };

  const handleClearHistory = () => {
    clearAllSessions();
    setShowConfirmClear(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar drawer */}
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

      {/* Main Workspace Scroll Frame */}
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
              <Settings className="h-4.5 w-4.5 text-primary" />
              <h1 className="text-xs font-bold text-text uppercase tracking-wider">
                Workspace Settings
              </h1>
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 select-text">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Save confirmation alert banner */}
            {showSaveAlert && (
              <div className="p-4 bg-success/5 border border-success/20 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                <span className="text-xs text-success font-bold">Workspace configurations updated successfully.</span>
              </div>
            )}

            {/* Profile Configurations Card */}
            <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Patient Profile Card</h3>
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Mock patient metadata details</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="space-y-1">
                    <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-wider text-text">Workspace Identifier</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full sm:max-w-xs bg-muted/5 dark:bg-muted/5 border border-border rounded-xl px-4 py-2 text-xs font-semibold text-text focus:outline-none focus:border-primary/45"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme & Display Options Card */}
            <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Display Configuration</h3>
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Personalize workspace interface</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 border rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all ${
                    theme === 'light'
                      ? 'bg-primary/5 border-primary/30 text-primary'
                      : 'bg-card border-border/60 hover:bg-muted/10 text-muted'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-bold">Light Theme</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 border rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-primary/5 border-primary/30 text-primary'
                      : 'bg-card border-border/60 hover:bg-muted/10 text-muted'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-bold">Dark Theme</span>
                </button>
              </div>
            </div>

            {/* Notifications Checkbox */}
            <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Notification Channels</h3>
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Toggle browser diagnostic alerts</span>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20 accent-primary"
                />
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted" />
                  <span className="text-xs font-bold text-text">Enable diagnostic alerts when BERT metrics recalculate</span>
                </div>
              </label>
            </div>

            {/* Clear Chat History Section */}
            <div className="p-6 bg-danger/5 dark:bg-danger/10 border border-danger/20 rounded-2xl space-y-5">
              <div className="flex items-start space-x-3">
                <ShieldAlert className="h-5.5 w-5.5 text-danger flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-extrabold text-danger">Local Workspace Purge</h3>
                  <p className="text-xs text-muted leading-relaxed font-semibold mt-1">
                    Purging deletes all chat history, confidence grids, helpful ratings, and cached reports from this browser LocalStorage. This operation cannot be undone.
                  </p>
                </div>
              </div>

              {showConfirmClear ? (
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-2.5 bg-danger text-white hover:bg-danger/80 text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    Confirm Deletion
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2.5 bg-card border border-border text-xs font-bold rounded-xl text-text hover:bg-muted/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 text-xs font-bold rounded-xl transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Purge Local Storage Logs</span>
                </button>
              )}
            </div>

            {/* Save Buttons Panel */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Save Configuration
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
