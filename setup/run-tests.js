import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const spinner = ora('Running Cypress tests...').start();

exec('npx cypress run --headed', async (error, stdout, stderr) => {
  spinner.succeed('✅ Cypress test run completed.');

  const output = stdout + '\n' + stderr;
  const outputPath = path.join(__dirname, '../gpt-analyzer/mock-logs/last-output.txt');

  fs.writeFileSync(outputPath, output);

  // Match error blocks first
const errorRegex = /(AssertionError|Error|Timed out).*?(?=\n\s*\n|[0-9]+\)|\n[A-Z])/gs;
const matches = [...output.matchAll(errorRegex)];

if (matches.length > 0) {
  const lines = output.split('\n');
  const { default: runAnalyzer } = await import(`file://${path.resolve(__dirname, '../gpt-analyzer/analyze.js')}`);

  for (let i = 0; i < matches.length; i++) {
    const errorMsg = matches[i][0].trim();

    // Try to find the most recent test file or test description above the match
    const matchLineIndex = lines.findIndex((line) => line.includes(errorMsg.split('\n')[0]));
    let contextLine = 'Unknown file or test';

    for (let j = matchLineIndex - 1; j >= 0; j--) {
      const line = lines[j];
      if (line.includes('tests/e2e/') || /^\d+\)/.test(line) || line.includes('.mjs')) {
        contextLine = line.trim();
        break;
      }
    }

    const gptSpinner = ora(`Analyzing Failure ${i + 1}...`).start();

    try {
      await runAnalyzer({
        index: i + 1,
        file: contextLine,
        message: errorMsg
      });
      gptSpinner.succeed(`✅ Failure ${i + 1} analyzed!`);
    } catch (err) {
      gptSpinner.fail(`❌ GPT analysis failed for failure ${i + 1}`);
      console.error(err);
    }
  }
}
else {
    console.log('✅ All tests passed. No errors to analyze.\n');
  }
});
