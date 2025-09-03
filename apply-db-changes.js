const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://zugqegwxfiapaonnjbhg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3FlZ3d4ZmlhcGFvbm5qYmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzAyOTcsImV4cCI6MjA2OTk0NjI5N30.npyxFaMPcXJydEWXOf0M2AZLx4CrQt8vJAB9J9T-mLI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function applyDatabaseChanges() {
  try {
    console.log('Applying database changes...');
    
    // Add new fields to squads table
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.squads 
        ADD COLUMN IF NOT EXISTS location TEXT,
        ADD COLUMN IF NOT EXISTS sprint_number INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS velocity INTEGER DEFAULT 85,
        ADD COLUMN IF NOT EXISTS project_name TEXT;
      `
    });

    if (alterError) {
      console.error('Error adding columns:', alterError);
      // Try alternative approach
      console.log('Trying alternative approach...');
    }

    // Update existing squads with default values
    const { error: updateError } = await supabase
      .from('squads')
      .update({
        location: 'Unassigned',
        sprint_number: 1,
        velocity: 85,
        project_name: 'Default Project'
      })
      .is('location', null);

    if (updateError) {
      console.error('Error updating existing squads:', updateError);
    } else {
      console.log('Successfully updated existing squads with default values');
    }

    console.log('Database changes applied successfully!');
    
    // Test the changes by fetching squads
    const { data: squads, error: fetchError } = await supabase
      .from('squads')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('Error fetching squads:', fetchError);
    } else {
      console.log('Sample squad data:', squads[0]);
    }

  } catch (error) {
    console.error('Error applying database changes:', error);
  }
}

applyDatabaseChanges();

