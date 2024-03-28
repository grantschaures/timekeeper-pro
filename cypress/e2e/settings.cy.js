describe('Pomodoro Settings', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
      cy.get('[data-testid="menuBtn"]').click();
      cy.contains("Settings").click();
      cy.contains("Pomodoro").click();
    })
  
    it('Pomodoro Info Window Shows Up', () => {
        cy.contains("Pomodoro Notifications").click();
        cy.contains("This will notify you after each interval specified for Pomodoro, Short Break, and Long Break").should('be.visible');
        
        cy.contains("Pomodoro Notifications").click();
        cy.contains("This will notify you after each interval specified for Pomodoro, Short Break, and Long Break").should('not.be.visible');
    })

    it('1 Min, Pom, SB and LB | No Auto Start', () => {
        let pomMinutes = 1;
        let sbMinutes = 1;
        let lbMinutes = 1;

        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.setPomodoroIntervalTimes(pomMinutes, sbMinutes, lbMinutes);
        cy.clock();
        cy.pomodoroInterval(pomMinutes, sbMinutes, lbMinutes, "00:01:00", "00:01:00", "00:01:00", "00:04:00");
    })

    it('25 min Pom, 5 min SB, 15 min LB | No Auto Start', () => {
        let pomMinutes = 25;
        let sbMinutes = 5;
        let lbMinutes = 15;

        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.setPomodoroIntervalTimes(pomMinutes, sbMinutes, lbMinutes);
        cy.clock();
        cy.pomodoroInterval(pomMinutes, sbMinutes, lbMinutes, "00:25:00", "00:05:00", "00:15:00", "01:40:00");
    })

    it('720 min Pom, 720 min SB, 720 min LB | No Auto Start', () => {
        let pomMinutes = 720;
        let sbMinutes = 720;
        let lbMinutes = 720;

        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.setPomodoroIntervalTimes(pomMinutes, sbMinutes, lbMinutes);
        cy.clock();
        cy.pomodoroInterval(pomMinutes, sbMinutes, lbMinutes, "12:00:00", "12:00:00", "12:00:00", "48:00:00");
    })

    
})