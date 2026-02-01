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
    if (!fs.existsSync(knowledgeDir)) {
      console.log('Knowledge directory not found, creating one...');
      fs.mkdirSync(knowledgeDir);
      return;
    }

    const files = fs.readdirSync(knowledgeDir);
    for (const file of files) {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
        this.addTextToKnowledge(content, file);
      }
    }
    
    this.isInitialized = true;
    console.log(`Librarian initialized with ${this.knowledgeBase.length} chunks from ${files.length} files.`);
  }

  private addTextToKnowledge(text: string, source: string) {
    // Split by double newlines for paragraphs, but also by single newlines for better granularity
    const chunks = text.split('\n\n').filter(c => c.trim().length > 20);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  async getRelevantContext(query: string): Promise<string> {
    await this.initialize();
    
    if (this.knowledgeBase.length === 0) {
      console.log('Warning: Knowledge base is empty!');
      return "";
    }

    // Improved keyword extraction - normalize and filter
    const queryLower = query.toLowerCase();
    const queryKeywords = queryLower
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(w => w.length > 2); // Filter very short words

    console.log(`Searching for keywords: ${queryKeywords.join(', ')}`);

    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      
      // Score based on keyword matches
      for (const keyword of queryKeywords) {
        const matches = (chunkText.match(new RegExp(keyword, 'g')) || []).length;
        score += matches * 2; // Weight each match
      }
      
      // Bonus points for exact phrase matches
      if (chunkText.includes(queryLower)) {
        score += 10;
      }
      
      return { chunk, score };
    });

    // Get top 5 most relevant chunks
    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(sc => {
        console.log(`Found relevant chunk from ${sc.chunk.source} (score: ${sc.score})`);
        return sc.chunk.text;
      });

    if (bestChunks.length === 0) {
      console.log('No relevant chunks found in knowledge base.');
    }

    return bestChunks.join('\n\n---\n\n');
  }

  async generateResponse(query: string): Promise<string> {
    const context = await this.getRelevantContext(query);
    
    // CRITICAL: Ultra-strict system prompt to prevent hallucination
    const systemPrompt = `YOU ARE THE 3DBOTICS® AI TEACHER.

CRITICAL RULES - NEVER BREAK THESE:
1. You MUST answer ONLY using the FACTS provided below in the "APPROVED CURRICULUM" section.
2. If the FACTS do not contain the answer, you MUST say: "I don't have that information in my curriculum yet. Let me connect you with a human instructor."
3. NEVER use your general knowledge or training data.
4. NEVER make up names, dates, or facts.
5. NEVER say "I think" or "probably" - only state facts from the curriculum.
6. If asked about the founder, ONLY use the name and information from the APPROVED CURRICULUM below.

APPROVED CURRICULUM:
${context || "NO CURRICULUM DATA FOUND FOR THIS QUERY."}

---

If the APPROVED CURRICULUM section above says "NO CURRICULUM DATA FOUND", you MUST respond: "I don't have that information in my curriculum yet. Let me connect you with a human instructor."

Now answer the student's question using ONLY the facts above.`;

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
          temperature: 0, // Zero creativity - only factual responses
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`LM Studio responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error connecting to LM Studio:", error);
      return "I'm having trouble connecting to my brain right now. Please make sure LM Studio is running!";
    }
  }
}

export const librarian = new Librarian();
