"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Github, Bot, Mic } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth-form";
import { supabase } from "@/lib/supabase";
import { DirectChat } from "@/components/direct-chat";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "bot";
  content: string;
  source?: "database" | "gemini" | "escalated" | "staff" | "system";
};

const LoadingSkeleton = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
      <div className="w-4 h-4 bg-muted-foreground/20 rounded animate-pulse" />
    </div>
    <div className="space-y-2.5 flex-1">
      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-32" />
      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-64" />
      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-48" />
    </div>
  </div>
);

interface NavbarProps {
  position: "top" | "bottom";
  input?: string;
  setInput?: (value: string) => void;
  isLoading?: boolean;
}

const Navbar = ({ position, input = "", setInput, isLoading }: NavbarProps) => (
  <nav
    className={`w-full border-${
      position === "top" ? "b" : "t"
    } border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 flex items-center`}
  >
    <div className="container flex max-w-3xl px-2 items-center mx-auto">
      {position === "top" ? (
        <>
          <div className="flex items-center gap-2 font-bold">
            <Bot className="h-5 w-5" />
            <span>MediConnect</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </>
      ) : (
        <div className="flex w-full gap-3">
          <Input
            value={input}
            onChange={(e) => setInput?.(e.target.value)}
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
                  setInput?.(transcript);
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
          <Button type="submit" disabled={isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  </nav>
);

export default function Home() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showDirectChat, setShowDirectChat] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string>("");

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user && profile) {
      setMessages([
        {
          role: "bot",
          content: `Hello ${
            profile.full_name || user.email
          }! I'm your AI assistant. How can I help you today?`,
        },
      ]);
    }
  }, [user, profile]);

  const getInitial = (name: string | undefined) => {
    return ((name || "U").charAt(0) || "U").toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Send the request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `HTTP error! status: ${response.status}`);

      // Add bot's response
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.response,
          source: data.source,
        },
      ]);

      // If no similar question found in database, show options
      if (data.source === "gemini") {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "Would you like to chat with our support staff?",
            source: "system",
          },
        ]);
        setPendingQuestion(userMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "An error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplify the support chat function
  const startSupportChat = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to chat with support.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting support chat for user:", user.id);

      // Create a new chat
      const { data: chat, error: chatError } = await supabase
        .from("direct_chats")
        .insert({
          user_id: user.id,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (chatError) {
        console.error("Error creating chat:", chatError);
        throw chatError;
      }

      if (!chat) {
        throw new Error("Failed to create chat");
      }

      console.log("Chat created:", chat);

      // Add the first message if there's a pending question
      if (pendingQuestion) {
        const { error: messageError } = await supabase
          .from("chat_messages")
          .insert({
            chat_id: chat.id,
            sender_type: "user",
            sender_id: user.id,
            message: pendingQuestion,
          });

        if (messageError) {
          console.error("Error creating message:", messageError);
          throw messageError;
        }

        console.log("Initial message added to chat");
      }

      // Show success message
      toast({
        title: "Success",
        description: "Chat started with support staff.",
      });

      // Clear pending question
      setPendingQuestion("");

      // Show chat interface
      setShowDirectChat(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Poll for answer to escalated question
  const pollForAnswer = async (question: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select("answer, status")
          .eq("question", question)
          .single();

        if (error) throw error;

        if (data && data.status === "answered") {
          clearInterval(pollInterval);
          setMessages((prev) => {
            const lastIndex = prev.length - 1;
            if (prev[lastIndex].content.includes("healthcare support staff")) {
              // Replace the "waiting" message with the actual answer
              return [
                ...prev.slice(0, -1),
                {
                  role: "bot",
                  content: data.answer,
                  source: "staff",
                },
              ];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  // Render auth form
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm space-y-6">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 container max-w-3xl mx-auto overflow-hidden mt-2">
        <ScrollArea className="h-[calc(100vh-7rem)] px-6">
          <div className="py-2 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.role === "bot"
                      ? "items-start"
                      : "items-end flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "bot"
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/20 text-primary dark:bg-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {message.role === "bot" ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <span className="text-base font-medium">
                        {getInitial(profile?.full_name || user.email)}
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      message.role === "bot"
                        ? "bg-muted/50 dark:bg-zinc-800 rounded-tl-sm"
                        : "bg-primary/10 dark:bg-zinc-700 rounded-tr-sm dark:text-white"
                    }`}
                  >
                    <div
                      className={`prose prose-sm max-w-none ${
                        message.role === "bot" ? "dark:prose-invert" : ""
                      }`}
                    >
                      {message.role === "bot" ? (
                        message.content.includes("healthcare support staff") ? (
                          <div className="space-y-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
                              Waiting for staff response...
                            </div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              pre: ({ node, ...props }) => (
                                <div className="relative my-2">
                                  <pre
                                    className="overflow-auto rounded-md bg-background/50 p-3 text-sm"
                                    {...props}
                                  />
                                </div>
                              ),
                              code: ({
                                node,
                                inline,
                                className,
                                ...props
                              }: {
                                node?: any;
                                inline?: boolean;
                                className?: string;
                                [key: string]: any;
                              }) =>
                                inline ? (
                                  <code
                                    className="rounded bg-background/50 px-1 py-0.5 font-mono text-sm"
                                    {...props}
                                  />
                                ) : (
                                  <code className="text-sm" {...props} />
                                ),
                              table: ({ children }) => (
                                <div className="my-2 overflow-auto">
                                  <table className="w-full border-collapse border rounded-md border-border text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-border bg-background/50 px-3 py-1 text-left">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-border px-3 py-1">
                                  {children}
                                </td>
                              ),
                              p: ({ children }) => (
                                <p className="leading-relaxed mb-1 last:mb-0">
                                  {children}
                                </p>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )
                      ) : (
                        <p className="leading-relaxed text-sm text-foreground dark:text-white">
                          {message.content}
                        </p>
                      )}
                      {message.source && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Source: {message.source}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%] items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-muted/50 rounded-tl-sm">
                    <LoadingSkeleton />
                  </div>
                </div>
              </div>
            )}
            {pendingQuestion && (
              <div className="flex justify-center gap-2 mb-4">
                <Button variant="outline" onClick={startSupportChat}>
                  Chat with Support
                </Button>
              </div>
            )}
            {showDirectChat && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <DirectChat
                  initialQuestion={pendingQuestion}
                  onClose={() => {
                    setShowDirectChat(false);
                    setPendingQuestion("");
                  }}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      <form onSubmit={handleSubmit}>
        <Navbar
          position="bottom"
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}
