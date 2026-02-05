import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

interface KnowledgeChunk {
  text: string;
  source: string;
}

class Librarian {
  private knowledgeBase: KnowledgeChunk[] = [];
  private isInitialized = false;
  private lmStudioUrl = 'https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions';
  
  // Supabase Client for "Wisdom Log" (Collective Intelligence)
  private supabase = createClient(
    'https://vwooykjymtuzxlmzggas.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b295a2p5bXR1enhsbXpnZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzg5MzQsImV4cCI6MjA4NDY1NDkzNH0.ZnS82C64IqW1BUvbRaSDFYznM1RnTBpUIfQ_dHUv4yo'
  );

  constructor() {
    console.log('[LIBRARIAN] Constructor called - starting initialization');
    this.initialize().catch(err => {
      console.error('[LIBRARIAN] FATAL: Initialization failed:', err);
    });
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const knowledgeDir = path.join(process.cwd(), 'knowledge');
      if (!fs.existsSync(knowledgeDir)) {
        fs.mkdirSync(knowledgeDir, { recursive: true });
        this.isInitialized = true;
        return;
      }

      const files = fs.readdirSync(knowledgeDir);
      let loadedCount = 0;
      for (const file of files) {
        if (file.endsWith('.txt') || file.endsWith('.md')) {
          try {
            const filePath = path.join(knowledgeDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            this.addTextToKnowledge(content, file);
            loadedCount++;
          } catch (fileError) {
            console.error(`[LIBRARIAN] ERROR loading ${file}:`, fileError);
          }
        }
      }
      
      this.isInitialized = true;
      console.log(`[LIBRARIAN] ✅ INITIALIZATION COMPLETE: ${this.knowledgeBase.length} chunks from ${loadedCount} files.`);
    } catch (error) {
      console.error('[LIBRARIAN] FATAL ERROR during initialization:', error);
      this.isInitialized = true;
    }
  }

  private addTextToKnowledge(text: string, source: string) {
    const chunks = text.split(/\n\n+/).filter(c => c.trim().length > 20);
    for (const chunk of chunks) {
      this.knowledgeBase.push({ text: chunk.trim(), source });
    }
  }

  private normalizeQuery(text: string): string[] {
    const normalized = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const keywords = normalized.split(' ').filter(w => w.length > 2);
    const expansions: string[] = [];
    keywords.forEach(keyword => {
      expansions.push(keyword);
      if (keyword === 'tt' || keyword === 'ttmotor' || keyword === 'ttmotors') expansions.push('motor', 'gear', 'yellow', 'driver', 'l298n');
      if (keyword === 'uss' || keyword === 'ultrasonic') expansions.push('sensor', 'distance', 'hcsr04', 'sonar');
      if (keyword === 'l298n' || keyword === 'l298') expansions.push('driver', 'bridge', 'motor', 'wiring');
      if (keyword === 'arduino') expansions.push('uno', 'microcontroller', 'brain');
      if (keyword === 'battery' || keyword === 'batteries') expansions.push('power', 'voltage', 'ampere', 'current');
      if (keyword === 'franchise' || keyword === 'franchis') expansions.push('email', 'contact', 'invest', 'opportunity');
      if (keyword === 'email' || keyword === 'contact') expansions.push('franchise', 'call', 'phone');
      if (keyword === 'weight' || keyword === 'grams' || keyword === 'gram' || keyword === 'light' || keyword === 'lightweight') expansions.push('infill', 'perimeter', 'slicer', 'print', 'filament');
      if (keyword === 'height' || keyword === 'tall' || keyword === 'inches' || keyword === 'size') expansions.push('layer', 'slicer', 'print', 'model');
      if (keyword === 'print' || keyword === 'printing' || keyword === 'slicer') expansions.push('infill', 'perimeter', 'layer', 'nozzle', 'temperature', 'support', 'weight');
      if (keyword === 'infill' || keyword === 'perimeter' || keyword === 'layer') expansions.push('slicer', 'print', 'settings', 'quality');
    });
    return [...new Set(expansions)];
  }

  async getRelevantContext(query: string, category: 'chat' | 'concierge'): Promise<string> {
    await this.initialize();
    
    console.log(`[LIBRARIAN] === SEARCH START [${category}] ===`);
    console.log(`[LIBRARIAN] Query: "${query}"`);
    
    // 1. Search Supabase Wisdom Log First (Priority) - WITH KEYWORD SCORING
    let wisdomContext = "";
    try {
      // Fetch ALL wisdom entries for this category
      const { data: allWisdom, error: fetchError } = await this.supabase
        .from('wisdom_log')
        .select('question, answer')
        .eq('category', category);
      
      if (!fetchError && allWisdom && allWisdom.length > 0) {
        console.log(`[LIBRARIAN] Fetched ${allWisdom.length} total wisdom entries`);
        
        // Score wisdom entries based on keyword matching
        const queryKeywords = this.normalizeQuery(query);
        console.log(`[LIBRARIAN] Query keywords: ${queryKeywords.join(', ')}`);
        
        const scoredWisdom = allWisdom.map((entry: any) => {
          let score = 0;
          const questionLower = entry.question.toLowerCase();
          
          // Check for exact substring match (highest priority)
          if (questionLower.includes(query.toLowerCase())) {
            score += 1000;
            console.log(`[LIBRARIAN] Exact match found: "${entry.question}" (score: 1000)`);
          }
          
          // Check for keyword matches in the question
          for (const keyword of queryKeywords) {
            if (questionLower.includes(keyword)) {
              score += 50;
            }
          }
          
          return { entry, score };
        });
        
        // Get top matches
        const topMatches = scoredWisdom
          .filter(sw => sw.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(sw => sw.entry);
        
        if (topMatches.length > 0) {
          console.log(`[LIBRARIAN] Found ${topMatches.length} wisdom matches via keyword scoring`);
          wisdomContext = "⭐ FOUNDER'S VERIFIED ANSWERS (ALWAYS USE THESE FIRST):\n" + 
            topMatches.map((d: any) => `Q: ${d.question}\nA: ${d.answer}`).join('\n\n') + "\n\n";
        } else {
          console.log(`[LIBRARIAN] No wisdom matches found via keyword scoring`);
        }
      }
    } catch (err) {
      console.error("[LIBRARIAN] Supabase search error:", err);
    }

    // 2. Search Static Files
    const queryKeywords = this.normalizeQuery(query);
    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      const chunkSource = chunk.source.toLowerCase();
      
      // Boost score if source contains relevant keywords
      for (const keyword of queryKeywords) {
        if (chunkSource.includes(keyword)) score += 10;
      }
      
      for (const keyword of queryKeywords) {
        const regex = new RegExp(keyword, 'gi');
        const matches = (chunkText.match(regex) || []).length;
        score += matches * 3;
      }
      if (chunkText.includes(query.toLowerCase())) score += 15;
      return { chunk, score };
    });

    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    const fileContext = bestChunks.map(sc => sc.chunk.text).join('\n\n---\n\n');
    
    return wisdomContext + "APPROVED CURRICULUM/MANUALS:\n" + fileContext;
  }

  async generateResponse(query: string, category: 'chat' | 'concierge' = 'chat'): Promise<string> {
    console.log(`[LIBRARIAN] >>> generateResponse [${category}] for: "${query}"`);
    
    try {
      const context = await this.getRelevantContext(query, category);
      
      const systemPrompt = `YOU ARE THE 3DBOTICS® AI ${category.toUpperCase()} ASSISTANT.

${category === 'chat' ? 'FOCUS: TechDojo curriculum, Arduino, 3D Printing, and Robotics.' : 'FOCUS: Enrollment, Franchising, Fees, and Business inquiries.'}

🚨 ABSOLUTE RULES (NON-NEGOTIABLE):
1. **IF ANY ANSWER EXISTS IN "FOUNDER'S VERIFIED ANSWERS" SECTION, YOU MUST USE IT EXACTLY AS PROVIDED. DO NOT MODIFY, PARAPHRASE, OR IGNORE IT.**
2. **NEVER GENERATE YOUR OWN ANSWER IF A FOUNDER'S VERIFIED ANSWER EXISTS FOR THAT QUESTION.**
3. If the answer is NOT in "FOUNDER'S VERIFIED ANSWERS", then check "APPROVED CURRICULUM".
4. If the answer is not in either section, say: "I don't have that information in my curriculum yet. Let me connect you with a human instructor."
5. **NEVER HALLUCINATE PRICES, FEES, OR BUSINESS DETAILS.** If unsure, defer to a human.
6. NEVER tell a student to connect a motor directly to an Arduino pin.
7. MOTORS MUST always use an L298N Motor Driver.
8. NEVER suggest 12V for TT motors (3-6V only).
9. ARDUINO UNO PIN LIMIT: Only use pins 2 to 13. Never suggest Pin 14 or higher.
10. L298N JUMPERS: Always tell students to keep ENA/ENB jumpers ON for simplicity.

APPROVED FACTS:
${context}

**CRITICAL**: Answer the user's question using ONLY the facts above. If a "FOUNDER'S VERIFIED ANSWER" exists, use it word-for-word. Do not add, remove, or change anything.`;

      const response = await fetch(this.lmStudioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "local-model",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
          temperature: 0,
          max_tokens: 800
        })
      });

      if (!response.ok) throw new Error(`LM Studio HTTP ${response.status}`);

      const data = await response.json();
      let answer = data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      
      // Safety Gate
      const isDangerous = /connect.*motor.*directly.*pin/i.test(answer) || (/motor/i.test(answer) && /pin\s*\d+/i.test(answer) && !/L298N|driver|bridge/i.test(answer));
      if (isDangerous) {
        answer = "⚠️ **CRITICAL SAFETY WARNING:** Never connect a motor directly to the Arduino pins! You MUST use an **L298N Motor Driver** as a bridge. Would you like to see the L298N wiring guide?";
      }

      return answer;
    } catch (error) {
      console.error("[LIBRARIAN] ❌ ERROR:", error);
      return "I'm having trouble connecting to my brain right now.";
    }
  }

  async learn(category: string, question: string, answer: string) {
    console.log(`[LIBRARIAN] Learning new wisdom for [${category}]`);
    const { error } = await this.supabase
      .from('wisdom_log')
      .insert([{ category, question, answer, is_verified: false }]);
    
    if (error) throw error;
    return true;
  }
}

export const librarian = new Librarian();
