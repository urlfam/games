
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vpwvcgqbepomocrnfurz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwd3ZjZ3FiZXBvbW9jcm5mdXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzczMTEsImV4cCI6MjA3ODI1MzMxMX0.nHHWj75CekP0HnQmEBLQGAqFPQE6RWRAifuL2rgQhVE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking Supabase connection...');
  const { data, error } = await supabase
    .from('game_stats')
    .select('game_slug, plays')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
}

check();
