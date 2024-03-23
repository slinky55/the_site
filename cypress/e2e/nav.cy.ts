context('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('Header').click()
  })

  it('cy.go() - go back or forward in the browser\'s history', () => {
    // https://on.cypress.io/go
    const navLinks = [
      { href: "/", expectedPath: "/" },
      { href: "/about-us", expectedPath: "/about-us" },
      { href: "/research-library", expectedPath: "/research-library" },
      { href: "/news-and-events", expectedPath: "/news-and-events" },
      { href: "/partners", expectedPath: "/partners" },
      { href: "/projects", expectedPath: "/projects" },
      { href: "/blog", expectedPath: "/blog" },
      { href: "/contact", expectedPath: "/contact" },
    ];

      // Navigate forward
    navLinks.forEach(link => {
      cy.get(`a[href="${link.href}"]`).click();
      cy.location('pathname', {timeout: 1000}).should('eq', link.expectedPath);
    });

    // navigate back
    for (let i = navLinks.length - 1; i > 0; i--) {
      cy.go('back');
      cy.location('pathname', {timeout: 1000}).should('eq', navLinks[i - 1].expectedPath);
    }

    // navigate forward
    for (let i = 1; i < navLinks.length; i++) {
      cy.go('forward');
      // Verify the expected path after going forward
      cy.location('pathname', {timeout: 1000}).should('eq', navLinks[i].expectedPath);
    }
  });

  it('cy.reload() - reload the page', () => {
    cy.reload()

    // reload the page without using the cache
    cy.reload(true)
  })

  it('cy.visit() - visit a remote url', () => {
    // https://on.cypress.io/visit

    // Visit any sub-domain of your current domain
    // Pass options to the visit
    cy.visit('http://localhost:3000/', {
      timeout: 1000, // increase total time for the visit to resolve
      onBeforeLoad (contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true
      },
      onLoad (contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true
      },
    })
  })
})