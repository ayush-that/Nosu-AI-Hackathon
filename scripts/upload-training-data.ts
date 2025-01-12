import fs from "fs";
import csv from "csv-parser";
import { supabaseAdmin } from "../lib/supabase-admin";
import { getEmbedding } from "../lib/embeddings";

async function uploadTrainingData() {
  const results: any[] = [];
  let processed = 0;
  const batchSize = 50; // Smaller batch size due to embedding generation

  console.log("Reading CSV file...");

  // Read and parse the CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream("data/train.csv")
      .pipe(csv())
      .on("data", (data) => {
        if (results.length === 0) {
          console.log("First row structure:", data);
        }
        results.push(data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Found ${results.length} records to process`);

  // Process in batches
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const batchPromises = batch.map(async (record) => {
      try {
        // Get the text to encode (using the correct column name)
        const questionText =
          record.Question || record.question || Object.values(record)[0];
        const answerText =
          record.Answer || record.answer || Object.values(record)[1];

        if (!questionText || !answerText) {
          console.error("Missing question or answer in record:", record);
          return null;
        }

        // Generate embedding using your sophisticated embedding function
        const embedding = await getEmbedding(questionText.toString());

        return {
          question: questionText,
          answer: answerText,
          embedding: embedding,
        };
      } catch (error) {
        console.error("Error processing record:", error);
        return null;
      }
    });

    // Wait for all embeddings in batch to be generated
    const processedBatch = (await Promise.all(batchPromises)).filter(Boolean);

    if (processedBatch.length === 0) {
      console.log("Skipping empty batch");
      continue;
    }

    // Insert batch into Supabase
    const { error } = await supabaseAdmin
      .from("conversations")
      .insert(processedBatch);

    if (error) {
      console.error("Error inserting batch:", error);
      continue;
    }

    processed += processedBatch.length;
    console.log(`Processed ${processed} of ${results.length} records`);
  }

  console.log("Upload completed!");
}

// Run the upload
uploadTrainingData().catch((error) => {
  console.error("Upload failed:", error);
  process.exit(1);
});
