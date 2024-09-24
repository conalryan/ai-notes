# OpenAI NodeJS

```bash
pnpm init
```

Change the `package.json` file to use `esnext` instead of `commonjs`

```json
"type": "module",
```

Install the dependencies

```bash
pnpm install openai dotenv
pnpm install -D prettier
```

Create the `.env` file with your OpenAI API key

```bash
echo "OPENAI_API_KEY=sk-proj-95343043-0000-0000-0000-000000000000" >> .env
```

Hello world chat

```js
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  messages: [
    {
      role: 'system',
      content: 'You an an AI assitant answer questions and help with tasks.',
    },
    {
      role: 'user',
      content: 'Hi',
    },
  ],
  model: 'gpt-3.5-turbo',
});

console.log(completion.choices[0]);
// {
//   index: 0,
//   message: {
//     role: 'assistant',
//     content: 'Hello! How can I help you today?',
//     refusal: null
//   },
//   logprobs: null,
//   finish_reason: 'stop'
// }
```
