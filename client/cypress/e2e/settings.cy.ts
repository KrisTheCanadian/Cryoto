describe('settings', () => {
    beforeEach(() => {
        cy.login();
    });
    it('Check settings page', () => {
        cy.visit('/');
        cy.visit('/settings');
        cy.wait(100);
        cy.get('.MuiTable-root').should('be.visible');
        cy.get('[data-testid="editPencil"]').should('be.visible');
    });
});

export {};
