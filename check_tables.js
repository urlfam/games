const { createClient } = require('@supabase/supabase-js');

// Using the credentials from check_supabase.js
const supabaseUrl = 'https://vpwvcgqbepomocrnfurz.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwd3ZjZ3FiZXBvbW9jcm5mdXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzczMTEsImV4cCI6MjA3ODI1MzMxMX0.nHHWj75CekP0HnQmEBLQGAqFPQE6RWRAifuL2rgQhVE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking games table...');
  const { data, error } = await supabase.from('games').select('*').limit(1);

  if (error) {
    console.error('Error selecting from games:', error.message);
  } else {
    console.log('Games table exists. Rows:', data.length);
    if (data.length > 0) console.log('Sample:', data[0]);
  }
}

check();
