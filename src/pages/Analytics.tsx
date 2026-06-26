import { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, BarChart3, Calendar, ArrowUpRight,
  ArrowDownRight, Target, Zap, Award
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

function SimpleBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-6 bg-slate-100 rounded-md overflow-hidden">
        <div
          className={`h-full rounded-md transition-all duration-1000 ease-out flex items-center justify-end px-2`}
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          <span className="text-[10px] text-white font-medium">{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  );
}

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((v - min) / range) * 100;
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
}

export default function Analytics() {
  const { stats, sessions, scoreBreakdown } = useDemoData();

  const interviewScores = useMemo(() => sessions.map(s => s.score || 0), [sessions]);
  const sessionTypes = useMemo(() => sessions.map(s => s.session_type), [sessions]);

  const weeklyData = [
    { day: 'Mon', ats: 72, interviews: 1 },
    { day: 'Tue', ats: 74, interviews: 0 },
    { day: 'Wed', ats: 75, interviews: 2 },
    { day: 'Thu', ats: 76, interviews: 1 },
    { day: 'Fri', ats: 78, interviews: 0 },
    { day: 'Sat', ats: 78, interviews: 1 },
    { day: 'Sun', ats: 78, interviews: 0 },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your progress and identify improvement areas.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">ATS Score</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{stats.atsTrend}%
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.atsScore}</p>
          <MiniLineChart data={[70, 72, 74, 76, 78]} color="#10b981" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Interviews</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{stats.interviewsTrend}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.interviewsCompleted}</p>
          <MiniLineChart data={[8, 9, 10, 11, 12]} color="#3b82f6" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Score</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{stats.avgInterviewTrend}%
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.avgInterviewScore}</p>
          <MiniLineChart data={[68, 70, 72, 73, 74]} color="#f59e0b" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Skill Gaps</span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{stats.skillGapsTrend}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.skillGapsClosed}</p>
          <MiniLineChart data={[2, 3, 3, 4, 5]} color="#8b5cf6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Weekly Activity</h2>
          <div className="space-y-4">
            {weeklyData.map(day => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500 w-8">{day.day}</span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${day.ats}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{day.ats}</span>
                </div>
                <div className="flex items-center gap-1 w-16">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-slate-500">{day.interviews}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Score Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Interview Scores by Type</h2>
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <SimpleBar
                key={session.id}
                value={session.score || 0}
                max={100}
                color={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i % 4]}
                label={session.session_type}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Score Dimensions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Score Dimensions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Communication', value: scoreBreakdown.communication, icon: Target, color: '#3b82f6' },
            { label: 'Technical Depth', value: scoreBreakdown.technicalDepth, icon: Zap, color: '#8b5cf6' },
            { label: 'Structured Thinking', value: scoreBreakdown.structuredThinking, icon: BarChart3, color: '#10b981' },
            { label: 'Problem Solving', value: scoreBreakdown.problemSolving, icon: Award, color: '#f59e0b' },
            { label: 'Confidence', value: scoreBreakdown.confidenceSignals, icon: TrendingUp, color: '#ec4899' },
          ].map(dim => (
            <div key={dim.label} className="text-center p-4 rounded-lg bg-slate-50">
              <dim.icon className="w-5 h-5 mx-auto mb-2" style={{ color: dim.color }} />
              <p className="text-2xl font-bold text-slate-900">{dim.value}</p>
              <p className="text-xs text-slate-500 mt-1">{dim.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Improvement Areas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-sm text-amber-800">System Design</h3>
            </div>
            <p className="text-xs text-amber-700">Score: 58/100. Focus on CAP theorem and load balancing patterns.</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm text-blue-800">Technical Depth</h3>
            </div>
            <p className="text-xs text-blue-700">Score: 68/100. Add more specific implementation details.</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-sm text-emerald-800">Problem Solving</h3>
            </div>
            <p className="text-xs text-emerald-700">Score: 92/100. Excellent! Keep practicing edge cases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
