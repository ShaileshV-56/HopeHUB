import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterDonorRequest {
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  age: number;
  address: string;
  city: string;
  state: string;
  lastDonationDate?: string;
  medicalConditions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: RegisterDonorRequest = await req.json();

    console.log('Registering blood donor:', { email: requestData.email, bloodGroup: requestData.bloodGroup });

    // Validate required fields
    if (!requestData.fullName || !requestData.email || !requestData.phone || 
        !requestData.bloodGroup || !requestData.age || !requestData.address || 
        !requestData.city || !requestData.state) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate phone number (must be 10 digits)
    if (!/^\d{10}$/.test(requestData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Phone number must be exactly 10 digits' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate age
    if (requestData.age < 18 || requestData.age > 65) {
      return new Response(
        JSON.stringify({ error: 'Age must be between 18 and 65' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate blood group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(requestData.bloodGroup)) {
      return new Response(
        JSON.stringify({ error: 'Invalid blood group' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert donor into database
    const { data, error } = await supabase
      .from('blood_donors')
      .insert({
        full_name: requestData.fullName,
        email: requestData.email,
        phone: requestData.phone,
        blood_group: requestData.bloodGroup,
        age: requestData.age,
        address: requestData.address,
        city: requestData.city,
        state: requestData.state,
        last_donation_date: requestData.lastDonationDate || null,
        medical_conditions: requestData.medicalConditions || null,
        available: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to register donor', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Donor registered successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Donor registered successfully',
        donor: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in register-donor function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
