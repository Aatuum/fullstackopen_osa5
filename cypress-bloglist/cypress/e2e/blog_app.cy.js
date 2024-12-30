// TESTI ETUSIVULLE
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.visit('http://localhost:5173');
  });
  it('Login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
  });
});

// TESTI KIRJAUTUMISELLE JA EPÄONNISTUMISELLE KIRJAUTUMISELLE
describe('Blog app', function () {
  beforeEach(function () {
    // TIETOKANNAN NOLLAUS
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // KÄYTTÄJÄN LISÄYS
    const user = {
      name: 'Test Käyttis',
      username: 'testkäyttis',
      password: 'password123',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);

    // Siirrytään sovellukseen
    cy.visit('http://localhost:5173');
  });

  // Tarkista että kirjautumislomake on näkyvissä
  it('Login form is shown in site', function () {
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    //ONNISTUNUT KIRJAUTUMINEN
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type('testkäyttis');
      cy.get('input[name="Password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // KÄYTTÄJÄ KIRJAUTUNUT
      cy.contains('Test Käyttis logged in');
      cy.contains('logout');
    });

    it('fails with wrong credentials', function () {
      // EPÄONNISTUNUT KÄYTTÄJÄN KIRJAUTUMINEN VÄÄRILLÄ TIEDOILLA
      cy.get('input[name="Username"]').type('wronguser');
      cy.get('input[name="Password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      //VIRHEILMOITUS
      cy.contains('wrong credentials');
    });
  });
});
