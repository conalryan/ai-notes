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
