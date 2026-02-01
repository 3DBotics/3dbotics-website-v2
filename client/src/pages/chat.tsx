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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"online" | "error">("online");
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("3dbotics-chat-history");
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
        localStorage.setItem("3dbotics-chat-history", JSON.stringify(messages));
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
    localStorage.removeItem("3dbotics-chat-history");
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
      // Call the backend /api/chat endpoint which uses the librarian system
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: studentMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.response) {
        throw new Error("Invalid response from API");
      }

      const aiReply = data.response;

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
                <h1 className="text-2xl font-bold">3DBotics® AI Classroom</h1>
                <p className="text-sm text-blue-100">Chat with your AI Robotics Teacher</p>
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
              <span className="text-green-600 font-medium">Connected to 3DBotics AI Brain</span>
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
              placeholder="Ask your AI teacher about Arduino, motors, or 3D printing..."
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
