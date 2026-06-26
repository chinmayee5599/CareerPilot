/*
# CareerPilot AI - Seed Data

Seed data for demo. All tables use user_id which must come from auth context.
Since this is a demo app, we create seed data that will be populated
after user registration. The frontend will handle demo data display.
*/

-- Create a function to get or create a demo user
CREATE OR REPLACE FUNCTION get_demo_user_id()
RETURNS uuid AS $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Try to find existing user by email
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@careerpilot.ai' LIMIT 1;
  
  IF demo_user_id IS NULL THEN
    -- Create demo user
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(),
      'demo@careerpilot.ai',
      crypt('demo123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Arjun Kumar"}'
    )
    RETURNING id INTO demo_user_id;
  END IF;
  
  RETURN demo_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In production, data is created per-user after sign-up.
-- The frontend will display demo data for unauthenticated users.
-- All tables are ready for user data insertion via the app.
