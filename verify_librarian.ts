import { librarian } from './server/librarian';

async function verify() {
  console.log("--- Verifying Librarian Wisdom Loop ---");
  
  const testQ = "What is the 3DBotics Golden Rule?";
  const testA = "The Golden Rule is: Respect the Robot, Respect the Rival.";
  
  try {
    console.log("Step 1: Teaching Librarian...");
    await librarian.learn('concierge', testQ, testA);
    console.log("✅ Wisdom saved.");

    console.log("Step 2: Retrieving Context...");
    // Wait a bit for Supabase indexing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const context = await librarian.getRelevantContext("Golden Rule", "concierge");
    console.log("Retrieved Context:", context);

    if (context.includes(testA)) {
      console.log("\n✅ SUCCESS: Librarian retrieved the correct wisdom from Supabase!");
    } else {
      console.log("\n❌ FAILURE: Wisdom not found in context. Check Supabase text search.");
    }
  } catch (err) {
    console.error("❌ Error during verification:", err);
  }
}

verify();
