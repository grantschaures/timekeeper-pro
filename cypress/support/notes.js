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

// Calculation Commands
Cypress.Commands.add('saveAndCloseNoteInputContainer', function() {
    cy.contains('div', 'Save').click();
    cy.contains('div', 'Cancel').click();
})

Cypress.Commands.add('removeDefaultLabels', function() {
    it('should remove every child element with class "selection tag"', () => {
        cy.get('[data-testid="label-selection-row"]')
          .children('.selection.tag')  // Select all children with the class "selection tag"
          .each(($el) => {  // Iterate over each of these elements
            cy.wrap($el).invoke('remove');  // Remove the element
        });
    });
})

Cypress.Commands.add('createLabel', function(labelValue) {
    cy.get('[data-testid="add-tag-icon"]').click();
    cy.get('[data-testid="create-label-input"]').type(labelValue);
    cy.get('[data-testid="create-label-done"]').click();
})