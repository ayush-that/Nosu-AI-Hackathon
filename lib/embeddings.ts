import { supabase } from "./supabase";

// Improved embedding function
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    console.log("Generating embedding for:", text.substring(0, 50) + "...");

    // Normalize and tokenize the text
    const normalizedText = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, " ");

    const words = normalizedText.split(/\s+/);

    // Create a fixed-size embedding (768 dimensions)
    const embedding = new Array(768).fill(0);

    // For each word, create a more sophisticated embedding
    words.forEach((word, wordIndex) => {
      // Use word position for context
      const positionFactor = (wordIndex + 1) / words.length;

      // Generate word-level features
      const wordChars = Array.from(word);
      const wordLength = word.length;

      wordChars.forEach((char, charIndex) => {
        // Distribute character information across the embedding
        const charCode = char.charCodeAt(0);
        const relativePosition = charIndex / wordLength;

        // Use multiple positions for each character to capture more patterns
        const positions = [
          (wordIndex * 50 + charIndex) % 768, // Character position
          (charCode * positionFactor * 10) % 768, // Character value with position weight
          (wordLength * 20 + charIndex * 3) % 768, // Word length features
        ];

        positions.forEach((pos) => {
          embedding[pos] =
            (embedding[pos] + (charCode / 255) * (1 - relativePosition)) / 2;
        });
      });
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    const normalizedEmbedding = embedding.map((val) => val / (magnitude || 1));

    console.log(`Generated embedding of length ${normalizedEmbedding.length}`);
    return normalizedEmbedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);

  // Exact match
  if (normalized1 === normalized2) return 1;

  const words1 = normalized1.split(" ");
  const words2 = normalized2.split(" ");

  // If lengths are too different, reduce similarity
  const lengthDiff = Math.abs(words1.length - words2.length);
  if (lengthDiff > Math.min(words1.length, words2.length)) {
    return 0.1;
  }

  // Calculate word-level similarity with position importance
  let matchScore = 0;
  let totalScore = Math.max(words1.length, words2.length);

  for (let i = 0; i < words1.length; i++) {
    const word1 = words1[i];
    let bestWordMatch = 0;

    for (let j = 0; j < words2.length; j++) {
      const word2 = words2[j];
      let wordSimilarity = 0;

      // Exact word match with position bonus
      if (word1 === word2) {
        const positionDiff = Math.abs(i - j);
        const positionPenalty =
          positionDiff / Math.max(words1.length, words2.length);
        wordSimilarity = 1 - positionPenalty * 0.5; // Position affects up to 50% of word score
      }
      // Partial match for longer words (minimum 4 characters)
      else if (word1.length >= 4 && word2.length >= 4) {
        // Check for substring match
        if (word1.includes(word2) || word2.includes(word1)) {
          wordSimilarity = 0.7;
        } else {
          // Calculate character-level similarity
          const commonChars = [...word1].filter((char) =>
            word2.includes(char)
          ).length;
          const charSimilarity =
            commonChars / Math.max(word1.length, word2.length);

          // Only count if significant character overlap
          if (charSimilarity > 0.6) {
            wordSimilarity = charSimilarity * 0.5; // Character similarity worth up to 50%
          }
        }
      }

      bestWordMatch = Math.max(bestWordMatch, wordSimilarity);
    }

    // Apply word position importance
    const positionImportance = 1 - (i / words1.length) * 0.3; // Earlier words are more important
    matchScore += bestWordMatch * positionImportance;
  }

  // Calculate final similarity score
  let similarity = matchScore / totalScore;

  // Additional penalties for significant differences
  if (words1.length !== words2.length) {
    similarity *= 0.9; // 10% penalty for different lengths
  }

  // Threshold to avoid very low similarity matches
  return similarity < 0.3 ? 0 : similarity;
}

export async function findSimilarQuestions(
  question: string,
  threshold = 0.3 // Lowered threshold for better matching
): Promise<{ question: string; answer: string } | null> {
  try {
    const normalizedQuestion = normalizeText(question);
    console.log("Finding similar questions for:", normalizedQuestion);

    // First try direct text matching
    const { data: directMatches } = await supabase
      .from("conversations")
      .select("question, answer")
      .ilike("question", `%${normalizedQuestion}%`)
      .limit(5);

    if (directMatches?.length) {
      console.log("Found direct matches:", directMatches.length);
      const bestDirectMatch = directMatches.reduce(
        (best: any, current: any) => {
          const similarity = calculateSimilarity(
            normalizedQuestion,
            current.question
          );
          return similarity > (best?.similarity || 0)
            ? { ...current, similarity }
            : best;
        },
        null
      );

      if (bestDirectMatch?.similarity >= threshold) {
        console.log("Best direct match:", bestDirectMatch);
        return {
          question: bestDirectMatch.question,
          answer: bestDirectMatch.answer,
        };
      }
    }

    // If no direct matches, try vector similarity
    const questionEmbedding = await getEmbedding(normalizedQuestion);
    const { data: similarQuestions, error } = await supabase.rpc(
      "match_questions",
      {
        query_embedding: questionEmbedding,
        match_threshold: 0.1, // Lowered threshold for vector similarity
        match_count: 10,
      }
    );

    if (error) {
      console.error("Error in match_questions RPC:", error);
      return null;
    }

    if (!similarQuestions?.length) {
      console.log("No similar questions found");
      return null;
    }

    console.log("Found potential matches:", similarQuestions.length);

    // Find best match using both vector and text similarity
    const bestMatch = similarQuestions.reduce((best: any, current: any) => {
      const similarity = calculateSimilarity(
        normalizedQuestion,
        current.question
      );
      console.log(`Similarity for "${current.question}": ${similarity}`);
      return similarity > (best?.similarity || 0)
        ? { ...current, similarity }
        : best;
    }, null);

    if (bestMatch?.similarity >= threshold) {
      console.log("Best match found:", bestMatch);
      return {
        question: bestMatch.question,
        answer: bestMatch.answer,
      };
    }

    console.log("No match above threshold found");
    return null;
  } catch (error) {
    console.error("Error finding similar questions:", error);
    return null;
  }
}

export async function storeConversation(question: string, answer: string) {
  try {
    const normalizedQuestion = normalizeText(question);
    const embedding = await getEmbedding(normalizedQuestion);

    const { data: existing } = await supabase
      .from("conversations")
      .select("id, question")
      .eq("question", normalizedQuestion)
      .limit(1);

    if (existing?.length) {
      return existing[0];
    }

    const similarQuestion = await findSimilarQuestions(normalizedQuestion, 0.9);
    if (similarQuestion) {
      return similarQuestion;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert([
        {
          question: normalizedQuestion,
          answer,
          embedding,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error storing conversation:", error);
    throw error;
  }
}
