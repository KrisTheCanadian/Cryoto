describe('Responsiveness', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Test search bar responsiveness in iPhoneX', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('[data-testid="searchBox"]').should('exist');
    cy.get('[data-testid="searchBox"]').click({force: true});
    cy.wait(100);
    cy.get('[data-testid="search-results"]').should('exist');
  });

  it('Test profile button responsiveness', () => {
    cy.visit('/');
    cy.get('[data-testid="AccountCircleIcon"]').should('exist');
  });

  it('Test search bar responsiveness in iPhoneX', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('#new-post-input').should('exist');
  });

  it('Test Darkmode Button Responsiveness', () => {
    cy.visit('/');
    cy.get('[data-testid="dark-mode-toggle"]').should('exist');
  });
});

export {};
