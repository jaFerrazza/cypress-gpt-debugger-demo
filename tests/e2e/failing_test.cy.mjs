describe('GPT Debug Demo', () => {
  it('should fail and log error manually', () => {
    cy.visit('https://example.com');

    cy.get('h1').then(($el) => { 
      try {
        const actual = $el.text();
        const expected = 'Hola GPT';

        if (actual !== expected) {
          throw new Error(`Expected "${expected}", but got "${actual}"`);
        }
      } catch (err) {
        cy.task('logErrorToFile', {
          title: 'should fail and log error manually',
          message: err.message,
          stack: err.stack
        });

        // Re-throw AFTER the task is queued
        throw err;
      }
    });
  });
});
