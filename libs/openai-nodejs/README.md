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

## Hello world chat

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

## [Simple Chat UX](https://scottmoss.notion.site/Simple-chat-UX-59c4414fd15b4346bde3f543e69e041b)

### Temperature

The higher the tempature the more imaginative the response.
A value of `0` will always return the same response.
A Value of `1` will be more imaginative.

## [Creating Semantic Search](https://scottmoss.notion.site/Creating-Semantic-search-51fc63277382409a8613fe64a48f6a3b)

Great for discovery engines.

If you want to build LLMs into your application LangChain is the most sofisticated library.

### [Scaling Semantic Search](https://scottmoss.notion.site/Scaling-Semantic-search-cc30dfdb975a4d458300d73efa613e79)

## [Document QA](https://scottmoss.notion.site/Document-QA-a631b110afff4eedb782e295cd9bd300)

Create for indexing on a specific document or documents.

### Use cases

- Onboarding chatbot that could help engineers onboard. They could ask the chatbot how do I setup x, y, z.? What is the style guide?
- Customer support bot
- Learning about content, pasted a document into the chatbot then have the bot teach you about it.

### PDF QA

```bash
pnpm add langchain @langchain/openai @langchain/core @langchain/community pdf-parse
```

```bash
node ./libs/openai-nodejs/document-qa.js "what is the x-box warranty?"
```

### Youtube QA

```bash
pnpm add youtube-transcript youtubei.js
```

```bash
node ./libs/openai-nodejs/youtube-qa.js "Where did Brian work?"
```
