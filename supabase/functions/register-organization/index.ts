import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterOrganizationRequest {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  specialization?: string;
  capacity?: number;
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

    const requestData: RegisterOrganizationRequest = await req.json();

    console.log('Registering helper organization:', { name: requestData.organizationName });

    // Validate required fields
    if (!requestData.organizationName || !requestData.contactPerson || 
        !requestData.email || !requestData.phone || !requestData.address) {
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

    // Validate capacity if provided
    if (requestData.capacity !== undefined && requestData.capacity < 0) {
      return new Response(
        JSON.stringify({ error: 'Capacity must be a positive number' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert organization into database
    const { data, error } = await supabase
      .from('helper_organizations')
      .insert({
        organization_name: requestData.organizationName,
        contact_person: requestData.contactPerson,
        email: requestData.email,
        phone: requestData.phone,
        address: requestData.address,
        specialization: requestData.specialization || null,
        capacity: requestData.capacity || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to register organization', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Organization registered successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Organization registered successfully',
        organization: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in register-organization function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
