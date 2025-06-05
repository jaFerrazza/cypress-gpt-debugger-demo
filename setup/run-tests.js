import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import ora from 'ora';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logsAnalyzer from '../gpt-analyzer/analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const spinner = ora('Running Cypress tests...').start();

exec('npx cypress run', async (error, stdout, stderr) => {
  spinner.succeed('✅ Cypress test run completed.');

  const output = stdout + '\n' + stderr;

  const outputPath = path.join(__dirname, '../gpt-analyzer', 'mock-logs', 'last-output.txt');
  const errorPath = path.join(__dirname, '../gpt-analyzer', 'mock-logs', 'last-error.json');

  fs.writeFileSync(outputPath, output);

  const errorMatch = output.match(/AssertionError:.+|Error:.+/);

  if (errorMatch) {
    const errorLog = {
      message: errorMatch[0],
      rawOutput: output,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));

    const gptSpinner = ora('Sending error to GPT for analysis...').start();

    try { // analyzer logs to console
      await logsAnalyzer();
      gptSpinner.succeed('🧠 GPT analysis complete!');
    } catch (err) {
      gptSpinner.fail('❌ GPT analysis failed.');
      console.error(err);
    }
  } else {
    console.log('\n✅ All tests passed. No errors to analyze.\n');
  }
});
