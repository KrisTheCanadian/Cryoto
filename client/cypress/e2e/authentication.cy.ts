describe('Authentication', () => {
  it('Check Content when Authenticated', () => {
    cy.login();
    cy.visit('/authentication');
    cy.get('[data-testid="CircularProgress"]')
      .should('exist')
      .should('be.visible');
    cy.url({timeout: 30000}).should(
      'eq',
      'http://localhost:5173/authentication',
    );
  });

  it('Check Routes Unauthenticated', () => {
    // check if we can access the routes
    // check wallet
    cy.visit('/wallet');
    cy.get('#sign-in-button').should('exist');

    // check checkout
    cy.visit('/checkout');
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
