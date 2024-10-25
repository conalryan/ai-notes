import 'dotenv/config';
import OpenAI from 'openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';
import { CharacterTextSplitter } from 'langchain/text_splitter';

const VIDEO = `https://youtu.be/zR_iuq2evXo?si=cG8rODgRgXOx9_Cn`;

const openai = new OpenAI();
const question = process.argv[2] || 'hi';

const query = async () => {
  const store = await loadStore();
  const results = await store.similaritySearch(question, 1);

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    temperature: 0,
    messages: [
      {
        role: 'assistant',
        content:
          'You are a helpful AI assistant. Answser questions to your best ability.',
      },
      {
        role: 'user',
        content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
        Question: ${question}
  
        Context: ${results.map((r) => r.pageContent).join('\n')}`,
      },
    ],
  });
  console.log(
    `Answer: ${response.choices[0].message.content}\n\nSources: ${results
      .map((r) => r.metadata.source)
      .join(', ')}`,
  );
};

const loadStore = async () => {
  const videoDocs = await docsFromYTVideo(VIDEO);
  return createStore(videoDocs);
};

export const docsFromYTVideo = async (video) => {
  const loader = YoutubeLoader.createFromUrl(video, {
    language: 'en',
    addVideoInfo: true, // add to metadata
  });
  return loader.load(
    // split into chunks to avoid token limit
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 100,
    }),
  );
};

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

query();
