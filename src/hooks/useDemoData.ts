import { useMemo } from 'react';
import type {
  Profile, Resume, ResumeAnalysis, CareerMatch, InterviewSession,
  LearningRoadmap, RoadmapItem, Activity, Notification, Settings,
  DashboardStats, InterviewScoreBreakdown
} from '../types';

const demoProfile: Profile = {
  id: '1', user_id: '1', full_name: 'Arjun Kumar', email: 'arjun@example.com',
  target_role: 'Senior Backend Engineer', experience_level: 'Senior (5–8 years)',
  avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
};

const demoResumes: Resume[] = [
  { id: '1', user_id: '1', filename: 'resume_v3.2.pdf', file_url: '/uploads/resume_v3.2.pdf', file_size: 124000, file_type: 'pdf', version: 'v3.2', ats_score: 78, keyword_match_pct: 74, is_current: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '1', filename: 'resume_v3.1.pdf', file_url: '/uploads/resume_v3.1.pdf', file_size: 118000, file_type: 'pdf', version: 'v3.1', ats_score: 72, keyword_match_pct: 68, is_current: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: '1', filename: 'resume_v2.0.pdf', file_url: '/uploads/resume_v2.0.pdf', file_size: 98000, file_type: 'pdf', version: 'v2.0', ats_score: 61, keyword_match_pct: 52, is_current: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const demoAnalysis: ResumeAnalysis = {
  id: '1', resume_id: '1', user_id: '1',
  ats_compatibility: 82, keyword_density: 67, impact_statements: 74, readability: 89,
  format_structure: 85, grammar_spelling: 91, overall_score: 78,
  issues: [
    { type: 'error', title: 'Missing quantified impact', message: '3 bullet points lack metrics. Add numbers like improved latency by 40%' },
    { type: 'warning', title: 'Keyword gap: Kubernetes', message: 'High-frequency keyword in target JDs. Add container orchestration experience.' },
    { type: 'info', title: 'Summary section too vague', message: 'Make it specific to target role. Mention years of experience and key tech.' },
    { type: 'success', title: 'Strong action verbs', message: 'Great use of Architected, Optimized, Led throughout experience section.' },
  ],
  keywords_present: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'REST APIs', 'Microservices', 'Git'],
  keywords_missing: ['Kubernetes', 'gRPC', 'Terraform', 'Kafka', 'Prometheus'],
  ai_suggestions: [
    { original: 'Worked on backend services to make them faster', suggested: 'Architected and optimized 6 high-traffic microservices, reducing average API latency by 43% (P99: 120ms to 68ms) serving 2M+ daily requests' },
  ],
  created_at: new Date().toISOString()
};

const demoMatches: CareerMatch[] = [
  { id: '1', user_id: '1', company: 'Google', role: 'Senior Software Engineer — Backend', location: 'Bangalore, IN', salary_range: '₹52–68L', match_pct: 91, skills_matched: ['Python', 'Distributed Systems'], skills_missing: ['Kubernetes'], logo_color: '#3b82f6', logo_letter: 'G', is_new: true, created_at: new Date().toISOString() },
  { id: '2', user_id: '1', company: 'Stripe', role: 'Staff Engineer — Payments Platform', location: 'Remote', salary_range: '₹70–90L', match_pct: 87, skills_matched: ['Go', 'Ruby'], skills_missing: ['gRPC'], logo_color: '#7c6bff', logo_letter: 'S', is_new: true, created_at: new Date().toISOString() },
  { id: '3', user_id: '1', company: 'Atlassian', role: 'Senior Backend Engineer', location: 'Sydney / Remote', salary_range: '₹58–75L', match_pct: 79, skills_matched: ['Java'], skills_missing: ['Kafka', 'Terraform'], logo_color: '#f59e0b', logo_letter: 'A', is_new: false, created_at: new Date().toISOString() },
  { id: '4', user_id: '1', company: 'Uber', role: 'Engineering Lead — Backend', location: 'Bangalore', salary_range: '₹60–85L', match_pct: 74, skills_matched: ['Python'], skills_missing: ['Leadership', 'OKRs'], logo_color: '#22c55e', logo_letter: 'U', is_new: false, created_at: new Date().toISOString() },
  { id: '5', user_id: '1', company: 'Microsoft', role: 'Principal Engineer', location: 'Hyderabad', salary_range: '₹65–95L', match_pct: 68, skills_matched: ['Azure'], skills_missing: ['C#', 'ML Infra'], logo_color: '#ec4899', logo_letter: 'M', is_new: false, created_at: new Date().toISOString() },
  { id: '6', user_id: '1', company: 'Flipkart', role: 'Senior SWE — Infrastructure', location: 'Bangalore', salary_range: '₹40–55L', match_pct: 63, skills_matched: ['Python'], skills_missing: ['Infra-as-Code'], logo_color: '#3b82f6', logo_letter: 'F', is_new: false, created_at: new Date().toISOString() },
];

const demoSessions: InterviewSession[] = [
  { id: '1', user_id: '1', session_type: 'Behavioral', score: 74, questions_count: 8, duration_minutes: 24, confidence_level: 'High', communication_pct: 84, technical_depth_pct: 68, structured_thinking_pct: 76, problem_solving_pct: 92, confidence_signals_pct: 80, is_active: false, created_at: new Date().toISOString() },
  { id: '2', user_id: '1', session_type: 'System Design', score: 58, questions_count: 4, duration_minutes: 42, confidence_level: 'Medium', communication_pct: 72, technical_depth_pct: 55, structured_thinking_pct: 62, problem_solving_pct: 70, confidence_signals_pct: 65, is_active: false, created_at: new Date().toISOString() },
  { id: '3', user_id: '1', session_type: 'DSA', score: 81, questions_count: 5, duration_minutes: 38, confidence_level: 'High', communication_pct: 88, technical_depth_pct: 85, structured_thinking_pct: 82, problem_solving_pct: 90, confidence_signals_pct: 85, is_active: false, created_at: new Date().toISOString() },
  { id: '4', user_id: '1', session_type: 'HR Round', score: 88, questions_count: 6, duration_minutes: 18, confidence_level: 'High', communication_pct: 92, technical_depth_pct: 75, structured_thinking_pct: 85, problem_solving_pct: 80, confidence_signals_pct: 90, is_active: false, created_at: new Date().toISOString() },
];

const demoRoadmap: LearningRoadmap = {
  id: '1', user_id: '1', title: 'Backend Engineer → FAANG',
  target_role: 'Senior Backend Engineer', overall_progress: 47, estimated_weeks: 6,
  is_active: true, created_at: new Date().toISOString()
};

const demoRoadmapItems: RoadmapItem[] = [
  { id: '1', roadmap_id: '1', title: 'Data Structures & Algorithms', description: 'Arrays, Trees, Graphs, DP', order_index: 1, status: 'completed', duration_weeks: 2.0, progress_pct: 100, resources: [], created_at: new Date().toISOString() },
  { id: '2', roadmap_id: '1', title: 'System Design Fundamentals', description: 'Load balancing, Caching, CAP theorem', order_index: 2, status: 'completed', duration_weeks: 2.0, progress_pct: 100, resources: [], created_at: new Date().toISOString() },
  { id: '3', roadmap_id: '1', title: 'Kubernetes & Container Orchestration', description: 'Pods, Services, Deployments, Helm', order_index: 3, status: 'in_progress', duration_weeks: 2.0, progress_pct: 30, resources: [
    { type: 'course', title: 'CKA Certification', source: 'KodeKloud', duration: '20h', style: 'Hands-on' },
    { type: 'book', title: 'Kubernetes in Action', source: 'Marko Luksa', style: 'Manning' },
    { type: 'practice', title: 'KillerCoda Labs', source: 'Free browser-based k8s labs', style: 'Interactive' },
  ], created_at: new Date().toISOString() },
  { id: '4', roadmap_id: '1', title: 'gRPC & Microservices Communication', description: 'Protocol Buffers, Service mesh', order_index: 4, status: 'upcoming', duration_weeks: 1.5, progress_pct: 0, resources: [], created_at: new Date().toISOString() },
  { id: '5', roadmap_id: '1', title: 'Observability & Monitoring', description: 'Prometheus, Grafana, OpenTelemetry', order_index: 5, status: 'upcoming', duration_weeks: 1.0, progress_pct: 0, resources: [], created_at: new Date().toISOString() },
  { id: '6', roadmap_id: '1', title: 'Infrastructure as Code (Terraform)', description: 'AWS provisioning, state management', order_index: 6, status: 'upcoming', duration_weeks: 1.0, progress_pct: 0, resources: [], created_at: new Date().toISOString() },
];

const demoActivities: Activity[] = [
  { id: '1', user_id: '1', activity_type: 'resume_analyzed', title: 'Resume Analyzed', description: 'ATS score improved to 78', metadata: { ats_score: 78 }, score_improvement: 6, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', user_id: '1', activity_type: 'interview_completed', title: 'Behavioral Interview', description: 'Completed behavioral interview session', metadata: { score: 74 }, score_improvement: 8, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', user_id: '1', activity_type: 'career_match', title: 'Career Match Scan', description: '14 new career matches found for Senior SWE roles', metadata: { matches: 14 }, score_improvement: null, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', user_id: '1', activity_type: 'roadmap_progress', title: 'K8s Module', description: 'Completed React module in learning roadmap', metadata: { progress: 30 }, score_improvement: null, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', user_id: '1', activity_type: 'resume_uploaded', title: 'Resume Uploaded', description: 'Resume v3.1 uploaded and analyzed', metadata: { version: 'v3.1' }, score_improvement: null, created_at: new Date(Date.now() - 259200000).toISOString() },
];

const demoNotifications: Notification[] = [
  { id: '1', user_id: '1', title: 'New career match', message: 'Google Senior SWE — 91% compatibility based on your latest resume.', is_read: false, notification_type: 'career_match', created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: '2', user_id: '1', title: 'Resume tip', message: 'Adding Kubernetes to your resume could improve your ATS score by ~8 points.', is_read: false, notification_type: 'tip', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', user_id: '1', title: 'Interview insight', message: 'Your system design score (58) is below your average. We have added a targeted practice session.', is_read: false, notification_type: 'insight', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', user_id: '1', title: 'Weekly report ready', message: 'ATS score improved 8 points. 2 new skills added this week.', is_read: true, notification_type: 'report', created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: '5', user_id: '1', title: 'Roadmap update', message: 'Kubernetes module is 30% complete. Keep going!', is_read: true, notification_type: 'progress', created_at: new Date(Date.now() - 864000000).toISOString() },
];

const demoSettings: Settings = {
  id: '1', user_id: '1', notify_new_matches: true, notify_weekly_report: true,
  notify_interview_reminders: false, linkedin_connected: false, github_connected: true,
  drive_connected: false, plan_tier: 'pro'
};

export function useDemoData() {
  return useMemo(() => ({
    profile: demoProfile,
    resumes: demoResumes,
    analysis: demoAnalysis,
    matches: demoMatches,
    sessions: demoSessions,
    roadmap: demoRoadmap,
    roadmapItems: demoRoadmapItems,
    activities: demoActivities,
    notifications: demoNotifications,
    settings: demoSettings,
    stats: {
      atsScore: 78, atsTrend: 8,
      interviewsCompleted: 12, interviewsTrend: 4,
      careerMatches: 14, matchesTrend: 3,
      avgInterviewScore: 74, avgInterviewTrend: 2,
      skillGapsClosed: 5, skillGapsTrend: 2,
    } as DashboardStats,
    scoreBreakdown: {
      communication: 84, technicalDepth: 68, structuredThinking: 76,
      problemSolving: 92, confidenceSignals: 80,
    } as InterviewScoreBreakdown,
  }), []);
}
