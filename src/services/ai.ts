import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function callEdgeFunction(functionName: string, body: Record<string, unknown>) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed (${response.status})`);
  }

  return response.json();
}

export async function analyzeResume(resumeText: string, targetRole?: string) {
  return callEdgeFunction('resume-analyze', { resumeText, targetRole });
}

export async function getCareerMatches(skills: string[], experience: string, targetRole?: string) {
  return callEdgeFunction('career-match', { skills, experience, targetRole });
}

export async function getInterviewQuestion(sessionType: string, questionIndex: number) {
  return callEdgeFunction('interview-coach', { sessionType, questionIndex });
}

export async function chatWithAI(message: string, context?: string) {
  return callEdgeFunction('ai-chat', { message, context });
}
