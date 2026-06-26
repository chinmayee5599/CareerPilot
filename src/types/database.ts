export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          email: string | null;
          target_role: string | null;
          experience_level: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          target_role?: string | null;
          experience_level?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          target_role?: string | null;
          experience_level?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id?: string;
          filename: string;
          file_url?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          version: string;
          ats_score?: number | null;
          keyword_match_pct?: number | null;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_url?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          version?: string;
          ats_score?: number | null;
          keyword_match_pct?: number | null;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_analyses: {
        Row: {
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
          issues: unknown;
          keywords_present: unknown;
          keywords_missing: unknown;
          ai_suggestions: unknown;
          created_at: string;
        };
      };
      career_matches: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          location: string | null;
          salary_range: string | null;
          match_pct: number;
          skills_matched: unknown;
          skills_missing: unknown;
          logo_color: string | null;
          logo_letter: string | null;
          is_new: boolean;
          created_at: string;
        };
      };
      interview_sessions: {
        Row: {
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
        };
      };
      interview_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
      };
      learning_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_role: string | null;
          overall_progress: number;
          estimated_weeks: number | null;
          is_active: boolean;
          created_at: string;
        };
      };
      roadmap_items: {
        Row: {
          id: string;
          roadmap_id: string;
          title: string;
          description: string | null;
          order_index: number;
          status: string;
          duration_weeks: number | null;
          progress_pct: number;
          resources: unknown;
          created_at: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          title: string;
          description: string | null;
          metadata: unknown;
          score_improvement: number | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          notification_type: string | null;
          created_at: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          notify_new_matches: boolean;
          notify_weekly_report: boolean;
          notify_interview_reminders: boolean;
          linkedin_connected: boolean;
          github_connected: boolean;
          drive_connected: boolean;
          plan_tier: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
