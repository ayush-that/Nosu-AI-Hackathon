import fs from "fs";
import csv from "csv-parser";
import { supabaseAdmin } from "../lib/supabase-admin";

async function importData() {
  const results: any[] = [];
  let processed = 0;
  const batchSize = 100;

  console.log("Reading CSV file...");
  console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Read and parse the CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream("data/train.csv")
      .pipe(csv())
      .on("data", (data) => {
        // Log the first row to see the structure
        if (results.length === 0) {
          console.log("First row structure:", data);
        }
        results.push(data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Found ${results.length} records to process`);

  if (results.length > 0) {
    console.log("Sample record:", results[0]);
    console.log("Available columns:", Object.keys(results[0]));
  }

  // Process in batches
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);

    // Create simple numeric embeddings (768 dimensions)
    const batchWithEmbeddings = batch
      .map((record) => {
        // Get the text to encode (using the correct column name)
        const questionText =
          record.Question || record.question || Object.values(record)[0];
        if (!questionText) {
          console.error("Could not find question text in record:", record);
          return null;
        }

        const textToEncode = questionText.toString().toLowerCase();
        const embedding = Array.from<string>(textToEncode)
          .filter((char) => /[a-z0-9\s]/.test(char))
          .map((char) => char.charCodeAt(0) / 255);

        // Pad or truncate to 768 dimensions
        const paddedEmbedding = embedding.slice(0, 768);
        while (paddedEmbedding.length < 768) {
          paddedEmbedding.push(0);
        }

        return {
          question: questionText,
          answer:
            record.Answer || record.answer || Object.values(record)[1] || "",
          embedding: paddedEmbedding,
        };
      })
      .filter(Boolean); // Remove any null records

    if (batchWithEmbeddings.length === 0) {
      console.log("Skipping empty batch");
      continue;
    }

    // Insert batch into Supabase
    const { error } = await supabaseAdmin
      .from("conversations")
      .insert(batchWithEmbeddings);

    if (error) {
      console.error("Error inserting batch:", error);
      continue;
    }

    processed += batch.length;
    console.log(`Processed ${processed} of ${results.length} records`);
  }

  console.log("Import completed!");
}

// Run the import
importData().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
