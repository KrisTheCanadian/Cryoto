describe('Notifications', () => {
  it('Check Popup for notifications', () => {
    cy.login();
    cy.visit('/');
    cy.get('[data-testid="NotificationsNoneIcon"]').should('exist');

    // Make sure notifications button exist
    cy.get('[data-testid="NotificationsButton"]').should('exist');
    // don't ask any questions, it just doesn't work otherwise...
    cy.get('[data-testid="NotificationsButton"]')
      .trigger('mouseover')
      .wait(1000)
      .click()
      .click({force: true});

    cy.get(
      '.MuiListItem-root > :nth-child(2) > .MuiListItemText-root > .MuiTypography-root',
    )
      .should('exist')
      .should('be.visible')
      .should('contain', 'Welcome to the team!');

    cy.get(
      '.MuiListItem-root > :nth-child(2) > .MuiBox-root > .MuiTypography-root',
    )
      .should('exist')
      .should('be.visible')
      .should('contain', 'Cryoto');

    cy.get('.MuiListItem-root > :nth-child(2) > .MuiChip-root > .MuiChip-label')
      .should('exist')
      .should('be.visible')
      .should('contain', '100');

    cy.get('.MuiMenu-list').should('exist').should('be.visible');

    // yeet popup
    cy.get('body').click(0, 0);

    cy.get(
      '.MuiListItem-root > :nth-child(2) > .MuiBox-root > .MuiTypography-root',
    ).should('not.exist');

    cy.get(
      '.MuiListItem-root > :nth-child(2) > .MuiChip-root > .MuiChip-label',
    ).should('not.exist');
  });
});

export {};
