
-- Create system_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add comment
COMMENT ON TABLE public.system_config IS 'Stores system-wide configuration settings';

-- Create a jobspy configuration if it doesn't exist
INSERT INTO public.system_config (key, value)
VALUES ('jobspy_api_config', '{"api_url": "", "api_key": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Update saved_searches table to add notification fields
ALTER TABLE public.saved_searches 
ADD COLUMN IF NOT EXISTS notify_new_matches BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notification_frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_notified_at TIMESTAMPTZ;

-- Enable RLS
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Create policy so only authenticated users can select
CREATE POLICY "Authenticated users can read system_config"
ON public.system_config
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create policy so only owners can update
CREATE POLICY "Only owners can update system_config"
ON public.system_config
FOR UPDATE
USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner')
WITH CHECK (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner');

-- Create RPC function to check system configuration
CREATE OR REPLACE FUNCTION public.get_system_config(config_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN (SELECT value FROM public.system_config WHERE key = config_key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN '{}'::jsonb;
END;
$$;
