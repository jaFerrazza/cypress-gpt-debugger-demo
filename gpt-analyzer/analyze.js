process.removeAllListeners('warning');

import 'dotenv/config'; // replaces require('dotenv').config()
import fs from 'fs';
import { OpenAI } from 'openai';


const logPath = './gpt-analyzer/mock-logs/last-error.json';

if (!fs.existsSync(logPath)) {
  console.error('❌ No error log found.');
  process.exit(1);
}

const errorLog = JSON.parse(fs.readFileSync(logPath, 'utf-8'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

export default async function logsAnalyzer() {
    const prompt = `
    I ran Cypress tests and got the following error:
    
    ${errorLog.message}
    
    Here is the full test runner output (if helpful):
    ${errorLog.rawOutput.slice(0, 1000)}...
    
    Explain why this error might have occurred and suggest a possible fix.
    `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  if (response && response.choices && response.choices.length > 0) {
    console.log('\n🧠 GPT Analysis:\n');
    console.log(response.choices[0].message.content);
  } else {
    console.error('❌ GPT response missing or malformed:', response);
  }
  
}
