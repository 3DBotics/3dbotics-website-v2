import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Loader2, 
  AlertCircle,
  Home,
  Cpu
} from "lucide-react";
import logoImage from "@assets/2026_3DBotics®_LOGO_1766703414890.jpg";
import chatbotAvatar from "@assets/Gemini_Generated_Image_8t7xmn8t7xmn8t7x_1766711043630.png";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StudentChat {
  message: string;
  response: string;
  branch: string;
  timestamp?: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "error">("connecting");
  const [studentName, setStudentName] = useState("");
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize connection and send welcome message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setConnectionStatus("connecting");
        // Test connection to LM Studio
        const testResponse = await fetch("http://192.168.1.33:1234/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.2-3b-instruct",
            messages: [
              { role: "system", content: "You are the 3DBotics Facilitator. Respond briefly." },
              { role: "user", content: "Hello" }
            ],
            temperature: 0.7,
            max_tokens: 50
          })
        });

        if (testResponse.ok) {
          setConnectionStatus("connected");
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: "Hello! 👋 Welcome to 3DBotics AI Classroom! I'm your 3DBotics Facilitator. I'm here to help you learn about 3D printing, robotics, and AI. What's your name, student?",
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        } else {
          setConnectionStatus("error");
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: "⚠️ I can't connect to the Master Brain right now. Please ask the Facilitator to check if the server is running on the MacBook.",
            timestamp: new Date()
          };
          setMessages([errorMessage]);
          toast({
            title: "Connection Error",
            description: "Unable to connect to LM Studio. Please check if the server is running.",
            variant: "destructive"
          });
        }
      } catch (error) {
        setConnectionStatus("error");
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: "⚠️ Connection lost to Master MacBook! Please ask the Facilitator to check the server!",
          timestamp: new Date()
        };
        setMessages([errorMessage]);
        toast({
          title: "Connection Error",
          description: "Failed to initialize chat connection.",
          variant: "destructive"
        });
      }
    };

    initializeChat();
  }, [toast]);

  const ask3DBoticsAI = async (studentMessage: string): Promise<string> => {
    try {
      const response = await fetch("http://192.168.1.33:1234/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.2-3b-instruct",
          messages: [
            {
              role: "system",
              content: "You are the 3DBotics Facilitator. Explain everything like the user is a 5th grader. Give only the first step. Keep responses short and encouraging."
            },
            { role: "user", content: studentMessage }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      // Save to Supabase
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
          body: JSON.stringify(chatData)
        });
      } catch (logError) {
        console.warn("Failed to log chat to Supabase:", logError);
        // Continue even if logging fails
      }

      return aiReply;
    } catch (err) {
      console.error("Connection lost to Master MacBook!", err);
      return "I can't hear the Master Brain right now. Please ask the Facilitator to check the server!";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    // If student hasn't introduced themselves, capture their name
    if (!hasIntroduced && inputValue.trim().length > 0) {
      setStudentName(inputValue.trim());
      setHasIntroduced(true);
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await ask3DBoticsAI(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal to-brand-teal/80 pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </a>
          <div className="text-white text-center">
            <h1 className="text-2xl md:text-3xl font-bold">3DBotics AI Classroom</h1>
            <p className="text-sm text-white/80">Learn from your AI Teacher</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[2px] border-white p-[2px] bg-white">
            <div className="w-full h-full rounded-full border-[2px] border-white bg-white overflow-hidden flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="3DBotics Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" ? "bg-green-400" : 
            connectionStatus === "connecting" ? "bg-yellow-400 animate-pulse" : 
            "bg-red-400"
          }`} />
          <span className="text-white text-sm font-medium">
            {connectionStatus === "connected" && "Connected to AI Teacher"}
            {connectionStatus === "connecting" && "Connecting to AI Teacher..."}
            {connectionStatus === "error" && "Connection Error - Check Server"}
          </span>
        </div>

        {/* Chat Container */}
        <Card className="bg-white rounded-2xl shadow-2xl overflow-hidden border-0 h-[600px] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Cpu className="w-16 h-16 mb-4 opacity-30" />
                <p>Initializing AI Teacher...</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full border-[2px] border-brand-teal p-[2px] bg-white flex-shrink-0">
                        <div className="w-full h-full rounded-full border-[2px] border-brand-teal bg-white overflow-hidden flex items-center justify-center">
                          <img 
                            src={chatbotAvatar} 
                            alt="AI Teacher" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-brand-teal text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-gray-600"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full border-[2px] border-brand-teal p-[2px] bg-white flex-shrink-0">
                      <div className="w-full h-full rounded-full border-[2px] border-brand-teal bg-white overflow-hidden flex items-center justify-center">
                        <img 
                          src={chatbotAvatar} 
                          alt="AI Teacher" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {connectionStatus === "error" && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Cannot connect to AI Teacher. Please check if LM Studio is running on the MacBook.
                </p>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask your AI Teacher a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading || connectionStatus === "error"}
                className="flex-1 border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-full"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim() || connectionStatus === "error"}
                className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-white/80 text-sm">
          <p>💡 Tip: Ask about 3D printing, robotics, or AI concepts!</p>
          <p className="mt-2">Your conversations are being recorded for learning progress tracking.</p>
        </div>
      </div>
    </div>
  );
}
// Trigger deployment
