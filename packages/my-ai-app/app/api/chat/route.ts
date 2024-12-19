import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // The messages variable contains a history of the conversation between you and the chatbot
  // and provides the chatbot with the necessary context to make the next generation.
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    // Tools
    // Complex tools to integrate with real APIs, databases, or any other external systems, 
    // allowing the model to access and process real-world data in real-time. 
    // Tools bridge the gap between the model's knowledge cutoff and current information.
    tools: {
      // Define a tool
      weather: tool({
        // description that helps the model understand when to use it.
        description: 'Get the weather in a location (fahrenheit)',
        // parameters using a Zod schema
        // The model will attempt to extract this parameter from the context of the conversation. 
        // If it can't, it will ask the user for the missing information.
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        // execute function that returns the result of the tool call
        // asynchronous function running on the server so you can fetch real data from an external API.
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        parameters: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}