describe('Target Hours & Progress Bar', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })
  
    it('Target Hours Input Behavior | Pre-session', () => {
        cy.get('[data-testid="target-hours"]').should('have.class', 'glowing-effect');
        cy.get('[data-testid="target-hours"]').type(1);
        cy.get('[data-testid="target-hours-submit"]').click();
        cy.contains('Change').should('exist');
        cy.get('[data-testid="progress-text"]').should('contain', '00:00:00 (0%)');

        cy.get('[data-testid="target-hours-submit"]').click();
        cy.contains('Submit').should('exist');
        cy.get('[data-testid="progress-text"]').should('contain', '00:00:00');
        
        cy.get('[data-testid="target-hours"]').type(1);
        cy.get('[data-testid="target-hours-submit"]').click();
        cy.get('[data-testid="target-hours"]').click();
        cy.contains('Submit').should('exist');
        cy.get('[data-testid="progress-text"]').should('contain', '00:00:00');
    })

    it('Progress Bar Constricts Initially & Expands Upon Input of Target Hour Value', () => {
        // Initial constriction
        cy.get('#start-stop').click();
        cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');

        // Expansion
        cy.get('[data-testid="target-hours"]').type(1);
        cy.get('[data-testid="target-hours-submit"]').click();
        cy.get('[data-testid="progress-bar-container"]').should('not.have.class', 'small');
    })

    it('Clicking on progress bar to change display (if target hours submitted)', () => {
        cy.get('[data-testid="target-hours"]').type(1);
        cy.get('[data-testid="target-hours-submit"]').click();

        cy.get('[data-testid="progress-text"]').should('contain', '00:00:00 (0%) completed');
        cy.get('[data-testid="progress-text"]').click();
        cy.get('[data-testid="progress-text"]').should('contain', '01:00:00 (100%) remaining');
    })

    it('Target Hour Reached & Then Target Hour Removed', () => {
        cy.get('[data-testid="target-hours"]').type(1);
        cy.get('[data-testid="target-hours-submit"]').click();

        cy.clock();
        cy.get('#start-stop').click();
        cy.tick(60 * 60 * 1000); // simulate passing of 60 minutes
        cy.get('[data-testid="progress-container"]').should('have.class', 'glowing-effect');
        
        cy.get('[data-testid="target-hours-submit"]').click();
        cy.get('[data-testid="progress-container"]').should('not.have.class', 'glowing-effect');
        cy.get('[data-testid="progress-text"]').should('contain', '01:00:00');
    })

    it('Target Hours Info Popup Shows', () => {
        cy.get('[data-testid="targetHoursQuestionIcon"]').click();
        cy.get('[data-testid="targetHoursQuestionPopup"]').should('be.visible');
        
        cy.get('[data-testid="overlayExit"]').click();
        cy.get('[data-testid="targetHoursQuestionPopup"]').should('not.be.visible');
    })
})

describe('Distractions Container', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })
    
    it('Distractions Info Popup Shows', () => {
        cy.get('[data-testid="interruptionsQuestionIcon"]').click();
        cy.get('[data-testid="interruptionsQuestionPopup"]').should('be.visible');

        cy.get('[data-testid="overlayExit"]').click();
        cy.get('[data-testid="interruptionsQuestionPopup"]').should('not.be.visible');
    })

    it('Increment & Decrement Functionality', () => {
        cy.get('[data-testid="decBtn"]').click();
        cy.get('[data-testid="interruptions_num"]').should('contain', '0');
        
        cy.get('[data-testid="incBtn"]').click();
        cy.get('[data-testid="interruptions_num"]').should('contain', '1');
        
        cy.get('[data-testid="incBtn"]').click();
        cy.get('[data-testid="interruptions_num"]').should('contain', '2');
        
        cy.get('#start-stop').click();
        cy.get('[data-testid="interruptions_num"]').should('contain', '0');
    })
})

describe('Basic Interval Switching Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })
  
    it('Beginning --> Deep Work --> Break; Session Summary + Streaks', () => {
      cy.contains('Submit').should('exist');
      cy.contains('Distractions').should('exist');
      cy.contains("Press 'Start' to begin session").should('exist');
      
      cy.get('[data-testid="progress-text"]').should('contain', '00:00:00');
      cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');
      
      cy.clock();

      /**
       * Major Assumption: Break notification times are 5, 8, 10, and 15 min
       */
      
      // --> Deep Work
      cy.get('#start-stop').click();
      cy.contains('Deep Work').should('exist');
      cy.contains('Distractions').should('exist');
      cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');
      
      cy.tick(20 * 60 * 1000); // simulate passing of 20 minutes
      
      // --> Break
      cy.get('#start-stop').click();
      cy.contains('Break').should('exist');
      cy.contains('Suggested Break').should('exist');
      cy.contains('5 min').should('exist');
      cy.get('[data-testid="progress-text"]').should('contain', '00:20:00');

      // --> Deep Work
      cy.get('#start-stop').click();
      cy.contains('Deep Work').should('exist');
      cy.contains('Distractions').should('exist');
      cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');
      
      cy.tick(45 * 60 * 1000); // simulate passing of 45 minutes
      
      // --> Break
      cy.get('#start-stop').click();
      cy.contains('Break').should('exist');
      cy.contains('Suggested Break').should('exist');
      cy.contains('8 min').should('exist');
      cy.get('[data-testid="progress-text"]').should('contain', '01:05:00');

      // --> Deep Work
      cy.get('#start-stop').click();
      cy.contains('Deep Work').should('exist');
      cy.contains('Distractions').should('exist');
      cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');
      
      cy.tick(85 * 60 * 1000); // simulate passing of 85 minutes
      
      // --> Break
      cy.get('#start-stop').click();
      cy.contains('Break').should('exist');
      cy.contains('Suggested Break').should('exist');
      cy.contains('10 min').should('exist');
      cy.get('[data-testid="progress-text"]').should('contain', '02:30:00');

      // --> Deep Work
      cy.get('#start-stop').click();
      cy.contains('Deep Work').should('exist');
      cy.contains('Distractions').should('exist');
      cy.get('[data-testid="progress-bar-container"]').should('have.class', 'small');
      
      cy.tick(100 * 60 * 1000); // simulate passing of 100 minutes
      
      // --> Break
      cy.get('#start-stop').click();
      cy.contains('Break').should('exist');
      cy.contains('Suggested Break').should('exist');
      cy.contains('15 min').should('exist');
      cy.get('[data-testid="progress-text"]').should('contain', '04:10:00');

      // adding 5 hours for target hours
      cy.get('[data-testid="target-hours"]').type(5);
      cy.get('[data-testid="target-hours-submit"]').click();
      cy.get('[data-testid="progress-text"]').should('contain', '04:10:00 (83%)');

      cy.tick(15 * 60 * 1000); // simulate passing of 15 minutes
      cy.get('#start-stop').click(); // --> End in Deep Work

      // add 3 distractions
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="incBtn"]').click();
      }

      // end session
      cy.get('[data-testid="end_session_btn"]').click();
      cy.tick(1 * 60 * 1000);

      cy.get('[data-testid="deepWorkTime"]').should('contain', '4h 10m');
      cy.get('[data-testid="focusPercentage"]').should('contain', '94%');

      cy.get('[data-testid="sessionSummaryOkBtn"]').click();
      cy.tick(1 * 60 * 1000);
      
      cy.get('[data-testid="overlayExit"]').click();
      cy.tick(1 * 60 * 1000);

      cy.get('[data-testid="streaksCount"]').should('contain', '1');
    })
})

describe('Timekeeping Container Functionality', () => {
    beforeEach(() => {
    cy.clock();
      cy.visit('http://localhost:3000')
      cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })

    it('Notes Button', () => {
        cy.get('[data-testid="notes"]').click();
        cy.get('[data-testid="notes-container"]').should('be.visible');
        cy.get('[data-testid="notes"]').click();
        cy.get('[data-testid="notes-container"]').should('not.be.visible');
    })
    
    it('Start & End Button, + Session End Flow (Non-logged in user)', () => {

        cy.get('[data-testid="start-stop"]').click();
        
        cy.tick(15 * 60 * 1000);
        cy.get('[data-testid="progress-text"]').should('contain', '00:15:00');
        
        cy.get('[data-testid="end_session_btn"]').click();
        cy.tick(1 * 60 * 1000);
        
        cy.get('[data-testid="deepWorkTime"]').should('contain', '0h 15m');
        cy.get('[data-testid="focusPercentage"]').should('contain', '100%');
        
        cy.get('[data-testid="commentsTextArea"]').type('asdf testing fdsa');
        
        cy.get('[data-testid="subjectiveFeedbackDropdown"]').select('2');
        cy.get('[data-testid="subjectiveFeedbackDropdown"]').should('have.value', '2');
        
        cy.get('[data-testid="sessionSummaryOkBtn"]').click();
        cy.tick(1 * 60 * 1000);
        
        cy.get('[data-testid="overlayExit"]').should('be.visible');
        
        cy.contains('Would you like to save your sessions?').should('be.visible');
        cy.contains('If so, create an account here!').should('be.visible');
        
        cy.get('[data-testid="signupPromptPopupBtn"]').click();
        cy.tick(1 * 60 * 1000);
        
        cy.url().should('include', '/signup');
        
        cy.visit('/');
    })
})

describe('GUI Buttons', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#subMainContainer').invoke('css', 'opacity', '1');
  })

  it('Settings GUI Button', () => {
    cy.get('[data-testid="settingsGUIContainer"]').click();
    cy.get('[data-testid="settingsContainer"]').should('be.visible');
    cy.get('[data-testid="settingsGUIContainer"]').click();
    cy.get('[data-testid="settingsContainer"]').should('not.be.visible');
  })

  it('Dark Light Theme GUI Button (dark mode functionality)', () => {
    cy.get('[data-testid="darkLightThemeGUIContainer"]').click();
    
    // check to make sure relevant elements have switched their background color
    cy.get('[data-testid="interruptions-container"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="targetHoursContainer"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="timekeeping-container"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="progress-bar-container"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="notes-container"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="aboutContainer"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="blogContainer"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');
    cy.get('[data-testid="streaksContainer"]').should('have.css', 'background-color', 'rgba(32, 32, 32, 0.9)');

    cy.get('[data-testid="popupMenu"]').should('have.css', 'background-color', 'rgb(32, 32, 32)');
    cy.get('[data-testid="settingsContainer"]').should('have.css', 'background-color', 'rgb(32, 32, 32)');
    cy.get('[data-testid="emoji-container"]').should('have.css', 'background-color', 'rgb(32, 32, 32)');

    cy.get('[data-testid="darkLightThemeGUIContainer"]').click();

    // check to make sure relevant elements have switched their background color
    cy.get('[data-testid="interruptions-container"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="targetHoursContainer"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="timekeeping-container"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="progress-bar-container"]').should('have.css', 'background-color', 'rgba(255, 255, 255, 0.25)');
    cy.get('[data-testid="notes-container"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="aboutContainer"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="blogContainer"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="streaksContainer"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');

    cy.get('[data-testid="popupMenu"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0.9)');
    cy.get('[data-testid="settingsContainer"]').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    cy.get('[data-testid="emoji-container"]').should('have.css', 'background-color', 'rgb(0, 0, 0)');
  })

  it('Display GUI Button', () => {
    cy.get('[data-testid="displayGUIContainer"]').click();
    cy.get('[data-testid="stopwatch"]').should('not.be.visible');
    cy.get('[data-testid="displayGUIContainer"]').click();
    cy.get('[data-testid="stopwatch"]').should('be.visible');
  })

  it('Streaks GUI Container', () => {
    cy.get('[data-testid="streaksContainer"]').click();
    cy.url().should('include', '/login');
  })
  
  it('Question GUI Button', () => {
    cy.get('[data-testid="questionIconContainer"]').click();
    cy.get('[data-testid="popupQuestionMenu"]').should('be.visible');
    cy.contains('Log In').should('exist');
    cy.contains('Shortcuts').should('exist');
    cy.contains('Join Our Discord!').should('exist');
    cy.contains('Privacy Policy').should('exist');
    cy.contains('Terms & Conditions').should('exist');
  })
  
  it('Main Dropdown Menu', () => {
    cy.contains('Blog').should('exist');
    cy.contains('About').should('exist');
    cy.contains('Settings').should('exist');
    cy.contains('Log In').should('exist');
  })
})