describe('Adding, Removing, Editing Notes and Tasks', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    cy.contains('button', 'Notes').click();
  })

  it('Notes Container Opens Up Properly', () => {

    // Ensure notes-container exists and is visible to user
    cy.get('[data-testid="notes-container"]').should('exist').and('be.visible');

    // Ensure "Select Task Labels" is showing up somewhere
    cy.contains('Select Task Labels').should('be.visible'); 
  })

  it('Create Note', () => {
    // create note
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a note.");
    cy.saveAndCloseNoteInputContainer();

    // assertion to check existance of note
    cy.get('[data-testid="taskDiv0"]').contains("This is a note.");
  })

  it('Edit Note', () => {
    // create note
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a note.");
    cy.saveAndCloseNoteInputContainer();
    
    cy.get('[data-testid="editBtnTask0"]').click();

    cy.get('[data-testid="note-task-input-text-edit"]').type(" And here is an edit.");
    cy.contains('div', 'Save').click();

    // assertion to ensure edit was made successfully
    cy.get('[data-testid="taskDiv0"]').contains("This is a note. And here is an edit.");
  })

  it('Delete Note', () => {
    // create note
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a note.");
    cy.saveAndCloseNoteInputContainer();

    cy.get('[data-testid="removeBtnTask0"]').click();

    // assertion (ensures no children in list)
    cy.get('[data-testid="dynamicList"]').children().should('have.length', 0);
  })

  it('Create Task', () => {
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a task.");
    cy.get('[data-testid="taskCheckbox"]').click();
    cy.saveAndCloseNoteInputContainer();

    // assertion to check existance of note
    cy.get('[data-testid="taskDiv0"]').contains("This is a task.");
    cy.get('[data-testid="taskDiv0"]').find('.taskCircularCheck').should('exist');
  })

  it('Edit Task', () => {
    // create task
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a task.");
    cy.get('[data-testid="taskCheckbox"]').click();
    cy.saveAndCloseNoteInputContainer();
    
    cy.get('[data-testid="editBtnTask0"]').click();

    cy.get('[data-testid="note-task-input-text-edit"]').type(" And here is an edit.");
    cy.contains('div', 'Save').click();

    // assertion to ensure edit was made successfully
    cy.get('[data-testid="taskDiv0"]').contains("This is a task. And here is an edit.");
  })

  it('Delete Task', () => {
    // create task
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a task.");
    cy.get('[data-testid="taskCheckbox"]').click();
    cy.saveAndCloseNoteInputContainer();

    cy.get('[data-testid="removeBtnTask0"]').click();

    // assertion (ensures no children in list)
    cy.get('[data-testid="dynamicList"]').children().should('have.length', 0);
  })

  it('Check Off Task', () => {
    // create task
    cy.contains('div', 'Add note (n) or task (t)').click();
    cy.get('[data-testid="note-task-input-text"]').type("This is a task, and it will get checked off.");
    cy.get('[data-testid="taskCheckbox"]').click();
    cy.saveAndCloseNoteInputContainer();
    
    cy.get('[data-testid="svgCheck0"]').click();
    cy.get('[data-testid="taskDiv0"]').should($span => {
      const style = window.getComputedStyle($span[0]);
      expect(style.textDecoration).to.include('line-through');
    })
  })
})

/**
 * This is somewhat brittle in the sense that it relys on having the original three labels;
 * Improved version would delete any initial labels and populate the label-selection-window
 * with labels specifically for testing.
 */
describe('Adding, Removing, Editing Labels', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    cy.contains('button', 'Notes').click();
    cy.contains("Select Task Labels").click();
  })

  it('Opening Label Window', () => {
    cy.get('[data-testid="add-done-container"]').should("exist");
    cy.contains("Done").should('exist');
  })

  it('Add & Remove Label', () => {
    // Adding a label
    cy.contains("✍️ Homework").click();
    cy.get('[data-testid="label-input-container"]').children().should('have.length', 1);
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 4);
    
    // Removing a label
    cy.contains("✍️ Homework").click();
    cy.get('[data-testid="label-input-container"]').children().should('have.length', 0);
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 5);
  })

  it('Add 3 Labels & Clear All', () => {
    // Adding labels
    cy.contains("✍️ Homework").click();
    cy.contains("📚 Reading").click();
    cy.contains("🧘 Meditation").click();
    cy.get('[data-testid="label-input-container"]').children().should('have.length', 5);
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 2);
    
    // Clearing labels
    cy.get('[data-testid="clearIcon"]').click();
    cy.get('[data-testid="label-input-container"]').children().should('have.length', 0);
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 5);
  })
  
  /**
   * Need to do manual testing for updating and deleting labels
  */
 
  it('Create Label', () => {
    cy.get('[data-testid="add-tag-icon"]').click();
    cy.get('[data-testid="create-label-input"]').type("🕒 Testing Label");
    cy.get('[data-testid="create-label-done"]').click();
    
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 6);
    cy.contains("🕒 Testing Label");
  })

  it('Clear Labels from Notes Console Window', () => {
    cy.contains("✍️ Homework").click();
    cy.contains("📚 Reading").click();
    cy.contains("🧘 Meditation").click();

    cy.contains('h4', 'Done').click();
    cy.get('[data-testid="clearIcon"]').click();
    cy.contains('h4', 'Done').click();

    cy.get('[data-testid="label-input-container"]').children().should('have.length', 0);
    cy.get('[data-testid="label-selection-row"]').children().should('have.length', 5);
  })
})

describe('Auto Switch Functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#subMainContainer').invoke('css', 'opacity', '1');
    cy.contains('button', 'Notes').click();
    cy.contains("Select Task Labels").click();
  })

  it('Auto Switch to Flow Time and Chill Time', () => {
    cy.get('[data-testid="aboutIconNotes"]').click();
    cy.get('[data-testid="transitionNotesAutoSwitchToggle"]').click({force: true});
    cy.get('[data-testid="settingsExit"]').click();

    cy.contains("✍️ Homework").click();
    cy.contains('h4', 'Done').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Flow Time");
    
    cy.get('[data-testid="clearIcon"]').click();
    cy.contains('h4', 'Done').click();
    cy.get('[data-testid="productivity-chill-mode"]').should('contain', "Chill Time");
  })
})