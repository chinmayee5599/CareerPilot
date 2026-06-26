import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, FileText, Mic, Briefcase, Target,
  ArrowRight, Clock, Zap, Award, ChevronRight
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

function StatCard({
  icon: Icon, label, value, trend, trendLabel, color
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  color: string;
}) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>
    </div>
  );
}

function ScoreRing({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={8} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
            strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  );
}

function ActivityItem({ activity }: { activity: ReturnType<typeof useDemoData>['activities'][0] }) {
  const icons: Record<string, React.ElementType> = {
    resume_analyzed: FileText,
    interview_completed: Mic,
    career_match: Briefcase,
    roadmap_progress: Target,
    resume_uploaded: FileText,
  };
  const Icon = icons[activity.activity_type] || Zap;
  const timeAgo = getTimeAgo(activity.created_at);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">{timeAgo}</span>
          {activity.score_improvement && (
            <span className="text-xs text-emerald-600 font-medium">+{activity.score_improvement} pts</span>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Dashboard() {
  const { stats, activities, matches, sessions, scoreBreakdown } = useDemoData();

  const topMatches = useMemo(() => matches.slice(0, 3), [matches]);
  const recentSessions = useMemo(() => sessions.slice(0, 3), [sessions]);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Welcome back, Arjun</h1>
        <p className="text-slate-500 mt-1">Here is how your career journey is progressing today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={FileText} label="ATS Score" value={stats.atsScore} trend={stats.atsTrend} trendLabel="vs last week" color="bg-blue-500" />
        <StatCard icon={Mic} label="Interviews" value={stats.interviewsCompleted} trend={stats.interviewsTrend} trendLabel="this month" color="bg-emerald-500" />
        <StatCard icon={Briefcase} label="Career Matches" value={stats.careerMatches} trend={stats.matchesTrend} trendLabel="new this week" color="bg-purple-500" />
        <StatCard icon={Award} label="Avg Interview" value={stats.avgInterviewScore} trend={stats.avgInterviewTrend} trendLabel="overall average" color="bg-amber-500" />
        <StatCard icon={Target} label="Skill Gaps" value={stats.skillGapsClosed} trend={stats.skillGapsTrend} trendLabel="closed this month" color="bg-rose-500" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Interview Score Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Interview Score Breakdown</h2>
          <div className="grid grid-cols-2 gap-4">
            <ScoreRing value={scoreBreakdown.communication} label="Communication" />
            <ScoreRing value={scoreBreakdown.technicalDepth} label="Technical Depth" />
            <ScoreRing value={scoreBreakdown.structuredThinking} label="Structured Thinking" />
            <ScoreRing value={scoreBreakdown.problemSolving} label="Problem Solving" />
            <ScoreRing value={scoreBreakdown.confidenceSignals} label="Confidence" />
          </div>
        </div>

        {/* Top Career Matches */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Top Career Matches</h2>
            <Link to="/career" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topMatches.map(match => (
              <div key={match.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: match.logo_color || '#3b82f6' }}
                >
                  {match.logo_letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{match.company}</p>
                  <p className="text-xs text-slate-500 truncate">{match.role}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${match.match_pct >= 80 ? 'text-emerald-600' : match.match_pct >= 60 ? 'text-amber-500' : 'text-slate-500'}`}>
                    {match.match_pct}%
                  </span>
                  {match.is_new && <span className="block text-[10px] text-emerald-600 font-medium">NEW</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interview Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Sessions</h2>
            <Link to="/interview" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              Practice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.map(session => (
              <div key={session.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{session.session_type}</p>
                  <p className="text-xs text-slate-500">{session.questions_count} questions · {session.duration_minutes} min</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${(session.score || 0) >= 75 ? 'text-emerald-600' : (session.score || 0) >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {session.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div>
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/resume" className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Analyze Resume</p>
                <p className="text-xs text-slate-500">Get ATS score & tips</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </Link>
            <Link to="/interview" className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Practice Interview</p>
                <p className="text-xs text-slate-500">AI-powered mock interview</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </Link>
            <Link to="/career" className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Find Matches</p>
                <p className="text-xs text-slate-500">AI-matched job roles</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </Link>
            <Link to="/roadmap" className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Learning Path</p>
                <p className="text-xs text-slate-500">Personalized roadmap</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
