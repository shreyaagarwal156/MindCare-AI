'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Testimonials() {
  const testimonials = [
    {
      quote: 'MindCare AI allows patients to keep track of their mood trends objectively. The BERT classification is exceptionally precise and gives clinicians a clear sentiment baseline to work from.',
      author: 'Dr. Evelyn Carter',
      role: 'Clinical Psychologist, PhD',
      institution: 'Metropolitan Health Services',
    },
    {
      quote: 'The report compilation is a game-changer. My clients come to sessions with structured summaries of their emotional weeks, meaning we can bypass initial discovery and get straight to therapeutic support.',
      author: 'Marcus Vance',
      role: 'Licensed Marriage & Family Therapist',
      institution: 'Vance Psychotherapy Partners',
    },
    {
      quote: 'Having the session history stored locally in the browser provides the reassurance my clients need. They feel safe venting, knowing their transcripts are not pooled into marketing databases.',
      author: 'Sarah Jenkins',
      role: 'Clinical Wellness Director',
      institution: 'Symmetry Mental Health Association',
    },
  ];

  return (
    <section className="py-24 bg-card/20 dark:bg-slate-900/20 relative overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Clinical Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
            Trusted By Mental Health Experts
          </h2>
          <p className="text-base text-muted font-medium">
            Read how professional therapists and wellness advisors integrate MindCare AI into their support workflows.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glassmorphism rounded-2xl p-8 border border-border/40 flex flex-col justify-between hover:border-primary/20 transition-all duration-300 shadow-sm"
            >
              <div className="space-y-6">
                <Quote className="h-6 w-6 text-primary/30" />
                <p className="text-sm text-text/90 italic leading-relaxed font-medium">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/40">
                <h4 className="text-sm font-bold text-text">{t.author}</h4>
                <p className="text-[11px] text-muted font-semibold mt-0.5">{t.role}</p>
                <p className="text-[10px] text-primary/75 font-semibold">{t.institution}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
