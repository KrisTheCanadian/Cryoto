describe('settings', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Test settings - Language', () => {
    cy.visit('/');
    cy.visit('/settings');
    cy.wait(200);
    cy.get('[data-testid="editPencil"]').should('exist');
    cy.get(
        ':nth-child(3) > .MuiCardContent-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > :nth-child(3) > .MuiTableCell-alignRight > [data-testid="editPencil"]',
    ).click();
    cy.wait(100);
    cy.get('.MuiGrid-grid-md-2 > .MuiTypography-root').then(($el) => {
      if ($el.text().includes('Language')) {
        cy.get('.MuiSelect-select').click();
        cy.get('.MuiList-root > [tabindex="-1"]').click();
        cy.get('.MuiButton-root').click();
        cy.wait(100);
        cy.get(
            ':nth-child(4) > .MuiCardContent-root > .MuiTypography-h5',
        ).should('contain', 'Notifications');
      } else {
        cy.get('.MuiSelect-select').click();
        cy.get('.MuiList-root > [tabindex="-1"]').click();
        cy.get('.MuiButton-root').click();
        cy.wait(100);
        cy.get(
            ':nth-child(3) > .MuiCardContent-root > .MuiTypography-h5',
        ).should('contain', 'Personnel');
        cy.get(
            ':nth-child(2) > .MuiCardContent-root > .MuiTypography-h5',
        ).should('contain', 'Profil');
        cy.get(
            ':nth-child(4) > .MuiCardContent-root > .MuiTypography-h5',
        ).should('contain', 'Notifications');
      }
    });
  });

  it('Test settings - Job Title', () => {
    cy.visit('/');
    cy.visit('/settings');
    cy.wait(200);
    cy.get('[data-testid="EditIcon"]').should('exist');
    cy.get(
        ':nth-child(2) > .MuiCardContent-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > :nth-child(2) > .MuiTableCell-alignRight > [data-testid="editPencil"] > [data-testid="EditIcon"]',
    ).click({force: true});
    cy.wait(1000);
  });

  it('Test settings buttons', () => {
    cy.visit('/settings');
    cy.wait(2000);
    cy.get('[data-testid="EditIcon"]').should('exist');
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.visit('/settings');
    cy.get('[data-testid="EditIcon"]').eq(1).click();
    cy.visit('/settings');
    cy.get('[data-testid="EditIcon"]').eq(2).click();
    cy.visit('/settings');
    cy.get('[data-testid="EditIcon"]').eq(3).click();
    cy.visit('/settings');
    cy.get('.MuiSwitch-input').click();
    cy.wait(200);
  }); 
  
  it('Test settings - Bio', () => {
    cy.visit('/');
    cy.visit('/settings');
    cy.wait(200);
    cy.get('[data-testid="EditIcon"]').should('exist');
    cy.get(
      ':nth-child(3) > .MuiCardContent-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > :nth-child(2) > .MuiTableCell-alignRight > [data-testid="editPencil"] > [data-testid="EditIcon"]',
    ).click({force: true});
  });
});

export {};
