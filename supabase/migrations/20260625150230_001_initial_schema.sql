/*
# CareerPilot AI - Initial Schema Migration

1. New Tables
- `profiles` - User profiles extending auth.users
- `resumes` - Resume versions with ATS scores
- `resume_analyses` - Detailed ATS analysis results
- `career_matches` - AI-matched job roles
- `interview_sessions` - Interview session records
- `interview_messages` - Chat messages within sessions
- `learning_roadmaps` - Personalized learning paths
- `roadmap_items` - Individual learning modules
- `activities` - User activity log
- `notifications` - User notifications
- `settings` - User preferences

2. Security
- Enable RLS on all tables
- Owner-scoped policies for authenticated users
- Soft delete support via deleted_at columns
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  target_role text,
  experience_level text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL,
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text,
  file_size integer,
  file_type text,
  version text NOT NULL,
  ats_score integer,
  keyword_match_pct integer,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Resume analyses table
CREATE TABLE IF NOT EXISTS resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  ats_compatibility integer,
  keyword_density integer,
  impact_statements integer,
  readability integer,
  format_structure integer,
  grammar_spelling integer,
  overall_score integer,
  issues jsonb DEFAULT '[]',
  keywords_present jsonb DEFAULT '[]',
  keywords_missing jsonb DEFAULT '[]',
  ai_suggestions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Career matches table
CREATE TABLE IF NOT EXISTS career_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  role text NOT NULL,
  location text,
  salary_range text,
  match_pct integer NOT NULL,
  skills_matched jsonb DEFAULT '[]',
  skills_missing jsonb DEFAULT '[]',
  logo_color text,
  logo_letter text,
  is_new boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interview sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL,
  score integer,
  questions_count integer DEFAULT 0,
  duration_minutes integer,
  confidence_level text,
  communication_pct integer,
  technical_depth_pct integer,
  structured_thinking_pct integer,
  problem_solving_pct integer,
  confidence_signals_pct integer,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interview messages table
CREATE TABLE IF NOT EXISTS interview_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('ai', 'user')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Learning roadmaps table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_role text,
  overall_progress integer DEFAULT 0,
  estimated_weeks integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Roadmap items table
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('completed', 'in_progress', 'upcoming')),
  duration_weeks numeric(3,1),
  progress_pct integer DEFAULT 0,
  resources jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  score_improvement integer,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  notification_type text,
  created_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_new_matches boolean DEFAULT true,
  notify_weekly_report boolean DEFAULT true,
  notify_interview_reminders boolean DEFAULT false,
  linkedin_connected boolean DEFAULT false,
  github_connected boolean DEFAULT false,
  drive_connected boolean DEFAULT false,
  plan_tier text DEFAULT 'pro',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "select_own_profiles" ON profiles;
CREATE POLICY "select_own_profiles" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profiles" ON profiles;
CREATE POLICY "insert_own_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profiles" ON profiles;
CREATE POLICY "update_own_profiles" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profiles" ON profiles;
CREATE POLICY "delete_own_profiles" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Resumes policies
DROP POLICY IF EXISTS "select_own_resumes" ON resumes;
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_resumes" ON resumes;
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_resumes" ON resumes;
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_resumes" ON resumes;
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Resume analyses policies
DROP POLICY IF EXISTS "select_own_analyses" ON resume_analyses;
CREATE POLICY "select_own_analyses" ON resume_analyses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_analyses" ON resume_analyses;
CREATE POLICY "insert_own_analyses" ON resume_analyses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_analyses" ON resume_analyses;
CREATE POLICY "update_own_analyses" ON resume_analyses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_analyses" ON resume_analyses;
CREATE POLICY "delete_own_analyses" ON resume_analyses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Career matches policies
DROP POLICY IF EXISTS "select_own_matches" ON career_matches;
CREATE POLICY "select_own_matches" ON career_matches FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_matches" ON career_matches;
CREATE POLICY "insert_own_matches" ON career_matches FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_matches" ON career_matches;
CREATE POLICY "update_own_matches" ON career_matches FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_matches" ON career_matches;
CREATE POLICY "delete_own_matches" ON career_matches FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Interview sessions policies
DROP POLICY IF EXISTS "select_own_sessions" ON interview_sessions;
CREATE POLICY "select_own_sessions" ON interview_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON interview_sessions;
CREATE POLICY "insert_own_sessions" ON interview_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON interview_sessions;
CREATE POLICY "update_own_sessions" ON interview_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON interview_sessions;
CREATE POLICY "delete_own_sessions" ON interview_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Interview messages policies
DROP POLICY IF EXISTS "select_own_messages" ON interview_messages;
CREATE POLICY "select_own_messages" ON interview_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_messages" ON interview_messages;
CREATE POLICY "insert_own_messages" ON interview_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_messages" ON interview_messages;
CREATE POLICY "update_own_messages" ON interview_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_messages" ON interview_messages;
CREATE POLICY "delete_own_messages" ON interview_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Learning roadmaps policies
DROP POLICY IF EXISTS "select_own_roadmaps" ON learning_roadmaps;
CREATE POLICY "select_own_roadmaps" ON learning_roadmaps FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_roadmaps" ON learning_roadmaps;
CREATE POLICY "insert_own_roadmaps" ON learning_roadmaps FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_roadmaps" ON learning_roadmaps;
CREATE POLICY "update_own_roadmaps" ON learning_roadmaps FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_roadmaps" ON learning_roadmaps;
CREATE POLICY "delete_own_roadmaps" ON learning_roadmaps FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Roadmap items policies
DROP POLICY IF EXISTS "select_own_items" ON roadmap_items;
CREATE POLICY "select_own_items" ON roadmap_items FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps lr
      WHERE lr.id = roadmap_items.roadmap_id AND lr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_items" ON roadmap_items;
CREATE POLICY "insert_own_items" ON roadmap_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_roadmaps lr
      WHERE lr.id = roadmap_items.roadmap_id AND lr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_items" ON roadmap_items;
CREATE POLICY "update_own_items" ON roadmap_items FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps lr
      WHERE lr.id = roadmap_items.roadmap_id AND lr.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_roadmaps lr
      WHERE lr.id = roadmap_items.roadmap_id AND lr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_items" ON roadmap_items;
CREATE POLICY "delete_own_items" ON roadmap_items FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM learning_roadmaps lr
      WHERE lr.id = roadmap_items.roadmap_id AND lr.user_id = auth.uid()
    )
  );

-- Activities policies
DROP POLICY IF EXISTS "select_own_activities" ON activities;
CREATE POLICY "select_own_activities" ON activities FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_activities" ON activities;
CREATE POLICY "insert_own_activities" ON activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_activities" ON activities;
CREATE POLICY "update_own_activities" ON activities FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_activities" ON activities;
CREATE POLICY "delete_own_activities" ON activities FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Settings policies
DROP POLICY IF EXISTS "select_own_settings" ON settings;
CREATE POLICY "select_own_settings" ON settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_settings" ON settings;
CREATE POLICY "insert_own_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_settings" ON settings;
CREATE POLICY "update_own_settings" ON settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_settings" ON settings;
CREATE POLICY "delete_own_settings" ON settings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_current ON resumes(user_id, is_current);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id ON resume_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON career_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_pct ON career_matches(user_id, match_pct DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON interview_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON interview_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
