'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ChatSession } from '@/types';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Brain, Heart, CheckCircle2, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardViewProps {
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
}

// ── Native High-Performance Animated Counter ────────────────────────
function AnimatedCounter({ value, duration = 1200, suffix = '', decimals = 0 }: { value: number; duration?: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * value);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
}

// ── Custom Glassmorphism Tooltip for Recharts ────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glassmorphism-card rounded-xl border border-border/40 p-3 shadow-lg text-[10px] font-bold space-y-1.5 backdrop-blur-md">
        <p className="text-muted uppercase tracking-wider">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || pld.stroke }} />
              <span className="text-text">{pld.name}:</span>
              <span className="text-primary font-black">
                {pld.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardView({ sessions, onSelectSession }: DashboardViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Process local session metrics
  const stats = useMemo(() => {
    let totalSessions = sessions.length;
    let totalMessages = 0;
    let helpfulRatings = 0;
    let feedbackCount = 0;
    let crisisCount = 0;
    let confidenceSum = 0;
    let classifiedCount = 0;

    const emotionCounts: Record<string, number> = {};

    sessions.forEach((s) => {
      totalMessages += s.messages.length;
      if (s.feedbackGiven) {
        feedbackCount++;
        if (s.helpful) helpfulRatings++;
      }

      s.messages.forEach((msg) => {
        if (msg.sender === 'assistant') {
          if (msg.crisis) crisisCount++;
          if (msg.prediction) {
            classifiedCount++;
            confidenceSum += msg.confidence || 0;
            const pred = msg.prediction.toLowerCase();
            emotionCounts[pred] = (emotionCounts[pred] || 0) + 1;
          }
        }
      });
    });

    const avgConfidence = classifiedCount > 0 ? (confidenceSum / classifiedCount) * 100 : 88.5;
    const helpfulRatio = feedbackCount > 0 ? (helpfulRatings / feedbackCount) * 100 : 100;

    return {
      totalSessions,
      totalMessages,
      avgConfidence: parseFloat(avgConfidence.toFixed(1)),
      helpfulRatio: parseFloat(helpfulRatio.toFixed(1)),
      crisisCount,
      emotionCounts,
    };
  }, [sessions]);

  // 2. Generate charts payload
  const emotionChartData = useMemo(() => {
    const raw = stats.emotionCounts;
    const keys = Object.keys(raw);
    if (keys.length === 0) {
      return [
        { name: 'Anxiety', value: 35, color: '#3B82F6' },
        { name: 'Stress', value: 25, color: '#2563EB' },
        { name: 'Sadness', value: 20, color: '#1E40AF' },
        { name: 'Neutral', value: 15, color: '#10B981' },
        { name: 'Joy', value: 5, color: '#F59E0B' },
      ];
    }
    const colors = ['#2563EB', '#3B82F6', '#1E40AF', '#10B981', '#F59E0B', '#EF4444'];
    return keys.map((key, index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: raw[key],
      color: colors[index % colors.length],
    }));
  }, [stats.emotionCounts]);

  const timelineChartData = useMemo(() => {
    if (sessions.length === 0) {
      return [
        { name: 'Jul 04', Stress: 60, Anxiety: 40, Confidence: 85 },
        { name: 'Jul 05', Stress: 70, Anxiety: 50, Confidence: 92 },
        { name: 'Jul 06', Stress: 45, Anxiety: 35, Confidence: 78 },
        { name: 'Jul 07', Stress: 50, Anxiety: 60, Confidence: 88 },
        { name: 'Jul 08', Stress: 80, Anxiety: 75, Confidence: 96 },
        { name: 'Jul 09', Stress: 35, Anxiety: 40, Confidence: 90 },
        { name: 'Jul 10', Stress: 20, Anxiety: 25, Confidence: 94 },
      ];
    }

    return sessions
      .slice()
      .reverse()
      .map((s) => {
        let confidenceTotal = 0;
        let count = 0;
        let stressScore = 0;
        let anxietyScore = 0;

        s.messages.forEach((m) => {
          if (m.sender === 'assistant' && m.prediction) {
            count++;
            confidenceTotal += m.confidence || 0;
            const pred = m.prediction.toLowerCase();
            if (pred.includes('stress') || pred.includes('anger')) stressScore += 50;
            if (pred.includes('anxiety') || pred.includes('sadness')) anxietyScore += 50;
          }
        });

        const formattedDate = new Date(s.createdAt).toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
        });

        return {
          name: formattedDate,
          Stress: Math.min(stressScore || 20, 100),
          Anxiety: Math.min(anxietyScore || 20, 100),
          Confidence: count > 0 ? Math.round((confidenceTotal / count) * 100) : 85,
        };
      });
  }, [sessions]);

  const recentLogs = useMemo(() => {
    const list: { id: string; text: string; prediction: string; confidence: number; timestamp: string }[] = [];
    sessions.forEach((s) => {
      s.messages.forEach((m) => {
        if (m.sender === 'assistant' && m.prediction) {
          list.push({
            id: m.id,
            text: s.title,
            prediction: m.prediction,
            confidence: m.confidence || 0,
            timestamp: m.timestamp,
          });
        }
      });
    });
    return list.slice(0, 5);
  }, [sessions]);

  const usingMockData = sessions.length === 0;

  if (!mounted) {
    // Premium Skeleton Loader while mounting
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-muted/20 border border-border/40 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card border border-border/40 rounded-2xl p-6 space-y-4 shadow-sm" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-card border border-border/40 rounded-2xl shadow-sm" />
          <div className="lg:col-span-4 h-80 bg-card border border-border/40 rounded-2xl shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 select-text"
    >
      
      {/* Sandbox Alert Header Banner */}
      {usingMockData && (
        <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl flex items-center space-x-3 shadow-sm">
          <Activity className="h-5 w-5 text-primary flex-shrink-0 animate-pulse" />
          <p className="text-xs text-muted leading-relaxed font-semibold">
            <span className="font-bold text-primary">Workspace Sandbox:</span> Displaying simulated diagnostics. Start a new dialogue in the chat workspace to index your active evaluations.
          </p>
        </div>
      )}

      {/* Counters Grid Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sessions */}
        <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Indexed Discussions</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Brain className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-text leading-none">
              <AnimatedCounter value={stats.totalSessions} />
            </h3>
            <span className="text-[10px] text-muted font-bold block mt-1 uppercase tracking-wide">Recorded in browser</span>
          </div>
        </div>

        {/* BERT Confidence Rate */}
        <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Classification Confidence</span>
            <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/20">
              <Heart className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-text leading-none">
              <AnimatedCounter value={stats.avgConfidence} suffix="%" decimals={1} />
            </h3>
            <span className="text-[10px] text-muted font-bold block mt-1 uppercase tracking-wide">Average Sequence Precision</span>
          </div>
        </div>

        {/* Helpful Feedback Ratio */}
        <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Evaluation Helpful Rate</span>
            <div className="p-2 rounded-lg bg-success/10 text-success border border-success/20">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-text leading-none">
              <AnimatedCounter value={stats.helpfulRatio} suffix="%" decimals={1} />
            </h3>
            <span className="text-[10px] text-muted font-bold block mt-1 uppercase tracking-wide">RLHF Rating Feedback Score</span>
          </div>
        </div>

        {/* Active Crisis Alerts */}
        <div className="glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Crisis Indicators</span>
            <div className={`p-2 rounded-lg border ${stats.crisisCount > 0 ? 'bg-danger/10 text-danger border-danger/20' : 'bg-muted/10 text-muted border-border/40'}`}>
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-text leading-none">
              <AnimatedCounter value={stats.crisisCount} />
            </h3>
            <span className="text-[10px] text-muted font-bold block mt-1 uppercase tracking-wide">Trigger overrides detected</span>
          </div>
        </div>

      </div>

      {/* Row 2 - Recharts visual blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mood progression Area Chart (8 Columns) */}
        <div className="lg:col-span-8 glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Mood Progression Trends</h3>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Chronological stress & anxiety indicators</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Area type="monotone" dataKey="Stress" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" isAnimationActive={true} animationDuration={1000} />
                <Area type="monotone" dataKey="Anxiety" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorAnxiety)" isAnimationActive={true} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotion Frequencies Pie Chart (4 Columns) */}
        <div className="lg:col-span-4 glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Detected Sentiment Ratios</h3>
            <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Distribution of predicted states</span>
          </div>
          <div className="h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={6}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                >
                  {emotionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-text">{stats.totalSessions}</span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest">Logs</span>
            </div>
          </div>
          {/* Custom Labels List */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-muted">
            {emotionChartData.map((entry, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3 - timeline & history */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Model Precision Line Chart (6 Columns) */}
        <div className="lg:col-span-6 glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Classifier Confidence Tracker</h3>
            <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Average BERT precision rates over consecutive discussions</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Confidence" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1.5 }} activeDot={{ r: 6 }} isAnimationActive={true} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent prediction history log listing (6 Columns) */}
        <div className="lg:col-span-6 glassmorphism-card rounded-2xl p-6 border border-border/40 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm tracking-tight text-text leading-tight">Recent Prediction History</h3>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mt-0.5">Recent BERT classifications logged locally</span>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-xs text-muted font-semibold text-center py-10">No prediction history logged yet.</p>
            ) : (
              <div className="divide-y divide-border/40">
                {recentLogs.map((log, idx) => (
                  <div key={log.id || idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="overflow-hidden mr-4">
                      <span className="font-bold text-text truncate block">{log.text}</span>
                      <span className="text-[10px] text-muted font-semibold mt-0.5 block">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded font-extrabold text-[10px] uppercase bg-primary/10 text-primary">
                        {log.prediction}
                      </span>
                      <span className="font-bold text-text/80">
                        {Math.round(log.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!usingMockData && (
            <button
              onClick={() => onSelectSession(sessions[0].id)}
              className="w-full text-center py-2.5 bg-muted/5 hover:bg-muted/10 border border-border/80 rounded-xl text-xs font-bold text-text transition-colors flex items-center justify-center space-x-1"
            >
              <span>Resume Active Dialogue</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

      </div>

    </motion.div>
  );
}
