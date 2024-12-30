describe('Blog app', function () {
  beforeEach(function () {
    // RESETTI
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // Testissä käytettävä käyttäjä
    const user = {
      name: 'Test Käyttis',
      username: 'testkäyttis',
      password: 'password123',
    };

    // Toinen käyttäjä tarkistamaan että hän ei voi deletoida toisen blogia
    const seconduser = {
      name: 'Second Käyttis',
      username: 'secondtestkäyttis',
      password: 'password12345',
    };

    // KÄYTTÄJÄN LUOMINEN
    cy.request('POST', 'http://localhost:3003/api/users', user);
    // TOISEN KÄYTTJÄN LUOMINEN
    cy.request('POST', 'http://localhost:3003/api/users', seconduser);
    cy.visit('http://localhost:5173');

    // SISÄÄN KIRJATUMINEN MAIN KÄYTTÄJÄLLÄ
    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();

    cy.contains('New Blog').click();
    cy.get('input[name="Title"]').type('Test Blogi123');
    cy.get('input[name="Author"]').type('Test Käyttis');
    cy.get('input[name="Url"]').type('Tämä on testiblogi');
    cy.get('button[type="submit"]').click();

    cy.contains('Test Blogi123');
    cy.get('button').contains('logout').click();
  });
  describe('When logged in', function () {
    it('Blog can be cdeleted by the creator', function () {
      // SISÄÄN KIRJATUMINEN MAIN KÄYTTÄJÄLLÄ
      cy.get('input[name="Username"]').type('testkäyttis');
      cy.get('input[name="Password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains('Test Blogi123')
        .parent()
        .find('button')
        .contains('View')
        .click();
      cy.contains('Test Blogi123')
        .parent()
        .find('button')
        .contains('Delete')
        .click();

      cy.on('window:confirm', () => true);
      cy.get('html').should('not.contain', 'Test Blog123');
    });
    it('Blog cannot be deleted by another user', function () {
      cy.get('input[name="Username"]').type('secondtestkäyttis');
      cy.get('input[name="Password"]').type('password12345');
      cy.get('button[type="submit"]').click();

      cy.contains('Test Blogi123')
        .parent()
        .find('button')
        .contains('View')
        .click();
      cy.contains('Test Blogi123')
        .parent()

        .should('not.contain', 'Delete');
    });
  });
});
