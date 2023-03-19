describe('profile', () => {
  beforeEach(() => {
    cy.login();
  });

  it('User Profile LogOut', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid="profileButton"]').should('exist');
    cy.get('[data-testid="profileButton"]').click({force: true});
    cy.wait(1000);
    cy.get('[data-testid="profile"]').should('be.visible');
    cy.get('[data-testid="profile"]').should('exist');
    cy.get('[data-testid="profile"]').click({force: true});
    cy.get('[data-testid="PersonIcon"]').should('exist');
    cy.get('[data-testid="WorkOutlineIcon"]').should('exist');
    cy.get('[data-testid="LocationCityIcon"]').should('exist');
    cy.get('[data-testid="WorkOutlineIcon"]').should('exist');
    cy.get('[data-testid="AccessTimeIcon"]').should('exist');
    cy.get('[data-testid="CalendarMonthIcon"]').should('exist');
    cy.get('[data-testid="CakeIcon"]').should('exist');
    cy.get('[data-testid="OutboxIcon"]').should('exist');
    cy.get('[data-testid="MoveToInboxIcon"]').should('exist');
    cy.contains('Recognize').should('exist');
    cy.contains('Recognitions').should('exist');
  });
});

export {};
