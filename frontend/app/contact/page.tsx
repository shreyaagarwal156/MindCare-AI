'use client';

import React, { useState } from 'react';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { ChatSidebar } from '@/features/chat/sidebar';
import { useHealthQuery } from '@/services/api';
import { Menu, Mail, MapPin, Github, Linkedin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  topic: z.string().min(1, 'Please select a topic'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormFields = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    clearAllSessions,
    mounted,
  } = useChatSessions();

  const { data: health } = useHealthQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<FormFields>({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted text-xs font-bold uppercase tracking-widest animate-pulse">
        Loading Workspace...
      </div>
    );
  }

  const backendHealthy = !!health && health.status === 'healthy';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResult = contactSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof FormFields, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormFields] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit payload mock action (delay)
    setErrors({});
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        topic: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar navigation */}
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

      {/* Main Workspace Frame */}
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
              <MessageCircle className="h-4.5 w-4.5 text-primary" />
              <h1 className="text-xs font-bold text-text uppercase tracking-wider">
                Support & Contact
              </h1>
            </div>
          </div>
        </header>

        {/* Form view content */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 select-text">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Form Column (7 Columns) */}
            <div className="lg:col-span-7 glassmorphism-card rounded-2xl p-6 sm:p-8 border border-border/40 space-y-6 shadow-sm">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Workspace Support Form</h3>
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Submit inquiry or report bugs</span>
              </div>

              {submitted ? (
                <div className="p-6 bg-success/5 border border-success/20 rounded-xl space-y-4 text-center">
                  <div className="mx-auto p-2 bg-success/10 text-success border border-success/20 rounded-full w-fit">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-sm text-text">Inquiry Submitted Successfully</h4>
                  <p className="text-xs text-muted leading-relaxed font-semibold">
                    Thank you. We have logged your support message. A workspace advisor will review this and contact you.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-muted/10 text-text hover:bg-muted/20 border border-border text-xs font-bold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-text">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className={`w-full bg-muted/5 dark:bg-muted/5 border ${errors.name ? 'border-danger' : 'border-border'} rounded-xl px-4 py-2.5 text-xs font-semibold text-text focus:outline-none focus:border-primary/45 transition-colors`}
                    />
                    {errors.name && <p className="text-[10px] text-danger font-bold">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-text">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane.doe@clinic.org"
                      className={`w-full bg-muted/5 dark:bg-muted/5 border ${errors.email ? 'border-danger' : 'border-border'} rounded-xl px-4 py-2.5 text-xs font-semibold text-text focus:outline-none focus:border-primary/45 transition-colors`}
                    />
                    {errors.email && <p className="text-[10px] text-danger font-bold">{errors.email}</p>}
                  </div>

                  {/* Topic Select */}
                  <div className="space-y-1">
                    <label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-wider text-text">Topic</label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className={`w-full bg-muted/5 dark:bg-card border ${errors.topic ? 'border-danger' : 'border-border'} rounded-xl px-4 py-2.5 text-xs font-semibold text-text focus:outline-none focus:border-primary/45 transition-colors`}
                    >
                      <option value="">Select an option</option>
                      <option value="technical">Technical Support (Ollama / BERT setup)</option>
                      <option value="clinical">Clinical Research Collaboration</option>
                      <option value="privacy">Security & HIPAA Questions</option>
                      <option value="other">General Inquiry</option>
                    </select>
                    {errors.topic && <p className="text-[10px] text-danger font-bold">{errors.topic}</p>}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-text">Message Details</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Detail your inquiry or request details..."
                      rows={5}
                      className={`w-full bg-muted/5 dark:bg-muted/5 border ${errors.message ? 'border-danger' : 'border-border'} rounded-xl px-4 py-2.5 text-xs font-semibold text-text focus:outline-none focus:border-primary/45 transition-colors resize-none`}
                    />
                    {errors.message && <p className="text-[10px] text-danger font-bold">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Support Request'}</span>
                  </button>

                </form>
              )}
            </div>

            {/* Info Cards Column (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Location card */}
              <div className="glassmorphism-card rounded-2xl p-5 border border-border/40 flex items-start space-x-4 shadow-sm">
                <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl flex-shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text">Office Location</h4>
                  <p className="text-xs text-muted leading-relaxed font-semibold mt-1">
                    100 Innovation Parkway, Suite 500<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>

              {/* Email card */}
              <div className="glassmorphism-card rounded-2xl p-5 border border-border/40 flex items-start space-x-4 shadow-sm">
                <div className="p-2.5 bg-accent/10 text-accent border border-accent/20 rounded-xl flex-shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text">General Contact</h4>
                  <p className="text-xs text-muted leading-relaxed font-semibold mt-1">
                    support@mindcare.ai<br />
                    research@mindcare.ai
                  </p>
                </div>
              </div>

              {/* Social links card */}
              <div className="glassmorphism-card rounded-2xl p-5 border border-border/40 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text">Find Us Online</h4>
                <div className="flex space-x-3 pt-1">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-border/60 rounded-xl text-text hover:text-primary hover:bg-muted/15 transition-all"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-border/60 rounded-xl text-text hover:text-primary hover:bg-muted/15 transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
