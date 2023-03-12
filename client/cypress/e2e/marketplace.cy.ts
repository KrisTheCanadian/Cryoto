describe('Marketplace', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Test marketplace filter - Types', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="type-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').should('exist');
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').each(($el) => {
      cy.wrap($el).click({force: true});
    });
    cy.wait(1000);
  });

  it('Test marketplace filter - Brands', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="brand-button"]').click();
    cy.wait(100);
    cy.get('#checkbox-GAP').should('exist');
    cy.get('#checkbox-GAP').click({force: true});
    cy.wait(1000);
    cy.contains('GAP').should('exist');
  });

  it('Test Pagination', () => {
    cy.visit('/market');
    cy.get('[data-testid="NavigateNextIcon"]').should('exist');
    cy.get('[data-testid="NavigateBeforeIcon"]').should('exist');
    cy.get('.MuiPagination-ul > :nth-child(3) > .MuiButtonBase-root').should(
      'exist',
    );
    cy.get('.MuiPagination-ul > :nth-child(3) > .MuiButtonBase-root').click({
      force: true,
    });
    cy.get('[data-testid="NavigateBeforeIcon"]').click({force: true});
  });

  it('Test redeeming card', () => {
    cy.visit('/market');
    cy.wait(200);
    cy.get(
      ':nth-child(1) > .MuiPaper-root > .css-32bll7 > [data-testid="cardMediaPic"]',
    )
      .first()
      .click();
    cy.wait(200);
    cy.get('.MuiButton-root').click();
    cy.get(
      '[data-testid="cartButton"] > .MuiBadge-root > .MuiBadge-anchorOriginTopRightRectangular',
    ).should('contain', '1');
  });

  it('Test marketplace filters - Gift Cards', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="type-button"]').click();
    cy.wait(100);
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]')
      .first()
      .click({force: true});
    cy.get('[data-testid="mFilterButton"]').click({force: true});
    cy.wait(1000);
  });

  it('Test marketplace filters - Prices', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="price-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').should('exist');
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').each(($el) => {
      cy.wrap($el).click({force: true});
    });
    cy.wait(1000);
  });

  it('Test marketplace filters - Under 150 coins', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="price-button"]').click();
    cy.wait(100);
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]')
        .first()
        .click({force: true});
    cy.get('[data-testid="mFilterButton"]').click({force: true});
    cy.wait(100);
  });

  it('Check for remove filters button', () => {
    cy.visit('/market');
    cy.get('[data-testid="mFilterButton"]').should('exist');
    cy.get('[data-testid="mFilterButton"]').click();
    cy.get('[data-testid="type-button"]').click();
    cy.wait(100);
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]')
      .first()
      .click({force: true});
    cy.get('[data-testid="remove-all-filters"]').should('exist');
  });

  it('Check marketplace search', () => {
    cy.visit('/market');
    cy.get('[data-testid="search-results"]').should('exist');
  });

  it('Check marketplace sortButton', () => {
    cy.visit('/market');
    cy.get('[data-testid="sort-button"]').should('exist');
  });

  it('Check marketplace cartButton', () => {
    cy.visit('/market');
    cy.get('[data-testid="cartButton"]').should('exist');
  });
});

export {};
