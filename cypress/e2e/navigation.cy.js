// scrolling behavior should be tested for manually

describe('Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('#sub-main-container').invoke('css', 'opacity', '1');
    })

    it('Home --> Blog Icon Click --> Home Icon Click', () => {
        cy.get('[data-testid="blog-icon"]').click();

        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('be.visible');

        cy.get('[data-testid="home-icon"]').click();

        cy.get('[data-testid="main"]').should('be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    })

    it('Home --> Blog Icon Click --> Blog Container Exit Icon Click', () => {
        cy.get('[data-testid="blog-icon"]').click();
        cy.get('[data-testid="blogExit"]').click();

        cy.get('[data-testid="main"]').should('be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    })

    it('Home --> Menu Btn --> Blog Btn', () => {
        cy.get('[data-testid="menuBtn"]').click();
        cy.get('[data-testid="blogMenuContainer"]').click();
        
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('be.visible');
    })

    it('Home --> Menu Btn --> About Btn', () => {
        cy.get('[data-testid="menuBtn"]').click();
        cy.get('[data-testid="aboutMenuContainer"]').click();

        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('be.visible');
        
        cy.get('[data-testid="aboutExit"]').click();
        cy.get('[data-testid="main"]').should('be.visible');
    })

    it('Home --> Menu Btn --> Settings Btn', () => {
        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();

        cy.get('[data-testid="main"]').should('be.visible');
        cy.get('[data-testid="settingsContainer"]').should('be.visible');
        
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('[data-testid="main"]').should('be.visible');
    })

    it('Home --> Blog Btn --> About Btn --> Blog --> Settings Btn', () => {
        cy.get('[data-testid="blog-icon"]').click();

        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("About").click();

        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('be.visible');
        cy.get('[data-testid="aboutExit"]').click();

        cy.get('[data-testid="blogContainer"]').should('be.visible');

        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('[data-testid="blogContainer"]').should('be.visible');

        cy.get('[data-testid="home-icon"]').click();
        cy.get('[data-testid="main"]').should('be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    })

    it('Home --> Blog Btn --> Home Btn --> Settings Btn --> Exit', () => {
        cy.get('[data-testid="blog-icon"]').click();
        cy.get('[data-testid="home-icon"]').click();

        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="main"]').should('be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    })
})