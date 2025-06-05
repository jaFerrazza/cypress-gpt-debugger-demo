describe('Test A - Title Check', () => {
    it('should have the correct page title', () => {
      cy.visit('/');
      cy.title().should('eq', 'Example Site');
    });
  });
  