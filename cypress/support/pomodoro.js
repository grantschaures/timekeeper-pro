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

Cypress.Commands.add('openPomodoroSettings', function() {
    cy.get('[data-testid="menuBtn"]').click();
    cy.contains("Settings").click();
    cy.get('[data-testid="pomodoroBtnContainer"]').click();
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

Cypress.Commands.add('pomodoroInterval', function(pomMin, HeaderStr, initialTotalTimeStr, finalTotalTimeStr, finalDisplayTimeStr) {
    cy.get('[data-testid="start-stop"]').click(); // click start btn
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Distractions').should('be.visible'); // ensure Distractions container is showing
    
    cy.tick(pomMin * 60 * 1000); // simulate passing of 25 minutes
    
    cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="display"]').should('contain', finalDisplayTimeStr); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', finalTotalTimeStr); // ensure correct total display time
})

Cypress.Commands.add('shortBreakInterval', function(sbMin, HeaderStr, initialTotalTimeStr, finalDisplayTimeStr, pomodoros) {
    cy.get('[data-testid="start-stop"]').click(); // click start btn
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Pomodoros').should('be.visible'); // ensure pomodoros container is showing
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', pomodoros); // ensure correct number of pomodoros completed
    
    cy.tick(sbMin * 60 * 1000); // simulate passing of 5 minutes
    
    cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="display"]').should('contain', finalDisplayTimeStr); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
})

Cypress.Commands.add('longBreakInterval', function(lbMin, HeaderStr, initialTotalTimeStr, finalDisplayTimeStr, pomodoros) {
    cy.get('[data-testid="start-stop"]').click(); // click start btn
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Pomodoros').should('be.visible'); // ensure pomodoros container is showing
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', pomodoros); // ensure correct number of pomodoros completed
    
    cy.tick(lbMin * 60 * 1000); // simulate passing of 15 minutes
    
    cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="display"]').should('contain', finalDisplayTimeStr); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
})

/**
 * AUTO SWITCHED INTERVALS
 */
Cypress.Commands.add('pomodoroIntervalAutoSwitch', function(pomMin, HeaderStr, initialTotalTimeStr, finalTotalTimeStr) {
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Distractions').should('be.visible'); // ensure Distractions container is showing
    
    cy.tick(((pomMin + 1) * 60 * 1000)); // simulate passing of 26 minutes
    
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="progress-text"]').should('contain', finalTotalTimeStr); // ensure correct total display time
})

Cypress.Commands.add('shortBreakIntervalAutoSwitch', function(sbMin, HeaderStr, initialTotalTimeStr, pomodoros) {
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Pomodoros').should('be.visible'); // ensure pomodoros container is showing
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', pomodoros); // ensure correct number of pomodoros completed
    
    cy.tick(sbMin * 60 * 1000); // simulate passing of 5 minutes
    
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
})

Cypress.Commands.add('longBreakIntervalAutoSwitch', function(lbMin, HeaderStr, initialTotalTimeStr, pomodoros) {
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is not glowing
    cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', HeaderStr); // check mode header
    cy.contains('Pomodoros').should('be.visible'); // ensure pomodoros container is showing
    cy.get('[data-testid="completedPomodoros-min"]').should('contain', pomodoros); // ensure correct number of pomodoros completed
    
    cy.tick(lbMin * 60 * 1000); // simulate passing of 15 minutes
    
    cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    cy.get('[data-testid="progress-text"]').should('contain', initialTotalTimeStr); // ensure correct total display time
})