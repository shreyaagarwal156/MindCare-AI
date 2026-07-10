'use client';

import React from 'react';
import { ShieldAlert, Activity, HeartHandshake, AlertCircle } from 'lucide-react';

interface PredictionPanelProps {
  prediction?: string;
  confidence?: number;
  crisis?: boolean;
}

export function PredictionPanel({ prediction, confidence, crisis }: PredictionPanelProps) {
  // If no prediction yet, display standby state
  if (!prediction) {
    return (
      <div className="glassmorphism-card rounded-2xl p-5 border border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Inference Standby</span>
        </div>
        <p className="text-xs text-muted leading-relaxed font-medium">
          Send a message to run NLP sequence classification. Live metrics will be calculated here.
        </p>
      </div>
    );
  }

  // Calculate risk level based on classification
  const getRiskDetails = (pred: string, isCrisis: boolean) => {
    const p = pred.toLowerCase();
    if (isCrisis) {
      return { label: 'CRITICAL', color: 'text-danger bg-danger/10 border-danger/30', level: 3 };
    }
    if (['anxiety', 'sadness', 'depression', 'stress', 'fear'].some(k => p.includes(k))) {
      return { label: 'MEDIUM RISK', color: 'text-warning bg-warning/10 border-warning/30', level: 2 };
    }
    if (['anger', 'suicide', 'harm', 'panic'].some(k => p.includes(k))) {
      return { label: 'HIGH RISK', color: 'text-danger bg-danger/10 border-danger/30', level: 3 };
    }
    return { label: 'LOW RISK', color: 'text-success bg-success/10 border-success/30', level: 1 };
  };

  const confidencePct = ((confidence || 0) * 100).toFixed(1);
  const risk = getRiskDetails(prediction, !!crisis);

  return (
    <div className="space-y-4">
      {/* Primary Analytics Card */}
      <div className="glassmorphism-card rounded-2xl p-5 border border-border/40 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Inference Analytics</span>
          </div>
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${risk.color}`}>
            {risk.label}
          </span>
        </div>

        {/* Diagnostic Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/5 dark:bg-muted/10 border border-border/40 rounded-xl">
            <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">Detected Sentiment</span>
            <span className="text-sm font-extrabold text-text mt-1 block capitalize">{prediction}</span>
          </div>
          <div className="p-3 bg-muted/5 dark:bg-muted/10 border border-border/40 rounded-xl">
            <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">BERT Confidence</span>
            <span className="text-sm font-extrabold text-text mt-1 block">{confidencePct}%</span>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                risk.level === 3 ? 'bg-danger' : risk.level === 2 ? 'bg-warning' : 'bg-success'
              }`} 
              style={{ width: `${confidencePct}%` }} 
            />
          </div>
        </div>
      </div>

      {/* High/Critical Risk Crisis Alert Card */}
      {(risk.level === 3 || crisis) && (
        <div className="p-5 bg-danger/5 dark:bg-danger/10 border border-danger/30 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-danger">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Crisis Override Active</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed font-semibold">
            We detected expressions of intense distress, self-harm, or extreme panic. Please remember you are not alone. 
          </p>
          <div className="pt-2 border-t border-danger/20 flex flex-col space-y-1.5">
            <a 
              href="tel:988" 
              className="text-[10px] font-bold text-danger flex items-center hover:underline"
            >
              <HeartHandshake className="h-3.5 w-3.5 mr-1.5" />
              988 Suicide & Crisis Lifeline (Call/Text 24/7)
            </a>
            <a 
              href="https://www.crisistextline.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-bold text-danger flex items-center hover:underline"
            >
              <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
              Crisis Text Line: Text HOME to 741741
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
