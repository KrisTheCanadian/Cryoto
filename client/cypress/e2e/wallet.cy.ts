describe('Wallet', () => {
  beforeEach(() => {
    cy.login();
  });
  it('check content', () => {
    cy.visit('/wallet');
    cy.get('.css-2npek9 > .MuiBox-root').should('exist');
    cy.get('.css-2npek9 > .MuiBox-root').should('be.visible');
    cy.get('.css-2npek9 > .MuiBox-root').should('contain', 'Wallet Route');
  });
});

export {};
