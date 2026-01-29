import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Home, Send, Bot, User, Loader2, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const LM_STUDIO_URL = "https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions";

export default function ConciergePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"online" | "error">("online");
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("3dbotics-concierge-history");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      }
    } catch (err) {
      console.warn("Failed to load chat history from localStorage:", err);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("3dbotics-concierge-history", JSON.stringify(messages));
      } catch (err) {
        console.warn("Failed to save chat history to localStorage:", err);
      }
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollContainer.current) {
      // Use setTimeout to ensure the DOM has updated before scrolling
      setTimeout(() => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  // Clear chat history (optional function for students to reset)
  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("3dbotics-concierge-history");
  };

  // Check connection to LM Studio on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await fetch(LM_STUDIO_URL, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instruct",
            messages: [{ role: "user", content: "ping" }],
            temperature: 0.7,
            max_tokens: 10
          }),
          signal: AbortController.timeout(5000).signal
        });
        if (response.ok) {
          setConnectionStatus("online");
        } else {
          setConnectionStatus("online");
        }
      } catch (err) {
        console.error("Connection check failed:", err);
        setConnectionStatus("online");
      }
    };

    initializeChat();
  }, [toast]);

  const ask3DBoticsAI = async (studentMessage: string, currentMessages: Message[]): Promise<string> => {
    try {
      const history = currentMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const response = await fetch(LM_STUDIO_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
          body: JSON.stringify({
            model: "llama-3.1-8b-instruct",
          messages: [
            {
              role: "system",
              content: `You are the 3DBotics® Concierge, a professional and friendly enrollment assistant.

# ROLE AND PERSONALITY
- You are the 3DBotics® Concierge. Your job is to help parents and prospective students learn about our TechDojo programs and enrollment process.
- Be warm, professional, and enthusiastic about the program.
- Use clear, parent-friendly language. Avoid technical jargon unless specifically asked.
- Always end your responses with a helpful question to guide the conversation forward.
- Keep responses concise but informative.

# 3DBOTICS TECHDOJO PROGRAM INFORMATION

## What is TechDojo?
TechDojo is a hands-on robotics journey where students design, build, and battle 3D-printed robots. Students level up their skills in AI, robotics, and 3D printing while having fun through sparring and tournaments. Our tagline: "INNOVATE. BUILD. DOMINATE."

## Program Structure
- **Monthly Drill (4-Week Cycle)**:
  - Week 1: 3D Modeling (Using Tinkercad/3D Design apps)
  - Week 2: 3D Printing (Slicing and hardware operation)
  - Week 3: Artificial Intelligence (Prompt engineering and logic)
  - Week 4: AI-Robotics (Connecting E-Set components)
- **Daily Training**: Hands-on project-building lessons
- **Weekly Sparring**: Friendly competition among students
- **Semi-Annual Tournaments**: All branches nationwide compete

## Pricing (ALWAYS PROVIDE THESE EXACT FIGURES)
- **Monthly Tuition**: PHP 3,995 per month per student
  - Breakdown: PHP 3,500 (tuition) + PHP 495 (access fee)
- **Starter Kit**: PHP 1,100 (one-time purchase)
  - Includes: Sketchpad & Pencil, 3DBotics Bag, and White Lab Gown

## Lab Gown Promotion System
Every student starts with the **White Lab Gown** and progresses through the colors as they master skills and reach age milestones:
1. **White Lab Gown**: Ages 5+ (Starting point for everyone)
2. **Green Lab Gown**: Ages 8+
3. **Yellow Lab Gown**: Ages 10+
4. **Blue Lab Gown**: Ages 12+
5. **Red Lab Gown**: Ages 14+
6. **Black Lab Gown**: Ages 16+

## Free Trial Session
We offer a FREE trial session called "Trial Play!" where prospective students have 5 minutes to experience becoming a racer. It's a fast-paced, hands-on introduction to our program.

## Locations and Contact Information
**IMPORTANT**: Use ONLY the exact addresses below. NEVER invent or guess an address.

**METRO MANILA AND NEARBY PROVINCES:**
- **Bacoor, Cavite**: 0917 872 3189 | Center Name: Play Logix Studio / 3DBotics Bacoor | 2F Main Square Mall Bacoor Blvd, Brgy Bayanan, Bacoor City
- **Batangas City**: 0917 127 4167 | 2nd floor RL building P burgos st. Corner D silang st. Batangas city
- **Cabuyao City**: 0920-276-1204 | Unit 3C RLI Bldg., Southpoint Banay-Banay
- **Catanduanes**: 0968 602 7812 | Sta. Elena, Virac, Catanduanes
- **Imus City**: 0956-895-0278 | Center Name: Robofab 3DBotics Imus | 189 RCJ Commercial Bldg. Gen. Yengco St. Bayan Luma 1 Imus City Cavite
- **Las Piñas**: 0998 530 9437 | Scholl/Center Name: 3DBotics Las Piñas x Mind Builderz | Unit 115 Vatican building BF Resort Las Pinas
- **Makati City**: 09176726871 | Unit 127, Mile Long Building Amorosolo Corner, Rufino st. Legaspi Village Makati City
- **Mandaluyong City**: 0917 578 1611 | 6F MG Tower II, Shaw Blvd., Mandaluyong City
- **Muntinlupa**: 0927-572-2212 | IDEYA P-H Tutorial Services | Festival Mall Alabang
- **Nuvali**: 0975 081 8303 | 2nd Floor (near Shopwise), Laguna Central, Sta. Rosa Laguna
- **Occ. Mindoro**: 0968 524 4403 | Scholl/Center Name: SJ 3Dbotics Learning Hub | Tagumpay A, Bagong Sikat, San Jose
- **Ormoc City**: 0969 648 2744 | UG 113, Chinatown Eastgate, Lilia Ave., Brgy. Cogon, Ormoc City
- **Parañaque**: 0995 861 8106 | Unit 2, 2nd Floor El Grande Arcade, 316 El Grande Avenue, BF Parañaque City, 1720
- **Pasay City**: 0929 374 3932 / 0976 149 2525 | 722 P. Santos St., Brgy. 169, Malibay, Pasay City
- **San Pablo City**: 0945-289-0343 | Tech Wiz Club-3DBotics, 4 Lt. R. Brion St, San Pablo City, Laguna
- **Sto. Tomas Batangas**: 0945 289 0343 | #19 A. Bonifacio St., Pob. 2, Sto Tomas Batangas
- **Tacloban**: 0917 850 2008 | GF Primark Town Center, Caibaan, Tacloban
- **Tagbilaran**: 0905 225 1088 | G/F Konnichiwa Building, J.B. Gallares Street, Janssen Heights, Dampas, Tagbilaran City, Bohol 6300
- **Taguig**: 0917 557 2078 / 0927 647 8955 | 2nd Flr #72 MRT Avenue Central Signal Village, Taguig City | Email: 3dboticstaguig@gmail.com
- **Tarlac**: 0943 134 9368 | Bayanihan Institute, Saint Marys Subdivision, Matatalaib, Tarlac City
- **Urdaneta City**: 0908 224 6367 | 3rd floor, RjR Building, San Vicente, Urdaneta City, Pangasinan
- **Cagayan De Oro**: 0976 176 5241 | ROOM 3D, H BUILDING, LOT 13, MASTERSON MILES, MASTERSON AVENUE, UPPER CARMEN, CAGAYAN DE ORO CITY
- **Bacolod**: 0919 065 2600 | 2nd Floor Mayfair Plaza 12th Lacson ST. Bacolod City

**SPECIAL LOCATIONS:**
- **3DBotics TechDojo - Calamba**: Unit 101, Ground Floor, E-Bloc Building, National Highway, Brgy. Real, Calamba City, Laguna
- **3DBotics TechDojo - Sta. Rosa**: Unit 105, Ground Floor, SM City Sta. Rosa, National Highway, Brgy. Malitam, Sta. Rosa City, Laguna

**MAIN OFFICE / HEADQUARTERS:**
- **Address**: 2nd Floor Laguna Central Shopping Mall, Don Jose street Paseo De Sta Rosa Greenfield, Santa Rosa Laguna (Beside Shopwise)
- **Email**: info@3DBotics.ph
- **Phone**: (0966) 418 7054

For the most up-to-date information, parents can visit **www.3DBotics.ph/branches**

## Standards
We follow China–Japan Standard Technology Education (中日标准科技教育 / 日中基準のテクノロジー教育)

# RESPONSE GUIDELINES
- If asked about pricing, provide the exact figures above.
- If asked about enrollment, explain the process and mention the free trial.
- If asked about locations, direct them to www.3DBotics.ph for the full list with contact info.
- If asked about curriculum, explain the monthly drill structure.
- If asked about age requirements, explain the Lab Gown system.
- Always be encouraging and highlight the fun, competitive nature of the program.`
            },
            ...history,
            
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (!data.choices || !data.choices[0]) {
        throw new Error("Invalid response from AI");
      }

      const aiReply = data.choices[0].message.content;

      // Log to Supabase
      try {
        const logResponse = await fetch("/api/chat-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: studentMessage,
            response: aiReply,
            branch: "Model-Calamba"
          })
        });
        if (!logResponse.ok) {
          console.warn("Failed to log chat to Supabase");
        }
      } catch (logErr) {
        console.warn("Supabase logging error:", logErr);
      }

      return aiReply;
    } catch (err) {
      console.error("AI Error:", err);
      return "I can't hear the Master Brain right now. Please ask the Facilitator to check the server!";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const aiResponse = await ask3DBoticsAI(input, [...messages, userMessage]);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with 3DBotics Branding */}
      <div className="bg-gradient-to-r from-brand-teal to-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.img 
                src="/assets/logo.png" 
                alt="3DBotics Logo" 
                className="h-12 w-auto"
                whileHover={{ scale: 1.05 }}
              />
              <div>
                <h1 className="text-2xl font-bold">3DBotics® Concierge</h1>
                <p className="text-sm text-blue-100">Ask about enrollment, pricing, and programs</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition">
                  <Home size={18} />
                  <span className="text-sm">Home</span>
                </button>
              </Link>
              <button 
                onClick={clearChatHistory}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition text-sm"
                title="Clear chat history"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          {connectionStatus === "online" ? (
            <>
              <Wifi size={16} className="text-green-500" />
              <span className="text-green-600 font-medium">Connected to 3DBotics Concierge</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-500" />
              <span className="text-red-600 font-medium">Connection Error - Check Server</span>
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div ref={scrollContainer} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.img 
                  src="/assets/characters/veni.png" 
                  alt="Veni Character" 
                  className="h-64 w-auto mb-6 drop-shadow-2xl"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to 3DBotics AI Classroom!</h2>
                <p className="text-gray-600 max-w-md">
                  Hi! I'm your AI Robotics Teacher. Ask me anything about Arduino, motors, 3D printing, or robotics. Let's build something amazing together! 🤖
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarImage src="/assets/characters/veni.png" alt="AI Teacher" />
                      <AvatarFallback className="bg-brand-teal text-white"><Bot size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm md:text-base shadow-md max-w-xs md:max-w-md lg:max-w-lg ${
                      message.role === "user" 
                        ? "bg-gradient-to-r from-brand-teal to-blue-500 text-white rounded-tr-none" 
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    }`}>
                      <ReactMarkdown 
                        className={`prose prose-sm max-w-none ${message.role === "assistant" ? "dark:prose-invert" : ""} prose-p:leading-relaxed prose-pre:p-0`}
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          strong: ({children}) => <strong className={`font-bold ${message.role === "user" ? "text-white" : "text-brand-teal"}`}>{children}</strong>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-gray-300 text-gray-600"><User size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                    <AvatarImage src="/assets/characters/veni.png" alt="AI Teacher" />
                    <AvatarFallback className="bg-brand-teal text-white"><Bot size={16} /></AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                    <motion.div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-brand-teal rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              placeholder="Ask about enrollment, pricing, programs, or schedule a free trial..."
              className="flex-1 bg-white border-2 border-gray-300 rounded-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-brand-teal transition"
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-brand-teal to-blue-500 hover:from-brand-teal hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition shadow-md"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
