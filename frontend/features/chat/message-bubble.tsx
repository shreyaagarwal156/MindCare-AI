'use client';

import React, { useState } from 'react';
import { Message } from '@/types';
import { Copy, Check, ThumbsUp, ThumbsDown, Brain, RotateCcw } from 'lucide-react';
import { useFeedbackMutation } from '@/services/api';

interface MessageBubbleProps {
  message: Message;
  sessionId: string;
  isLastAssistantMessage: boolean;
  onFeedbackLogged?: (helpful: boolean) => void;
  onRegenerate?: () => void;
  feedbackGiven?: boolean;
  helpful?: boolean;
  isStreaming?: boolean; // Prop to hide control elements during streaming state
}

export function MessageBubble({
  message,
  sessionId,
  isLastAssistantMessage,
  onFeedbackLogged,
  onRegenerate,
  feedbackGiven = false,
  helpful = false,
  isStreaming = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const feedbackMutation = useFeedbackMutation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleFeedback = (rating: boolean) => {
    if (feedbackGiven) return;
    feedbackMutation.mutate(
      { session_id: sessionId, helpful: rating },
      {
        onSuccess: () => {
          if (onFeedbackLogged) onFeedbackLogged(rating);
        },
        onError: (err) => {
          console.error('Failed to log feedback:', err);
        },
      }
    );
  };

  // Parser helper to support simple bold, italic and bullet lists in Llama's reply
  const parseInlineStyles = (txt: string) => {
    const parts = txt.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-foreground">{part.slice(2, -2)}</strong>;
      }
      const italicParts = part.split(/(\*.*?\*)/g);
      return italicParts.map((subPart, subIdx) => {
        if (subPart.startsWith('*') && subPart.endsWith('*')) {
          return <em key={subIdx} className="italic text-foreground/90">{subPart.slice(1, -1)}</em>;
        }
        return subPart;
      });
    });
  };

  const formatText = (txt: string) => {
    if (!txt) return null;
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      // Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="ml-5 list-disc pl-1 my-1 text-sm text-text leading-relaxed font-medium">
            {parseInlineStyles(content)}
          </li>
        );
      }
      // Section subheadings
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-primary mt-4 mb-1.5">
            {parseInlineStyles(trimmed.substring(4))}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-sm font-extrabold text-text mt-5 mb-2 border-b border-border/20 pb-1">
            {parseInlineStyles(trimmed.substring(3))}
          </h3>
        );
      }
      // Normal text paragraphs
      if (trimmed === '') {
        return <div key={idx} className="h-3.5" />;
      }
      return (
        <p key={idx} className="my-1.5 text-sm leading-relaxed text-text font-medium">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group mb-5`}>
      <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm ${
          isUser 
            ? 'bg-muted/10 border-border text-text' 
            : 'bg-primary/10 border-primary/20 text-primary'
        }`}>
          {isUser ? (
            <span className="text-[11px] font-bold">ME</span>
          ) : (
            <Brain className="h-4 w-4" />
          )}
        </div>

        {/* Bubble Frame */}
        <div className="space-y-1.5">
          <div className={`rounded-2xl p-4 border shadow-sm relative ${
            isUser 
              ? 'bg-card border-border rounded-tr-none' 
              : 'glassmorphism-card border-border/40 rounded-tl-none'
          }`}>
            {/* Format message contents */}
            <div className="whitespace-pre-wrap select-text">
              {isUser ? (
                <p className="text-sm leading-relaxed font-medium text-text">{message.text}</p>
              ) : (
                <>
                  {formatText(message.text)}
                  {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse ml-0.5" />}
                </>
              )}
            </div>

            {/* Bubble Action Controls (Copy / Feedback / Regenerate) */}
            {!isStreaming && (
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md text-muted hover:text-text hover:bg-muted/15 border border-border/40 transition-colors"
                  title="Copy Message"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                </button>
                {!isUser && isLastAssistantMessage && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded-md text-muted hover:text-text hover:bg-muted/15 border border-border/40 transition-colors"
                    title="Regenerate Response"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Time & Feedback Logs */}
          <div className={`flex items-center space-x-3 text-[10px] text-muted font-bold ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{message.timestamp}</span>
            
            {/* Empathy Feedback indicators for assistant bubble */}
            {!isUser && !isStreaming && (isLastAssistantMessage || feedbackGiven) && (
              <div className="flex items-center space-x-2 border-l border-border/40 pl-3">
                <span className="text-[9px] uppercase tracking-wider">Helpful?</span>
                <button
                  disabled={feedbackGiven}
                  onClick={() => handleFeedback(true)}
                  className={`p-0.5 rounded transition-colors ${
                    feedbackGiven && helpful 
                      ? 'text-success bg-success/15' 
                      : feedbackGiven 
                        ? 'opacity-40 cursor-not-allowed' 
                        : 'hover:text-success hover:bg-success/10'
                  }`}
                  title="Helpful reply"
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button
                  disabled={feedbackGiven}
                  onClick={() => handleFeedback(false)}
                  className={`p-0.5 rounded transition-colors ${
                    feedbackGiven && !helpful 
                      ? 'text-danger bg-danger/15' 
                      : feedbackGiven 
                        ? 'opacity-40 cursor-not-allowed' 
                        : 'hover:text-danger hover:bg-danger/10'
                  }`}
                  title="Unhelpful reply"
                >
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
