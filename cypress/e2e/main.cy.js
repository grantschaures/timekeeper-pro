describe('Target Hours', () => {
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
})

describe('Basic Interval Switching Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })
  
    it('Beginning --> Deep Work --> Break', () => {
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
    })
})