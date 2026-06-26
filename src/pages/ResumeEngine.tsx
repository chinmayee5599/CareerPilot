import { useState, useCallback, useRef } from 'react';
import {
  Upload, FileText, AlertCircle, CheckCircle, Info, AlertTriangle,
  ChevronDown, ChevronUp, Sparkles, Download, Copy, Check
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';
import type { AnalysisIssue } from '../types';

function IssueCard({ issue }: { issue: AnalysisIssue }) {
  const icons = {
    error: { icon: AlertCircle, color: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500' },
    warning: { icon: AlertTriangle, color: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' },
    info: { icon: Info, color: 'bg-blue-50 border-blue-200 text-blue-700', dot: 'bg-blue-500' },
    success: { icon: CheckCircle, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-500' },
  };
  const style = icons[issue.type];
  const Icon = style.icon;

  return (
    <div className={`rounded-lg border p-4 ${style.color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">{issue.title}</h4>
          <p className="text-sm mt-1 opacity-90">{issue.message}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ResumeEngine() {
  const { resumes, analysis } = useDemoData();
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleUpload(files[0]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, []);

  const handleUpload = useCallback((file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const copySuggestion = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Resume Engine</h1>
        <p className="text-slate-500 mt-1">Analyze, optimize, and track your resume versions.</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-8
          ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 bg-white'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />
        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Uploading resume...</p>
            <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">Drop your resume here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, DOC, DOCX (max 5MB)</p>
          </>
        )}
      </div>

      {/* Resume Versions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Resume Versions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2 px-3">Version</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2 px-3">ATS Score</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2 px-3">Keywords</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2 px-3">Size</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map(resume => (
                <tr
                  key={resume.id}
                  onClick={() => setSelectedResumeId(resume.id)}
                  className={`border-b border-slate-50 cursor-pointer transition-colors
                    ${selectedResumeId === resume.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{resume.version}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-sm font-bold ${(resume.ats_score || 0) >= 75 ? 'text-emerald-600' : (resume.ats_score || 0) >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {resume.ats_score}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-slate-600">{resume.keyword_match_pct}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-slate-600">{((resume.file_size || 0) / 1024).toFixed(0)} KB</span>
                  </td>
                  <td className="py-3 px-3">
                    {resume.is_current ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" /> Current
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-900 mb-4">ATS Analysis</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth={10} />
                  <circle
                    cx="64" cy="64" r="56" fill="none" stroke="#10b981" strokeWidth={10}
                    strokeLinecap="round" strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (analysis.overall_score || 0) / 100 * 351.86}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">{analysis.overall_score}</span>
                  <span className="text-xs text-slate-500">Overall</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <ScoreBar label="ATS Compatibility" value={analysis.ats_compatibility || 0} color="bg-blue-500" />
              <ScoreBar label="Keyword Density" value={analysis.keyword_density || 0} color="bg-purple-500" />
              <ScoreBar label="Impact Statements" value={analysis.impact_statements || 0} color="bg-emerald-500" />
              <ScoreBar label="Readability" value={analysis.readability || 0} color="bg-amber-500" />
              <ScoreBar label="Format & Structure" value={analysis.format_structure || 0} color="bg-rose-500" />
              <ScoreBar label="Grammar & Spelling" value={analysis.grammar_spelling || 0} color="bg-cyan-500" />
            </div>
          </div>

          {/* Issues & Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issues */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Issues Found</h2>
              <div className="space-y-3">
                {analysis.issues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900">AI Suggestions</h2>
              </div>
              <div className="space-y-4">
                {analysis.ai_suggestions.map((suggestion, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase">Original</span>
                      <p className="text-sm text-slate-600 mt-1 line-through">{suggestion.original}</p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-emerald-600 uppercase">Suggested</span>
                      <p className="text-sm text-slate-900 mt-1 font-medium">{suggestion.suggested}</p>
                    </div>
                    <button
                      onClick={() => copySuggestion(suggestion.suggested, `sugg-${i}`)}
                      className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {copiedId === `sugg-${i}` ? (
                        <><Check className="w-4 h-4" /> Copied</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy suggestion</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Keyword Analysis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Present ({analysis.keywords_present.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_present.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Missing ({analysis.keywords_missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_missing.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
