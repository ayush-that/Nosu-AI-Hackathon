import { supabase } from "../lib/supabase";
import { getEmbedding } from "../lib/embeddings";

async function main() {
  try {
    console.log("Starting embedding update...");

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .is("embedding", null);

    if (error) throw error;

    console.log(
      `Found ${conversations?.length || 0} conversations without embeddings`
    );

    for (const conversation of conversations || []) {
      try {
        console.log(
          `Processing conversation ${
            conversation.id
          }: "${conversation.question.substring(0, 50)}..."`
        );

        const embedding = await getEmbedding(conversation.question);
        console.log(`Generated embedding of length ${embedding.length}`);

        const { error: updateError } = await supabase
          .from("conversations")
          .update({ embedding })
          .eq("id", conversation.id);

        if (updateError) {
          console.error(
            `Error updating conversation ${conversation.id}:`,
            updateError
          );
          continue;
        }

        console.log(
          `Successfully updated embedding for conversation ${conversation.id}`
        );
      } catch (error) {
        console.error(
          `Error processing conversation ${conversation.id}:`,
          error
        );
        continue;
      }
    }

    console.log("Embedding update complete!");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

main();
