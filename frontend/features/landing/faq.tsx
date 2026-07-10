'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/40 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 font-semibold text-text hover:text-primary transition-colors text-sm sm:text-base focus:outline-none"
      >
        <span>{question}</span>
        <span className="p-1 rounded-lg bg-muted/5 border border-border/40 text-text ml-4 flex-shrink-0">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="py-2.5 text-xs sm:text-sm text-muted leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const faqs = [
    {
      question: 'Is my conversational chat history private and secure?',
      answer: 'Yes, absolutely. MindCare AI stores your conversation logs exclusively in your browser local storage. Data is never cached on our backend databases. You can clear your entire session cache instantly in the settings tab.',
    },
    {
      question: 'What AI models are powering the predictions and responses?',
      answer: 'MindCare AI utilizes a double-layered intelligence structure. First, a custom fine-tuned BERT text classifier analyzes the syntax structure of your inputs. Second, Llama 3.2 (via Ollama integration) generates the conversational supportive feedback based on the predicted sentiment state.',
    },
    {
      question: 'Can MindCare AI replace traditional clinical therapy?',
      answer: 'No. MindCare AI is a supportive assistant designed to help log emotions, evaluate feelings, and compile structured reports. It is not a licensed clinician. If the system detects signs of extreme stress or risk triggers, it will display crisis resource references.',
    },
    {
      question: 'How does the Clinical Report Compiler work?',
      answer: 'When you conclude a chat session, you can request a clinical report. Our backend compiles a professional psychologist-style evaluation detailing the session progression, primary mood classifications, and suggested wellness goals. You can save this markdown report directly.',
    },
    {
      question: 'How do I review my mood analytics over time?',
      answer: 'The system logs the classification outputs of all active chat sessions. By visiting the Dashboard page, you will see a series of Recharts visualizations representing your mood timeline, emotional distribution metrics, and model confidence ratings.',
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Support Resources
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted font-medium max-w-xl mx-auto">
            Everything you need to know about our local security protocols, clinical BERT classifiers, and report generation tools.
          </p>
        </div>

        {/* Accordions list */}
        <div className="glassmorphism-card rounded-2xl p-6 sm:p-8 border border-border/40 shadow-sm">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

      </div>
    </section>
  );
}
