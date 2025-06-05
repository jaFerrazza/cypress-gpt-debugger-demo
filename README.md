# 🧠 Cypress GPT Debugger Demo

This project showcases how to supercharge your Cypress test suite by integrating it with GPT to analyze test failures in real time.

Whether you're debugging a flaky selector or dealing with shared-state chaos, this tool helps you understand why your tests are failing — with the power of GPT-4o.

---

## 🚀 Features

- ✅ Cypress tests that intentionally fail (so you can see the analysis)
- ✅ Custom Node runner that captures failures
- ✅ GPT-powered log analyzer
- ✅ Pretty console output with spinner + labeled feedback
- ✅ Live-exercise branch for real-time debugging demo

---

## 📦 Setup

```bash
git clone git@github.com:jaFerrazza/cypress-gpt-debugger-demo.git
cd cypress-gpt-debugger-demo

# Install dependencies
npm install

# Add your OpenAI API Key
echo "OPENAI_API_KEY=sk-..." > .env
