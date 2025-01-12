import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "User ID is required",
        }),
        { status: 400 }
      );
    }

    console.log("Creating chat for:", { userId, message });

    // Create a new chat
    const { data: chat, error: chatError } = await supabase
      .from("direct_chats")
      .insert({
        user_id: userId,
        question: message,
        status: "pending",
      })
      .select()
      .single();

    if (chatError) {
      console.error("Error creating chat:", chatError);
      throw chatError;
    }

    console.log("Chat created:", chat);

    // Add the message
    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chat.id,
        sender_type: "user",
        sender_id: userId,
        message: message,
      });

    if (messageError) {
      console.error("Error creating message:", messageError);
      throw messageError;
    }

    console.log("Message added to chat");

    return new Response(
      JSON.stringify({
        chatId: chat.id,
        message: "Chat started successfully",
      })
    );
  } catch (error) {
    console.error("Error in direct chat route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const chatId = url.searchParams.get("chatId");
    const userId = url.searchParams.get("userId");

    if (!chatId || !userId) {
      throw new Error("Missing required parameters");
    }

    // Get chat messages
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return new Response(JSON.stringify({ messages }));
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
