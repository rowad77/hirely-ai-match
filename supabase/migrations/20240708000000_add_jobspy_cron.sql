
-- Create function to set up required extensions for cron jobs
CREATE OR REPLACE FUNCTION public.setup_cron_extensions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if extensions are installed
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  CREATE EXTENSION IF NOT EXISTS pg_net;
END;
$$;

-- Create function to set up the JobSpy cron job
CREATE OR REPLACE FUNCTION public.create_jobspy_cron_job()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove existing job if it exists
  PERFORM cron.unschedule('jobspy-scheduled-import');
  
  -- Schedule new job to run daily at midnight
  PERFORM cron.schedule(
    'jobspy-scheduled-import',
    '0 0 * * *', -- Daily at midnight
    $$
    SELECT net.http_post(
      'https://lckyfjxdnmwhmruvgpwn.supabase.co/functions/v1/scheduled-job-import',
      '{}',
      ARRAY[
        ('Authorization', 'Bearer ' || (SELECT value->>'api_key' FROM public.system_config WHERE key = 'jobspy_api_config'))::net.http_header
      ]
    );
    $$
  );
END;
$$;
