import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    tools: {
      addResource: tool({
        // description: description of the tool that will influence when the tool is picked.
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        // parameters: Zod schema that defines the parameters necessary for the tool to run.
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        // execute: An asynchronous function that is called with the arguments from the tool call.
        // In simple terms, on each generation, the model will decide whether it should call the tool. 
        // If it deems it should call the tool, it will extract the parameters from the input and then 
        // append a new message to the messages array of type tool-call. The AI SDK will then 
        // run the execute function with the parameters provided by the tool-call message.
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toDataStreamResponse();
}