import { librarian } from './server/librarian';

async function verify() {
  console.log("--- Verifying Enhanced Wisdom Enforcement ---");
  
  const testQ = "paano magfranchise";
  
  try {
    console.log(`Testing query: "${testQ}"`);
    const context = await librarian.getRelevantContext(testQ, "concierge");
    
    console.log("\n--- RETRIEVED CONTEXT ---");
    console.log(context);

    if (context.includes("⭐ FOUNDER'S VERIFIED ANSWERS")) {
      console.log("\n✅ SUCCESS: Enhanced search logic prioritized Founder's Verified Answers!");
    } else {
      console.log("\n❌ FAILURE: Founder's Answers not found in context.");
    }

    if (context.includes("₱660,000")) {
      console.log("✅ SUCCESS: Correct price (660k) found in context.");
    } else {
      console.log("❌ FAILURE: Correct price not found in context.");
    }
    
    // Test a partial match
    const partialQ = "franchise";
    console.log(`\nTesting partial query: "${partialQ}"`);
    const partialContext = await librarian.getRelevantContext(partialQ, "concierge");
    if (partialContext.includes("₱660,000")) {
      console.log("✅ SUCCESS: Partial match search also found the wisdom!");
    } else {
      console.log("❌ FAILURE: Partial match failed.");
    }

  } catch (err) {
    console.error("❌ Error during verification:", err);
  }
}

verify();
