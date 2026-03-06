import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vwooykjymtuzxlmzggas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b295a2p5bXR1enhsbXpnZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzg5MzQsImV4cCI6MjA4NDY1NDkzNH0.ZnS82C64IqW1BUvbRaSDFYznM1RnTBpUIfQ_dHUv4yo'
);

async function testWisdomSearch() {
  console.log('🔍 Fetching all concierge wisdom entries...\n');
  
  const { data, error } = await supabase
    .from('wisdom_log')
    .select('*')
    .eq('category', 'concierge');
  
  if (error) {
    console.error('❌ Error fetching wisdom:', error);
    return;
  }
  
  console.log(`✅ Found ${data.length} wisdom entries:\n`);
  
  data.forEach((entry: any, index: number) => {
    console.log(`${index + 1}. Q: ${entry.question}`);
    console.log(`   A: ${entry.answer.substring(0, 100)}...`);
    console.log();
  });
  
  // Test keyword matching
  console.log('\n🔎 Testing keyword matching for "How much to franchise?":\n');
  
  const testQuery = 'How much to franchise?';
  const keywords = testQuery.toLowerCase().split(' ').filter(w => w.length > 2);
  
  console.log(`Keywords: ${keywords.join(', ')}`);
  
  data.forEach((entry: any) => {
    const questionLower = entry.question.toLowerCase();
    let score = 0;
    
    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) score += 50;
    }
    
    if (questionLower.includes(testQuery.toLowerCase())) score += 1000;
    
    if (score > 0) {
      console.log(`✅ Match: "${entry.question}" (score: ${score})`);
    }
  });
}

testWisdomSearch().catch(console.error);
