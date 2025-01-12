import { GoogleGenerativeAI } from "@google/generative-ai";
import { findSimilarQuestions, storeConversation } from "@/lib/embeddings";
import { supabase } from "@/lib/supabase";

// Initialize Gemini with hardcoded API key for now
const genAI = new GoogleGenerativeAI("AIzaSyCQtd3mHagegGMfne_G7RMAvR5QMuGe7BU");

// Get the chat model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function checkForAnswer(question: string) {
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("answer")
    .eq("question", question)
    .limit(1)
    .single();

  if (error || !conversations) {
    return null;
  }

  return conversations.answer;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.message;

    console.log("Received question:", question);

    // First check for similar questions in the database
    const similarQuestion = await findSimilarQuestions(question);
    if (similarQuestion) {
      console.log("Found similar question:", similarQuestion);
      return new Response(
        JSON.stringify({
          response: similarQuestion.answer,
          source: "database",
        })
      );
    }

    // Check if this question has been answered by staff
    const staffAnswer = await checkForAnswer(question);
    if (staffAnswer) {
      return new Response(
        JSON.stringify({
          response: staffAnswer,
          source: "staff",
        })
      );
    }

    // If no similar question found, use Gemini to generate an answer
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const answer = response.text();

    if (!answer) {
      throw new Error("Empty response from Gemini");
    }

    return new Response(
      JSON.stringify({
        response: answer,
        source: "gemini",
      })
    );
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
