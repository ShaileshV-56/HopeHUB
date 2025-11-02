-- Add user ownership to key entities
ALTER TABLE IF EXISTS public.food_donations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_food_donations_user_id ON public.food_donations(user_id);

ALTER TABLE IF EXISTS public.helper_organizations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_helper_organizations_user_id ON public.helper_organizations(user_id);
