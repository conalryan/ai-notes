# AI SDK Getting Started

## [NEXT.JS APP ROUTER](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)
1. Create a new Next.js app
`pnpm create next-app@latest packages/my-ai-app`

2. Install the AI SDK and dependencies
`pnpm -F my-ai-app add ai @ai-sdk/openai zod`

3. Add an env.local file
`echo "OPENAI_API_KEY=xxxxxxxxx" > .env.local`

4. Run the app
`pnpm -F my-ai-app dev`

5. Define an /api/chat route for the useChat hook

/app/api/chat/route.ts
```typescript
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
```

6. Add the useChat hook to page.tsx
```tsx
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  // useChat hook
  // By default will use the POST API route /api/chat.
  // The hook provides functions and state for handling user input and form submission.
  // - messages - the current chat messages (an array of objects with id, role, and content properties).
  // - input - the current value of the user's input field.
  // - handleInputChange and handleSubmit - functions to handle user interactions (typing into the input field and submitting the form, respectively).
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    
    // Enabling Multi-Step Tool Calls
    // The model is not aware of the tool calls, so it will not use them.
    // To enable multi-step tool calls, you need to set the maxSteps option.
    // This feature will automatically send tool results back to the model to trigger an additional generation. 
    maxSteps: 5,
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
        >
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {/* If the message contains tool invocations, display them as a JSON object */}
          {m.toolInvocations ? (
            <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
          ) : (
            <p>{m.content}</p>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```