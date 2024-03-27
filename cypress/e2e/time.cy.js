describe('Pomodoro Settings', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('#sub-main-container').invoke('css', 'opacity', '1');
    })
  
    it('Simulate Time Passing', () => {
        cy.clock();
        // Start the timer in your application somehow, e.g., by clicking a button
        cy.get('#start-stop').click();
    
        // Simulate passing time
        cy.tick(10000); // Simulates 1000 milliseconds (1 second) passing
    
        // Now you can assert something changed in the UI that shows the timer has counted down
        cy.get('#display').should('contain', '00:00:10');
    
    })
})
