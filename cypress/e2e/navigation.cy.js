// scrolling behavior should be tested for manually

describe('Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    })

    it('Basic Testing of Main Menu Popup', () => {
        cy.get('[data-testid="menuBtn"]').click();
        cy.get('[data-testid="popupMenu"]').should('be.visible');
        cy.get('[data-testid="menuBtn"]').click();
        cy.get('[data-testid="popupMenu"]').should('not.be.visible');
    })

    it('Basic Testing of Question Menu Popup', () => {
        cy.get('[data-testid="questionIcon"]').click();
        cy.get('[data-testid="popupQuestionMenu"]').should('be.visible');
        cy.get('[data-testid="questionIcon"]').click();
        cy.get('[data-testid="popupQuestionMenu"]').should('not.be.visible');
    })

    it('Basic Testing of Shortcuts Popup', () => {
        cy.get('[data-testid="questionIcon"]').click();
        cy.get('[data-testid="shortcutsContainer"]').click();
        
        cy.get('[data-testid="popupOverlay"]').should('be.visible');
        cy.get('[data-testid="shortcutsPopup"]').should('be.visible');

        cy.get('[data-testid="shortcutsExit"]').click();
        cy.get('[data-testid="popupOverlay"]').should('not.be.visible');
        cy.get('[data-testid="shortcutsPopup"]').should('not.be.visible');
    })

    it('Basic Testing of Settings', () => {
        cy.get('[data-testid="menuBtn"]').click();
        cy.contains("Settings").click();
        cy.get('[data-testid="settingsContainer"]').should('be.visible');
        cy.get('[data-testid="settingsExit"]').click();
        cy.get('[data-testid="settingsContainer"]').should('not.be.visible');
    })

    it('Basic Three-Way Toggle Click Testing', () => {

        // Click --> REPORT ICON
        cy.reportIconClick();
            
        // Click --> HOME ICON
        cy.homeIconClick();

        // Click --> SPACE ICON
        cy.spaceIconClick();

        // Click --> HOME ICON
        cy.homeIconClick();
        
        // Click --> REPORT ICON
        cy.reportIconClick();
        
        // Click --> SPACE ICON
        cy.spaceIconClick();
        
        // Click --> HOME ICON
        cy.homeIconClick();

        // Click --> SPACE ICON
        cy.spaceIconClick();

        // Click --> REPORT ICON
        cy.reportIconClick();

        // Click --> HOME ICON
        cy.homeIconClick();
    })

    it('Basic Three-Way Toggle Arrow-Key Testing', () => {

        // REPORT <--
        cy.leftArrowKeyPress();

            // invisible
            cy.get('[data-testid="main"]').should('not.be.visible');
            cy.get('[data-testid="spaceContainer"]').should('not.be.visible');

            // visible
            cy.get('[data-testid="reportContainer"]').should('be.visible');
        
        // --> HOME
        cy.rightArrowKeyPress();

            // invisible
            cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
            cy.get('[data-testid="reportContainer"]').should('not.be.visible');
            
            // visible
            cy.get('[data-testid="main"]').should('be.visible');
        
        // --> SPACE
        cy.rightArrowKeyPress();

            // invisible
            cy.get('[data-testid="main"]').should('not.be.visible');
            cy.get('[data-testid="reportContainer"]').should('not.be.visible');
            
            // visible
            cy.get('[data-testid="spaceContainer"]').should('be.visible');

        // HOME <--
        cy.leftArrowKeyPress();

            // invisible
            cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
            cy.get('[data-testid="reportContainer"]').should('not.be.visible');
            
            // visible
            cy.get('[data-testid="main"]').should('be.visible');
    })

    it('Basic Blog and About Container Testing (in home)', () => {
        cy.openBlog();
        cy.get('[data-testid="blogExit"]').click();
        cy.get('[data-testid="main"]').should('be.visible');

        cy.openAbout();
        cy.get('[data-testid="aboutExit"]').click();
        cy.get('[data-testid="main"]').should('be.visible');
    })

    it('Advanced Blog and About Container Testing', () => {
        // blog (clicking)
        cy.openBlog();
        cy.reportIconClick();
        cy.homeIconClick();

        cy.openBlog();
        cy.spaceIconClick();
        cy.homeIconClick();

        // about (clicking)
        cy.openAbout();
        cy.reportIconClick();
        cy.homeIconClick();

        cy.openAbout();
        cy.spaceIconClick();
        cy.homeIconClick();

        // ------------

        // blog (arrows)
        cy.openBlog();
        cy.leftArrowKeyPress(); // report <--

        // invisible
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');

        // visible
        cy.get('[data-testid="reportContainer"]').should('be.visible');
        cy.homeIconClick();

        // ------------

        cy.openBlog();
        cy.rightArrowKeyPress(); // --> space

        // invisible
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        
        // visible
        cy.get('[data-testid="spaceContainer"]').should('be.visible');

        cy.homeIconClick();

        // ------------

        // about (arrows)
        cy.openAbout();
        cy.leftArrowKeyPress(); // report <--

        // invisible
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');

        // visible
        cy.get('[data-testid="reportContainer"]').should('be.visible');

        cy.homeIconClick();

        // ------------

        cy.openAbout();
        cy.rightArrowKeyPress(); // --> space

        // invisible
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        
        // visible
        cy.get('[data-testid="spaceContainer"]').should('be.visible');

        cy.homeIconClick();

        // ------------

        cy.reportIconClick();
        cy.openBlog();
        cy.get('[data-testid="blogExit"]').click();

        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');
        
        // ------------
        
        cy.spaceIconClick();
        cy.openBlog();
        cy.get('[data-testid="blogExit"]').click();

        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');

        // ------------

        cy.reportIconClick();
        cy.openAbout();
        cy.get('[data-testid="aboutExit"]').click();

        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');
        
        // ------------
        
        cy.spaceIconClick();
        cy.openAbout();
        cy.get('[data-testid="aboutExit"]').click();

        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');

        // ------------
    })

    it('Blog Post Container Testing', () => {
        cy.openBlog();
        cy.get('[data-testid="blog_1"]').click();
        cy.reportIconClick();
        cy.homeIconClick();

        cy.openBlog();
        cy.get('[data-testid="blog_1"]').click();
        cy.spaceIconClick();
        cy.homeIconClick();

        cy.openBlog();
        cy.get('[data-testid="blog_1"]').click();
        cy.leftArrowKeyPress(); // report <--
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogPostContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('be.visible');
        cy.rightArrowKeyPress(); // --> home
        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogPostContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');
        
        cy.openBlog();
        cy.get('[data-testid="blog_1"]').click();
        cy.rightArrowKeyPress(); // --> space
        cy.get('[data-testid="main"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogPostContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="spaceContainer"]').should('be.visible');
        cy.leftArrowKeyPress(); // home <--
        cy.get('[data-testid="spaceContainer"]').should('not.be.visible');
        cy.get('[data-testid="reportContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogContainer"]').should('not.be.visible');
        cy.get('[data-testid="blogPostContainer"]').should('not.be.visible');
        cy.get('[data-testid="aboutContainer"]').should('not.be.visible');
        cy.get('[data-testid="main"]').should('be.visible');
    })
})