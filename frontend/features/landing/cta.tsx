'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function CallToAction() {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="glow-blob bg-primary w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="glassmorphism-card rounded-3xl p-8 sm:p-16 border border-border/40 shadow-2xl text-center space-y-8 relative overflow-hidden"
        >
          {/* Inner Grid Pattern mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Empower Your Mind</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text max-w-2xl mx-auto leading-tight">
            Start Your Empathy AI Conversation Today
          </h2>
          
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed font-medium">
            Join the premium clinical workspace. Evaluate moods, compile logs, download clinical reports, and check progress, completely free and offline-enabled.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-primary rounded-xl shadow-lg hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Chat Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-text glassmorphism border border-border rounded-xl hover:bg-muted/10 transition-all duration-200"
            >
              Learn the Architecture
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
