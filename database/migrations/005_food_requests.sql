-- Food Requests table for recipients to request aid
CREATE TABLE IF NOT EXISTS public.food_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  organization TEXT,
  requested_item TEXT NOT NULL,
  quantity TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  needed_by TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- trigger to update updated_at
CREATE TRIGGER update_food_requests_updated_at
  BEFORE UPDATE ON public.food_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- indexes
CREATE INDEX IF NOT EXISTS idx_food_requests_status ON public.food_requests(status);
CREATE INDEX IF NOT EXISTS idx_food_requests_needed_by ON public.food_requests(needed_by);
