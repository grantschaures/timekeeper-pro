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

Cypress.Commands.add('setPomodoroIntervalTimes', function(pomTime, sbTime, lbTime) {
    cy.get('[data-testid="pomodoroInput"]').clear();
    cy.get('[data-testid="pomodoroInput"]').type(pomTime);
    cy.get('[data-testid="shortBreakInput"]').clear();
    cy.get('[data-testid="shortBreakInput"]').type(sbTime);
    cy.get('[data-testid="longBreakInput"]').clear();
    cy.get('[data-testid="longBreakInput"]').type(lbTime);
    cy.get('[data-testid="settingsExit"]').click();
})

Cypress.Commands.add('pomodoroInterval', function(pomMin, sbMin, lbMin, pomMinStr, sbMinStr, lbMinStr, totalMin) {
    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #1 | " + pomMin + " min");
    cy.tick(pomMin * 60000);
    cy.get('[data-testid="display"]').should('contain', pomMinStr);

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #1 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="display"]').should('contain', sbMinStr);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "1");

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #2 | " + pomMin + " min");
    cy.tick(pomMin * 60000);
    cy.get('[data-testid="display"]').should('contain', pomMinStr);

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #2 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="display"]').should('contain', sbMinStr);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "2");

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #3 | " + pomMin + " min");
    cy.tick(pomMin * 60000);
    cy.get('[data-testid="display"]').should('contain', pomMinStr);

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #3 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="display"]').should('contain', sbMinStr);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "3");

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #4 | " + pomMin + " min");
    cy.tick(pomMin * 60000);
    cy.get('[data-testid="display"]').should('contain', pomMinStr);

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Long Break | " + lbMin + " min");
    cy.tick(lbMin * 60000);
    cy.get('[data-testid="display"]').should('contain', lbMinStr);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "4");

    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #1 | " + pomMin + " min");
    cy.get('[data-testid="display"]').should('contain', "00:00:00");
    cy.get('[data-testid="progress-text"]').should('contain', totalMin);
})

Cypress.Commands.add('pomodoroIntervalAutoSwitch', function(pomMin, sbMin, lbMin, totalMin) {
    cy.get('[data-testid="start-stop"]').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #1 | " + pomMin + " min");
    cy.tick(pomMin * 60000);

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #1 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "1");

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #2 | " + pomMin + " min");
    cy.tick(pomMin * 60000);

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #2 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "2");

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #3 | " + pomMin + " min");
    cy.tick(pomMin * 60000);

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #3 | " + sbMin + " min");
    cy.tick(sbMin * 60000);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "3");

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #4 | " + pomMin + " min");
    cy.tick(pomMin * 60000);

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Long Break | " + lbMin + " min");
    cy.tick(lbMin * 60000);
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', "4");

    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #1 | " + pomMin + " min");
    cy.get('[data-testid="display"]').should('contain', "00:00:00");
    cy.get('[data-testid="progress-text"]').should('contain', totalMin);
})