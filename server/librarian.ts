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

  private isChatFile(filename: string): boolean {
    const chatKeywords = ['slicer', 'arduino', 'breadboard', 'l298n', 'motor', 'component', 'techdojo', 'curriculum', 'ai_robotics', 'legacy', 'founder'];
    return chatKeywords.some(keyword => filename.toLowerCase().includes(keyword));
  }

  private isConciergeFile(filename: string): boolean {
    const conciergeKeywords = ['franchising', 'franchise'];
    return conciergeKeywords.some(keyword => filename.toLowerCase().includes(keyword));
  }

  private normalizeQuery(text: string): string[] {
    const normalized = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const keywords = normalized.split(' ').filter(w => w.length > 2);
    const expansions: string[] = [];
    keywords.forEach(keyword => {
      expansions.push(keyword);
      // CHAT-specific expansions (technical curriculum)
      if (keyword === 'tt' || keyword === 'ttmotor' || keyword === 'ttmotors') expansions.push('motor', 'gear', 'yellow', 'driver', 'l298n');
      if (keyword === 'uss' || keyword === 'ultrasonic') expansions.push('sensor', 'distance', 'hcsr04', 'sonar');
      if (keyword === 'l298n' || keyword === 'l298') expansions.push('driver', 'bridge', 'motor', 'wiring');
      if (keyword === 'arduino') expansions.push('uno', 'microcontroller', 'brain');
      if (keyword === 'battery' || keyword === 'batteries') expansions.push('power', 'voltage', 'ampere', 'current');
      if (keyword === 'weight' || keyword === 'grams' || keyword === 'gram' || keyword === 'light' || keyword === 'lightweight') expansions.push('infill', 'perimeter', 'slicer', 'print', 'filament');
      if (keyword === 'height' || keyword === 'tall' || keyword === 'inches' || keyword === 'size') expansions.push('layer', 'slicer', 'print', 'model');
      if (keyword === 'print' || keyword === 'printing' || keyword === 'slicer') expansions.push('infill', 'perimeter', 'layer', 'nozzle', 'temperature', 'support', 'weight');
      if (keyword === 'infill' || keyword === 'perimeter' || keyword === 'layer') expansions.push('slicer', 'print', 'settings', 'quality');
      // CONCIERGE-specific expansions (business/franchising)
      if (keyword === 'franchise' || keyword === 'franchis') expansions.push('email', 'contact', 'invest', 'opportunity', 'investment', 'fee');
      if (keyword === 'email' || keyword === 'contact') expansions.push('franchise', 'call', 'phone', 'inquiry');
      if (keyword === 'enroll' || keyword === 'enrollment' || keyword === 'price' || keyword === 'cost') expansions.push('tuition', 'fee', 'program', 'techdojo');
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
        console.log(`[LIBRARIAN] Fetched ${allWisdom.length} total wisdom entries for [${category}]`);
        
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
          wisdomContext = "⭐ FOUNDER'S VERIFIED ANSWERS (Always authoritative for 3DBotics-specific facts):\n" + 
            topMatches.map((d: any) => `Q: ${d.question}\nA: ${d.answer}`).join('\n\n') + "\n\n";
        } else {
          console.log(`[LIBRARIAN] No wisdom matches found via keyword scoring`);
        }
      }
    } catch (err) {
      console.error("[LIBRARIAN] Supabase search error:", err);
    }

    // 2. Search Static Files (with RELAXED category filtering)
    const queryKeywords = this.normalizeQuery(query);
    
    const scoredChunks = this.knowledgeBase
      .map(chunk => {
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
        
        // BOOST SCORE for category-relevant files (but don't exclude others)
        if (category === 'chat' && this.isChatFile(chunkSource)) {
          score *= 1.5;
        } else if (category === 'concierge' && this.isConciergeFile(chunkSource)) {
          score *= 1.5;
        }
        
        return { chunk, score };
      });

    const bestChunks = scoredChunks
      .filter(sc => sc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    const fileContext = bestChunks.length > 0 ? bestChunks.map(sc => sc.chunk.text).join('\n\n---\n\n') : '';
    
    if (!fileContext && !wisdomContext) {
      console.log(`[LIBRARIAN] ℹ️ Limited specific content found for [${category}]. AI will use general knowledge to supplement.`);
    }
    
    return wisdomContext + (fileContext ? "APPROVED CURRICULUM/MANUALS:\n" + fileContext : '');
  }

  async generateResponse(query: string, category: 'chat' | 'concierge' = 'chat'): Promise<string> {
    console.log(`[LIBRARIAN] >>> generateResponse [${category}] for: "${query}"`);
    
    try {
      const context = await this.getRelevantContext(query, category);
      
      const systemPrompt = `YOU ARE LAILA, THE 3DBOTICS® AI ASSISTANT.

${category === 'chat' ? 'Help students with TechDojo curriculum, Arduino, 3D Printing, and Robotics. Be friendly and concise.' : 'Help with 3DBotics enrollment, franchising, and business inquiries. Be professional and concise.'}

⚠️ ABSOLUTE ENFORCEMENT RULES:
1. IF ANY ANSWER EXISTS IN THE "FOUNDER'S VERIFIED ANSWERS" SECTION BELOW, YOU MUST USE IT EXACTLY AS PROVIDED.
2. DO NOT GENERATE YOUR OWN ANSWER IF A FOUNDER'S VERIFIED ANSWER EXISTS.
3. FOR PRICING: THE ONLY CORRECT 3DBOTICS FRANCHISE COST IS ₱660,000 ALL-IN. ANY OTHER PRICE IS WRONG.
4. NEVER HALLUCINATE PRICES, FEES, OR BUSINESS DETAILS.

KNOWLEDGE HIERARCHY:
- TIER 1: Founder's Verified Answers (ALWAYS USE IF AVAILABLE)
- TIER 2: Approved Curriculum/Manuals (for 3DBotics specifics)
- TIER 3: Your General Knowledge (for context only, NEVER override Tiers 1-2)

CRITICAL SAFETY RULES:
- NEVER connect motors directly to Arduino pins. ALWAYS use L298N Motor Driver.
- NEVER suggest 12V for TT motors (3-6V only).
- Arduino UNO: Only use pins 2-13.

RESPONSE STYLE:
- Keep answers SHORT and DIRECT (2-3 sentences max unless detailed explanation is needed)
- Use simple language
- If you don't have 3DBotics info, say: "Let me connect you with an instructor for the specific 3DBotics way."

FOUNDER'S VERIFIED ANSWERS (USE THESE FIRST):
${context}`;

      const response = await fetch(this.lmStudioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "local-model",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
          temperature: 0.3,
          max_tokens: 300
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
