-- Remove blood donors table, indexes, and triggers
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blood_donors' AND table_schema = 'public') THEN
    -- Drop triggers first if they exist
    IF EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE event_object_table = 'blood_donors' AND trigger_schema = 'public'
    ) THEN
      DROP TRIGGER IF EXISTS update_blood_donors_updated_at ON public.blood_donors;
    END IF;

    -- Drop indexes if they exist
    DROP INDEX IF EXISTS idx_blood_donors_blood_group;
    DROP INDEX IF EXISTS idx_blood_donors_city;
    DROP INDEX IF EXISTS idx_blood_donors_available;

    -- Finally drop table
    DROP TABLE IF EXISTS public.blood_donors CASCADE;
  END IF;
END $$;