import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bayhbdkazymofnqmbver.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheWhiZGthenltb2ZucW1idmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzI4ODMsImV4cCI6MjA5NDEwODg4M30.hpkgbrkc9OW7jJij275lfaIKKdht0HRYPNUd_G3ZXr4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('cliniques').select('id, nom, slug');
  console.log(data);
}

test();
