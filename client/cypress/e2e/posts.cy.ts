describe('Posts', () => {
  beforeEach(() => {
    cy.login();
  });
  
  it('Test Poster Profile', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid="poster-name"]').first().click();
    cy.wait(1000);
    cy.get('[data-testid="profile-card"]').should('exist');
    cy.get('[data-testid="PersonIcon"]').should('exist');
    cy.get('[data-testid="WorkOutlineIcon"]').should('exist');
    cy.get('[data-testid="AccessTimeIcon"]').should('exist');
    cy.get('[data-testid="CalendarMonthIcon"]').should('exist');
    cy.get('[data-testid="CakeIcon"]').should('exist');
    cy.get('[data-testid="OutboxIcon"]').should('exist');
    cy.get('[data-testid="MoveToInboxIcon"]').should('exist');
  });
  
  // it('Creating a post', () => {
  //   cy.visit('/');
  //
  //   //check post tags and reactions 
  //   cy.wait(1300);
  //   cy.get('[data-testid="VolunteerActivismIcon"]').should('exist');
  //   cy.get('[data-testid="body2"]').first().should('contain', 'months ago');
  //
  //   //add a comment
  //   cy.get('#new-comment-input')
  //       .wait(1300)
  //       .type('test comment')
  //       .trigger('keypress', { keyCode: 13 })
  //       .wait(1300);
  //  
  //   //create a post
  //   cy.get('#new-post-input').click();
  //  
  //   //check add image and add emoji 
  //   cy.get('[data-testid="remove-image-button"]').should('exist');
  //   cy.get('[data-testid="PhotoIcon"]').should('exist');
  //   cy.get('[data-testid="add-emoji-button"]').should('exist');
  //   cy.get('[data-testid="AddReactionOutlinedIcon"]').should('exist');
  //
  //   //select william as recipient
  //   cy.get('#autocomplete').type('William');
  //   cy.wait(3000);
  //   cy.get('#autocomplete-option-0').click({force: true});
  //   cy.get('[data-testid="AddReactionOutlinedIcon"]').first().click({force: true});
  //   cy.get('#new-post-dialog-company-value').click({force: true});
  //   cy.get('.MuiPaper-root > .MuiList-root > [tabindex="0"]').click({
  //     force: true,
  //   });
  //   cy.get('#new-post-dialog-amount').type('1');
  //   cy.get('#new-post-dialog-message').type('test message');
  //   cy.get('.MuiButton-root').click({force: true});
  //   cy.wait(3000);
  //   cy.get('[data-testid="rewardee-name"]').first().should('contain', 'William Mcclure');
  //   cy.get('[data-testid="body1"]').first().should('contain', 'test message');
  //  
  // });

  it('Test Sending Token More Than Balance', () => {
    cy.visit('/');
    //create a post
    cy.get('#new-post-input').click();

    //select william as recipient
    cy.get('#autocomplete').type('William');
    cy.wait(1300);
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
