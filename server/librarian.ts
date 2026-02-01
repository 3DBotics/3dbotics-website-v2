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
    console.log(`Librarian initialized with ${this.knowledgeBase.length} chunks.`);
  }

  private addTextToKnowledge(text: string, source: string) {
    const chunks = text.split('\n\n').filter(c => c.trim().length > 20);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  async getRelevantContext(query: string): Promise<string> {
    await this.initialize();
    
    if (this.knowledgeBase.length === 0) return "";

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
    
    const systemPrompt = `You are the 3DBotics® AI Teacher. 
Answer the student's question ONLY using the provided facts below.
If the facts don't have the answer, say "I don't have that specific information in my curriculum yet, let's ask a human instructor."
PRIORITIZE SAFETY: If the question involves electricity or batteries, ensure the answer is 100% accurate based on the facts.

FACTS FROM 3DBOTICS® CURRICULUM:
${context || "No specific facts found in curriculum for this query."}`;

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
      return data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error connecting to LM Studio:", error);
      return "I'm having trouble connecting to my brain right now. Please make sure LM Studio is running!";
    }
  }
}

export const librarian = new Librarian();
