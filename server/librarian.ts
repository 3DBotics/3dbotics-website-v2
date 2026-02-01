import * as fs from 'fs';
import * as path from 'path';

interface KnowledgeChunk {
  text: string;
  source: string;
}

class Librarian {
  private knowledgeBase: KnowledgeChunk[] = [];
  private isInitialized = false;
  private lmStudioUrl = 'https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions';

  constructor() {
    console.log('[LIBRARIAN] Constructor called - starting initialization');
    this.initialize().catch(err => {
      console.error('[LIBRARIAN] FATAL: Initialization failed:', err);
    });
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('[LIBRARIAN] Already initialized');
      return;
    }
    
    try {
      const knowledgeDir = path.join(process.cwd(), 'knowledge');
      console.log(`[LIBRARIAN] Process CWD: ${process.cwd()}`);
      console.log(`[LIBRARIAN] Looking for knowledge directory at: ${knowledgeDir}`);
      
      if (!fs.existsSync(knowledgeDir)) {
        console.log('[LIBRARIAN] ERROR: Knowledge directory not found! Creating it...');
        fs.mkdirSync(knowledgeDir, { recursive: true });
        console.log('[LIBRARIAN] WARNING: Knowledge directory was empty. Please add .txt or .md files.');
        this.isInitialized = true;
        return;
      }

      const files = fs.readdirSync(knowledgeDir);
      console.log(`[LIBRARIAN] Found ${files.length} files in knowledge directory:`, files);
      
      let loadedCount = 0;
      for (const file of files) {
        if (file.endsWith('.txt') || file.endsWith('.md')) {
          try {
            const filePath = path.join(knowledgeDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            console.log(`[LIBRARIAN] ✓ Loaded ${file}: ${content.length} characters`);
            this.addTextToKnowledge(content, file);
            loadedCount++;
          } catch (fileError) {
            console.error(`[LIBRARIAN] ERROR loading ${file}:`, fileError);
          }
        } else {
          console.log(`[LIBRARIAN] Skipping ${file} (not .txt or .md)`);
        }
      }
      
      this.isInitialized = true;
      console.log(`[LIBRARIAN] ✅ INITIALIZATION COMPLETE: ${this.knowledgeBase.length} chunks from ${loadedCount} files.`);
      
      if (this.knowledgeBase.length === 0) {
        console.log('[LIBRARIAN] ⚠️ WARNING: No knowledge chunks loaded! AI will not have curriculum data.');
      }
    } catch (error) {
      console.error('[LIBRARIAN] FATAL ERROR during initialization:', error);
      this.isInitialized = true;
    }
  }

  private addTextToKnowledge(text: string, source: string) {
    const chunks = text.split(/\n\n+/).filter(c => c.trim().length > 20);
    console.log(`[LIBRARIAN] Adding ${chunks.length} chunks from ${source}`);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  private normalizeQuery(text: string): string[] {
    // Normalize the text for better matching
    const normalized = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim();
    
    // Extract keywords (filter out very short words)
    const keywords = normalized.split(' ').filter(w => w.length > 2);
    
    // Add common abbreviation expansions
    const expansions: string[] = [];
    keywords.forEach(keyword => {
      // Add the original keyword
      expansions.push(keyword);
      
      // Expand common abbreviations
      if (keyword === 'tt' || keyword === 'ttmotor' || keyword === 'ttmotors') {
        expansions.push('motor', 'gear', 'yellow');
      }
      if (keyword === 'uss' || keyword === 'ultrasonic') {
        expansions.push('sensor', 'distance', 'hcsr04', 'sonar');
      }
      if (keyword === 'l298n' || keyword === 'l298') {
        expansions.push('driver', 'bridge', 'motor');
      }
      if (keyword === 'arduino') {
        expansions.push('uno', 'microcontroller', 'brain');
      }
      if (keyword === 'battery' || keyword === 'batteries') {
        expansions.push('power', 'voltage', 'ampere', 'current');
      }
    });
    
    return [...new Set(expansions)]; // Remove duplicates
  }

  async getRelevantContext(query: string): Promise<string> {
    await this.initialize();
    
    console.log(`[LIBRARIAN] === SEARCH START ===`);
    console.log(`[LIBRARIAN] Query: "${query}"`);
    console.log(`[LIBRARIAN] Knowledge base size: ${this.knowledgeBase.length} chunks`);
    
    if (this.knowledgeBase.length === 0) {
      console.log('[LIBRARIAN] ⚠️ EMPTY KNOWLEDGE BASE - Cannot search!');
      return "";
    }

    const queryKeywords = this.normalizeQuery(query);
    console.log(`[LIBRARIAN] Expanded keywords: [${queryKeywords.join(', ')}]`);

    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      
      // Score based on keyword matches
      for (const keyword of queryKeywords) {
        const regex = new RegExp(keyword, 'gi');
        const matches = (chunkText.match(regex) || []).length;
        score += matches * 3; // Increased weight
      }
      
      // Bonus for exact phrase matches
      const queryLower = query.toLowerCase();
      if (chunkText.includes(queryLower)) {
        score += 15;
      }
      
      // Bonus for safety-related content when voltage/battery questions
      if ((query.includes('volt') || query.includes('battery') || query.includes('ampere')) &&
          (chunkText.includes('danger') || chunkText.includes('safety') || chunkText.includes('warning'))) {
        score += 10;
      }
      
      return { chunk, score };
    });

    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Increased from 5 to 8 chunks

    console.log(`[LIBRARIAN] Found ${bestChunks.length} relevant chunks`);
    
    if (bestChunks.length === 0) {
      console.log('[LIBRARIAN] ⚠️ NO MATCHES FOUND');
    } else {
      bestChunks.forEach((sc, idx) => {
        console.log(`[LIBRARIAN] Match ${idx + 1}: ${sc.chunk.source} (score: ${sc.score})`);
        console.log(`[LIBRARIAN]   Preview: ${sc.chunk.text.substring(0, 150)}...`);
      });
    }

    console.log(`[LIBRARIAN] === SEARCH END ===`);
    return bestChunks.map(sc => sc.chunk.text).join('\n\n---\n\n');
  }

  async generateResponse(query: string): Promise<string> {
    console.log(`[LIBRARIAN] >>> generateResponse called for: "${query}"`);
    
    try {
      const context = await this.getRelevantContext(query);
      console.log(`[LIBRARIAN] Context length: ${context.length} characters`);
      
      const systemPrompt = `YOU ARE THE 3DBOTICS® AI TEACHER FOR STUDENTS AGES 6-17.

🚨 CRITICAL SAFETY RULES - NEVER BREAK THESE:
1. You MUST answer ONLY using the FACTS provided in the "APPROVED CURRICULUM" section below.
2. If the FACTS do not contain the answer, say EXACTLY: "I don't have that information in my curriculum yet. Let me connect you with a human instructor."
3. NEVER use your general knowledge, training data, or assumptions.
4. NEVER make up component specifications, voltages, or currents.
5. NEVER suggest 12V for TT motors - they are 3V to 6V ONLY.
6. When students say "ttmotor" or "ttmotors", they mean TT Gear Motor (3-6V).
7. When students say "USS", they mean Ultrasonic Sensor (5V).
8. If you're unsure about a specification, say you don't know rather than guessing.

APPROVED CURRICULUM (FACTS YOU MUST USE):
${context || "NO CURRICULUM DATA FOUND FOR THIS QUERY."}

---

${context ? 
  "Answer the student's question using ONLY the facts above. Be friendly and educational, but NEVER add information not in the curriculum." : 
  "You MUST respond: 'I don't have that information in my curriculum yet. Let me connect you with a human instructor.'"}`;

      console.log(`[LIBRARIAN] Sending request to LM Studio...`);
      
      const response = await fetch(this.lmStudioUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
          ],
          temperature: 0,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`LM Studio HTTP ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      console.log(`[LIBRARIAN] ✓ AI Response received (${answer.length} chars)`);
      return answer;
    } catch (error) {
      console.error("[LIBRARIAN] ❌ ERROR in generateResponse:", error);
      return "I'm having trouble connecting to my brain right now. Please make sure LM Studio is running!";
    }
  }
}

export const librarian = new Librarian();
console.log('[LIBRARIAN] Module loaded and instance created');
