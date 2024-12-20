# Vercel AI SDK RAG Guide Starter Project

This is the starter project for the Vercel AI SDK [Retrieval-Augmented Generation (RAG) guide](https://sdk.vercel.ai/docs/guides/rag-chatbot).

In this project, you will build a chatbot that will only respond with information that it has within its knowledge base. The chatbot will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

This project will use the following stack:

- [Next.js](https://nextjs.org) 14 (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Postgres](https://www.postgresql.org/) with [ pgvector ](https://github.com/pgvector/pgvector)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling

# [AI SDK RAG Chatbot](https://sdk.vercel.ai/docs/guides/rag-chatbot)

What is RAG?

RAG stands for retrieval augmented generation. In simple terms, RAG is the process of providing a Large Language Model (LLM) with specific information relevant to the prompt.

You could fetch any context for your RAG application (eg. Google search). Embeddings and Vector Databases are just a specific retrieval approach to achieve semantic search.

## Embedding

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space. In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

The process of calculating the similarity between two vectors is called ‘cosine similarity’ where a value of 1 would indicate high similarity and a value of -1 would indicate high opposition.

## Chunking

Chunking refers to the process of breaking down a particular source material into smaller pieces. A simple and common approach to chunking (and what you will be using in this guide) is separating written content by sentences.

Once your source material is appropriately chunked, you can embed each one and then store the embedding and the chunk together in a database. Embeddings can be stored in any database that supports vectors. For this tutorial, you will be using Postgres alongside the pgvector plugin.

## Setup

1. `git clone https://github.com/vercel/ai-sdk-rag-starter`
2. `pnpm install`
3. `pnpm -F ai-sdk-02-rag-starter db:migrate`

## Akamai Connect to the database

`psql --host=[host] --username=[username] --password --dbname=defaultdb`

### Commands

`\?` - List of commands
`\l` - List of databases
`\d` - List of relations
`\dt` - List of relations details

## Create Embeddings Table

1. `pnpm -F ai-sdk-02-rag-starter add ai`
2. Create embeddings.ts file in `lib/db/schema`
3. `pnpm -F ai-sdk-02-rag-starter db:push`

## Add Embedding Logic

Now that you have a table to store embeddings, it’s time to write the logic to create the embeddings.

## Generate Chunks

Remember, to create an embedding, you will start with a piece of source material (unknown length), break it down into smaller chunks, embed each chunk, and then save the chunk to the database. Let’s start by creating a function to break the source material into small chunks.

1. `pnpm -F ai-sdk-02-rag-starter add ai @ai-sdk/openai`

## Create Root Page

Great! Let's build the frontend. The AI SDK’s useChat hook allows you to easily create a conversational user interface for your chatbot application.

1. `pnpm -F ai-sdk-02-rag-starter run dev`

By default, useChat will send a POST request to the /api/chat endpoint with the messages as the request body.

## Create API Route

In Next.js, you can create custom request handlers for a given route using Route Handlers.

Route Handlers are defined in a `route.ts` file and can export HTTP methods like `GET`, `POST`, `PUT`, `PATCH` etc.

Create a file at `app/api/chat/route.ts` by running the following command:

```bash
mkdir -p packages/ai-sdk-02-rag-starter/app/api/chat && touch packages/ai-sdk-02-rag-starter/app/api/chat/route.ts
```

## Using Tools

A tool is a function that can be called by the model to perform a specific task.
The model will decide whether it should call the tool.
When called the tool/model? will extract the parameters from the input and then append a new message to the messages array of type tool-call. 
The AI SDK will then run the execute function with the parameters provided by the tool-call message.

`pnpm -F ai-sdk-02-rag-starter db:studio`

