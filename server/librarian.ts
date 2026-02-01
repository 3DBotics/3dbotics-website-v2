import * as fs from 'fs';
import * as path from 'path';
import { OpenAI } from 'openai';

// Initialize OpenAI client for embeddings and LLM
// This uses the pre-configured environment variables in the Manus sandbox
const openai = new OpenAI();

interface KnowledgeChunk {
  text: string;
  source: string;
}

class Librarian {
  private knowledgeBase: KnowledgeChunk[] = [];
  private isInitialized = false;

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
      if (file.endsWith('.txt')) {
        const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
        this.addTextToKnowledge(content, file);
      }
      // Note: For PDF support in production, we'd use a library like 'pdf-parse'
      // For now, we'll assume knowledge is provided in .txt or .md for simplicity in this TypeScript implementation
    }
    
    this.isInitialized = true;
    console.log(`Librarian initialized with ${this.knowledgeBase.length} chunks.`);
  }

  private addTextToKnowledge(text: string, source: string) {
    // Simple chunking by paragraphs
    const chunks = text.split('\n\n').filter(c => c.trim().length > 20);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  async getRelevantContext(query: string): Promise<string> {
    await this.initialize();
    
    if (this.knowledgeBase.length === 0) return "";

    // In a real production environment with many documents, we would use a Vector DB like Pinecone or Chroma.
    // For a small/medium curriculum, we can use a simpler semantic search or keyword search.
    // Here, we'll simulate the search by finding chunks that share keywords.
    const queryKeywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      for (const keyword of queryKeywords) {
        if (chunkText.includes(keyword)) score++;
      }
      return { chunk, score };
    });

    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(sc => sc.chunk.text);

    return bestChunks.join('\n\n');
  }

  async generateResponse(query: string): Promise<string> {
    const context = await this.getRelevantContext(query);
    
    const systemPrompt = `
You are the 3DBotics® AI Teacher. 
Answer the student's question ONLY using the provided facts below.
If the facts don't have the answer, say "I don't have that specific information in my curriculum yet, let's ask a human instructor."
PRIORITIZE SAFETY: If the question involves electricity or batteries, ensure the answer is 100% accurate based on the facts.

FACTS FROM 3DBOTICS® CURRICULUM:
${context || "No specific facts found in curriculum for this query."}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
  }
}

export const librarian = new Librarian();
