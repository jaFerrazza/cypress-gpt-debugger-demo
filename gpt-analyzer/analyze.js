process.removeAllListeners('warning');

import 'dotenv/config';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function runAnalyzer({ index, file, message }) {
  let codeContext = '';

  // Try to load code if it's in your repo
  const match = file.match(/tests\/e2e\/(.*?\.mjs)/);
  if (match) {
    const filePath = path.resolve('./tests/e2e', match[1]);
    if (fs.existsSync(filePath)) {
      codeContext = fs.readFileSync(filePath, 'utf-8');
    }
  }

  const prompt = `
Cypress test failure #${index}
File: ${file}

Error Message:
${message}

Relevant Code:
${codeContext.slice(0, 1000)}

Please explain what went wrong and identify if a shared function or imported module might be involved.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  });

  console.log('\n----------------------------');
  console.log(`🧪 GPT Analysis for Failure ${index}`);
  console.log(`📄 File: ${file}\n`);
  console.log(response.choices[0].message.content);
  console.log('----------------------------\n');
}
