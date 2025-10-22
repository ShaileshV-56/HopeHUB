import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateDonationRequestRequest {
  donationId: string;
  helperOrgId: string;
  notes?: string;
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

    const requestData: CreateDonationRequestRequest = await req.json();

    console.log('Creating donation request:', { donationId: requestData.donationId, helperOrgId: requestData.helperOrgId });

    // Validate required fields
    if (!requestData.donationId || !requestData.helperOrgId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: donationId and helperOrgId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify donation exists and is available
    const { data: donation, error: donationError } = await supabase
      .from('food_donations')
      .select('*')
      .eq('id', requestData.donationId)
      .eq('status', 'available')
      .single();

    if (donationError || !donation) {
      return new Response(
        JSON.stringify({ error: 'Donation not found or not available' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify organization exists
    const { data: organization, error: orgError } = await supabase
      .from('helper_organizations')
      .select('*')
      .eq('id', requestData.helperOrgId)
      .single();

    if (orgError || !organization) {
      return new Response(
        JSON.stringify({ error: 'Helper organization not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if a request already exists for this donation and organization
    const { data: existingRequest } = await supabase
      .from('donation_requests')
      .select('*')
      .eq('donation_id', requestData.donationId)
      .eq('helper_org_id', requestData.helperOrgId)
      .maybeSingle();

    if (existingRequest) {
      return new Response(
        JSON.stringify({ error: 'A request already exists for this donation and organization' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create donation request
    const { data, error } = await supabase
      .from('donation_requests')
      .insert({
        donation_id: requestData.donationId,
        helper_org_id: requestData.helperOrgId,
        notes: requestData.notes || null,
        status: 'requested',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create donation request', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Donation request created successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Donation request created successfully',
        request: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in create-donation-request function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
