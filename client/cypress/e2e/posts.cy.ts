describe('Posts', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Creating a post', () => {
    cy.visit('/');
    //create a post
    cy.get('#new-post-input').click();

    //select william as recipient
    cy.get('#autocomplete').type('William');
    cy.get('#autocomplete-option-0').click({force: true});

    cy.get('#new-post-dialog-company-value').click({force: true});
    cy.get('.MuiPaper-root > .MuiList-root > [tabindex="0"]').click({
      force: true,
    });
    cy.get('#new-post-dialog-amount').type('1');
    cy.get('#new-post-dialog-message').type('test message');
    cy.get('.MuiButton-root').click({force: true});
    cy.get(':nth-child(2) > .css-tnzrz8 > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > .MuiTypography-body1 > :nth-child(2)').should('contain', 'William Mcclure');
    cy.get(':nth-child(2) > .css-tnzrz8 > .css-sorydz-MuiTypography-root').should('contain', 'test message');
    cy.get(':nth-child(2) > .css-tnzrz8 > .css-m69qwo-MuiStack-root > .css-4xxiys-MuiStack-root > .MuiBox-root > :nth-child(1) > .MuiChip-label').should('contain', '1');
    cy.get(':nth-child(2) > .css-tnzrz8 > .css-79elbk > .css-70qvj9 > .MuiBox-root > .MuiButtonBase-root').click();

    //add a comment
    // cy.get(':nth-child(1) > .css-tnzrz8 > .css-rjvdxb > .MuiBox-root > .MuiInputBase-root > #new-comment-input')
    //     .wait(1300)
    //     .type('test comment')
    //     .trigger('keypress', { keyCode: 13 });
  });

  it('Test Sending Token More Than Balance', () => {
    cy.visit('/');
    //create a post
    cy.get('#new-post-input').click();

    //select william as recipient
    cy.get('#autocomplete').type('William');
    cy.get('#autocomplete-option-0').click({force: true});

    //check chip if william is selected
    cy.get('.MuiInputBase-root > .MuiChip-root > .MuiChip-label').should(
      'contain',
      'William Mcclure',
    );
    cy.get('#new-post-dialog-company-value').click({force: true});
    cy.get('.MuiPaper-root > .MuiList-root > [tabindex="0"]').click({
      force: true,
    });
    cy.get('#new-post-dialog-amount').type('10000000000');
    cy.get('#new-post-dialog-message').type('test message');
    cy.get('.MuiButton-root').click({force: true});
    cy.wait(1300);
    cy.get('.MuiAlert-message').should('contain', 'Your balance is not enough');  
  });
  
});

export {};
