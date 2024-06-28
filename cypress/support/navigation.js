// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

require("@testing-library/cypress/add-commands")

Cypress.Commands.add('reportIconClick', function() {
    cy.get('[data-testid="report-icon"]').click();

    // invisible
    cy.get('[data-testid="main"]').should('not.be.visible');
    cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
    cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    cy.get('[data-testid="aboutContainer"]').should('not.be.visible');

    // visible
    cy.get('[data-testid="reportContainer"]').should('be.visible');
})

Cypress.Commands.add('homeIconClick', function() {
    cy.get('[data-testid="home-icon"]').click();

    // invisible
    cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
    cy.get('[data-testid="reportContainer"]').should('not.be.visible');
    cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
    
    // visible
    cy.get('[data-testid="main"]').should('be.visible');
})

Cypress.Commands.add('spaceIconClick', function() {
    cy.get('[data-testid="space-icon"]').click();

    // invisible
    cy.get('[data-testid="main"]').should('not.be.visible');
    cy.get('[data-testid="reportContainer"]').should('not.be.visible');
    cy.get('[data-testid="blogContainer"]').should('not.be.visible');
    cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
    
    // visible
    cy.get('[data-testid="spaceContainer"]').should('be.visible');
})

// arrows
Cypress.Commands.add('leftArrowKeyPress', function() {
    cy.document().then((doc) => {
        // Create a new KeyboardEvent for the left arrow key press
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            keyCode: 37, // keyCode for left arrow
            which: 37, // which for left arrow
            code: 'ArrowLeft',
            bubbles: true
        });

        // Dispatch the event on the document to simulate the key press
        doc.dispatchEvent(event);
    });
})

Cypress.Commands.add('rightArrowKeyPress', function() {
    cy.document().then((doc) => {
        // Create a new KeyboardEvent for the left arrow key press
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            keyCode: 37, // keyCode for right arrow
            which: 37, // which for right arrow
            code: 'ArrowRight',
            bubbles: true
        });

        // Dispatch the event on the document to simulate the key press
        doc.dispatchEvent(event);
    });
})

Cypress.Commands.add('openBlog', function() {
    cy.get('[data-testid="menuBtn"]').click();
    cy.contains("Blog").click();
    cy.get('[data-testid="blogContainer"]').should('be.visible');
    cy.get('[data-testid="main"]').should('not.be.visible');
})

Cypress.Commands.add('openAbout', function() {
    cy.get('[data-testid="menuBtn"]').click();
    cy.contains("About").click();
    cy.get('[data-testid="aboutContainer"]').should('be.visible');
    cy.get('[data-testid="main"]').should('not.be.visible');
})