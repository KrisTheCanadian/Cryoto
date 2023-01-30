describe('Marketplace', () => {
  beforeEach(() => {
    cy.login();
  });
  it('check marketplace filter', () => {
    cy.visit('/market');
    cy.get('[data-testid="filterButton"]').should('exist');
  });
  it('check marketplace search', () => {
    cy.visit('/market');
    cy.get('[data-testid="search-results"]').should('exist');
  });
  it('check marketplace sortButton', () => {
    cy.visit('/market');
    cy.get('[data-testid="sort-button"]').should('exist');
  });
  it('check marketplace cartButton', () => {
    cy.visit('/market');
    cy.get('[data-testid="cartButton"]').should('exist');
  });
  
  
});

export {};
