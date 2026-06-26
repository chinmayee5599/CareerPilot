export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  target_role: string | null;
  experience_level: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  filename: string;
  file_url: string | null;
  file_size: number | null;
  file_type: string | null;
  version: string;
  ats_score: number | null;
  keyword_match_pct: number | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  user_id: string;
  ats_compatibility: number | null;
  keyword_density: number | null;
  impact_statements: number | null;
  readability: number | null;
  format_structure: number | null;
  grammar_spelling: number | null;
  overall_score: number | null;
  issues: AnalysisIssue[];
  keywords_present: string[];
  keywords_missing: string[];
  ai_suggestions: AISuggestion[];
  created_at: string;
}

export interface AnalysisIssue {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

export interface AISuggestion {
  original: string;
  suggested: string;
}

export interface CareerMatch {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string | null;
  salary_range: string | null;
  match_pct: number;
  skills_matched: string[];
  skills_missing: string[];
  logo_color: string | null;
  logo_letter: string | null;
  is_new: boolean;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  session_type: string;
  score: number | null;
  questions_count: number;
  duration_minutes: number | null;
  confidence_level: string | null;
  communication_pct: number | null;
  technical_depth_pct: number | null;
  structured_thinking_pct: number | null;
  problem_solving_pct: number | null;
  confidence_signals_pct: number | null;
  is_active: boolean;
  created_at: string;
}

export interface InterviewMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'ai' | 'user';
  content: string;
  created_at: string;
}

export interface LearningRoadmap {
  id: string;
  user_id: string;
  title: string;
  target_role: string | null;
  overall_progress: number;
  estimated_weeks: number | null;
  is_active: boolean;
  created_at: string;
}

export interface RoadmapItem {
  id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  duration_weeks: number | null;
  progress_pct: number;
  resources: Resource[];
  created_at: string;
}

export interface Resource {
  type: string;
  title: string;
  source: string;
  duration?: string;
  style: string;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  score_improvement: number | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  notify_new_matches: boolean;
  notify_weekly_report: boolean;
  notify_interview_reminders: boolean;
  linkedin_connected: boolean;
  github_connected: boolean;
  drive_connected: boolean;
  plan_tier: string;
}

export interface DashboardStats {
  atsScore: number;
  atsTrend: number;
  interviewsCompleted: number;
  interviewsTrend: number;
  careerMatches: number;
  matchesTrend: number;
  avgInterviewScore: number;
  avgInterviewTrend: number;
  skillGapsClosed: number;
  skillGapsTrend: number;
}

export interface InterviewScoreBreakdown {
  communication: number;
  technicalDepth: number;
  structuredThinking: number;
  problemSolving: number;
  confidenceSignals: number;
}
