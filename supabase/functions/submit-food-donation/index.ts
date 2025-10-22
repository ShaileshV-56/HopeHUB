import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubmitFoodDonationRequest {
  organization: string;
  contactPerson: string;
  email?: string;
  phone: string;
  foodType: string;
  quantity: string;
  location: string;
  description?: string;
  availableUntil: string;
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

    const requestData: SubmitFoodDonationRequest = await req.json();

    console.log('Submitting food donation:', { organization: requestData.organization });

    // Validate required fields
    if (!requestData.organization || !requestData.contactPerson || 
        !requestData.phone || !requestData.foodType || 
        !requestData.quantity || !requestData.location || !requestData.availableUntil) {
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

    // Validate email format if provided
    if (requestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate date
    const availableUntilDate = new Date(requestData.availableUntil);
    if (isNaN(availableUntilDate.getTime()) || availableUntilDate < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Available until date must be in the future' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert food donation into database
    const { data, error } = await supabase
      .from('food_donations')
      .insert({
        organization: requestData.organization,
        contact_person: requestData.contactPerson,
        email: requestData.email || null,
        phone: requestData.phone,
        food_type: requestData.foodType,
        quantity: requestData.quantity,
        location: requestData.location,
        description: requestData.description || null,
        available_until: requestData.availableUntil,
        status: 'available',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit food donation', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Food donation submitted successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Food donation submitted successfully',
        donation: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in submit-food-donation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
