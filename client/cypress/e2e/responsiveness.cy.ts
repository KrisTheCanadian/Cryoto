describe('responsiveness', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Test Darkmode Component Responsiveness', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid="profileButton"]').should('exist');
    cy.get('[data-testid="profileButton"]').click({force: true});
    cy.wait(1000);
    cy.get('[data-testid="dark-mode-toggle"]').should('be.visible');
    cy.get('[data-testid="dark-mode-toggle"]').should('exist');
    cy.get('[data-testid="dark-mode-toggle"]').click({force: true});

    // check if darkmode is on
    cy.get('body').should('have.css', 'background-color', 'rgb(18, 18, 18)');

    // toggle darkmode off
    cy.get('[data-testid="profileButton"]').click({force: true});
    cy.get('[data-testid="dark-mode-toggle"]').click({force: true});

    // check if darkmode is off
    cy.get('body').should('have.css', 'background-color', 'rgb(248, 250, 251)');
  });

  it('Test notifications visibility in iPhoneX', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('[data-testid="NotificationsButton"]').should('exist');
    cy.get('[data-testid="NotificationsNoneIcon"]').should('exist');
  });
  
  it('Test wallet responsiveness in iPhoneX', () => {
    cy.viewport('iphone-x');
    cy.visit('/wallet');
    cy.get('[data-testid="self-transfer-button"]').should('exist');
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

  it('Test if Burger Menu is visible on smaller screens', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.wait(100);
    cy.get('[data-testid="MenuIcon"]').should('exist');
  });

  it('Test the visibility of cart & filter in Marketplace for smaller screens', () => {
    cy.viewport('iphone-x');
    cy.visit('/market');
    cy.wait(100);
    cy.get('[data-testid="cartButton"]').should('exist');
    cy.get('[data-testid="filterButton"]').should('exist');
    
  });
  
});

export {};
