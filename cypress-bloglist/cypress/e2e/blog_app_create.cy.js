describe('Blog app', function () {
  // KÄYTTÄJÄN LUOMINEN
  const user = {
    name: 'Test Käyttis',
    username: 'testkäyttis',
    password: 'password123',
  };

  beforeEach(function () {
    // RESET
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // KÄYTTÄJÄN LUOMINEN
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    // KIRJAUDUTAAN TUNNUKSILLA
    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    it('A blog can be created', function () {
      // KÄYTTÄJÄN ON KIRJAUTUNUT ONNISTUNEESTI
      cy.contains(`${user.name} logged in`);

      // NEW BLOG PAINIKE
      cy.contains('New Blog').click();

      // Täytetään new blog lomake
      cy.get('input[name="Title"]').type('Blog123');
      cy.get('input[name="Author"]').type('Aatu Maenpaa');
      cy.get('input[name="Url"]').type('This is a test blog.');

      // LOMAKKEEN LÄHETYS
      cy.get('button[type="submit"]').click();

      // UUSI BLOGI LISTASSA
      cy.contains('View').click();
      cy.contains('This is a test blog.'); // URL näkyy
      cy.contains('Title: Blog123');
    });
  });
});
