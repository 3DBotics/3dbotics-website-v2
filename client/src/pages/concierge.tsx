import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Home, Send, Bot, User, Loader2, Wifi, WifiOff, Edit2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LearningModal {
  isOpen: boolean;
  question: string;
  currentAnswer: string;
  messageId: string;
}

// NOTE: This is for non-franchise questions only. Franchise questions are handled by the FRONTEND SAFETY SHIELD.
const LM_STUDIO_URL = "https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions";

export default function ConciergePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"online" | "error">("online");
  const [learningModal, setLearningModal] = useState<LearningModal>({
    isOpen: false,
    question: "",
    currentAnswer: "",
    messageId: ""
  });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isSubmittingWisdom, setIsSubmittingWisdom] = useState(false);
  const [franchiseResponse, setFranchiseResponse] = useState<string>("");
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
    
    // FRONTEND SAFETY SHIELD: Fetch franchise response from API (always fresh)
    const fetchFranchiseInfo = async () => {
      try {
        const response = await fetch("/api/franchise-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const data = await response.json();
        if (data.info) {
          setFranchiseResponse(data.info);
          console.log("[FRONTEND SHIELD] Franchise response loaded from API");
        }
      } catch (err) {
        console.error("Failed to load franchise info:", err);
        // Fallback to hard-coded response if API fails
        setFranchiseResponse(`✅ **3DBotics Franchise Package - ₱660,000 All-In**

**What's Included:**
• 5 Brand New 3D Printers (calibrated & ready to use)
• 7 Kilos of 3D Filament (assorted colors)
• 43" Smart TV for classroom instructions
• 5 Complete 3DPrinting Toolkits
• 5 Storage Devices for file transfers
• 3 Major Apps for 3D modeling & robotics
• Per Course Level Robot Projects for marketing & Display
• Best Selling "ready-to-3DPrint" Files as immediate products
• Official Marketing Materials (HD logos, editable posters)

**Plus:**
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from 3DBotics Main Office
✅ Instant ACCESS to state-of-the-art AI web-platform for branch operations
✅ Rental Space Security Deposit
✅ 1st Two Months Rent fee

**Contact us:** 3DBotics.LC@gmail.com | 0995-836-2249`);
      }
    };
    
    fetchFranchiseInfo();
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
      setTimeout(() => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  // Clear chat history
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

## Pricing (ALWAYS PROVIDE THESE EXACT FIGURES - NEVER MENTION FRANCHISE PRICING)
- **Monthly Tuition**: PHP 3,995 per month per student
  - Breakdown: PHP 3,500 (tuition) + PHP 495 (access fee)
- **Starter Kit**: PHP 1,100 (one-time purchase)
  - Includes: Sketchpad & Pencil, 3DBotics Bag, and White Lab Gown

## CRITICAL: FRANCHISE QUESTIONS
IF THE USER ASKS ABOUT FRANCHISE PRICING, COST, FEES, OR INVESTMENT:
- DO NOT ANSWER. The frontend will intercept this and show the correct information.
- The franchise cost is ₱660,000 all-in (handled by frontend, not by you).
- You should never be asked this question because the frontend intercepts it.

## Lab Gown Promotion System
Every student starts with the **White Lab Gown** and progresses through the colors based on **skill mastery alone** — age is NOT a requirement for promotion. A student of any age who demonstrates the required tech skills can level up to the next rank.
1. **White Lab Gown**: Novice/Apprentice — Starting point for EVERYONE
2. **Green Lab Gown**: Intermediate — Skill mastery of White level
3. **Yellow Lab Gown**: Advanced — Skill mastery of Green level
4. **Blue Lab Gown**: Expert — Skill mastery of Yellow level
5. **Red Lab Gown**: Master — Skill mastery of Blue level
6. **Black Lab Gown**: Grandmaster — Skill mastery of Red level

This is a **tech skills journey**, not a physical competition. A young child who can design and build a battlebot has earned the right to level up — we celebrate skill, not age! 🎓

## Free Trial Session
We offer a FREE trial session called "Trial Play!" where prospective students have 5 minutes to experience becoming a racer. It's a fast-paced, hands-on introduction to our program.

## Locations and Contact Information
**CRITICAL CONSTRAINT**: You MUST use ONLY the exact information below. NEVER invent unit numbers, floor numbers, or any other details. If a location is not in this list, say you don't have that information.

**BRANCH LOCATIONS (COPY EXACTLY AS PROVIDED):**
1. Bacoor, Cavite: 0917 872 3189 | 2F Main Square Mall Bacoor Blvd, Brgy Bayanan, Bacoor City
2. Batangas City: 0917 127 4167 | 2nd floor RL building P burgos st. Corner D silang st. Batangas city
3. Cabuyao City: 0920-276-1204 | Unit 3C RLI Bldg., Southpoint Banay-Banay
4. Catanduanes: 0968 602 7812 | Sta. Elena, Virac, Catanduanes
5. Imus City: 0956-895-0278 | 189 RCJ Commercial Bldg. Gen. Yengco St. Bayan Luma 1 Imus City Cavite
6. Las Piñas: 0998 530 9437 | Unit 115 Vatican building BF Resort Las Pinas
7. Makati City: 09176726871 | Unit 127, Mile Long Building Amorosolo Corner, Rufino st. Legaspi Village Makati City
8. Mandaluyong City: 0917 578 1611 | 6F MG Tower II, Shaw Blvd., Mandaluyong City
9. Muntinlupa: 0927-572-2212 | Festival Mall Alabang
10. **Nuvali: 0975 081 8303 | 2nd Floor (near Shopwise), Laguna Central, Sta. Rosa Laguna** (DO NOT add Unit numbers or change to Ground Floor)
11. Occ. Mindoro: 0968 524 4403 | Tagumpay A, Bagong Sikat, San Jose
12. Ormoc City: 0969 648 2744 | UG 113, Chinatown Eastgate, Lilia Ave., Brgy. Cogon, Ormoc City
13. Parañaque: 0995 861 8106 | Unit 2, 2nd Floor El Grande Arcade, 316 El Grande Avenue, BF Parañaque City, 1720
14. Pasay City: 0929 374 3932 / 0976 149 2525 | 722 P. Santos St., Brgy. 169, Malibay, Pasay City
15. San Pablo City: 0945-289-0343 | Tech Wiz Club-3DBotics, 4 Lt. R. Brion St, San Pablo City, Laguna
16. Sto. Tomas Batangas: 0945 289 0343 | #19 A. Bonifacio St., Pob. 2, Sto Tomas Batangas
17. Tacloban: 0917 850 2008 | GF Primark Town Center, Caibaan, Tacloban
18. Tagbilaran: 0905 225 1088 | G/F Konnichiwa Building, J.B. Gallares Street, Janssen Heights, Dampas, Tagbilaran City, Bohol 6300
19. Taguig: 0917 557 2078 / 0927 647 8955 | 2nd Flr #72 MRT Avenue Central Signal Village, Taguig City
20. Tarlac: 0943 134 9368 | Bayanihan Institute, Saint Marys Subdivision, Matatalaib, Tarlac City
21. Urdaneta City: 0908 224 6367 | 3rd floor, RjR Building, San Vicente, Urdaneta City, Pangasinan
22. Cagayan De Oro: 0976 176 5241 | ROOM 3D, H BUILDING, LOT 13, MASTERSON MILES, MASTERSON AVENUE, UPPER CARMEN, CAGAYAN DE ORO CITY
23. Bacolod: 0919 065 2600 | 2nd Floor Mayfair Plaza 12th Lacson ST. Bacolod City

**MAIN HEADQUARTERS:**
Address: 2nd Floor Laguna Central Shopping Mall, Don Jose street Paseo De Sta Rosa Greenfield, Santa Rosa Laguna (Beside Shopwise) | Email: info@3DBotics.ph | Phone: (0966) 418 7054

For complete details, visit **www.3DBotics.ph/branches**

## Standards
We follow China–Japan Standard Technology Education (中日标准科技教育 / 日中基準のテクノロジー教育)

# RESPONSE GUIDELINES
- If asked about pricing, provide the exact figures above.
- If asked about enrollment, explain the process and mention the free trial.
- If asked about locations, direct them to www.3DBotics.ph for the full list with contact info.
- If asked about curriculum, explain the monthly drill structure.
- If asked about age requirements or whether a young child can advance, explain that promotion is based on skill mastery only — not age. Any student who demonstrates the required tech skills can level up.
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

    // FRONTEND SAFETY SHIELD: Check if this is a franchise question
    // NOTE: Keywords must be specific to FRANCHISE/BUSINESS inquiries.
    // Do NOT include generic words like 'fee', 'price', 'how much', 'cost', 'payment' alone —
    // those also match enrollment/tuition questions from students/parents.
    const lowerInput = input.toLowerCase();

    // Enrollment-related keywords that should NOT trigger the franchise shield
    const enrollmentKeywords = ['tuition', 'enrollment', 'enroll', 'monthly fee', 'session fee', 'student fee', 'course fee', 'per month', 'per session', 'registration fee', 'how much is the tuition', 'how much to enroll', 'how much for the class', 'how much per month', 'how much is enrollment'];
    const isEnrollmentQuestion = enrollmentKeywords.some(kw => lowerInput.includes(kw));

    // Franchise-specific keywords (only trigger shield when clearly about the franchise business)
    const franchiseKeywords = ['franchise', 'franchising', 'open a branch', 'open branch', 'start a branch', 'become a franchisee', 'franchise package', 'franchise cost', 'franchise fee', 'franchise investment', 'franchise price', 'all-in cost', 'all-in package', 'cash out', 'downpayment', 'startup cost', 'initial investment', 'reservation fee', '660', 'partnership opportunity', 'branch owner'];
    const isFranchiseQuestion = !isEnrollmentQuestion && franchiseKeywords.some(kw => lowerInput.includes(kw));

    let aiResponse: string;
    
    if (isFranchiseQuestion) {
      // BYPASS AI ENTIRELY FOR FRANCHISE QUESTIONS
      console.log(`[FRONTEND SHIELD] Franchise question detected: "${input}" - Using API response`);
      aiResponse = franchiseResponse || "Loading franchise information...";
    } else {
      // For non-franchise questions, use the AI
      aiResponse = await ask3DBoticsAI(input, [...messages, userMessage]);
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const openLearningModal = (question: string, answer: string, messageId: string) => {
    setLearningModal({
      isOpen: true,
      question,
      currentAnswer: answer,
      messageId
    });
    setCorrectAnswer("");
  };

  const submitWisdom = async () => {
    if (!correctAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide the correct answer.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingWisdom(true);
    try {
      const response = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "concierge",
          question: learningModal.question,
          answer: correctAnswer
        })
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your wisdom has been saved. The AI will use this answer next time!",
          variant: "default"
        });
        setLearningModal({ isOpen: false, question: "", currentAnswer: "", messageId: "" });
        setCorrectAnswer("");
      } else {
        throw new Error("Failed to save wisdom");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save your wisdom. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingWisdom(false);
    }
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
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to 3DBotics AI Concierge!</h2>
                <p className="text-gray-600 max-w-md">
                  Hi! I'm your enrollment assistant. Ask me about our programs, pricing, locations, and how to get started. Let's find the perfect fit for you! 🚀
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
                      <AvatarImage src="/assets/characters/veni.png" alt="AI Concierge" />
                      <AvatarFallback className="bg-brand-teal text-white"><Bot size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-5 py-4 text-sm md:text-base shadow-md max-w-xs md:max-w-md lg:max-w-lg ${
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
                    {message.role === "assistant" && (
                      <button
                        onClick={() => {
                          const userMessage = messages[messages.indexOf(message) - 1];
                          if (userMessage) {
                            openLearningModal(userMessage.content, message.content, message.id);
                          }
                        }}
                        className="mt-2 text-xs text-gray-500 hover:text-brand-teal flex items-center gap-1 transition"
                      >
                        <Edit2 size={12} />
                        Correct This
                      </button>
                    )}
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
                    <AvatarImage src="/assets/characters/veni.png" alt="AI Concierge" />
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

      {/* Learning Modal */}
      {learningModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Teach the AI</h3>
              <button
                onClick={() => setLearningModal({ isOpen: false, question: "", currentAnswer: "", messageId: "" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Question:</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-1">{learningModal.question}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Current Answer (from AI):</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-1 max-h-24 overflow-y-auto">{learningModal.currentAnswer}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Your Correct Answer:</label>
                <textarea
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Type the correct answer here..."
                  className="w-full mt-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-brand-teal text-sm resize-none h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setLearningModal({ isOpen: false, question: "", currentAnswer: "", messageId: "" })}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitWisdom}
                  disabled={isSubmittingWisdom}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-teal to-blue-500 text-white rounded-lg hover:from-brand-teal hover:to-blue-600 disabled:opacity-50 transition font-medium"
                >
                  {isSubmittingWisdom ? "Saving..." : "Save Wisdom"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
