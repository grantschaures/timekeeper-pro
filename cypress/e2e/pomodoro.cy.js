describe('Pomodoro | Auto and non-auto start', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        cy.contains("Pomodoro").click();
    })
    
    it('Pomodoro Info Window Shows Up', () => {
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        cy.contains("Pomodoro Notifications").click();
        cy.contains("This will notify you after each interval specified for Pomodoro, Short Break, and Long Break").should('be.visible');
        
        cy.contains("Pomodoro Notifications").click();
        cy.contains("This will notify you after each interval specified for Pomodoro, Short Break, and Long Break").should('not.be.visible');
    })
    
    it('25 min Pom, 5 min SB, 15 min LB | No Auto Start', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
         */

        cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
        cy.clock(); // start cypress clock
        
        cy.pomodoroInterval(pomMin, "Pomodoro #1 | 25 min", "00:00:00", "00:25:00", "00:25:00"); // FIRST POMODORO
        cy.shortBreakInterval(sbMin, "Short Break #1 | 5 min", "00:25:00", "00:05:00", "1"); // FIRST SHORT BREAK
        cy.pomodoroInterval(pomMin, "Pomodoro #2 | 25 min", "00:25:00", "00:50:00", "00:25:00"); // SECOND POMODORO
        cy.shortBreakInterval(sbMin, "Short Break #2 | 5 min", "00:50:00", "00:05:00", "2"); // SECOND SHORT BREAK
        cy.pomodoroInterval(pomMin, "Pomodoro #3 | 25 min", "00:50:00", "01:15:00", "00:25:00"); // THIRD POMODORO
        cy.shortBreakInterval(sbMin, "Short Break #3 | 5 min", "01:15:00", "00:05:00", "3"); // THIRD SHORT BREAK
        cy.pomodoroInterval(pomMin, "Pomodoro #4 | 25 min", "01:15:00", "01:40:00", "00:25:00"); // FOURTH POMODORO
        cy.longBreakInterval(lbMin, "Long Break | 15 min", "01:40:00", "00:15:00", "4"); // LONG BREAK

        cy.get('[data-testid="start-stop"]').click(); // click start btn to reset
    })
    
    it('25 min Pom, 5 min SB, 15 min LB | Auto Start Pomodoro & Break', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;

        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // enable pomodoro notifications
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // enable pomodoro auto start
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // enable break auto start
        cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin);
        cy.clock();

        cy.get('[data-testid="start-stop"]').click(); // initial triggering of session

        cy.pomodoroIntervalAutoSwitch(pomMin, "Pomodoro #1 | 25 min", "00:00:00", "00:25:00"); // FIRST POMODORO
        cy.shortBreakIntervalAutoSwitch(sbMin, "Short Break #1 | 5 min", "00:25:00", "1");  // FIRST SHORT BREAK
        cy.pomodoroIntervalAutoSwitch(pomMin, "Pomodoro #2 | 25 min", "00:25:00", "00:50:00"); // SECOND PONMODORO
        cy.shortBreakIntervalAutoSwitch(sbMin, "Short Break #2 | 5 min", "00:50:00", "2"); // SECOND SHORT BREAK
        cy.pomodoroIntervalAutoSwitch(pomMin, "Pomodoro #3 | 25 min", "00:50:00", "01:15:00"); //THIRD POMODORO
        cy.shortBreakIntervalAutoSwitch(sbMin, "Short Break #3 | 5 min", "01:15:00", "3");  // THIRD SHORT BREAK
        cy.pomodoroIntervalAutoSwitch(pomMin, "Pomodoro #4 | 25 min", "01:15:00", "01:40:00"); // FOURTH POMODORO
        cy.longBreakIntervalAutoSwitch(lbMin, "Long Break | 15 min", "01:40:00", "4"); // LONG RBEAK
    })

    it('Pom #1 --> SB #1 --> Pom #2 | Auto Start Pomodoro', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;

        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // enable pomodoro notifications
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // enable pomodoro auto start
        cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin);
        cy.clock();

        cy.pomodoroInterval(pomMin, "Pomodoro #1 | 25 min", "00:00:00", "00:25:00", "00:25:00"); // FIRST POMODORO
        cy.get('[data-testid="start-stop"]').click(); // Pom (no auto switch) --> SB (auto switch)
        cy.shortBreakIntervalAutoSwitch(sbMin, "Short Break #1 | 5 min", "00:25:00", "1");  // FIRST SHORT BREAK
    })

    it('Pom #1 --> SB #1 | Auto Start Break', () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');

        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;

        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // enable pomodoro notifications
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // enable break auto start
        cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin);
        cy.clock();

        cy.get('[data-testid="start-stop"]').click(); // initial triggering of session
        
        cy.pomodoroIntervalAutoSwitch(pomMin, "Pomodoro #1 | 25 min", "00:00:00", "00:25:00"); // FIRST POMODORO
        cy.shortBreakIntervalAutoSwitch(sbMin, "Short Break #1 | 5 min", "00:25:00", "1"); // FIRST SHORT BREAK
    })
})

describe('Addition and removal of glowing-effect on start-stop btn', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        cy.contains("Pomodoro").click();
    })
    
    it("Changing pomodoro notification time during pomodoro interval correctly adds or removes glowing-effect", () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        
        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
        */
       cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
       cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
       cy.clock(); // start cypress clock
       
       cy.get('[data-testid="start-stop"]').click(); // initial triggering of session

       cy.tick(25 * 60 * 1000); // simulate passing of 25 minutes
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing

       // Update pomodoro notification time to be below current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="pomodoroInput"]').clear();
       cy.get('[data-testid="pomodoroInput"]').type(24);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still glowing

       // Update pomodoro notification time to be after current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="pomodoroInput"]').clear();
       cy.get('[data-testid="pomodoroInput"]').type(26);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is still glowing
    })

    it("Changing short break notification time during short break interval correctly adds or removes glowing-effect", () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        
        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
        */
       cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
       cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
       cy.clock(); // start cypress clock
       
       cy.get('[data-testid="start-stop"]').click(); // initial triggering of session
       cy.get('[data-testid="start-stop"]').click(); // immediately start first break

       cy.tick(5 * 60 * 1000); // simulate passing of 5 minutes
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing

       // Update pomodoro notification time to be below current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="shortBreakInput"]').clear();
       cy.get('[data-testid="shortBreakInput"]').type(4);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still glowing

       // Update pomodoro notification time to be after current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="shortBreakInput"]').clear();
       cy.get('[data-testid="shortBreakInput"]').type(6);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is not glowing
    })

    it("Changing long break notification time during long break interval correctly adds or removes glowing-effect", () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        
        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
        */
       cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
       cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
       cy.clock(); // start cypress clock
       
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #1
       cy.get('[data-testid="start-stop"]').click(); // begin short break #1
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #2
       cy.get('[data-testid="start-stop"]').click(); // begin short break #2
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #3
       cy.get('[data-testid="start-stop"]').click(); // begin short break #3
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #4
       cy.get('[data-testid="start-stop"]').click(); // begin long break

       cy.tick(15 * 60 * 1000); // simulate passing of 15 minutes
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing

       // Update pomodoro notification time to be below current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="longBreakInput"]').clear();
       cy.get('[data-testid="longBreakInput"]').type(14);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still glowing

       // Update pomodoro notification time to be after current time
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="longBreakInput"]').clear();
       cy.get('[data-testid="longBreakInput"]').type(16);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is still glowing
    })

    it("Pomodoro on --> Reach time --> Set Flow Time notification to same time, then turn on toggle --> Turns on glowing effect", () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        
        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
        */
       cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
       cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
       cy.clock(); // start cypress clock
       
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #1

       cy.tick(25 * 60 * 1000); // simulate passing of 25 minutes
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing

       // Turn on Flow Time notification, set to 25 min, and turn on toggle
       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="generalBtnContainer"]').click();
       cy.get('[data-testid="suggestionMinutesInput"]').clear();
       cy.get('[data-testid="suggestionMinutesInput"]').type(25);
       cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} );

       cy.tick(1 * 60 * 1000); // simulate passing of one more minute

       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is still glowing
    })

    it("Pomodoro on --> Reach time --> Turn on toggle, set Flow Time notification to 1  --> Turns on glowing effect", () => {
        // INITIAL CONDITIONS
        cy.get('body').invoke('css', 'overflow-y', 'scroll');
        
        // VARIABLE INITIALIZATION
        let pomMin = 25;
        let sbMin = 5;
        let lbMin = 15;
        
        /**
         * MAIN TESTING LOGIC
        */
       cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
       cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
       cy.clock(); // start cypress clock
       
       cy.get('[data-testid="start-stop"]').click(); // begin pomodoro #1

       cy.tick(25 * 60 * 1000); // simulate passing of 25 minutes
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing

       cy.get('[data-testid="menuBtn"]').click();
       cy.contains("Settings").click();
       cy.get('[data-testid="generalBtnContainer"]').click();
       cy.get('[data-testid="breakSuggestionToggle"]').click( {force: true} );
       cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // ensure start-stop btn is not glowing
       cy.get('[data-testid="suggestionMinutesInput"]').clear();
       cy.get('[data-testid="suggestionMinutesInput"]').type(1);
       cy.get('[data-testid="settingsExit"]').click();
       cy.get('#start-stop').should('have.class', 'glowing-effect'); // ensure start-stop btn is glowing
    })
})