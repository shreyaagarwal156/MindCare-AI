'use client';

import React from 'react';
import { Eye, Settings2, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export function Timeline() {
  const steps = [
    {
      number: '01',
      icon: <Eye className="h-5 w-5" />,
      title: 'Analyze Your Mind',
      description: 'Write down what is on your mind. Our custom fine-tuned BERT model parses semantic structure to isolate psychological indicators.',
    },
    {
      number: '02',
      icon: <Settings2 className="h-5 w-5" />,
      title: 'Understand Predictions',
      description: 'Review the confidence percentages. Understand the specific emotions and risks highlighted by the AI model in real time.',
    },
    {
      number: '03',
      icon: <HeartPulse className="h-5 w-5" />,
      title: 'Get Clinical Support',
      description: 'Discuss options with Llama 3.2. Generate comprehensive reports and actionable therapeutic insights to aid your journey.',
    },
  ];

  return (
    <section className="py-24 bg-card/40 dark:bg-slate-900/40 relative overflow-hidden border-y border-border/40">
      <div className="glow-blob bg-secondary w-[250px] h-[250px] top-[20%] right-[5%]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
            How MindCare AI Works
          </h2>
          <p className="text-base text-muted font-medium">
            Three simple, secure phases from immediate neural prediction to deep Llama conversational therapy.
          </p>
        </div>

        {/* Timeline Grid (3 Steps) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center space-y-4 px-4 group"
            >
              {/* Timeline Marker */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background border border-border group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 shadow-sm z-10">
                <div className="text-primary">{step.icon}</div>
                
                {/* Step indicator tag */}
                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {step.number}
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-bold text-text tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted font-medium leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
