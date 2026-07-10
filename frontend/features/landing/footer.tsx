'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Heart, Github, Linkedin, ShieldAlert, FileText, Info, HelpCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/25 dark:bg-slate-900/25 py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Brand details (5 Columns) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/5 shadow-sm">
                <Brain className="h-5.5 w-5.5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-text to-primary bg-clip-text text-transparent">
                MindCare AI
              </span>
            </Link>
            <p className="text-xs text-muted max-w-sm leading-relaxed font-semibold">
              Next-generation mental health analysis workspace. Powered by fine-tuned sequence classifiers and localized Llama 3.2 Ollama engines. Absolute data isolation guarantees patient privacy.
            </p>
            {/* Social Grid */}
            <div className="flex space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border/80 rounded-xl text-muted hover:text-primary hover:bg-muted/15 transition-all"
                aria-label="GitHub Workspace"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border/80 rounded-xl text-muted hover:text-primary hover:bg-muted/15 transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Workspace shortcuts (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text flex items-center space-x-1.5">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <span>Workspace</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/chat" className="hover:text-primary transition-colors flex items-center">
                  Chat Workspace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-primary transition-colors">
                  Settings Profiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech stack / Resources (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text flex items-center space-x-1.5">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>Resources</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Technology Stack details
                </Link>
              </li>
              <li>
                <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Ollama Local Setup Guide
                </a>
              </li>
              <li>
                <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  BERT Model Weights (HF)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & disclaimer (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text flex items-center space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-success" />
              <span>Legal Guidelines</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center">
                  <ShieldAlert className="h-3.5 w-3.5 mr-1 text-success" />
                  Privacy Isolation Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1 text-primary" />
                  Workspace Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors flex items-center">
                  <HelpCircle className="h-3.5 w-3.5 mr-1 text-accent" />
                  Support Workspace FAQ
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer / Copyright block */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-muted max-w-2xl text-center lg:text-left leading-normal font-semibold">
            Disclaimer: MindCare AI is a supplementary NLP dashboard and supportive helper. It is not a licensed mental healthcare provider or replacement for clinical psychotherapy. If you are experiencing a crisis, please contact your local emergency services immediately.
          </p>
          <div className="flex items-center text-[10px] text-muted font-bold space-x-1 select-none flex-shrink-0">
            <span>&copy; {currentYear} MindCare AI. Crafted with</span>
            <Heart className="h-3 w-3 text-danger fill-danger" />
            <span>for mental wellness.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
