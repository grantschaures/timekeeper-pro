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

    it('25 min Pom, 5 min SB, 15 min LB | No Auto Start', () => {
        let pomMinutes = 25;
        let sbMinutes = 5;
        let lbMinutes = 15;

        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.setPomodoroIntervalTimes(pomMinutes, sbMinutes, lbMinutes);
        cy.clock();
        cy.pomodoroInterval(pomMinutes, sbMinutes, lbMinutes, "00:25:00", "00:05:00", "00:15:00", "01:40:00");
    })

    it('25 min Pom, 5 min SB, 15 min LB | Auto Start', () => {
        let pomMinutes = 25;
        let sbMinutes = 5;
        let lbMinutes = 15;

        cy.get('[data-testid="pomodoroNotificationToggle"]').click();
        cy.get('[data-testid="autoStartPomodoroIntervalToggleLabel"]').click();
        cy.get('[data-testid="autoStartBreakIntervalToggleLabel"]').click();
        cy.setPomodoroIntervalTimes(pomMinutes, sbMinutes, lbMinutes);
        cy.clock();
        cy.pomodoroIntervalAutoSwitch(pomMinutes, sbMinutes, lbMinutes, "01:40:00");
    })
})