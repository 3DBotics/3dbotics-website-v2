import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vwooykjymtuzxlmzggas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b295a2p5bXR1enhsbXpnZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzg5MzQsImV4cCI6MjA4NDY1NDkzNH0.ZnS82C64IqW1BUvbRaSDFYznM1RnTBpUIfQ_dHUv4yo'
);

async function inspect() {
  console.log("=== INSPECTING WISDOM_LOG TABLE ===\n");
  
  // Get all wisdom entries
  const { data, error } = await supabase
    .from('wisdom_log')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("❌ Error fetching wisdom:", error);
    return;
  }

  console.log(`Total entries: ${data?.length || 0}\n`);
  
  if (data && data.length > 0) {
    data.forEach((entry: any, index: number) => {
      console.log(`[${index + 1}] Category: ${entry.category}`);
      console.log(`    Question: ${entry.question}`);
      console.log(`    Answer: ${entry.answer}`);
      console.log(`    Verified: ${entry.is_verified}`);
      console.log(`    Created: ${entry.created_at}`);
      console.log(`    ID: ${entry.id}`);
      console.log('---');
    });
  }

  // Check for problematic entries
  console.log("\n=== CHECKING FOR ISSUES ===");
  if (data) {
    const problematic = data.filter((e: any) => 
      e.answer.includes('2.5') || e.answer.includes('2,500') || e.answer.includes('2500')
    );
    
    if (problematic.length > 0) {
      console.log(`⚠️  Found ${problematic.length} entries with "2.5M" or similar:`);
      problematic.forEach((p: any) => {
        console.log(`  - ID: ${p.id}`);
        console.log(`    Q: ${p.question}`);
        console.log(`    A: ${p.answer}`);
      });
    }
  }
}

inspect();
