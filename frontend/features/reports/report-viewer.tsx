'use client';

import React from 'react';
import { useReportMutation } from '@/services/api';
import { FileText, Download, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportViewerProps {
  sessionId: string;
  sessionTitle: string;
  cachedReport?: string;
  onReportCompiled: (report: string) => void;
}

export function ReportViewer({
  sessionId,
  sessionTitle,
  cachedReport,
  onReportCompiled,
}: ReportViewerProps) {
  const reportMutation = useReportMutation();
  const [downloaded, setDownloaded] = React.useState(false);

  const handleCompile = () => {
    reportMutation.mutate(
      { session_id: sessionId },
      {
        onSuccess: (data) => {
          onReportCompiled(data.report);
        },
        onError: (err) => {
          console.error('Failed to compile report:', err);
        },
      }
    );
  };

  const handleDownload = () => {
    if (!cachedReport) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([cachedReport], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `Clinical_Report_${sessionTitle.replace(/\s+/g, '_')}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  // Custom parser to format report markdown
  const formatReportMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Horizontal rules
      if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
        return <hr key={idx} className="my-6 border-border/40" />;
      }
      // Headings
      if (trimmed.startsWith('# ')) {
        return <h2 key={idx} className="text-xl font-extrabold text-text mt-6 mb-3">{trimmed.substring(2)}</h2>;
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} className="text-lg font-bold text-text mt-5 mb-2.5">{trimmed.substring(3)}</h3>;
      }
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold uppercase tracking-wider text-primary mt-4 mb-2">{trimmed.substring(4)}</h4>;
      }
      // Lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc pl-1 my-1 text-sm text-text leading-relaxed font-medium">
            {trimmed.substring(2)}
          </li>
        );
      }
      // Blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-primary/40 bg-muted/5 pl-4 py-2 my-4 rounded-r-lg text-xs italic font-medium text-muted">
            {trimmed.substring(2)}
          </blockquote>
        );
      }
      // Empty lines
      if (trimmed === '') {
        return <div key={idx} className="h-4" />;
      }
      
      return (
        <p key={idx} className="my-2 text-sm leading-relaxed text-text font-medium">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="glassmorphism-card rounded-2xl border border-border/40 p-6 space-y-6 shadow-sm">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Clinical Report Compiler</h3>
            <span className="text-[10px] text-muted font-bold block uppercase tracking-wider mt-0.5">Synthesized by Llama 3.2</span>
          </div>
        </div>

        {cachedReport ? (
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-text bg-card hover:bg-muted/10 border border-border rounded-xl shadow-sm transition-colors"
          >
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download Markdown</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Main Body content */}
      <div className="space-y-4">
        {cachedReport ? (
          <div className="p-4 bg-muted/5 dark:bg-muted/5 border border-border/40 rounded-xl max-h-[350px] overflow-y-auto pr-2 select-text">
            {formatReportMarkdown(cachedReport)}
          </div>
        ) : (
          <div className="py-10 text-center space-y-4">
            <p className="text-xs text-muted leading-relaxed font-semibold max-w-sm mx-auto">
              Ready to generate a clinical summary of this discussion? The AI will compile user mood trends, primary concerns, and recommended strategies.
            </p>
            <button
              disabled={reportMutation.isPending}
              onClick={handleCompile}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md disabled:opacity-50 transition-all duration-200"
            >
              {reportMutation.isPending ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Compiling Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Practitioner Summary</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Disclaimers */}
      <p className="text-[9px] text-muted text-center leading-normal font-semibold">
        This report is generated dynamically by LLM evaluation based solely on the active dialogue. It does not constitute a certified medical diagnosis.
      </p>
    </div>
  );
}
