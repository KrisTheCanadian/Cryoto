describe('Dashboard Loads', () => {
  beforeEach(() => {
    cy.login();
  });

  it('passes', () => {
    cy.visit('/');
  });
});

export {};
