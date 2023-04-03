describe('example suite', () => {
  it('example spec', () => {
    cy.visit('http://0.0.0.0:5173', {
      timeout: 10000,
    });
  });
});
