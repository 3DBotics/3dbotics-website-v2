import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vwooykjymtuzxlmzggas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b295a2p5bXR1enhsbXpnZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzg5MzQsImV4cCI6MjA4NDY1NDkzNH0.ZnS82C64IqW1BUvbRaSDFYznM1RnTBpUIfQ_dHUv4yo'
);

async function injectFranchiseDetails() {
  const wisdomEntries = [
    {
      category: 'concierge',
      question: 'What is included in the 3DBotics franchise package?',
      answer: `The 3DBotics Franchise Package (₱660,000 ALL-IN) includes:

EQUIPMENT:
✔️ 5 Brand New 3D Printers (calibrated)
✔️ 7 Kilos of 3D Filament (assorted colors)
✔️ 43" Smart TV for classroom instructions
✔️ 5 Complete 3D Printing Toolkits
✔️ 5 Storage Devices for file transfers

SOFTWARE & CONTENT:
✔️ 3 Major Apps for 3D modeling & robotics
✔️ Per Course Level Robot Projects for marketing & Display
✔️ Best Selling "ready-to-3DPrint" Files as your immediate products to be sold
✔️ Official Marketing Materials: HD logos and editable posters

TRAINING & SUPPORT:
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom sessions)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from the 3DBotics Main Office
✅ Instant ACCESS to our state-of-the-art AI web-platform for duplicable branch operations

OPERATIONAL COSTS:
✔️ Rental Space Security Deposit
✔️ 1st Two Months Rent fee

TOTAL ALL-IN COST: ₱660,000`
    },
    {
      category: 'concierge',
      question: 'How much does it cost to franchise 3DBotics?',
      answer: 'The all-in franchise cost for 3DBotics is ₱660,000. This includes equipment (5 3D printers, filament, TV, toolkits), software, Facilitator training, AI platform access, support, and initial operational costs (security deposit and 2 months rent).'
    },
    {
      category: 'concierge',
      question: 'What equipment do I get with the franchise?',
      answer: `You receive:
✔️ 5 Brand New 3D Printers (calibrated)
✔️ 7 Kilos of 3D Filament (assorted colors)
✔️ 43" Smart TV for classroom instructions
✔️ 5 Complete 3D Printing Toolkits
✔️ 5 Storage Devices for file transfers`
    },
    {
      category: 'concierge',
      question: 'What training and support do franchisees get?',
      answer: `You get:
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom sessions)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from the 3DBotics Main Office
✅ Instant ACCESS to our state-of-the-art AI web-platform for duplicable branch operations`
    },
    {
      category: 'concierge',
      question: 'What software and content are included?',
      answer: `You get:
✔️ 3 Major Apps for 3D modeling & robotics
✔️ Per Course Level Robot Projects for marketing & Display
✔️ Best Selling "ready-to-3DPrint" Files as your immediate products to be sold
✔️ Official Marketing Materials: HD logos and editable posters`
    }
  ];

  for (const entry of wisdomEntries) {
    const { error } = await supabase
      .from('wisdom_log')
      .insert([entry]);
    
    if (error) {
      console.error(`Error inserting "${entry.question}":`, error);
    } else {
      console.log(`✅ Inserted: "${entry.question}"`);
    }
  }

  console.log('\n✅ All franchise details injected into Supabase!');
}

injectFranchiseDetails().catch(console.error);
