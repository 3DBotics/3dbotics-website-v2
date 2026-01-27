import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface StudentChat {
  message: string;
  response: string;
  branch: string;
  timestamp: Date;
}

const LM_STUDIO_URL = "https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! 👋 Welcome to 3DBotics AI Classroom! I'm your 3DBotics Facilitator. I'm here to help you learn about 3D printing, robotics, and AI. What's your name, student?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "online" | "error">("checking");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Check connection to LM Studio on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Using the skip-warning header to bypass ngrok's interstitial page
        const response = await fetch("https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/models", {
          headers: { "ngrok-skip-browser-warning": "true" },
          signal: AbortController.timeout(5000).signal
        });
        if (response.ok) {
          setConnectionStatus("online");
        } else {
          // Even if /v1/models fails, we'll try to be online if the server is reachable
          setConnectionStatus("online");
        }
      } catch (err) {
        console.error("Connection check failed:", err);
        // Default to online to allow attempts, but show warning if it really fails later
        setConnectionStatus("online");
      }
    };

    initializeChat();
  }, [toast]);

  const ask3DBoticsAI = async (studentMessage: string, currentMessages: Message[]): Promise<string> => {
    try {
      // Prepare the full message history for the AI
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
          model: "llama-3.2-3b-instruct",
          messages: [
            {
              role: "system",
              content: `You are the 3DBotics Facilitator, an expert robotics and 3D printing teacher. 
              
              TECHNICAL RULES:
              1. TT MOTORS & L298N: 
                 - TT Motors have only TWO wires (Positive and Negative). They do NOT have signal wires.
                 - They MUST connect to the side screw terminals of the L298N (OUT1/OUT2 or OUT3/OUT4).
                 - The L298N has a 3-slot power block: 12V (Power in), GND (Common Ground), and 5V (Power for Arduino).
              2. SG90 SERVO (Don't confuse with TT Motors):
                 - Servos have THREE wires: Brown (GND), Red (5V), Orange/Yellow (Signal).
              3. ARDUINO SAFETY: 
                 - Never connect TT motors directly to Arduino pins.
                 - Always share a Common Ground (GND) between the Arduino and the L298N.
              4. 3D PRINTING: Focus on safety (hot end heat) and basic concepts (filament, leveling).
              
              TEACHING STYLE:
              - Persona: Friendly, encouraging, and expert.
              - Level: Explain like the user is a 5th grader but stay technically 100% accurate.
              - Method: Give only the first step or a small piece of information at a time to keep the student focused.
              - Safety First: Always warn about electrical shorts or heat when relevant.`,
            },
            ...history,
            { role: "user", content: studentMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      // Save to Supabase via our backend API
      try {
        const chatData: StudentChat = {
          message: studentMessage,
          response: aiReply,
          branch: "Model-Calamba",
          timestamp: new Date()
        };

        await fetch("/api/chat-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatData),
        });
      } catch (supabaseErr) {
        console.error("Failed to log to Supabase:", supabaseErr);
      }

      return aiReply;
    } catch (err) {
      console.error("Connection lost to Master MacBook!", err);
      return "I can't hear the Master Brain right now. Please ask the Facilitator to check the server!";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const aiReply = await ask3DBoticsAI(userMessage.content, messages);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiReply,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-teal/20 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-brand-teal">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">3DBotics AI Classroom</h1>
            <p className="text-gray-600">Learn from your AI Teacher</p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-brand-teal">
              <AvatarImage src="/logo.png" />
              <AvatarFallback>3DB</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center mb-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === "online" ? "bg-green-100 text-green-700" : 
            connectionStatus === "error" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          }`}>
            {connectionStatus === "online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connectionStatus === "online" ? "Connected to AI Teacher" : 
             connectionStatus === "error" ? "Connection Error - Check Server" : "Checking Connection..."}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4 md:p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={`h-8 w-8 shrink-0 ${message.role === "assistant" ? "border border-brand-teal" : ""}`}>
                          {message.role === "assistant" ? (
                            <>
                              <AvatarImage src="/teacher-avatar.png" />
                              <AvatarFallback className="bg-brand-teal text-white"><Bot size={16} /></AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="bg-gray-200 text-gray-600"><User size={16} /></AvatarFallback>
                          )}
                        </Avatar>
                        <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                          <div className={`rounded-2xl px-4 py-2 text-sm md:text-base shadow-sm ${
                            message.role === "user" 
                              ? "bg-brand-teal text-white rounded-tr-none" 
                              : "bg-gray-100 text-gray-800 rounded-tl-none"
                          }`}>
                            <ReactMarkdown 
                              className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                              components={{
                                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                li: ({children}) => <li className="mb-1">{children}</li>,
                                strong: ({children}) => <strong className="font-bold text-brand-teal">{children}</strong>
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex gap-3 items-center bg-gray-100 rounded-2xl px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-teal" />
                      <span className="text-sm text-gray-500">AI Teacher is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-white/50">
              {connectionStatus === "error" && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <WifiOff className="h-4 w-4" />
                  Cannot connect to AI Teacher. Please check if LM Studio is running on the MacBook.
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask your AI Teacher a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading || connectionStatus === "error"}
                  className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-full focus:ring-brand-teal focus:border-brand-teal"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim() || connectionStatus === "error"}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full px-6"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <Bot size={12} /> Tip: Ask about 3D printing, robotics, or AI concepts!
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Your conversations are being recorded for learning progress tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
