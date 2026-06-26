import { useState } from 'react';
import {
  Map, CheckCircle2, Circle, Clock, BookOpen, Play,
  Award, ChevronRight, Lock, ExternalLink
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

function ProgressBar({ progress, color = 'bg-emerald-500' }: { progress: number; color?: string }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function RoadmapItemCard({
  item, index, isExpanded, onToggle
}: {
  item: ReturnType<typeof useDemoData>['roadmapItems'][0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    in_progress: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
    upcoming: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-300' },
  };
  const style = statusConfig[item.status];
  const Icon = style.icon;

  return (
    <div className={`relative rounded-xl border ${style.border} ${style.bg} transition-all ${isExpanded ? 'shadow-md' : ''}`}>
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-slate-200" />
      )}

      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className={`w-10 h-10 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-200'} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${item.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm ${item.status === 'upcoming' ? 'text-slate-500' : 'text-slate-900'}`}>
              {item.title}
            </h3>
            {item.status === 'in_progress' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
                IN PROGRESS
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1">
              <ProgressBar
                progress={item.progress_pct}
                color={item.status === 'completed' ? 'bg-emerald-500' : item.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 w-10 text-right">{item.progress_pct}%</span>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-200/50">
          <div className="ml-14">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs text-slate-500">Duration: {item.duration_weeks} weeks</span>
              <span className="text-xs text-slate-500">{item.resources.length} resources</span>
            </div>
            {item.resources.length > 0 ? (
              <div className="space-y-2">
                {item.resources.map((resource, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {resource.type === 'course' ? <Play className="w-4 h-4 text-slate-600" /> :
                       resource.type === 'book' ? <BookOpen className="w-4 h-4 text-slate-600" /> :
                       <Award className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{resource.title}</p>
                      <p className="text-xs text-slate-500">{resource.source} · {resource.style}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Resources will be available when you start this module.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearningRoadmap() {
  const { roadmap, roadmapItems } = useDemoData();
  const [expandedId, setExpandedId] = useState<string | null>(
    roadmapItems.find(i => i.status === 'in_progress')?.id || null
  );

  const completedCount = roadmapItems.filter(i => i.status === 'completed').length;
  const totalCount = roadmapItems.length;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Learning Roadmap</h1>
        <p className="text-slate-500 mt-1">Personalized path to reach your career goals.</p>
      </div>

      {/* Roadmap Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Map className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{roadmap.title}</h2>
              <p className="text-sm text-slate-500">Target: {roadmap.target_role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">{roadmap.overall_progress}%</p>
            <p className="text-xs text-slate-500">{completedCount}/{totalCount} modules completed</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar progress={roadmap.overall_progress} />
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {roadmap.estimated_weeks} weeks estimated
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> {roadmapItems.filter(i => i.status === 'completed').length} completed
          </span>
        </div>
      </div>

      {/* Roadmap Items */}
      <div className="space-y-4">
        {roadmapItems.map((item, index) => (
          <RoadmapItemCard
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedId === item.id}
            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        ))}
      </div>
    </div>
  );
}
