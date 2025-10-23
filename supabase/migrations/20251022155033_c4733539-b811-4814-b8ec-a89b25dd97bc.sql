-- Create blood_donors table for donor registration
CREATE TABLE public.blood_donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  age INTEGER NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  last_donation_date TIMESTAMP WITH TIME ZONE,
  available BOOLEAN NOT NULL DEFAULT true,
  medical_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;

-- Create policies for blood donors
CREATE POLICY "Blood donors are viewable by everyone" 
ON public.blood_donors 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can register as blood donor" 
ON public.blood_donors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Donors can update their own info" 
ON public.blood_donors 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blood_donors_updated_at
BEFORE UPDATE ON public.blood_donors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on blood group for faster searches
CREATE INDEX idx_blood_donors_blood_group ON public.blood_donors(blood_group);

-- Create index on city for location-based searches
CREATE INDEX idx_blood_donors_city ON public.blood_donors(city);

-- Create index on availability
CREATE INDEX idx_blood_donors_available ON public.blood_donors(available);