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

  async initialize() {
    if (this.isInitialized) return;
    
    const knowledgeDir = path.join(process.cwd(), 'knowledge');
    console.log(`[LIBRARIAN] Looking for knowledge directory at: ${knowledgeDir}`);
    
    if (!fs.existsSync(knowledgeDir)) {
      console.log('[LIBRARIAN] ERROR: Knowledge directory not found!');
      fs.mkdirSync(knowledgeDir);
      return;
    }

    const files = fs.readdirSync(knowledgeDir);
    console.log(`[LIBRARIAN] Found ${files.length} files in knowledge directory:`, files);
    
    for (const file of files) {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        const filePath = path.join(knowledgeDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(`[LIBRARIAN] Loading ${file}: ${content.length} characters`);
        this.addTextToKnowledge(content, file);
      } else {
        console.log(`[LIBRARIAN] Skipping ${file} (not .txt or .md)`);
      }
    }
    
    this.isInitialized = true;
    console.log(`[LIBRARIAN] ✅ Initialized with ${this.knowledgeBase.length} chunks from ${files.filter(f => f.endsWith('.txt') || f.endsWith('.md')).length} files.`);
  }

  private addTextToKnowledge(text: string, source: string) {
    // Split by paragraphs (double newline) and by sections (single newline with headers)
    const chunks = text.split(/\n\n+/).filter(c => c.trim().length > 20);
    console.log(`[LIBRARIAN] Adding ${chunks.length} chunks from ${source}`);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  async getRelevantContext(query: string): Promise<string> {
    await this.initialize();
    
    if (this.knowledgeBase.length === 0) {
      console.log('[LIBRARIAN] ⚠️ WARNING: Knowledge base is EMPTY!');
      return "";
    }

    console.log(`[LIBRARIAN] Searching ${this.knowledgeBase.length} chunks for: "${query}"`);

    // Improved keyword extraction
    const queryLower = query.toLowerCase();
    const queryKeywords = queryLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);

    console.log(`[LIBRARIAN] Keywords: ${queryKeywords.join(', ')}`);

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
      console.log('[LIBRARIAN] ⚠️ NO RELEVANT CHUNKS FOUND!');
      console.log('[LIBRARIAN] Sample chunk texts:', this.knowledgeBase.slice(0, 3).map(c => c.text.substring(0, 100)));
    } else {
      bestChunks.forEach(sc => {
        console.log(`[LIBRARIAN] ✓ ${sc.chunk.source} (score: ${sc.score}): ${sc.chunk.text.substring(0, 100)}...`);
      });
    }

    return bestChunks.map(sc => sc.chunk.text).join('\n\n---\n\n');
  }

  async generateResponse(query: string): Promise<string> {
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

APPROVED CURRICULUM:
${context || "NO CURRICULUM DATA FOUND FOR THIS QUERY."}

---

${context ? "Answer the student's question using ONLY the facts above." : "You MUST respond: 'I don't have that information in my curriculum yet. Let me connect you with a human instructor.'"}`;

    try {
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
        throw new Error(`LM Studio responded with status: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      console.log(`[LIBRARIAN] AI Response: ${answer.substring(0, 200)}...`);
      return answer;
    } catch (error) {
      console.error("[LIBRARIAN] ❌ Error connecting to LM Studio:", error);
      return "I'm having trouble connecting to my brain right now. Please make sure LM Studio is running!";
    }
  }
}

export const librarian = new Librarian();
