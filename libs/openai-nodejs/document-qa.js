import 'dotenv/config';
import OpenAI from 'openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path';
import { fileURLToPath } from 'url';

const openai = new OpenAI();
const question = process.argv[2] || 'hi';

const query = async () => {
  const store = await loadStore();
  const results = await store.similaritySearch(question, 1);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
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
  const pdfDocs = await docsFromPDF();
  return createStore(pdfDocs);
};

export const docsFromPDF = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const loader = new PDFLoader(path.join(__dirname, './xbox.pdf'));
  return loader.load(
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 200,
    }),
  );
};

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

query();
