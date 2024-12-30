describe('Blog app', function () {
  // testi käyttis
  const user = {
    name: 'Test Käyttis',
    username: 'testkäyttis',
    password: 'password123',
  };

  beforeEach(function () {
    // RESET
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // LUODAAN KÄYTTÄJÄ
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    // SISÄÄN KIRJATUMINEN
    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    it('A blog can be liked', function () {
      // UUSI BLOGI
      cy.contains('New Blog').click();
      cy.get('input[name="Title"]').type('Test Blogi123');
      cy.get('input[name="Author"]').type('Aatu Maenpaa');
      cy.get('input[name="Url"]').type('Tämä on testiblogi');
      cy.get('button[type="submit"]').click();

      // Varmistetaan, että blogi on luotu
      cy.contains('Test Blogi123');

      // VIEW NAPPI
      cy.contains('View').click();

      // LIKE NAPPI NÄKYY KUN VIEW NAPPIA PAINETAAN
      cy.contains('Like').should('be.visible');

      // LIKE NAPIN PAINAMINEN JA VARMISTUS
      cy.contains('Like').click();
      cy.contains('Likes: 1');

      // TOINEN LIKE
      cy.contains('Like').click();
      cy.contains('Likes: 2');
    });
  });
});
