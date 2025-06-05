describe('Test D - DOM Check', () => {
    it('tries to find a missing element', () => {
      cy.visit('/');
      cy.get('#login-button').should('exist');
    });
  });
  