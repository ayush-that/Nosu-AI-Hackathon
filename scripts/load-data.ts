import { supabase } from "../lib/supabase";
import { getEmbedding } from "../lib/embeddings";

const medicalQnA = [
  {
    question: "Where is Dr. Ramita's cabin?",
    answer:
      "Dr. Ramita's cabin is located on the second floor, Room 205, in the Medical Wing B.",
  },
  {
    question: "What are the hospital visiting hours?",
    answer:
      "The general visiting hours are from 10:00 AM to 8:00 PM daily. ICU has special visiting hours: 11:00 AM - 12:00 PM and 5:00 PM - 6:00 PM.",
  },
  {
    question: "How do I schedule an appointment?",
    answer:
      "You can schedule an appointment by calling our appointment desk at (555) 123-4567 or using our online patient portal. For urgent cases, please visit our emergency department.",
  },
  {
    question: "Where is the emergency room?",
    answer:
      "The emergency room is located on the ground floor, with direct access from the main parking lot. Follow the red 'Emergency' signs at the hospital entrance.",
  },
  {
    question: "What are the pharmacy hours?",
    answer:
      "The main pharmacy is open 24/7. The outpatient pharmacy is open Monday to Friday from 8:00 AM to 9:00 PM, and weekends from 9:00 AM to 6:00 PM.",
  },
];

async function loadData() {
  try {
    console.log("Starting data load process...");

    // Clear existing data
    const { error: clearError } = await supabase
      .from("conversations")
      .delete()
      .neq("id", 0); // Delete all records

    if (clearError) {
      console.error("Error clearing existing data:", clearError);
      return;
    }

    console.log("Existing data cleared");

    // Process each Q&A pair
    for (const [index, qna] of medicalQnA.entries()) {
      try {
        console.log(`Processing Q&A ${index + 1}/${medicalQnA.length}`);
        console.log("Question:", qna.question);

        // Generate embedding
        const embedding = await getEmbedding(qna.question);
        console.log("Embedding generated");

        // Insert into database
        const { error: insertError } = await supabase
          .from("conversations")
          .insert([
            {
              question: qna.question,
              answer: qna.answer,
              embedding: embedding,
            },
          ]);

        if (insertError) {
          console.error(`Error inserting Q&A ${index + 1}:`, insertError);
          continue;
        }

        console.log(`Successfully inserted Q&A ${index + 1}`);

        // Add a small delay between insertions
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing Q&A ${index + 1}:`, error);
        continue;
      }
    }

    console.log("Data load complete!");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

loadData();
