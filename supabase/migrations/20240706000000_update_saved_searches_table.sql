
-- Update saved_searches table to ensure it has the notification fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_searches' AND column_name = 'notify_new_matches'
  ) THEN
    ALTER TABLE public.saved_searches ADD COLUMN notify_new_matches BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_searches' AND column_name = 'notification_frequency'
  ) THEN
    ALTER TABLE public.saved_searches ADD COLUMN notification_frequency TEXT DEFAULT 'daily';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_searches' AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.saved_searches ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_searches' AND column_name = 'last_viewed_at'
  ) THEN
    ALTER TABLE public.saved_searches ADD COLUMN last_viewed_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saved_searches' AND column_name = 'last_notified_at'
  ) THEN
    ALTER TABLE public.saved_searches ADD COLUMN last_notified_at TIMESTAMPTZ;
  END IF;
END;
$$;

-- Create RPC function to get saved searches with extended fields
CREATE OR REPLACE FUNCTION public.get_saved_searches(user_id UUID)
RETURNS SETOF saved_searches
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.saved_searches
  WHERE profile_id = user_id
  ORDER BY created_at DESC;
END;
$$;

-- Create job_import_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.job_import_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_import_config_id UUID NOT NULL REFERENCES public.job_import_configs(id),
  name TEXT NOT NULL,
  schedule TEXT NOT NULL, -- cron expression
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (job_import_config_id, name)
);

-- Enable RLS for job_import_schedules
ALTER TABLE public.job_import_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy for job_import_schedules
CREATE POLICY "Only owners can manage job import schedules"
ON public.job_import_schedules
USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner');
