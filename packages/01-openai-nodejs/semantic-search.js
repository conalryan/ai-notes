import 'dotenv/config';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // this line is not required if your .env file has OPENAI_API_KEY and using dotenv/config
});

const movies = [
  {
    id: 1,
    title: 'Stepbrother',
    description: `Comedic journey full of adult humor and awkwardness.`,
  },
  {
    id: 2,
    title: 'The Matrix',
    description: `Deals with alternate realities and questioning what's real.`,
  },
  {
    id: 3,
    title: 'Shutter Island',
    description: `A mind-bending plot with twists and turns.`,
  },
  {
    id: 4,
    title: 'Memento',
    description: `A non-linear narrative that challenges the viewer's perception.`,
  },
  {
    id: 5,
    title: 'Doctor Strange',
    description: `Features alternate dimensions and reality manipulation.`,
  },
  {
    id: 6,
    title: 'Paw Patrol',
    description: `Children's animated movie where a group of adorable puppies save people from all sorts of emergencies.`,
  },
  {
    id: 7,
    title: 'Interstellar',
    description: `Features futuristic space travel with high stakes`,
  },
];

const createStore = () =>
  MemoryVectorStore.fromDocuments(
    movies.map(
      (movie) =>
        new Document({
          // The Document object is a fundamental unit in LangChain for text processing
          // It typically contains:
          // - pageContent: The main text content
          // - metadata: Additional information about the document (optional)

          // Here, we're creating a Document for each movie
          // pageContent combines the title and description
          // pageContent is not structured
          pageContent: `Title: ${movie.title}\n${movie.description}`,

          // Note: We could add metadata if needed, e.g.:
          // metadata: { id: movie.id, genre: movie.genre }
          // structured data
          // Some vectore stores support filtering by metadata
          metadata: { source: movie.id, title: movie.title },
        }),
    ),
    // embeddings are a way to represent text as a vector
    new OpenAIEmbeddings(),
  );

export const search = async (query, count = 1) => {
  const store = await createStore();
  return store.similaritySearch(query, count);
};

console.log(await search('cute and furry'));
