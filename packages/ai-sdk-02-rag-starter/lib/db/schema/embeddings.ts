import { openai } from '@ai-sdk/openai';
import { embedMany, generateId } from 'ai';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export const embeddings = pgTable(
  'embeddings',
  {
    // id - unique identifier
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    // resourceId - a foreign key relation to the full source material
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    // content - the plain text chunk
    content: text('content').notNull(),
    // embedding - the vector representation of the plain text chunk
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    // To perform similarity search, you also need to include an index (HNSW
    // or IVFFlat) on this column for better performance.
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    // It is worth experimenting with different chunking techniques in your projects as the best technique will vary.
    // Here, we are splitting the input by periods.
    .split('.')
    .filter(i => i !== '');
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