describe('Authentication', () => {
  it('Check Content when Authenticated', () => {
    cy.login();
    cy.visit('/authentication');
    cy.get('[data-testid="Backdrop"]').should('exist').should('be.visible');
    cy.get('[data-testid="CircularProgress"]')
      .should('exist')
      .should('be.visible');
    cy.url({timeout: 30000}).should('eq', 'http://localhost:5173/');
  });

  it('Check Routes Unauthenticated', () => {
    // check if we can access the routes
    // check wallet
    cy.visit('/wallet');
    cy.get('#sign-in-button').should('exist');
    // check orders
    cy.visit('/orders');
    cy.get('#sign-in-button').should('exist');

    // check homepage
    cy.visit('/');
    cy.get('#sign-in-button').should('exist');

    // check marketplace
    cy.visit('/market');
    cy.get('#sign-in-button').should('exist');
  });
});

export {};
