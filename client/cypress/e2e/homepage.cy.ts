describe('HomePage', () => {
  beforeEach(() => {
    cy.login();
  });

  it('HomePage Items are loading', () => {
    cy.visit('/');
    //
    // checking left sidebar
    //
    cy.get('[data-testid="HomeOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="HomeOutlinedIcon"]').should('exist');
    cy.get('.Mui-selected').should('contain', 'Home');

    cy.get('[data-testid="StorefrontOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="StorefrontOutlinedIcon"]').should('exist');
    cy.get('[href="/market"]').should('contain', 'Marketplace');

    cy.get('[data-testid="WalletOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="WalletOutlinedIcon"]').should('exist');
    cy.get('[href="/wallet"]').should('contain', 'Wallet');

    //
    // check feed
    //
    cy.get('#Feed').should('exist');

    // a post should exist
    cy.get('#Feed > :nth-child(1)').should('exist');
  });

  it('Test Infinite Scroll', () => {
    cy.visit('/');
    cy.get('#Feed').should('exist');
    cy.get('#Feed > :nth-child(1)').should('exist');
    cy.get('#Feed > :nth-child(15)').should('not.exist');
    cy.scrollTo('bottom');
  });

  it('Test LogOut', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid="profileButton"]').should('exist');
    cy.get('[data-testid="profileButton"]').click({force: true});
    cy.wait(1000);
    cy.get('[data-testid="logout"]').should('be.visible');
    cy.get('[data-testid="logout"]').should('exist');
    cy.get('[data-testid="logout"]').click({force: true});
    cy.get('.logo').should('exist');
  });
});

export {};
