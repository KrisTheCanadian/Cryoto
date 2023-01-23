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
    // check feed
    //
    cy.get('#Feed').should('exist');

    // a post should exist
    cy.get('#Feed > :nth-child(1)').should('exist');

    // // a post should have a header (profile picture, name, date, etc.)
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root',
    // ).should('exist');

    // // a post should have a body
    // cy.get('#Feed > :nth-child(2) > .MuiBox-root > .MuiTypography-root').should(
    //   'exist',
    // );

    // a post should have a react section
    // cy.get('#Feed > :nth-child(2) > .MuiBox-root > .MuiBox-root').should(
    //   'exist',
    // );

    //
    // checking specific post -> data might have to be changed if database changes (make sure you're using the same data as the cypress test)
    //

    // check author in title
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > .MuiTypography-root',
    // ).should('contain', 'William Mcclure');

    // check recipient in title
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > .MuiTypography-root',
    // ).should('contain', 'Sherry Villanueva');

    // check coins in header
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > :nth-child(2) > :nth-child(1) > .MuiChip-label',
    // ).should('contain', '39');

    // check tags in chips
    // check tag 1
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > :nth-child(2) > :nth-child(2) > .MuiChip-label',
    // ).should('contain', 'student');
    // check tag 2
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > :nth-child(2) > :nth-child(3) > .MuiChip-label',
    // ).should('contain', 'need');
    // check tag 3
    // cy.get(
    //   '#Feed > :nth-child(2) > .MuiBox-root > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > :nth-child(2) > :nth-child(4) > .MuiChip-label',
    // ).should('contain', 'rock');

    // check likes
    // cy.get('#Feed > :nth-child(2) > .MuiBox-root > .MuiBox-root').should(
    //   'contain',
    //   '6',
    // );
  });

  it('Test Infinite Scroll', () => {
    cy.visit('/');
    cy.get('#Feed').should('exist');
    cy.get('#Feed > :nth-child(1)').should('exist');
    cy.get('#Feed > :nth-child(15)').should('not.exist');
    cy.scrollTo('bottom');
    // cy.get('#Feed > :nth-child(15)').should('exist');
  });
});

export {};
