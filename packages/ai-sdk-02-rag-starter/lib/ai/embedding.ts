import { openai } from "@ai-sdk/openai";
import { embedMany, embed } from "ai";
import { sql, cosineDistance, gt, desc } from "drizzle-orm";
import { db } from "../db";
import { embeddings } from "../db/schema/embeddings";

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return (
    input
      .trim()
      // It is worth experimenting with different chunking techniques in your projects as the best technique will vary.
      // Here, we are splitting the input by periods.
      .split('.')
      .filter((i) => i !== '')
  );
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  try {
      const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
      .limit(4);
    console.log('similarGuides', similarGuides);
    return similarGuides;
  } catch (e) {
    console.error('Error finding relevant content', e);
    return [];
  }
};
