describe('HomePage', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Test Menu & Balance Links', () => {
    cy.visit('/');
    cy.get('[data-testid="listItemButton"]').should('be.visible');
    cy.get('[data-testid="listItemButton"]').should('exist');
    cy.get('[data-testid="listItemButton"]').first().click();
    cy.visit('/');
    cy.get('[data-testid="listItemButton"]').eq(1).click();
    cy.visit('/');
    cy.get('[data-testid="listItemButton"]').eq(2).click();
    cy.visit('/');
    cy.get('[data-testid="toSpend"]').should('be.visible');
    cy.get('[data-testid="toSpend"]').should('exist');
    cy.get('[data-testid="toSpend"]').click();
    cy.visit('/');
    cy.get('[data-testid="toAward"]').should('be.visible');
    cy.get('[data-testid="toAward"]').should('exist');
    cy.get('[data-testid="toAward"]').click();
    
  });

  it('Search bar + HomePage Items are loading', () => {
    cy.visit('/');

    // checking search bar
    cy.get('#searchInput').should('be.visible');
    cy.get('#searchInput').type('a');
    cy.wait(1300);
    cy.get('.css-yg7acs > .css-70qvj9').click({force: true});
    cy.get('#companyName').click({force: true});
    
    // checking recognizers of the month
    cy.get('#rightBar').should('exist');

    // checking left sidebar
 
    cy.get('[data-testid="HomeOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="HomeOutlinedIcon"]').should('exist');
    cy.get('.Mui-selected').should('contain', 'Home');

    cy.get('[data-testid="StorefrontOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="StorefrontOutlinedIcon"]').should('exist');
    cy.get('[href="/market"]').should('contain', 'Marketplace');

    cy.get('[data-testid="WalletOutlinedIcon"]').should('be.visible');
    cy.get('[data-testid="WalletOutlinedIcon"]').should('exist');
    cy.get('[href="/wallet"]').should('contain', 'Wallet');
    
    // check feed
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
