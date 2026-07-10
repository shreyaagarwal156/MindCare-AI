'use client';

import React from 'react';
import { Brain, MessageSquareText, FileSpreadsheet, ShieldAlert, History, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  delay: number;
}

function FeatureCard({ icon, title, description, badge, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}
      className="glassmorphism-card rounded-2xl p-6 md:p-8 border border-border/40 transition-all duration-300 hover:border-primary/30 hover:bg-card flex flex-col justify-between group glow-hover-card relative overflow-hidden"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          {/* Icon Wrapper with Spin/Float on Hover */}
          <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            {icon}
          </div>
          {badge && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-text tracking-tight">{title}</h3>
        <p className="text-sm text-muted leading-relaxed font-medium">{description}</p>
      </div>
      <div className="mt-6 flex items-center text-xs font-bold text-primary group-hover:underline">
        Learn more
      </div>
    </motion.div>
  );
}

export function Features() {
  const featuresList = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Mental Health Detection",
      description: "Harness a fine-tuned, local BERT text sequence classifier that predicts psychological states across classes with rigorous accuracy.",
      badge: "Clinical",
      delay: 0.1,
    },
    {
      icon: <MessageSquareText className="h-6 w-6" />,
      title: "AI Conversation",
      description: "Chat privately with Llama 3.2. Get clinically guided, empathetic support configured to address your specific stress levels.",
      badge: "AI",
      delay: 0.2,
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6" />,
      title: "Clinical Reports",
      description: "Instantly compile a structured professional session review in markdown format based on your conversation history.",
      badge: "Clinical",
      delay: 0.3,
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "Privacy First",
      description: "Your health records are secure. Session history is managed locally in your browser. Easily clear your logs with one click.",
      badge: "Secure",
      delay: 0.4,
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Session History",
      description: "Automatically log, save, and resume your therapy discussions. Organizes conversations in local caches to read later.",
      badge: "Secure",
      delay: 0.5,
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "View visual mood analytics. Study emotion distribution charts, mood timeline maps, and classifier confidence grids.",
      badge: "AI",
      delay: 0.6,
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.03),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Clinical NLP Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
            Integrated Workspace Core Features
          </h2>
          <p className="text-base text-muted font-medium leading-relaxed">
            MindCare AI provides high-end cognitive computing tools that deliver support while placing data privacy above all else.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat) => (
            <FeatureCard
              key={feat.title}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              badge={feat.badge}
              delay={feat.delay}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
