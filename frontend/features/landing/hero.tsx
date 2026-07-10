'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 14 },
    },
  };

  // ── HERO MOCKUP LIVE ANIMATOR ENGINE ─────────────────────────────
  const [typedText, setTypedText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [progressVal, setProgressVal] = useState(0);
  const [statePhase, setStatePhase] = useState<'typing' | 'analyzing' | 'score' | 'replying' | 'holding'>('typing');

  const fullPrompt = "I feel extremely anxious and cannot focus...";
  const fullReply = "I understand. Let's take a deep breath together. Try to inhale for 4 seconds, hold, and slowly exhale. We can break this down.";

  const typingIndexRef = useRef(0);
  const replyIndexRef = useRef(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runEngine = () => {
      // 1. Typing Phase
      if (statePhase === 'typing') {
        if (typingIndexRef.current < fullPrompt.length) {
          timer = setTimeout(() => {
            setTypedText((prev) => prev + fullPrompt[typingIndexRef.current]);
            typingIndexRef.current++;
          }, 60);
        } else {
          // Transition to Analyzing
          timer = setTimeout(() => {
            setStatePhase('analyzing');
          }, 1000);
        }
      }

      // 2. Analyzing Phase (Pulsing loader)
      else if (statePhase === 'analyzing') {
        timer = setTimeout(() => {
          setStatePhase('score');
        }, 1800);
      }

      // 3. Score/Confidence Phase (Progress bar fills)
      else if (statePhase === 'score') {
        if (progressVal < 98) {
          timer = setTimeout(() => {
            setProgressVal((prev) => Math.min(prev + 8, 98));
          }, 40);
        } else {
          timer = setTimeout(() => {
            setStatePhase('replying');
          }, 1200);
        }
      }

      // 4. Replying Phase (AI streams reply)
      else if (statePhase === 'replying') {
        const words = fullReply.split(' ');
        if (replyIndexRef.current < words.length) {
          timer = setTimeout(() => {
            setReplyText((prev) => (prev ? prev + ' ' + words[replyIndexRef.current] : words[replyIndexRef.current]));
            replyIndexRef.current++;
          }, 150);
        } else {
          timer = setTimeout(() => {
            setStatePhase('holding');
          }, 4500); // Sleep and display results before resetting
        }
      }

      // 5. Holding / Reset Phase
      else if (statePhase === 'holding') {
        timer = setTimeout(() => {
          // Reset all refs and states to restart the loop
          typingIndexRef.current = 0;
          replyIndexRef.current = 0;
          setTypedText('');
          setReplyText('');
          setProgressVal(0);
          setStatePhase('typing');
        }, 1000);
      }
    };

    runEngine();

    return () => clearTimeout(timer);
  }, [statePhase, typedText, replyText, progressVal]);

  return (
    <section className="relative min-h-screen pt-36 pb-24 flex items-center justify-center overflow-hidden bg-background">
      
      {/* Background Ambient Glows - Positioned for design depth */}
      <div className="glow-blob bg-primary/20 w-[450px] h-[450px] top-[8%] left-[2%] blur-[120px]" />
      <div className="glow-blob bg-accent/25 w-[400px] h-[400px] bottom-[10%] right-[5%] blur-[110px]" />
      <div className="glow-blob bg-secondary/15 w-[300px] h-[300px] top-1/3 right-1/4 blur-[130px]" />

      {/* Grid Pattern Layer - Extremely subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Headline Copy (7 Columns) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-10 text-center lg:text-left"
          >
            {/* Pill Tag */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glassmorphism text-xs font-bold text-primary border border-primary/20 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Next-Gen Mental Health Analysis Workspace</span>
            </motion.div>

            {/* Main Premium Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.08] text-text"
            >
              Professional AI <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </motion.h1>

            {/* Subtitle with increased spacing */}
            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-muted leading-relaxed font-medium"
            >
              MindCare AI combines fine-tuned BERT sentiment classifiers with localized Llama 3.2 models to provide instantaneous, secure mood evaluations and psychologist-styled summaries.
            </motion.p>

            {/* Premium Interactive CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
            >
              <Link
                href="/chat"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] hover:-translate-y-0.5 transition-all duration-200"
              >
                Start AI Assistant
                <ArrowRight className="ml-2 h-4.5 w-4.5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4.5 text-sm font-bold text-text glassmorphism border border-border/80 rounded-2xl hover:bg-muted/15 hover:border-primary/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
              >
                View Analytics
              </Link>
            </motion.div>

            {/* highlights bar */}
            <motion.div
              variants={itemVariants}
              className="pt-10 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 border-t border-border/20"
            >
              <div className="flex items-center space-x-2.5 text-xs text-muted">
                <ShieldCheck className="h-4.5 w-4.5 text-success flex-shrink-0" />
                <span className="font-semibold">Clinical Classifier</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-muted">
                <Activity className="h-4.5 w-4.5 text-accent flex-shrink-0" />
                <span className="font-semibold">Real-time Insights</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-muted">
                <BrainCircuit className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                <span className="font-semibold">Llama 3.2 Powered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Mockup Illustration Area (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, type: 'spring' }}
            className="lg:col-span-5 relative w-full flex items-center justify-center perspective-container"
          >
            {/* Glowing Backdrop Mesh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-accent/25 rounded-3xl blur-[50px] pointer-events-none" />

            {/* 3D Depth Animated Card Mockup */}
            <div className="relative w-full max-w-[420px] glassmorphism-card rounded-2xl p-6 border border-border/40 shadow-2xl overflow-hidden perspective-card animate-perspective-float glow-hover-card">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
                </div>
                <div className="text-[9px] text-muted font-bold bg-muted/10 px-2 py-0.5 rounded-full">
                  session_id: simulation
                </div>
              </div>

              {/* Chat Simulation Area */}
              <div className="py-6 space-y-4 min-h-[310px] flex flex-col justify-end">
                
                {/* 1. User Message (types dynamically) */}
                {typedText && (
                  <div className="space-y-1 max-w-[85%]">
                    <span className="text-[9px] text-muted font-bold pl-1 uppercase tracking-wider">User Input</span>
                    <div className="bg-muted/5 border border-border/60 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs leading-relaxed text-text font-medium relative">
                      <span>{typedText}</span>
                      {statePhase === 'typing' && <span className="chat-caret pl-0.5" />}
                    </div>
                  </div>
                )}

                {/* 2. Analyzing Loader Panel */}
                <AnimatePresence>
                  {statePhase === 'analyzing' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2 justify-center py-2"
                    >
                      <div className="h-[1px] bg-border/40 flex-grow" />
                      <span className="text-[9px] tracking-wider font-extrabold text-primary animate-pulse uppercase">
                        BERT Classifying
                      </span>
                      <div className="h-[1px] bg-border/40 flex-grow" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. Prediction Confidence Card */}
                {progressVal > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wide">
                        Inference Output
                      </span>
                      <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 animate-pulse">
                        Anxiety
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] text-muted font-bold">
                        <span>Model Confidence</span>
                        <span>{progressVal}%</span>
                      </div>
                      <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-300" 
                          style={{ width: `${progressVal}%` }} 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. AI Stream Response */}
                {replyText && (
                  <div className="space-y-1 max-w-[90%] ml-auto text-right">
                    <span className="text-[9px] text-primary font-bold pr-1 uppercase tracking-wider">MindCare Assistant</span>
                    <div className="bg-primary text-white text-left px-4 py-3 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-md shadow-primary/5 font-semibold">
                      <span>{replyText}</span>
                      {statePhase === 'replying' && <span className="border-r-2 border-white pl-0.5 animate-pulse" />}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
