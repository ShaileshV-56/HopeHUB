-- Remove blood donor features for food-only focus
DROP TRIGGER IF EXISTS update_blood_donors_updated_at ON public.blood_donors;
DROP INDEX IF EXISTS idx_blood_donors_blood_group;
DROP INDEX IF EXISTS idx_blood_donors_city;
DROP INDEX IF EXISTS idx_blood_donors_available;
DROP TABLE IF EXISTS public.blood_donors;
