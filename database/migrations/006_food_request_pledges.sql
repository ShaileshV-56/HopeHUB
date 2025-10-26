-- Track pledges against food_requests by users
CREATE TABLE IF NOT EXISTS public.food_request_pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.food_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pledged_quantity TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_food_request_pledges_request_id ON public.food_request_pledges(request_id);
CREATE INDEX IF NOT EXISTS idx_food_request_pledges_user_id ON public.food_request_pledges(user_id);
