describe('Navbar', () => {
  beforeEach(() => {
    cy.login();
  });
  it('check header title', () => {
    cy.visit('/');

    cy.get('#companyName').should('contain', 'Cryoto');
    cy.get('[data-testid="searchBox"]').should('exist');
    cy.get('.css-oiifgt > :nth-child(3)').click({force: true});
    cy.get('[data-testid="dark-mode-toggle"]').should('exist');
    cy.get('[data-testid="AccountCircleIcon"]').should('exist');
  });

  it('Test Darkmode', () => {
    cy.visit('/');
    cy.get('.css-oiifgt > :nth-child(3)').click({force: true});
    cy.get('[data-testid="dark-mode-toggle"]').should('exist');
    cy.get('[data-testid="dark-mode-toggle"]').click({force: true});

    // check if darkmode is on
    cy.get('body').should('have.css', 'background-color', 'rgb(18, 18, 18)');

    // toggle darkmode off
    cy.get('.css-oiifgt > :nth-child(3)').click({force: true});
    cy.get('[data-testid="dark-mode-toggle"]').click({force: true});

    // check if darkmode is off
    cy.get('body').should('have.css', 'background-color', 'rgb(248, 250, 251)');
  });

  it('Test Notifications', () => {
    cy.visit('/');
    cy.get('[data-testid="NotificationsNoneIcon"]').should('exist');
  });

  it('Test profile button', () => {
    cy.visit('/');
    cy.get('[data-testid="AccountCircleIcon"]').should('exist');
  });

  it('Test search bar', () => {
    cy.visit('/');
    cy.get('[data-testid="searchBox"]').should('exist');
    cy.get('[data-testid="searchBox"]').click({force: true});
    cy.wait(100);
    cy.get('[data-testid="search-results"]').should('exist');
  });
});

export {};