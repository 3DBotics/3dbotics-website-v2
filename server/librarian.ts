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
    // Initialize immediately when the module loads
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
      this.isInitialized = true; // Mark as initialized to prevent infinite retries
    }
  }

  private addTextToKnowledge(text: string, source: string) {
    const chunks = text.split(/\n\n+/).filter(c => c.trim().length > 20);
    console.log(`[LIBRARIAN] Adding ${chunks.length} chunks from ${source}`);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
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

    const queryLower = query.toLowerCase();
    const queryKeywords = queryLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);

    console.log(`[LIBRARIAN] Keywords: [${queryKeywords.join(', ')}]`);

    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      
      for (const keyword of queryKeywords) {
        const matches = (chunkText.match(new RegExp(keyword, 'g')) || []).length;
        score += matches * 2;
      }
      
      if (chunkText.includes(queryLower)) {
        score += 10;
      }
      
      return { chunk, score };
    });

    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

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
      
      const systemPrompt = `YOU ARE THE 3DBOTICS® AI TEACHER.

CRITICAL RULES - NEVER BREAK THESE:
1. You MUST answer ONLY using the FACTS provided below in the "APPROVED CURRICULUM" section.
2. If the FACTS do not contain the answer, you MUST say EXACTLY: "I don't have that information in my curriculum yet. Let me connect you with a human instructor."
3. NEVER use your general knowledge or training data.
4. NEVER make up names, dates, or facts.
5. NEVER say "I think" or "probably" - only state facts from the curriculum.
6. NEVER be sarcastic or refuse to answer if the information is in the curriculum.
7. If asked about the founder, ONLY use the name from the APPROVED CURRICULUM below.
8. For electronics questions, ONLY use voltage/current specs from the APPROVED CURRICULUM.

APPROVED CURRICULUM:
${context || "NO CURRICULUM DATA FOUND FOR THIS QUERY."}

---

${context ? "Answer the student's question using ONLY the facts above." : "You MUST respond: 'I don't have that information in my curriculum yet. Let me connect you with a human instructor.'"}`;

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
          max_tokens: 500
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

// Create and export a single instance
export const librarian = new Librarian();
console.log('[LIBRARIAN] Module loaded and instance created');
