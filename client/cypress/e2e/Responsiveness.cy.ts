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

  it('Test logo responsiveness', () => {
    cy.visit('/');
    cy.get('#companyName').should('exist');
  });

  it('Test post input responsiveness in iPhoneX', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.wait(100);
    cy.get('#new-post-input').should('exist');
  });

  it('Check if Burger Menu is visible on smaller screens', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.wait(100);
    cy.get('[data-testid="MenuIcon"]').should('exist');
  });

  it('Check the visibility of cart & filter in Marketplace for smaller screens', () => {
    cy.viewport('iphone-x');
    cy.visit('/market');
    cy.wait(100);
    cy.get('[data-testid="cartButton"]').should('exist');
    cy.get('[data-testid="filterButton"]').should('exist');
    
  });
  
});

export {};
