describe('Marketplace', () => {
  beforeEach(() => {
    cy.login();
  });
  it('check header title', () => {
    cy.visit('/market');
    cy.get('.css-2npek9 > .MuiBox-root').should('exist');
    cy.get('.css-2npek9 > .MuiBox-root').should('be.visible');
    cy.get('.css-2npek9 > .MuiBox-root').should('contain', 'Marketplace Route');
  });
});

export {};
