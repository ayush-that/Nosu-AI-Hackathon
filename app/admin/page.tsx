"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getEmbedding } from "@/lib/embeddings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type Message = {
  id: number;
  chat_id: number;
  sender_type: "user" | "admin";
  sender_id: string;
  message: string;
  created_at: string;
};

type Chat = {
  id: number;
  user_id: string;
  status: string;
  created_at: string;
  last_message?: string;
};

export default function AdminChat() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle admin login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    setSelectedChat(null);
  };

  // Check admin session on mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("isAdmin");
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat) return;

    setIsLoading(true);
    const message = input.trim();
    setInput("");

    try {
      // First store the message in chat_messages
      const { error: chatError } = await supabase.from("chat_messages").insert({
        chat_id: selectedChat.id,
        sender_type: "admin",
        sender_id: "00000000-0000-0000-0000-000000000000",
        message: message,
      });

      if (chatError) throw chatError;

      // Get the original question from the chat
      const { data: originalMessage, error: queryError } = await supabase
        .from("chat_messages")
        .select("message")
        .eq("chat_id", selectedChat.id)
        .eq("sender_type", "user")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (queryError) throw queryError;

      // Store the Q&A pair in conversations table with embedding
      if (originalMessage) {
        // Generate embedding for the question
        const embedding = await getEmbedding(originalMessage.message);

        const { error: storeError } = await supabase
          .from("conversations")
          .insert({
            question: originalMessage.message,
            answer: message,
            embedding: embedding,
          });

        if (storeError) throw storeError;
      }

      // Update chat's updated_at timestamp
      await supabase
        .from("direct_chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedChat.id);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active chats
  useEffect(() => {
    if (!isAdmin) return;

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("direct_chats")
        .select(
          `
          id,
          user_id,
          status,
          created_at,
          chat_messages (
            message,
            created_at
          )
        `
        )
        .eq("status", "active")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      // Process chats to include last message
      const processedChats = data.map((chat) => ({
        id: chat.id,
        user_id: chat.user_id,
        status: chat.status,
        created_at: chat.created_at,
        last_message: chat.chat_messages?.[0]?.message || "No messages yet",
      }));

      setChats(processedChats);
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", selectedChat.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  const closeChat = async (chatId: number) => {
    try {
      await supabase
        .from("direct_chats")
        .update({ status: "closed" })
        .eq("id", chatId);

      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error closing chat:", error);
    }
  };

  // Show admin login form if not logged in
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin panel
            </p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* Chat List Panel */}
        <ResizablePanel defaultSize={25}>
          <Card className="h-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Active Chats</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="px-3 py-2 space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "relative w-full p-2 rounded-lg text-sm transition-colors",
                      selectedChat?.id === chat.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="pr-8">
                        <div>Chat #{chat.id}</div>
                        <div className="text-xs opacity-70">
                          {new Date(chat.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => closeChat(chat.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Chat Messages Panel */}
        <ResizablePanel defaultSize={75}>
          <Card className="h-full">
            <CardHeader className="py-3">
              <CardTitle className="text-lg">
                {selectedChat ? `Chat #${selectedChat.id}` : "Select a chat"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedChat ? (
                <div className="h-[calc(100vh-8rem)] flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex max-w-[80%] rounded-lg p-3",
                            message.sender_type === "admin"
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <div className="space-y-1">
                            <div className="text-sm">{message.message}</div>
                            <div className="text-[10px] opacity-70">
                              {new Date(message.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a chat to start messaging
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
