-- Core tables for HopeHUB backend
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- food_donations
CREATE TABLE IF NOT EXISTS public.food_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  food_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  available_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- helper_organizations
CREATE TABLE IF NOT EXISTS public.helper_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER,
  specialization TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- donation_requests
CREATE TABLE IF NOT EXISTS public.donation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
  helper_org_id UUID NOT NULL REFERENCES public.helper_organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- helper: update_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- triggers
CREATE TRIGGER update_food_donations_updated_at
  BEFORE UPDATE ON public.food_donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_helper_organizations_updated_at
  BEFORE UPDATE ON public.helper_organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- indexes
CREATE INDEX IF NOT EXISTS idx_food_donations_status ON public.food_donations(status);
CREATE INDEX IF NOT EXISTS idx_food_donations_available_until ON public.food_donations(available_until);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON public.donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_donation_id ON public.donation_requests(donation_id);
CREATE INDEX IF NOT EXISTS idx_donation_requests_helper_org_id ON public.donation_requests(helper_org_id);
