describe('Blog app', function () {
  // TESTI KÄYTTÄJÄ
  const user = {
    name: 'Test Käyttis',
    username: 'testkäyttis',
    password: 'password123',
  };

  beforeEach(function () {
    // RESET
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // KÄYTTÄJÄ LUODAAN
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    // SISÄÄN KIRJAUTUMINEN
    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    it('Blogs are sorted by likes count', function () {
      // luodaan useita blogeja
      cy.contains('New Blog').click();
      cy.get('input[name="Title"]').type('Blog1');
      cy.get('input[name="Author"]').type('Author1');
      cy.get('input[name="Url"]').type('url1');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="Title"]').type('Blog2');
      cy.get('input[name="Author"]').type('Author2');
      cy.get('input[name="Url"]').type('url2');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="Title"]').type('Blog3');
      cy.get('input[name="Author"]').type('Author3');
      cy.get('input[name="Url"]').type('url3');
      cy.get('button[type="submit"]').click();

      //LUODUT BLOGIT
      cy.contains('Blog1');
      cy.contains('Blog2');
      cy.contains('Blog3');

      cy.get('.blog').should('have.length', 3);

      // TYKKÄYS BLOG1
      cy.get('.blog').eq(0).contains('View').click();
      cy.get('.blog').eq(0).contains('Like').click();

      cy.wait(500);

      // TYKKÄYÄS BLOG2
      cy.get('.blog').eq(1).contains('View').click();
      cy.get('.blog').eq(1).contains('Like').click();

      cy.wait(500);

      // TYKKÄYS BLOG3
      cy.get('.blog').eq(2).contains('View').click();
      cy.get('.blog').eq(2).contains('Like').click();
      cy.wait(500);

      // LISÄTÄÄN YHDET TYKKÄYKSET BLOG1 JA BLOG2
      cy.get('.blog').eq(0).contains('Like').click();
      cy.get('.blog').eq(1).contains('Like').click();
      cy.wait(500);

      // LISÄÄ KOLMAS LIKE BLOG2
      cy.get('.blog').eq(1).contains('Like').click();
      cy.wait(500);
    });
  });
});
