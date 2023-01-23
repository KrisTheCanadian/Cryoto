describe('Posts', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Creating a post', () => {
    cy.visit('/');
    // create a post
    // cy.get('#new-post-input').click();

    // select william as recipient
    // cy.get('#autocomplete').type('William');
    // cy.get('#autocomplete-option-0').click({force: true});

    // check chip if william is selected
    // cy.get('.MuiInputBase-root > .MuiChip-root > .MuiChip-label').should(
    //   'contain',
    //   'William Mcclure',
    // );
    // cy.get('#new-post-dialog-company-value').click({force: true});
    // cy.get('.MuiPaper-root > .MuiList-root > [tabindex="0"]').click({
    //   force: true,
    // });
    // cy.get('#new-post-dialog-amount').type('100');
    // cy.get('#new-post-dialog-message').type('test message');
    // cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click({force: true});
  });
});

export {};
