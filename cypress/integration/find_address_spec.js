describe('find address', () => {
  it('can find an address', () => {
    cy.viewport(1200, 800);
    cy.visit('http://localhost:3000');

    cy.window().then(win => {
      return win.mapProps.zoom;
    }).as('originalZoom');

    cy.get('.dartboard > :nth-child(1) > .form-control').type('123 S Main Street');
    cy.get('.dartboard > :nth-child(2) > .form-control').type('84115');
    cy.get('.dartboard > :nth-child(3) > .btn').click();

    cy.get('@originalZoom').then(originalZoom => {
      cy.window().its('mapProps.zoom').should('be.above', originalZoom);
    });
  });
});
