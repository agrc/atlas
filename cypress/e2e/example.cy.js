describe('example suite', () => {
  it('example spec', () => {
    cy.visit('http://localhost:5173', {
      timeout: 10000,
    });
  });
});
