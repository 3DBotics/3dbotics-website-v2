import { librarian } from './server/librarian';

async function testSlicerKnowledge() {
  console.log("Testing Slicer Knowledge Loading...\n");
  
  const testQuery = "how can i make an item that will weigh only 100 grams but the item to 3d print is 12 inches tall";
  
  try {
    console.log(`Query: "${testQuery}"\n`);
    
    // Get the context that would be used
    const context = await librarian['getRelevantContext'](testQuery, 'chat');
    
    console.log("=== RETRIEVED CONTEXT ===\n");
    console.log(context);
    
    console.log("\n=== CHECKING FOR SLICER CONTENT ===");
    if (context.includes('infill') || context.includes('perimeter') || context.includes('layer')) {
      console.log("✅ Slicer knowledge found in context!");
    } else {
      console.log("❌ Slicer knowledge NOT found in context");
    }
    
    if (context.includes('100 grams') || context.includes('lightweight')) {
      console.log("✅ Lightweight printing guidance found!");
    } else {
      console.log("❌ Lightweight guidance not found");
    }
    
  } catch (err) {
    console.error("Error:", err);
  }
}

testSlicerKnowledge();
