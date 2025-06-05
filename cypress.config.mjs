import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/*.cy.mjs', // 👈 Your custom test directory
    supportFile: 'cypress/support/e2e.js', // optional, for support code
    baseUrl: 'https://example.com', // optional, for consistency
    setupNodeEvents(on, config) {
    }
  }
});
