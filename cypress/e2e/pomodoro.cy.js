describe('Pomodoro | Auto and non-auto start', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
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
    
    // BASIC USE
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

    it('(1) Set Pom to 1 min, (2) Start Interval, (3) Increment Time Past 1 min, (4) Turn on Toggle | Pomodoro | No Auto Start', () => {
        cy.get('[data-testid="pomodoroInput"]').clear();
        cy.get('[data-testid="pomodoroInput"]').type(1); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();

        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // click start btn to reset
        cy.tick(5 * 60 * 1000); // simulate passing of 5 min

        cy.openPomodoroSettings();
        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing

        cy.openPomodoroSettings();
        cy.get('[data-testid="pomodoroInput"]').clear();
        cy.get('[data-testid="pomodoroInput"]').type(6); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    })

    it('(1) Turn on Toggle, (2) Start Interval, (3) Let Time Pass 1 min, (4) Set Pom to 1 min | Pomodoro | No Auto Start', () => {
        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.get('[data-testid="settingsExit"]').click();

        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // click start btn to reset
        cy.tick(5 * 60 * 1000); // simulate passing of 5 min

        cy.openPomodoroSettings();
        cy.get('[data-testid="pomodoroInput"]').clear();
        cy.get('[data-testid="pomodoroInput"]').type(1); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing

        cy.openPomodoroSettings();
        cy.get('[data-testid="pomodoroInput"]').clear();
        cy.get('[data-testid="pomodoroInput"]').type(6); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    })

    it('(1) Turn on Toggle, (2) Start Interval, (3) Let Time Pass 1 min, (4) Set SB to 1 min | Short Break | No Auto Start', () => {
        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.get('[data-testid="settingsExit"]').click();

        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // --> Pomodoro
        cy.get('[data-testid="start-stop"]').click(); // --> Short Break
        cy.tick(5 * 60 * 1000); // simulate passing of 5 min

        cy.openPomodoroSettings();
        cy.get('[data-testid="shortBreakInput"]').clear();
        cy.get('[data-testid="shortBreakInput"]').type(1); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('#start-stop').should('have.class', 'glowing-effect'); // check if start-stop btn is glowing

        cy.openPomodoroSettings();
        cy.get('[data-testid="shortBreakInput"]').clear();
        cy.get('[data-testid="shortBreakInput"]').type(6); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('#start-stop').should('not.have.class', 'glowing-effect'); // check if start-stop btn is glowing
    })

    // Testing cause of undefined error
    it('Test to ensure that changing pomodoro input after toggling on pom notis in chill time does not alter mode header text until next switch', () => {
        cy.get('[data-testid="settingsExit"]').click();

        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // --> Flow Time
        cy.get('[data-testid="start-stop"]').click(); // --> Chill Time
        cy.tick(5 * 60 * 1000); // simulate passing of 5 min
        
        cy.openPomodoroSettings();
        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.get('[data-testid="pomodoroInput"]').clear();
        cy.get('[data-testid="pomodoroInput"]').type(30); // click start btn to reset
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Chill Time");
        
        cy.get('[data-testid="start-stop"]').click(); // --> Flow Time
        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #1 | 30 min");
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
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
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

describe('Pomodoro | Auto and non-auto start', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        cy.contains("Pomodoro").click();       
    })
    
    it('Alternating Auto Switch Toggling Bug Check', () => {
        // VARIABLE INITIALIZATION
        let pomMin = 1;
        let sbMin = 1;
        let lbMin = 1;
        
        /**
         * MAIN TESTING LOGIC
         */
        cy.get('[data-testid="pomodoroNotificationToggle"]').click(); // turn on pomodoro notifications
        cy.setPomodoroIntervalTimes(pomMin, sbMin, lbMin); // set times for pomodoro, sb and lb
        cy.clock(); // start cypress clock
        cy.get('[data-testid="start-stop"]').click(); // initial triggering of session

        cy.tick(6 * 60 * 1000); // simulate passing of 6 minutes

        // P1 --> SB1
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // enable break auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #1 | 1 min"); // check header
        cy.get('[data-testid="completedPomodoros-min"]').should('contain', 1); // check pomodoro count
        cy.get('[data-testid="display"]').should('contain', "00:05:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:01:00"); // ensure correct total display time

        // SB1 --> P2
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // disable break auto start
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // enable pom auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #2 | 1 min"); // check header
        cy.get('[data-testid="display"]').should('contain', "00:04:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:05:00"); // ensure correct total display time

        // P2 --> SB2
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // disable pom auto start
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // enable break auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #2 | 1 min"); // check header
        cy.get('[data-testid="completedPomodoros-min"]').should('contain', 2); // check pomodoro count

        cy.get('[data-testid="display"]').should('contain', "00:03:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:02:00"); // ensure correct total display time

        // SB2 --> P3
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // disable break auto start
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // enable pom auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #3 | 1 min"); // check header
        cy.get('[data-testid="display"]').should('contain', "00:02:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:04:00"); // ensure correct total display time

        // P3 --> SB3
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // disable pom auto start
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // enable break auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Short Break #3 | 1 min"); // check header
        cy.get('[data-testid="completedPomodoros-min"]').should('contain', 3); // check pomodoro count

        cy.get('[data-testid="display"]').should('contain', "00:01:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:03:00"); // ensure correct total display time

        // SB3 --> P4
        cy.openPomodoroSettings();
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click(); // disable break auto start
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click(); // enable pom auto start
        cy.get('[data-testid="settingsExit"]').click();

        cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Pomodoro #4 | 1 min"); // check header
        cy.get('[data-testid="display"]').should('contain', "00:00:00"); // ensure correct display time
        cy.get('[data-testid="progress-text"]').should('contain', "00:03:00"); // ensure correct total display time
    })
})