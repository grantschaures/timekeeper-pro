describe('Flowmodoro (Break Notification) Testing', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
        cy.openFlowmodoroSettingsContainer();
    })

    it('Break Notifications | < 25 min', () => {
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

    it('Break Notifications | < 50 min', () => {
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

    it('Break Notifications | < 90 min', () => {
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

    it('Break Notifications | >= 90 min', () => {
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

describe('Deep Work Notification Testing', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
        cy.openFlowTimeSettingsContainer();
    })
    
    it('Deep Work Notifications', () => {
        cy.clock(); // start cypress clock

        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} ); // turn on Deep Work notification toggle
        cy.get('[data-testid="suggestionMinutesInput"]').clear();
        cy.get('[data-testid="suggestionMinutesInput"]').type(90);
        cy.get('[data-testid="settingsExit"]').click();

        // ensure mode text is still the same
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Press 'Start' to begin session");

        cy.get('[data-testid="start-stop"]').click(); // --> Deep Work
        cy.get('#start-stop').should('not.have.class', 'glowing-effect');
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Deep Work | 90 min");

        cy.tick(90 * 60 * 1000); // simulate passing of 90 minutes
        cy.get('#start-stop').should('have.class', 'glowing-effect');

        // turn notification toggle on/ off
        cy.openFlowTimeSettingsContainer();
        cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} ); // turn on Deep Work notification toggle
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Deep Work");
        cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} ); // turn on Deep Work notification toggle
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Deep Work | 90 min");

        // change the time and ensure mode text reflects change during deep work mode
        cy.get('[data-testid="suggestionMinutesInput"]').clear();
        cy.get('[data-testid="suggestionMinutesInput"]').type(120);
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Deep Work | 120 min");

        cy.get('[data-testid="start-stop"]').click(); // --> Break
        cy.get('[data-testid="start-stop"]').click(); // --> Deep Work
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Deep Work | 120 min");
    })
})