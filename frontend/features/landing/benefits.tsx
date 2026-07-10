'use client';

import React from 'react';
import { ShieldCheck, Heart, Sparkles, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export function Benefits() {
  const benefits = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-success" />,
      title: 'HIPAA-Inspired Privacy Standards',
      desc: 'No external telemetry tracking or cloud database caches. Your sensitive mental state descriptions are calculated locally and preserved in your own browser storage.',
    },
    {
      icon: <Heart className="h-5 w-5 text-danger" />,
      title: 'Immediate Empathy Diagnostics',
      desc: 'BERT classification alerts are calculated instantly. If crisis override states are triggered, immediate support references are highlighted automatically.',
    },
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: 'Open Source Model Integrity',
      desc: 'Powered by Llama 3.2 running locally or on trusted servers. We never share chat history with closed-source commercial LLM providers.',
    },
    {
      icon: <LayoutDashboard className="h-5 w-5 text-accent" />,
      title: 'Therapeutic PDF Exporter',
      desc: 'Compile comprehensive clinical summaries in markdown format with a single click. Download these session logs to discuss with your personal psychologist.',
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Graphic/Highlight Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-card border border-border/40 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-2.5 bg-background rounded-xl w-fit border border-border/40 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-text mb-2 leading-tight">{benefit.title}</h3>
                <p className="text-xs text-muted leading-relaxed font-medium">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Premium Copy (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Designed For Patients & Clinicians
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text leading-tight">
              Clinical Quality Meets Personal Privacy
            </h2>
            <p className="text-muted leading-relaxed font-medium">
              We understand that talking about mental wellness requires absolute safety. MindCare AI provides premium machine-learning classifications that reside in a zero-persistence framework.
            </p>
            <p className="text-muted leading-relaxed font-medium">
              By separating immediate sentiment scoring (BERT) from conversational advice (Llama), we ensure that your session analytics remain objective, transparent, and structured for export.
            </p>
            <div className="pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">BERT</div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center text-xs font-bold text-accent">L3.2</div>
                  <div className="w-10 h-10 rounded-full bg-success/20 border-2 border-background flex items-center justify-center text-xs font-bold text-success">SSL</div>
                </div>
                <div className="text-xs font-medium text-muted">
                  Double-layered intelligence architecture with local encryption.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
