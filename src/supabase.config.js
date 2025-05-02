import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vglrebicssoyzqkenafp.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbHJlYmljc3NveXpxa2VuYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc5ODgsImV4cCI6MjA2MTczMzk4OH0.WLYHvr3IsV4IMwesz_XRjOJtcoXxpK09fYPeHwOmVgU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase }; 