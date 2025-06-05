process.removeAllListeners('warning');

import 'dotenv/config';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function runAnalyzer({ index, file, message }) {
  const prompt = `
Cypress test failure #${index}
File: ${file}

Error:
${message}

Please explain what went wrong and how to fix it.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  console.log('\n----------------------------');
  console.log(`🧪 GPT Analysis for Failure ${index}`);
  console.log(`📄 File: ${file}\n`);
  console.log(response.choices[0].message.content);
  console.log('----------------------------\n');
}
