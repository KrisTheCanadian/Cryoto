describe('Wallet', () => {
  beforeEach(() => {
    cy.login();
  });
  it('check content', () => {
    cy.visit('/wallet');
    cy.get('.css-2npek9 > .MuiBox-root').should('exist');
    cy.get('.css-2npek9 > .MuiBox-root').should('be.visible');

    cy.get('#to-award-balance')
      .should('exist')
      .should('be.visible')
      .should('contain', '$');

    cy.get('#to-spend-balance')
      .should('exist')
      .should('be.visible')
      .should('contain', '$');

    cy.get('#brand-name')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Cryoto');

    cy.get('#name')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Cryoto User');

    cy.get('.MuiTablePagination-root > .MuiToolbar-root')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Rows per page')
      .should('contain', '5');

    cy.get('#tableTitle')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Transaction History');

    cy.get('.MuiTableRow-root')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Transaction')
      .should('contain', 'Date')
      .should('contain', 'Wallet')
      .should('contain', 'Amount');
  });
  it('Self Transfer', () => {
    cy.visit('/wallet');

    cy.get('.css-8mwiv3 > .MuiButtonBase-root').click();

    cy.get('#responsive-dialog-title > .MuiTypography-root')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Transfer Coins');

    cy.get('.MuiDialogActions-root > .MuiBox-root > .MuiButtonBase-root')
      .should('exist')
      .should('be.visible')
      .should('contain', 'Transfer');

    cy.get('#self-transfer-dialog-amount').type('2');

    cy.get(
      '.MuiDialogActions-root > .MuiBox-root > .MuiTypography-root',
    ).should('contain', 'Transfer 2 coin(s)');

    cy.get('.MuiDialogActions-root > .MuiBox-root > .MuiButtonBase-root').click(
      {force: true},
    );
  });
});

export {};
