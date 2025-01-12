import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  chat_id: number;
  sender_type: "user" | "admin";
  sender_id: string;
  message: string;
  created_at: string;
};

interface DirectChatProps {
  initialQuestion?: string;
  onClose: () => void;
}

export function DirectChat({ initialQuestion, onClose }: DirectChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Get chat ID and fetch messages
  useEffect(() => {
    const fetchChatId = async () => {
      if (!user) return;

      console.log("Fetching active chat for user:", user.id);

      const { data: chat, error } = await supabase
        .from("direct_chats")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching chat:", error);
        return;
      }

      if (chat) {
        console.log("Found active chat:", chat);
        setChatId(chat.id);
      } else {
        console.log("No active chat found for user");
      }
    };

    fetchChatId();
  }, [user]);

  // Poll for new messages
  useEffect(() => {
    if (!chatId) return;

    console.log("Setting up message polling for chat:", chatId);

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data) {
        console.log("Received messages:", data.length);
        setMessages(data);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chatId) return;

    setIsLoading(true);
    const message = input.trim();
    setInput("");

    try {
      const { error } = await supabase.from("chat_messages").insert({
        chat_id: chatId,
        sender_type: "user",
        sender_id: user.id,
        message: message,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-background border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Support Chat</h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === "admin"
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender_type === "admin"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if ("webkitSpeechRecognition" in window) {
                const recognition = new (
                  window as any
                ).webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  setInput(transcript);
                };

                recognition.start();
              } else {
                alert("Speech recognition is not supported in your browser.");
              }
            }}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
