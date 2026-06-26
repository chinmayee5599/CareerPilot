import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Profile, Resume, ResumeAnalysis, CareerMatch, InterviewSession,
  LearningRoadmap, RoadmapItem, Activity, Notification, Settings,
} from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data as Profile);
        setLoading(false);
      });
  }, [userId]);

  return { profile, loading };
}

export function useResumes(userId: string | null) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setResumes(data as Resume[]);
        setLoading(false);
      });
  }, [userId]);

  return { resumes, loading };
}

export function useCareerMatches(userId: string | null) {
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('career_matches').select('*').eq('user_id', userId).order('match_pct', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMatches(data as CareerMatch[]);
        setLoading(false);
      });
  }, [userId]);

  return { matches, loading };
}

export function useInterviewSessions(userId: string | null) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('interview_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSessions(data as InterviewSession[]);
        setLoading(false);
      });
  }, [userId]);

  return { sessions, loading };
}

export function useLearningRoadmaps(userId: string | null) {
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('learning_roadmaps').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRoadmaps(data as LearningRoadmap[]);
        setLoading(false);
      });
  }, [userId]);

  return { roadmaps, loading };
}

export function useActivities(userId: string | null) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('activities').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
      .then(({ data, error }) => {
        if (!error && data) setActivities(data as Activity[]);
        setLoading(false);
      });
  }, [userId]);

  return { activities, loading };
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setNotifications(data as Notification[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }, [userId]);

  return { notifications, loading, markAsRead, markAllAsRead };
}

export function useSettings(userId: string | null) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('settings').select('*').eq('user_id', userId).maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setSettings(data as Settings);
        setLoading(false);
      });
  }, [userId]);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    if (!userId || !settings) return;
    const { error } = await supabase.from('settings').update(updates).eq('user_id', userId);
    if (!error) setSettings({ ...settings, ...updates });
  }, [userId, settings]);

  return { settings, loading, updateSettings };
}
