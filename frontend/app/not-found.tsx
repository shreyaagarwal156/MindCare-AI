'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="glow-blob bg-primary w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full text-center space-y-8 glassmorphism-card rounded-3xl p-8 sm:p-12 border border-border/40 shadow-2xl relative z-10"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center animate-subtle-float">
          <Brain className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-text leading-tight">
            Workspace Lost
          </h2>
          <p className="text-xs text-muted leading-relaxed font-semibold">
            The requested pathway does not exist. Let&apos;s return you to the active workspace.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/chat"
            className="w-full inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
