describe('Test B - Heading Check', () => {
    it('should have the correct main heading', () => {
      cy.visit('/');
      cy.get('h1').should('have.text', 'Welcome');
    });
  });
  