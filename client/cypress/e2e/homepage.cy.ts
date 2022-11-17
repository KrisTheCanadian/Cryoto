describe('HomePage', () => {
  beforeEach(() => {
    cy.login();
  });

  it('HomePage Items are loading', () => {
    cy.visit('/');
    //
    // checking left sidebar
    //
    cy.get('.Mui-selected').should('contain', 'Home');
    cy.get('[href="/market"]').should('contain', 'Marketplace');
    cy.get('[href="/orders"]').should('contain', 'My Orders');
    cy.get('[href="/wallet"]').should('contain', 'Wallet');

    //
    // checking right sidebar
    //
    cy.get('#rightBar').should('exist');
    cy.get('#rightBar').should('contain', 'Right bar content');

    //
    // check feed
    //
    cy.get('#Feed').should('exist');

    // a post should exist
    cy.get('#Feed > :nth-child(1)').should('exist');

    // a post should have a title
    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardHeader-root').should(
      'exist',
    );

    // a post should have a body
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiTypography-root',
    ).should('exist');
    // a post should have chips
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root',
    ).should('exist');
    // a post should contain actions
    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root').should(
      'exist',
    );
    // a post should contain three dots menu
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > [data-testid="MoreVertIcon"]',
    ).should('exist');

    //
    // checking specific post -> data might have to be changed if database changes (make sure you're using the same data as the cypress test)
    //

    // check author in title
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-content > .MuiCardHeader-title > :nth-child(1)',
    ).should('contain', 'William Mcclure');

    // check recipient in title
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-content > .MuiCardHeader-title > :nth-child(2)',
    ).should('contain', 'Sherry Villanueva');

    // check coins in title
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-content > .MuiCardHeader-title',
    ).should('contain', '39 coins');

    // check tags in chips
    // check tag 1
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > :nth-child(1) > .MuiChip-label',
    ).should('contain', 'student');
    // check tag 2
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > :nth-child(2) > .MuiChip-label',
    ).should('contain', 'need');
    // check tag 3
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiBox-root > :nth-child(3) > .MuiChip-label',
    ).should('contain', 'rock');

    // check likes
    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root').should(
      'contain',
      '6',
    );
  });

  it('Test Infinite Scroll', () => {
    cy.visit('/');
    cy.get('#Feed').should('exist');
    cy.get('#Feed > :nth-child(1)').should('exist');
    cy.get('#Feed > :nth-child(15)').should('not.exist');
    cy.scrollTo('bottom');
    cy.get('#Feed > :nth-child(15)').should('exist');
  });
});

export {};
