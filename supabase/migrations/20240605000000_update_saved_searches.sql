
-- Update saved_searches table to add notification fields and tags
ALTER TABLE public.saved_searches
ADD COLUMN IF NOT EXISTS notify_new_matches boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_frequency text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS last_viewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_notified_at timestamp with time zone;

-- Create a background job scheduler table for periodic job imports
CREATE TABLE IF NOT EXISTS public.job_import_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cron_schedule text NOT NULL,
  job_import_config_id uuid REFERENCES public.job_import_configs(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  last_run_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add system_config table for global settings including JobSpy API URL and key
CREATE TABLE IF NOT EXISTS public.system_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert initial JobSpy configuration values if they don't exist
INSERT INTO public.system_config (key, value, description)
VALUES 
  ('jobspy_api_config', '{"api_url": "", "api_key": ""}', 'Configuration for JobSpy API integration'),
  ('job_import_defaults', '{"frequency": "daily", "max_jobs_per_import": 100}', 'Default settings for job imports')
ON CONFLICT (key) DO NOTHING;
