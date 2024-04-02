describe('Flowmodoro (Chill Time Notification) Testing', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
        cy.openFlowmodoroSettingsContainer();
    })
    
    it('Chill Time Notifications Info Window Shows Up', () => {
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        cy.contains("Chill Time Notifications").click();
        cy.contains("This will notify you after the specified number of minutes in Chill Time").should('be.visible');
        
        cy.contains("Chill Time Notifications").click();
        cy.contains("This will notify you after the specified number of minutes in Chill Time").should('not.be.visible');
    })

    it('Chill Time Notifications | < 25 min', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let lessThan25Min = 5;
        let lessThan50Min = 8;
        let lessThan90Min = 10;
        let moreThan90Min = 15;
        
        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="flowmodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setFlowmodoroIntervalTimes(lessThan25Min, lessThan50Min, lessThan90Min, moreThan90Min); // set times for flowmodoro times
        cy.clock(); // start cypress clock
        cy.mainFlowmodoroTest("5 min", lessThan25Min, 0, "flowmodoroBreakInput1");
    })

    it('Chill Time Notifications | < 50 min', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let lessThan25Min = 5;
        let lessThan50Min = 8;
        let lessThan90Min = 10;
        let moreThan90Min = 15;
        
        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="flowmodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setFlowmodoroIntervalTimes(lessThan25Min, lessThan50Min, lessThan90Min, moreThan90Min); // set times for flowmodoro times
        cy.clock(); // start cypress clock

        cy.mainFlowmodoroTest("8 min", lessThan50Min, 25, "flowmodoroBreakInput2");
    })

    it('Chill Time Notifications | < 90 min', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let lessThan25Min = 5;
        let lessThan50Min = 8;
        let lessThan90Min = 10;
        let moreThan90Min = 15;
        
        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="flowmodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setFlowmodoroIntervalTimes(lessThan25Min, lessThan50Min, lessThan90Min, moreThan90Min); // set times for flowmodoro times
        cy.clock(); // start cypress clock

        cy.mainFlowmodoroTest("10 min", lessThan90Min, 50, "flowmodoroBreakInput3");
    })

    it('Chill Time Notifications | >= 90 min', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let lessThan25Min = 5;
        let lessThan50Min = 8;
        let lessThan90Min = 10;
        let moreThan90Min = 15;
        
        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="flowmodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setFlowmodoroIntervalTimes(lessThan25Min, lessThan50Min, lessThan90Min, moreThan90Min); // set times for flowmodoro times
        cy.clock(); // start cypress clock

        cy.mainFlowmodoroTest("15 min", moreThan90Min, 90, "flowmodoroBreakInput4");
    })
})

describe('Flow Time Notification Testing', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
        cy.openFlowTimeSettingsContainer();
    })

    it('Flow Time Notifications Info Window Shows Up', () => {
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        cy.contains("Flow Time Notifications").click();
        cy.contains("Enter the time (in minutes) you'd like to pass while in Flow Time before getting a suggestion to take break").should('be.visible');
        
        cy.contains("Flow Time Notifications").click();
        cy.contains("Enter the time (in minutes) you'd like to pass while in Flow Time before getting a suggestion to take break").should('not.be.visible');
    })
    
    it('Flow Time Notifications', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} ); // turn on flow time notification toggle
        cy.get('[data-testid="suggestionMinutesInput"]').clear();
        cy.get('[data-testid="suggestionMinutesInput"]').type(90);
        cy.get('[data-testid="settingsExit"]').click();

        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // --> Flow Time
        cy.get('#start-stop').should('not.have.class', 'glowing-effect');

        cy.tick(90 * 60 * 1000); // simulate passing of 90 minutes
        cy.get('#start-stop').should('have.class', 'glowing-effect');
    })
})