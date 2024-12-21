# AI SDK 03 Multi Modal Chatbot

1. `pnpm create next-app@latest packages/ai-sdk-03-multi-modal-chatbot`

2. `pnpm -F ai-sdk-03-multi-modal-chatbot add ai @ai-sdk/openai`

3. `echo "OPENAI_API_KEY=sk-..." > packages/ai-sdk-03-multi-modal-chatbot/.env`

4. Create a route handler, app/api/chat/route.ts

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```


5. pages.tsx

```tsx
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

6. `pnpm -F ai-sdk-03-multi-modal-chatbot dev`
