describe('Authentication', () => {
  it('Check Content when not Authenticated', () => {
    cy.visit('/authentication');
    cy.get('#sign-in-button').should('exist');
  });

  it('Check Content when Authenticated', () => {
    cy.login();
    cy.visit('/authentication');
    cy.get('#signOutButton').should('exist').should('be.visible');
    cy.get('#RequestProfile').should('exist').should('be.visible');
  });

  it('Check Profile Information Request', () => {
    cy.login();
    cy.visit('/authentication');
    cy.get('#RequestProfile').should('exist').should('be.visible');
    cy.get('#RequestProfile').click({force: true});
    cy.wait(1000);
    cy.get('#profile-div').should('exist').should('be.visible');
    cy.get('#profile-div > :nth-child(1)').should('contain', 'Cryoto User');
    cy.get('#profile-div > :nth-child(2)').should(
      'contain',
      'cryototestaccount@kpmglhx.onmicrosoft.com',
    );
    cy.get('#profile-div > :nth-child(3)').should(
      'contain',
      'da6e9ec4-6c5d-45b3-bf3c-22ad1c4b9800',
    );
  });

  it('Test Sign Out Button', () => {
    cy.login();
    cy.visit('/authentication');
    cy.get('#signOutButton').should('exist').should('be.visible');
    cy.get('#signOutButton').click({force: true});
    cy.visit('/authentication');
    cy.get('#sign-in-button').should('exist');
  });

  it('Check Routes Unauthenticated', () => {
    // making sure we are not authenticated
    cy.visit('/authentication');
    cy.get('#sign-in-button').should('exist');

    // check if we can access the routes
    // check wallet
    cy.visit('/wallet');
    cy.get('.MuiAlert-message')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Please log in to view this page');
    // check orders
    cy.visit('/orders');
    cy.get('.MuiAlert-message')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Please log in to view this page');

    // check homepage
    cy.visit('/');
    cy.get('#landingPageWelcome')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Get Rewarded');

    // check marketplace
    cy.visit('/market');
    cy.get('.MuiAlert-message')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Please log in to view this page');
  });
});

export {};
