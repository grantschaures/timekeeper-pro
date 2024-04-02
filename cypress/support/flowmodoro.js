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

Cypress.Commands.add('openFlowmodoroSettingsContainer', function() {
    cy.get('[data-testid="menuBtn"]').click();
    cy.contains("Settings").click();
    cy.get('[data-testid="flowmodoroBtnContainer"]').click();
})

Cypress.Commands.add('openFlowTimeSettingsContainer', function() {
    cy.get('[data-testid="menuBtn"]').click();
    cy.contains("Settings").click();
    cy.get('[data-testid="generalBtnContainer"]').click();
})

Cypress.Commands.add('setFlowmodoroIntervalTimes', function(lessThan25Min, lessThan50Min, lessThan90Min, moreThan90Min) {
    cy.get('[data-testid="flowmodoroBreakInput1"]').clear();
    cy.get('[data-testid="flowmodoroBreakInput1"]').type(lessThan25Min);
    cy.get('[data-testid="flowmodoroBreakInput2"]').clear();
    cy.get('[data-testid="flowmodoroBreakInput2"]').type(lessThan50Min);
    cy.get('[data-testid="flowmodoroBreakInput3"]').clear();
    cy.get('[data-testid="flowmodoroBreakInput3"]').type(lessThan90Min);
    cy.get('[data-testid="flowmodoroBreakInput4"]').clear();
    cy.get('[data-testid="flowmodoroBreakInput4"]').type(moreThan90Min);

    cy.get('[data-testid="settingsExit"]').click();
})

Cypress.Commands.add('mainFlowmodoroTest', function(breakTimeStr, breakTime, flowTime, breakInput) {
    cy.get('[data-testid="start-stop"]').click(); // --> Flow Time
    cy.tick(flowTime * 60 * 1000); // simulate passing of 5 minutes
    cy.get('[data-testid="start-stop"]').click(); // --> Chill Time

    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is still not glowing
    cy.get('[data-testid="suggestionBreak-label"]').should('contain', 'Break');
    cy.get('[data-testid="suggestionBreak-min"]').should('contain', breakTimeStr);
    
    cy.tick(breakTime * 60 * 1000); // simulate passing of breakTime minutes
    cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still not glowing

    cy.openFlowmodoroSettingsContainer();
    cy.get(`[data-testid=${breakInput}]`).clear();
    cy.get(`[data-testid=${breakInput}]`).type(breakTime + 1);
    cy.get('[data-testid="settingsExit"]').click(); // close settings container
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is still not glowing

    cy.openFlowmodoroSettingsContainer();
    cy.get(`[data-testid=${breakInput}]`).clear();
    cy.get(`[data-testid=${breakInput}]`).type(breakTime - 1);
    cy.get('[data-testid="settingsExit"]').click(); // close settings container
    cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still not glowing
})