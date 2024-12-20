import { generateId } from 'ai';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

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