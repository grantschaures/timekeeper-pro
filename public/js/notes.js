document.addEventListener("DOMContentLoaded", function() {
    /**
     * I just realized that you can make header comment like this now!
     */

    const notesContainer = document.getElementById("notes-container");
    
    const taskContainer = document.getElementById("task-container");
    const promptContainer = document.getElementById("prompt-container");
    const labelInputContainer = document.getElementById("label-input-container");
    const createLabelContainer = document.getElementById("create-label-container");
    const createLabelWindow = document.getElementById("create-label-window");
    const createLabelInput = document.getElementById("create-label-input");
    const createLabelDone = document.getElementById("create-label-done");
    const createLabelCancel = document.getElementById("create-label-cancel");

    const updateLabelContainer = document.getElementById("update-label-container");
    const updateLabelWindow = document.getElementById("update-label-window");
    const updateLabelInput = document.getElementById("update-label-input");
    const updateLabelCancel = document.getElementById('update-label-cancel');
    const updateLabelDone = document.getElementById('update-label-done');

    const labelSelectionWindow = document.getElementById("label-selection-window");
    const labelSelectionRow = document.querySelector('.label-selection-row');
    const clearIcon = document.getElementById("clearIcon");
    const notesBtn = document.getElementById("notes");
    const notesConsole = document.getElementById("notes-console");
    const taskPrompt = document.getElementById("task-prompt");
    const tagIcon = document.getElementById("tag-icon");
    const tagSelection = document.querySelectorAll('.selection-tag');
    const tagSelectionDivider = document.getElementById('tag-selection-divider');
    const addDoneContainer = document.getElementById('add-done-container');
    const selectionDoneDiv = document.getElementById('selection-done-div');
    const selectionDone = document.getElementById('selection-done');
    const addTagIcon = document.getElementById("add-tag-icon");
    const emojiBtn = document.getElementById("emoji-btn");
    const emojiBtn2 = document.getElementById("emoji-btn2");
    const emojiImg = document.getElementById("OGemoji");
    const emojiImg2 = document.getElementById("OGemoji2");
    const emojiContainer = document.getElementById("emoji-container");
    const emojiSymbols = document.querySelectorAll('.emoji-symbol');

    const transitionNotesAutoSwitchToggle = document.getElementById('transitionNotesAutoSwitchToggle');
    const start_stop_btn = document.getElementById('start-stop');
    const tutorialImgContainers = document.querySelectorAll('.tutorialImgContainer');
    const aboutIconNotes = document.getElementById('aboutIconNotes');
    const settings_menu_container = document.getElementById("settingsMenuContainer");
    const notesBtnContainer = document.getElementById("notesBtnContainer");
    const notesSettingsHr = document.getElementById('notesSettingsHr');
    const addingDeletingUpdatingLabelsInfoBlock = document.getElementById('addingDeletingUpdatingLabelsInfoBlock');

    const addNoteTaskContainer = document.getElementById("add-note-task-container");
    const noteTaskInputContainer = document.getElementById("note-task-input-container");
    const noteTaskInputText = document.getElementById("note-task-input-text");
    const noteInputCancelBtn = document.getElementById("note-input-cancel-btn");
    const noteInputSaveBtn = document.getElementById("note-input-save-btn");
    const taskCheckbox = document.getElementById('taskCheckbox');
    const dynamicList = document.getElementById('dynamicList');

    // CONSOLE
    let notesFlags = {
        isClicked: false,
        notesShowing: false,
        notesConsoleShowing: true,
        emojiContainerShowing: false
    }

    let counters = {
        notesLines: 0,
        tagsSelected: 0,
        lastLabelIdNum: 3, //subject to change based on num of predefined labels for user (need to store in database)
        lastNoteInputIdNum: 0,
        lastTaskInputIdNum: 0
    }

    let state = {
        currentNoteInputId: null,
        currentNoteTimeId: null,
        lastNotesLineTime: null,
        currentLabelInputTagSize: 20,
        generalTarget: null,
        lastSelectionElement: null,
        lastSelectedEmojiId: null,
        elementToUpdateId: null,
        currentNoteTaskEditId: null
    }

    let flags = {
        tagSelected: false,
        tagSelection: true,
        clearIconClicked: false,
        shiftPressed: false,
        altPressed: false,
        createLabelWindowOpen: false,
        updateLabelWindowOpen: false,
        transitionNotesAutoSwitchToggle: false,
        noteTaskInputContainerShowing: false,
        noteTaskInputContainerEditShowing: false
    }

    const emojiMap = {
        "studying-man-emoji": "👨‍💻",
        "studying-woman-emoji": "👩‍💻",
        "meditation-emoji": "🧘",
        "meditation-woman-emoji": "🧘‍♀️",
        "happy-emoji": "😄",
        "zany-emoji": "🤪",
        "heart-emoji": "💖",
        "dead-emoji": "💀",
        "document-emoji": "📄",
        "memo-emoji": "📝",
        "writing-emoji": "✍️",
        "notebook-emoji": "📓",
        "exercise-emoji": "🏋️",
        "headphones-emoji": "🎧",
        "piano-emoji": "🎹",
        "brain-emoji": "🧠",
        "lightbulb-emoji": "💡",
        "calendar-emoji": "📅",
        "clock-emoji": "🕒",
        "books-emoji": "📚"
    }

    const tutorialContainerMap = {
        "addingImgContainer": "addingLabelInstructions",
        "deletingImgContainer": "deletingLabelInstructions",
        "updatingImgContainer": "updatingLabelInstructions"
    }

    fontSizeArr = ['20px', '19px', '18px', '17px', '16px', '15px', '14px', '13px', '12px'];
    fontNumArr = [20, 19, 18, 17, 16, 15, 14, 13, 12];

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    //set initial emoji container point location
    setEmojiContainerPointLocation(window.innerWidth, emojiContainer, notesFlags, isMobile);

    if (isMobile) {
        aboutIconNotes.style.display = "none";
        notesSettingsHr.style.display = "none";
        addingDeletingUpdatingLabelsInfoBlock.style.display = "none";

    }

    // //
    // //
    // BEGINNING OF EVENT LISTENER SECTION
    // //
    // //

    dynamicList.addEventListener('click', function(event) {
        let target = event.target;
        let targetId = target.id;
        console.log(targetId);

        if ((target.className.baseVal === 'check') || (target.className.baseVal === 'svgCheck')) {
            let idNum = getLastNumberFromId(targetId);
            let taskDiv = document.getElementById("taskDiv" + idNum);
            let check = document.getElementById("check" + idNum);
            let taskCircularCheckElement = taskDiv.firstElementChild;

            if (taskDiv.classList.contains('completed-task')) {
                taskCircularCheckElement.style.backgroundColor = "";
                
                check.setAttribute('stroke-width', '2');
                check.parentElement.parentElement.style.opacity = '';
    
                taskDiv.classList.remove('completed-task');

            } else if (!(taskDiv.classList.contains('completed-task'))) {
                taskCircularCheckElement.style.backgroundColor = "#3ba43e";
                
                check.setAttribute('stroke-width', '3');
                check.parentElement.parentElement.style.opacity = '1';
    
                taskDiv.classList.add('completed-task');
            }
        } else if ((target.classList.contains("editRemoveBtn")) || (target.classList.contains("editRemoveSvg")) || (target.classList.contains("editIcon")) || (target.classList.contains("removePath"))) {

            // Discriminate between edit btn and remove btn
            let taskInputId;

            let idNum;
            if ((target.classList.contains('editBtn')) || (target.classList.contains('editIcon'))) {
                console.log("Edit Btn Clicked");

                idNum = getLastNumberFromId(targetId);
                noteInputId = "noteDiv" + idNum;
                taskInputId = "taskDiv" + idNum;

                // IDs
                // Note: editBtnNote[n]
                // Task: editBtnTask[n]

                if (flags.noteTaskInputContainerShowing) {
                    noteTaskInputContainer.style.display = 'none';
                    addNoteTaskContainer.style.display = 'flex';
                }

                console.log(getTypeFromId(targetId))
                if (getTypeFromId(targetId) === "Note") {
                    // Edit Note
                    console.log("Editing " + targetId);
                    // Hide the chosen note and display the note-task-input-container

                    editNoteTask("note", noteInputId, state, flags);
                } else if (getTypeFromId(targetId) === "Task") {
                    // Edit Task
                    console.log("Editing " + targetId);


                    editNoteTask("task", taskInputId, state, flags);
                }
            } else if ((target.classList.contains('removeBtn')) || (target.classList.contains('removeSvg')) || (target.classList.contains('removePath'))) {
                console.log("Remove Btn Clicked");
                
                idNum = getLastNumberFromId(targetId);
                noteInputId = "noteDiv" + idNum;
                taskInputId = "taskDiv" + idNum;


                if (document.getElementById(noteInputId)) {
                    document.getElementById(noteInputId).remove();
                } else if (document.getElementById(taskInputId)) {
                    document.getElementById(taskInputId).remove();
                }
            }
        } else if ((targetId === "note-input-save-btn-edit") || (targetId === "note-input-cancel-btn-edit") || (targetId === "taskCheckbox-edit")) {
            if (targetId === "note-input-save-btn-edit") {
                console.log("saved edit");
                let inputEditStr = document.getElementById('note-task-input-container-edit').querySelector('textarea').value;

                document.getElementById(state.currentNoteTaskEditId).querySelector('span').textContent = inputEditStr;
                document.getElementById(state.currentNoteTaskEditId).style.display = "flex";
                document.getElementById('note-task-input-container-edit').remove();

                flags.noteTaskInputContainerEditShowing = false;
                
            } else if (targetId === "note-input-cancel-btn-edit") {
                console.log("cancelled edit");
                
                
                
                document.getElementById('note-task-input-container-edit').remove();
                document.getElementById(state.currentNoteTaskEditId).style.display = "flex";
                
                flags.noteTaskInputContainerEditShowing = false;

            }
        }
    })

    taskCheckbox.addEventListener('click', function() {
        noteTaskInputText.focus();
    })

    noteInputSaveBtn.addEventListener('click', function() {
        //gather the value of the input
        //use as innerText content for new note/ task container

        let inputStr = noteTaskInputText.value;

        if (inputStr === "") {
            noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
            return;
        }

        let noteTaskDiv = document.createElement('div');
        noteTaskDiv.classList.add('noteTask');

        let container;

        if (taskCheckbox.checked) {
            let taskCircularCheckDiv = document.createElement('div');
            taskCircularCheckDiv.classList.add('taskCircularCheck');
            
            let circularCheckDiv = document.createElement('div');
            circularCheckDiv.classList.add('circularCheck');
            
            // Create the SVG element
            var svgCheck = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgCheck.setAttribute('width', '20');
            svgCheck.setAttribute('height', '20');
            svgCheck.setAttribute('viewBox', '0 0 20 20');
            svgCheck.classList.add('svgCheck');
            svgCheck.id = "svgCheck" + counters.lastTaskInputIdNum;
            
            // Create the path element
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('check');
            path.setAttribute('class', 'check');
            path.setAttribute('d', 'M4 10 L8 14 L16 6');
            path.setAttribute('stroke', 'white');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.id = "check" + counters.lastTaskInputIdNum;
            
            // Append the path to the SVG
            svgCheck.appendChild(path);
            circularCheckDiv.appendChild(svgCheck);
            taskCircularCheckDiv.appendChild(circularCheckDiv);
            noteTaskDiv.appendChild(taskCircularCheckDiv);
            
            var taskText = document.createElement('span');
            taskText.textContent = inputStr;
            noteTaskDiv.appendChild(taskText);
            noteTaskDiv.id = "taskDiv" + counters.lastTaskInputIdNum;

            container = appendEditRemoveContainer("Task", counters.lastTaskInputIdNum);

            counters.lastTaskInputIdNum += 1;
            // console.log("Latest Task ID: " + counters.lastTaskInputIdNum);
        } else {
            // make a new note div
            var taskText = document.createElement('span');
            taskText.textContent = inputStr;
            noteTaskDiv.appendChild(taskText)
            noteTaskDiv.id = "noteDiv" + counters.lastNoteInputIdNum;

            container = appendEditRemoveContainer("Note", counters.lastNoteInputIdNum);

            counters.lastNoteInputIdNum += 1;
            // console.log("Latest Note ID: " + counters.lastNoteInputIdNum);
        }

        noteTaskDiv.appendChild(container);

        dynamicList.appendChild(noteTaskDiv);

        // Scroll the new noteTaskDiv into view
        setTimeout(() => {
            notesConsole.scrollTo({ top: notesConsole.scrollHeight, behavior: 'smooth' });
        }, 0);

        noteTaskInputText.value = "";
        noteTaskInputText.focus();
        autoExpand(); // resets input container to original size for next input
    })

    noteInputCancelBtn.addEventListener('click', function() {
        noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
        autoExpand(); // resets input container to original size for next input
    })

    addNoteTaskContainer.addEventListener('click', function() {
        addNoteTaskContainer.style.display = 'none';
        noteTaskInputContainer.style.display = 'flex';


        console.log(flags.noteTaskInputContainerEditShowing);
        if (flags.noteTaskInputContainerEditShowing) {
            document.getElementById('note-task-input-container-edit').remove();
            flags.noteTaskInputContainerEditShowing = false;

            document.getElementById(state.currentNoteTaskEditId).style.display = "flex";
        }

        noteTaskInputText.focus();
        flags.noteTaskInputContainerShowing = true;

        setTimeout(() => {
            notesConsole.scrollTo({ top: notesConsole.scrollHeight, behavior: 'smooth' });
        }, 0);
    })

    const textarea = document.getElementById('note-task-input-text');
    function autoExpand() {
        textarea.style.height = '24px';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    textarea.addEventListener('input', autoExpand);
















    notesBtn.addEventListener("click", function() {
        if (notesFlags.notesShowing === false) {
            openNotesContainer(notesContainer, notesFlags);
        } else {
            closeNotesContainer(notesContainer, notesFlags, flags, noteInputCancelBtn);
        }
    })
    
    document.addEventListener('keydown', (event) => handleTaskEnter_or_n(event, notesFlags, notesContainer, createLabelInput, createLabelDone, updateLabelInput, updateLabelDone, noteInputSaveBtn, noteTaskInputText, noteInputCancelBtn, addNoteTaskContainer, flags));
    
    clearIcon.addEventListener("click", async function() {

        let tagDivs = document.querySelectorAll('.selected-tag .tag-text');
        tagDivs.forEach(tag => {
            tag.style.fontSize = '20px';
        })

        flags.clearIconClicked = true;
        clearIcon.classList.add('resetIconRotation');
        setTimeout(() => {
            clearIcon.style.display = "none";
            clearIcon.classList.remove('resetIconRotation');
        }, 500)

        tagIcon.style.marginLeft = '';
        tagIcon.classList.remove('tagToLeftSide');
        promptContainer.style.width = '';


        if (notesFlags.notesConsoleShowing) {
            notesConsole.style.display = "none";
            labelSelectionWindow.style.display = "block";
            notesFlags.notesConsoleShowing = false;
        }
        
        // query select all w/ className 'tag unselectable selected-tag'\
        let selectedTags = document.querySelectorAll('.selected-tag');
        
        selectedTags.forEach(tag => {
            deselectTags(tag, flags, tagIcon, clearIcon, labelSelectionRow, counters, tagSelectionDivider, addDoneContainer);
        })
        flags.clearIconClicked = false;
        flags.tagSelected = false;

        labelInputContainer.style.justifyContent = 'center';
    })

    promptContainer.addEventListener("click", function() {
        notesFlags.isClicked = true;
        taskPrompt.style.display = "none";
        tagIcon.style.marginRight = 0;
        tagIcon.classList.add('blink');

        notesConsole.style.display = "none";
        labelSelectionWindow.style.display = "block";

        notesFlags.notesConsoleShowing = false;

        promptContainer.style.zIndex = 3;
    })

    document.addEventListener('keydown', function(event) {
        let target = state.generalTarget;

        if ((event.key === 'Shift') && (!flags.shiftPressed)) {
            flags.shiftPressed = true;

            if ((target.classList.contains('tag-text')) && (!target.classList.contains('create-label')) && (!(target.parentElement.classList.contains('selected-tag'))) && (flags.shiftPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) {
                state.lastSelectionElement = target;

                if (flags.altPressed) {
                    target.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                } else {
                    target.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
                    target.classList.add('deleteJiggling');
                }
            }
        } else if ((event.key === 'Alt') && (!flags.altPressed)) {
            event.preventDefault();
            flags.altPressed = true;
            
            if ((target.classList.contains('tag-text')) && (!(target.parentElement.classList.contains('selected-tag'))) && (!target.classList.contains('create-label')) && (flags.altPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) {
                state.lastSelectionElement = target;
                
                target.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            }
        }
    })

    document.addEventListener('keyup', function(event) {
        if ((event.key === 'Shift') && (flags.shiftPressed)) {
            flags.shiftPressed = false;

            if (state.lastSelectionElement !== null) {
                state.lastSelectionElement.style.backgroundColor = "";
                state.lastSelectionElement.classList.remove('deleteJiggling');
            }
        } else if ((event.key === 'Alt') && (flags.altPressed)) {
            flags.altPressed = false;
            
            if (state.lastSelectionElement !== null) {
                state.lastSelectionElement.style.backgroundColor = "";
            }
        }
    })

    document.addEventListener('mouseover', function(event) {
        let target = event.target;
        state.generalTarget = target;
        
        // If user shift-clicks or alt-clicks on label and quickly moves mouse to outside,
        // it catches that movement in case the labelSelectionRow mouseover
        // event listener missed it and resets color and jiggle class
        if ((!((target.classList.contains('tag-text')) && ((flags.shiftPressed) || (flags.altPressed)) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) && (state.lastSelectionElement !== null))) {
            state.lastSelectionElement.style.backgroundColor = "";
            state.lastSelectionElement.classList.remove('deleteJiggling');
        }
    })

    labelSelectionRow.addEventListener('mouseover', function(event) {
        // console.log("test")

        // Consistently sets this state variable to contain current element in the
        // label selection row
        let target = event.target;

        //if active element contains tag-selection class and ONLY shift is pressed
        if ((target.classList.contains('tag-text')) && ((flags.shiftPressed) && (!flags.altPressed)) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) {
            // if a previous element was selected for deletion, it's reset
            if (state.lastSelectionElement !== null) {
                state.lastSelectionElement.style.backgroundColor = "";
                state.lastSelectionElement.classList.remove('deleteJiggling');
            }
            state.lastSelectionElement = target;
            
            target.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            target.classList.add('deleteJiggling');

        } else if ((target.classList.contains('tag-text')) && (flags.altPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) { //if alt or shift + alt are pressed

            // if a previous element was selected for deletion, it's reset
            if (state.lastSelectionElement !== null) {
                state.lastSelectionElement.style.backgroundColor = "";
            }
            state.lastSelectionElement = target;

            target.style.backgroundColor = "rgba(0, 255, 0, 0.2)";

        } else if (state.lastSelectionElement !== null) {
            state.lastSelectionElement.style.backgroundColor = "";
            state.lastSelectionElement.classList.remove('deleteJiggling');
        }
    })

    labelSelectionRow.addEventListener('click', function(event) {
        var target = event.target;

        if (target.className === 'selection-tag' || (((target.className === 'tag-text') || (target.className === 'tag-text deleteJiggling')) && (target.innerText !== "Done"))) {

            if ((flags.shiftPressed) && (!flags.altPressed)) {
                let toDeleteTagId;
                if (target.className === 'tag-text deleteJiggling') {
                    toDeleteTagId = target.parentElement.id;
                } else {
                    toDeleteTagId = target.id;
                }

                document.getElementById(toDeleteTagId).remove();

                // MAKE THIS A FUNCTION
                if (!addDoneContainer.previousElementSibling) {
                    tagSelectionDivider.style.display = 'none';
                    addDoneContainer.style.marginLeft = '7px';
                    flags.tagSelection = false;
                }
                // MAKE THIS A FUNCTION
                return;
            } else if ((flags.altPressed) || ((flags.altPressed) && (flags.shiftPressed))) {
                // update label
                updateLabel(target);
            } else {
                // this limit can be changed if needed (refer to user feedback, if there is any)
                if (counters.tagsSelected === 5) {
                    alert("You've reached your max limit of 5 labels")
                } else {
                    //if more than 1 selected tag, adds a '|' divider to left
                    counters.tagsSelected++;
                    if (counters.tagsSelected > 1) {
                        let dividerElement = document.createElement('h4');
                        dividerElement.className = 'tag-divider unselectable';
                        dividerElement.innerText = '|';
                        labelInputContainer.append(dividerElement);
                    }
        
                    // initialize vars
                    let selectionTagId;
                    let innerHTML;
                    let selectedBackgroundColor = 'rgba(255, 255, 255, 0.2)';
        
                    if (target.className === 'tag-text') {
                        selectionTagId = target.parentElement.id;
                        innerHTML = target.parentElement.innerHTML;
                    } else {
                        selectionTagId = target.id;
                        innerHTML = target.innerHTML;
                    }
    
                    // Remove tag from selection window
                    document.getElementById(selectionTagId).remove();
        
                    // Add tag to label input container
                    let selectedDiv = document.createElement('div');
                    selectedDiv.className = 'tag unselectable selected-tag';
                    selectedDiv.innerHTML = innerHTML;
                    selectedDiv.id = selectionTagId;
                    selectedDiv.firstElementChild.style.backgroundColor = selectedBackgroundColor;
        
                    labelInputContainer.appendChild(selectedDiv);
        
                    if (flags.tagSelected === false) {
                        flags.tagSelected = true;
                        tagIcon.style.marginLeft = '5px';
                        tagIcon.classList.add('tagToLeftSide');
                        promptContainer.style.width = '100%';
    
                        clearIcon.style.display = 'flex';
                    }
        
                    // MAKE THIS A FUNCTION
                    if (!addDoneContainer.previousElementSibling) {
                        tagSelectionDivider.style.display = 'none';
                        addDoneContainer.style.marginLeft = '7px';
                        flags.tagSelection = false;
                    }
                    // MAKE THIS A FUNCTION
    
                    if ((labelInputContainer.scrollWidth > labelInputContainer.clientWidth) || (state.currentLabelInputTagSize < 20)) {
                        
                        // console.log(labelInputContainer.scrollWidth - labelInputContainer.clientWidth);
                        
                        
                        // MAKE FUNCTION
                        let tagDivs = document.querySelectorAll('.selected-tag .tag-text');
                        let fontArrIndex = 0;
                        do {
                            tagDivs.forEach(tag => {
                                tag.style.fontSize = fontSizeArr[fontArrIndex];
                                state.currentLabelInputTagSize = fontNumArr[fontArrIndex];
                            })
                            // console.log(fontSizeArr[fontArrIndex]);
                            fontArrIndex++;
                        } while (((labelInputContainer.scrollWidth - labelInputContainer.clientWidth) > 0) && (fontArrIndex < 9))
                        // MAKE FUNCTION
    
                        if (labelInputContainer.scrollWidth > labelInputContainer.clientWidth) {
                            labelInputContainer.style.justifyContent = 'left';
                        }
                    }
                }
            }

        } else if ((target.id === 'selection-done-div') || (target.id === 'selection-done')) {
            done();
            notesFlags.notesConsoleShowing = true;
        } else if (target.id === 'add-tag-icon') {
            addNewTag();
        }
    })

    labelInputContainer.addEventListener('mouseover', function(event) {
        var target = event.target;
        if ((target.className === 'selected-tag' || target.className === 'tag-text') && (!notesFlags.notesConsoleShowing)) {
            target.classList.add('deleteJiggling');
            setTimeout(() => {
                target.classList.remove('deleteJiggling');
            }, 250)
        }
    })
    
    labelInputContainer.addEventListener('click', function(event) {
        var target = event.target;
        
        // check if div or h4 is clicked on
        if ((target.className === 'selected-tag' || target.className === 'tag-text' || target.className === 'tag-text deleteJiggling') && (!notesFlags.notesConsoleShowing)) {
            if (target.className === 'tag-text deleteJiggling') {
                target.className = 'tag-text';
            }
            
            deselectTags(target, flags, tagIcon, clearIcon, labelSelectionRow, counters, tagSelectionDivider, addDoneContainer);
            // resets font size for all in main selection container
            let tagDivs = document.querySelectorAll('.selection-tag .tag-text'); //not actually a div (really an h4 (the div's child))
            tagDivs.forEach(tag => {
                tag.style.fontSize = '20px';
            })
            
            // resets size of no overflow in labelInputContainer
            if (labelInputContainer.scrollWidth <= labelInputContainer.clientWidth) {
                
                
                // MAKE FUNCTION
                let tagDivs = document.querySelectorAll('.selected-tag .tag-text');
                let fontArrIndex = 0;
                do {
                    tagDivs.forEach(tag => {
                        tag.style.fontSize = fontSizeArr[fontArrIndex];
                        state.currentLabelInputTagSize = fontNumArr[fontArrIndex];
                    })
                    // console.log(fontSizeArr[fontArrIndex]);
                    fontArrIndex++;
                } while (((labelInputContainer.scrollWidth - labelInputContainer.clientWidth) > 0) && (fontArrIndex < 9))
                // MAKE FUNCTION
            }

            if (labelInputContainer.scrollWidth <= labelInputContainer.clientWidth) {
                labelInputContainer.style.justifyContent = 'center';
            }
    
            if (!flags.tagSelected) {
                tagIcon.style.marginLeft = '';
                tagIcon.classList.remove('tagToLeftSide');
                promptContainer.style.width = '';
            }
        } else {
            promptContainer.click();
        }

    })

    createLabelCancel.addEventListener("click", function(event) {
        //clear the input
        createLabelInput.value = "";
        
        backToLabelSelection(createLabelContainer, createLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);

        // MAKE FUNCTION
        emojiContainer.style.display = "none";
        emojiContainer.style.opacity = '0';
        notesFlags.emojiContainerShowing = false;
        // MAKE FUNCTION

        flags.createLabelWindowOpen = false;
    })

    updateLabelCancel.addEventListener("click", function(event) {
        //clear the input
        updateLabelInput.value = "";
        
        backToLabelSelection(updateLabelContainer, updateLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);

        // MAKE FUNCTION
        emojiContainer.style.display = "none";
        emojiContainer.style.opacity = '0';
        notesFlags.emojiContainerShowing = false;
        // MAKE FUNCTION

        flags.updateLabelWindowOpen = false;
    })
    
    createLabelDone.addEventListener("click", function(event) {
        //take user input and turn into a label selection element
        if ((createLabelInput.value !== "") && (containsNonSpaceChar(createLabelInput.value))) {

            // Checking for uniqueness
            let isUnique = true;
            let currentSelectionTags = document.querySelectorAll('.selection-tag');
            currentSelectionTags.forEach(tag => {
                let labelName = tag.firstElementChild.textContent;
                if (labelName === (createLabelInput.value).trim()) {
                    alert("The label '" + labelName + "' already exists!");
                    isUnique = false;
                }
            })

            // Ensuring entry is not more than 42 letters
            if (((createLabelInput.value).trim()).length > 42) {
                alert("Oops! Your label seems a bit too long. Could you please make it 42 characters or shorter? Thank you!");
                return; //allows user to basically retry
            }

            if (isUnique) {
                // Label Creation Process
                let labelName = createLabelInput.value;
                let innerHTMLString = "<h4 class='tag-text'>" + labelName + "</h4>";
                
                let selectionDiv = document.createElement('div');
                selectionDiv.className = 'tag unselectable selection-tag';
                selectionDiv.innerHTML = innerHTMLString;
                
                counters.lastLabelIdNum += 1;
                selectionDiv.id = "tag-" + (counters.lastLabelIdNum);
    
                labelSelectionRow.insertBefore(selectionDiv, addDoneContainer);


                // REPLACES Emoji Btn Picture W/ Last Selected Emoji!
                if (state.lastSelectedEmojiId !== null) {
                    // get path of src for last selected emoji id
                    // assign that path to the OGemoji id (represents the emoji btn)
                    let emojiImgPath = document.getElementById(state.lastSelectedEmojiId).src;
                    emojiImg.src = emojiImgPath; // for add label container
                    emojiImg2.src = emojiImgPath; // for update label container
                }
            }

            flags.createLabelWindowOpen = false;
        }

        //MAKE THIS A FUNCTION
        if (flags.tagSelection === false) {
            tagSelectionDivider.style.display = 'flex';
            addDoneContainer.style.marginLeft = '';
            flags.tagSelection = true;
        }
        //MAKE THIS A FUNCTION

        // MAKE FUNCTION
        emojiContainer.style.display = "none";
        emojiContainer.style.opacity = '0';
        notesFlags.emojiContainerShowing = false;
        // MAKE FUNCTION
        
        //go back to label selection window
        createLabelInput.value = "";
        backToLabelSelection(createLabelContainer, createLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);
    })

    updateLabelDone.addEventListener("click", function(event) {
        //take user input and turn into a label selection element
        if ((updateLabelInput.value !== "") && (containsNonSpaceChar(updateLabelInput.value))) {

            // Checking for uniqueness
            let isUnique = true;
            let elementToUpdateName = (document.getElementById(state.elementToUpdateId)).innerText.trim();
            let currentSelectionTags = document.querySelectorAll('.selection-tag');
            currentSelectionTags.forEach(tag => {
                let labelName = tag.firstElementChild.textContent;
                if ((labelName === (updateLabelInput.value).trim()) && (elementToUpdateName !== (updateLabelInput.value).trim())) {
                    alert("The label '" + labelName + "' already exists!");
                    isUnique = false;
                }
            })

            if (isUnique === false) {
                return;
            }

            // Ensuring entry is not more than 42 letters
            if (((updateLabelInput.value).trim()).length > 42) {
                alert("Oops! Your label seems a bit too long. Could you please make it 42 characters or shorter? Thank you!");
                return; //allows user to basically retry
            }

            // Label Update Process
            document.getElementById(state.elementToUpdateId).firstElementChild.textContent = (updateLabelInput.value).trim();

            // REPLACES Emoji Btn Picture W/ Last Selected Emoji!
            if (state.lastSelectedEmojiId !== null) {
                // get path of src for last selected emoji id
                // assign that path to the OGemoji id (represents the emoji btn)
                let emojiImgPath = document.getElementById(state.lastSelectedEmojiId).src;
                emojiImg.src = emojiImgPath; // for add label container
                emojiImg2.src = emojiImgPath; // for update label container
            }

            flags.updateLabelWindowOpen = false;
        }

        //MAKE THIS A FUNCTION
        if (flags.tagSelection === false) {
            tagSelectionDivider.style.display = 'flex';
            addDoneContainer.style.marginLeft = '';
            flags.tagSelection = true;
        }
        //MAKE THIS A FUNCTION

        // MAKE FUNCTION
        emojiContainer.style.display = "none";
        emojiContainer.style.opacity = '0';
        notesFlags.emojiContainerShowing = false;
        // MAKE FUNCTION
        
        //go back to label selection window
        updateLabelInput.value = "";
        backToLabelSelection(updateLabelContainer, updateLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);
    })

    emojiBtn.addEventListener("click", function() {
        // console.log("emoji btn was pressed");
        
        if (!notesFlags.emojiContainerShowing) {
            emojiContainer.style.display = "block";
            setTimeout(() => {
                emojiContainer.classList.add('emojiPopup');
                emojiContainer.style.opacity = '1';
            }, 1);
            
            notesFlags.emojiContainerShowing = true;
        } else {
            // MAKE FUNCTION
            emojiContainer.style.display = "none";
            emojiContainer.style.opacity = '0';
            notesFlags.emojiContainerShowing = false;
            // MAKE 
        }
    })

    emojiBtn2.addEventListener("click", function() {
        console.log("emoji btn 2 was pressed");

        if (!notesFlags.emojiContainerShowing) {
            emojiContainer.style.display = "block";
            setTimeout(() => {
                emojiContainer.classList.add('emojiPopup');
                emojiContainer.style.opacity = '1';
            }, 1);

            notesFlags.emojiContainerShowing = true;
        } else {

            console.log("else statement executed");
            // MAKE FUNCTION
            emojiContainer.style.display = "none";
            emojiContainer.style.opacity = '0';
            notesFlags.emojiContainerShowing = false;
            // MAKE 
        }
    })

    createLabelWindow.addEventListener("click", function() {
        createLabelInput.focus();
    })

    updateLabelWindow.addEventListener("click", function() {
        updateLabelInput.focus();
    })
    
    emojiContainer.addEventListener("click", function() {
        if (flags.createLabelWindowOpen) {
            createLabelInput.focus();
        } else if (flags.updateLabelWindowOpen) {
            updateLabelInput.focus();
        }
    })

    // setting up event listeners to insert emoji selected from emoji container
    // into the label creation input
    emojiSymbols.forEach(symbol => {
        symbol.addEventListener("click", function() {
            let targetEmojiId = symbol.id;
            let emojiToInsert = emojiMap[targetEmojiId];
            let inputField;
    
            if (flags.createLabelWindowOpen) {
                inputField = createLabelInput;
            } else if (flags.updateLabelWindowOpen) {
                inputField = updateLabelInput;
            }
    
            if (inputField) {
                insertAtCaret(inputField, emojiToInsert);
            }
    
            // Keep track of last selected emoji
            state.lastSelectedEmojiId = targetEmojiId;
    
            // Then trigger close of menu
            emojiContainer.style.display = "none";
            notesFlags.emojiContainerShowing = false;
        });
    });
    
    document.addEventListener("click", function(event) {
        if ((!emojiContainer.contains(event.target)) && (event.target !== emojiImg) && (event.target !== emojiImg2) && (emojiContainer.style.display === "block")) {
            emojiContainer.style.display = "none";
            notesFlags.emojiContainerShowing = false;
        }
    })

    window.addEventListener('resize', function() {
        setEmojiContainerPointLocation(this.window.innerWidth, emojiContainer, notesFlags, isMobile);
    });

    transitionNotesAutoSwitchToggle.addEventListener('click', function() {
        if (transitionNotesAutoSwitchToggle.checked) {
            flags.transitionNotesAutoSwitchToggle = true;
        } else {
            flags.transitionNotesAutoSwitchToggle = false;
        }
    })

    tutorialImgContainers.forEach(container => {
        container.addEventListener('mouseover', function() {
            let targetIdStr = container.id;
            let labelInstructionsId = tutorialContainerMap[targetIdStr];

            document.getElementById(labelInstructionsId).classList.add('fullOpacity');
        })

        container.addEventListener('mouseout', function() {
            let targetIdStr = container.id; // or maybe just container.id??
            let labelInstructionsId = tutorialContainerMap[targetIdStr];

            document.getElementById(labelInstructionsId).classList.remove('fullOpacity');
        })
    })

    aboutIconNotes.addEventListener("click", function() {
        settings_menu_container.click();
        setTimeout(() => {
            notesBtnContainer.click();
        }, 0)
    });

    // ---------------------
    // HELPER FUNCTIONS 1
    // ---------------------
    function done() {
        notesConsole.style.display = "block";
        labelSelectionWindow.style.display = "none";
        if (counters.tagsSelected === 0) {
            tagIcon.style.marginLeft = '';
            tagIcon.classList.remove('tagToLeftSide');
            promptContainer.style.width = '';
            taskPrompt.style.display = "block";
            tagIcon.style.marginRight = '10px';
            promptContainer.style.zIndex = 5;
        }
        tagIcon.classList.remove('blink');

        // If auto switch is turned on, auto switch modes based on presence of labels
        if (flags.transitionNotesAutoSwitchToggle) {
            if (((flags.tagSelected) && (start_stop_btn.innerText === "Start")) || ((!flags.tagSelected) && (start_stop_btn.innerText === "Stop"))) {
                start_stop_btn.click();
            }
        }

        if (flags.noteTaskInputContainerShowing) {
            noteTaskInputText.focus();
        }

        if (flags.noteTaskInputContainerEditShowing) {
            document.getElementById('note-task-input-text-edit').focus();
        }

        notesFlags.notesConsoleShowing = true;
    }

    function addNewTag() {
        // console.log("Adding new tag");
        
        //hide clear icon
        clearIcon.style.display = "none";
        
        //hide prompt container (also includes tag icon)
        promptContainer.style.display = "none";
        
        //hide label-input-container
        labelInputContainer.style.display = "none";
        
        //hide label-selection-window
        labelSelectionWindow.style.display = "none";
        
        //show create-label-container
        createLabelContainer.style.display = "flex";
        
        //show create-label-window
        createLabelWindow.style.display = "block";
        flags.createLabelWindowOpen = true;

        //focus on input
        createLabelInput.focus();
    }

    function updateLabel(target) {
        // console.log(target);
        
        //hide clear icon
        clearIcon.style.display = "none";

        //hide prompt container (also includes tag icon)
        promptContainer.style.display = "none";

        //hide label-input-container
        labelInputContainer.style.display = "none";

        //hide label-selection-window
        labelSelectionWindow.style.display = "none";

        //show create-label-container
        updateLabelContainer.style.display = "flex";

        //show create-label-window
        updateLabelWindow.style.display = "block";
        flags.updateLabelWindowOpen = true;

        //insert chosen label text into input
        let toUpdateTagId;
        if ((target.className === 'tag-text') || (target.className = 'tag-text deleteJiggling')) {
            toUpdateTagId = target.parentElement.id;
        } else {
            toUpdateTagId = target.id;
        }

        updateLabelInput.value = (document.getElementById(toUpdateTagId).innerText).trim();
        state.elementToUpdateId = toUpdateTagId;

        //focus on input
        updateLabelInput.focus();
    }
})

// ---------------------
// HELPER FUNCTIONS 2
// ---------------------
function getTypeFromId(id) {
    // Regular expression to match "editBtn" or "editIcon" followed by "Note" or "Task" and then by any number of digits
    const match = id.match(/(editBtn|editIcon)(Note|Task)\d+/);
  
    // If there's a match, return the part that corresponds to "Note" or "Task"
    if (match && match[2]) {
      return match[2];
    } else {
      // Return null or an appropriate value if the ID doesn't match the expected pattern
      return null;
    }
}

function autoExpandEdit(textarea) {
    console.log("input")
    textarea.style.height = '24px';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function buildNoteTaskInputContainerEdit(noteTaskDivContent) {
    // Create the main container
    const noteTaskInputContainer = document.createElement('div');
    noteTaskInputContainer.id = "note-task-input-container-edit";

    // Create upper half container
    const upperHalfNoteTaskInput = document.createElement('div');
    upperHalfNoteTaskInput.id = "upper-half-note-task-input-edit";

    // Create the textarea
    const noteTaskInputText = document.createElement('textarea');
    noteTaskInputText.id = "note-task-input-text-edit";
    noteTaskInputText.placeholder = "Description";
    noteTaskInputText.value = noteTaskDivContent;

    // Append textarea to upper half container
    upperHalfNoteTaskInput.appendChild(noteTaskInputText);

    // Create lower half container
    const lowerHalfNoteTaskInput = document.createElement('div');
    lowerHalfNoteTaskInput.id = "lower-half-note-task-input-edit";

    // Create save-cancel container
    const saveCancelContainer = document.createElement('div');
    saveCancelContainer.id = "save-cancel-container-edit";

    // Create note input save container
    const noteInputSaveContainer = document.createElement('div');
    noteInputSaveContainer.id = "note-input-save-container-edit";
    noteInputSaveContainer.classList.add("save-cancel-task-container");

    // Create save button
    const noteInputSaveBtn = document.createElement('div');
    noteInputSaveBtn.id = "note-input-save-btn-edit";
    noteInputSaveBtn.textContent = "Save";

    // Append save button to its container
    noteInputSaveContainer.appendChild(noteInputSaveBtn);

    // Create note input cancel container
    const noteInputCancelContainer = document.createElement('div');
    noteInputCancelContainer.id = "note-input-cancel-container-edit";
    noteInputCancelContainer.classList.add("save-cancel-task-container");

    // Create cancel button
    const noteInputCancelBtn = document.createElement('div');
    noteInputCancelBtn.id = "note-input-cancel-btn-edit";
    noteInputCancelBtn.textContent = "Cancel";

    // Append cancel button to its container
    noteInputCancelContainer.appendChild(noteInputCancelBtn);

    // Append all containers to the save-cancel container
    saveCancelContainer.appendChild(noteInputSaveContainer);
    saveCancelContainer.appendChild(noteInputCancelContainer);

    lowerHalfNoteTaskInput.appendChild(saveCancelContainer);

    // Append upper and lower halves to the main container
    noteTaskInputContainer.appendChild(upperHalfNoteTaskInput);
    noteTaskInputContainer.appendChild(lowerHalfNoteTaskInput);

    // Finally, append the main container to the body or another element in your document
    return noteTaskInputContainer;
}

/** 
 * @param {string} inputType === "note" or "task"
 */
function editNoteTask(inputType, noteTaskId, state, flags) {
    // Hide noteDiv or taskDiv
    state.currentNoteTaskEditId = noteTaskId;
    const noteTaskDiv = document.getElementById(noteTaskId);
    let noteTaskDivContent = (document.getElementById(noteTaskId)).querySelector('span').innerText;

    noteTaskDiv.style.display = "none";

    let noteTaskInputContainer = buildNoteTaskInputContainerEdit(noteTaskDivContent);
    noteTaskInputContainer.style.display = "flex";

    // Get the element just above the one you want to hide
    let elementAbove = noteTaskDiv.previousElementSibling;

    // If there's an element above, insert the container after this element
    if (elementAbove) {
        elementAbove.parentNode.insertBefore(noteTaskInputContainer, elementAbove.nextSibling);
    } else {
        // If there is no element above, it means the noteTaskDiv is the first child
        // Insert the noteTaskInputContainer at the beginning of the parent container
        noteTaskDiv.parentNode.insertBefore(noteTaskInputContainer, noteTaskDiv);
    }

    flags.noteTaskInputContainerEditShowing = true;

    // ensuring textarea changes height dynamically at start and w/ each input
    document.getElementById('note-task-input-text-edit').addEventListener('input', function(event) {
        autoExpandEdit(document.getElementById('note-task-input-text-edit'));
    });
    autoExpandEdit(document.getElementById('note-task-input-text-edit'));

    noteTaskInputContainer.querySelector('textarea').focus();
}

function appendEditRemoveContainer(inputType, lastIdNum) {
    const container = document.createElement('div'); //for edit remove container
    container.classList.add('editRemoveContainer');

    let containerIdStr = "editRemoveContainer" + inputType + lastIdNum;
    container.id = containerIdStr;

    // Create edit button div
    const editBtn = document.createElement('div');
    editBtn.classList.add('editRemoveBtn');
    editBtn.classList.add('editBtn');

    let editBtnIdStr = "editBtn" + inputType + lastIdNum;
    editBtn.setAttribute('id', editBtnIdStr);

    // Create IMG for edit button
    const editImg = document.createElement('img');

    let editImgIdStr = "editIcon" + inputType + lastIdNum;
    editImg.id = editImgIdStr;

    editImg.classList.add("editIcon");
    editImg.src = 'images/icons/whitepencil.png';
    editImg.draggable = false;

    // Append SVG to edit button div
    editBtn.appendChild(editImg);

    // Create remove button div
    const removeBtn = document.createElement('div');
    removeBtn.classList.add('editRemoveBtn');
    removeBtn.classList.add('removeBtn');

    let removeBtnIdStr = "removeBtn" + inputType + lastIdNum;
    removeBtn.setAttribute('id', removeBtnIdStr);

    // Create SVG for remove button
    const trashSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    trashSvg.classList.add('editRemoveSvg');
    trashSvg.classList.add('removeSvg');

    let trashSvgIdStr = "trashSvg" + inputType + lastIdNum;
    trashSvg.setAttribute('id', trashSvgIdStr);

    trashSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    trashSvg.setAttribute('width', '24');
    trashSvg.setAttribute('height', '24');
    trashSvg.setAttribute('viewBox', '0 0 24 24');
    trashSvg.setAttribute('fill', 'none');
    trashSvg.setAttribute('stroke', 'currentColor');
    trashSvg.setAttribute('stroke-width', '2');
    trashSvg.setAttribute('stroke-linecap', 'round');
    trashSvg.setAttribute('stroke-linejoin', 'round');

    let polylineIdStr = "polyline" + inputType + lastIdNum;
    let pathIdStr = "path" + inputType + lastIdNum;
    let line1IdStr = "line1" + inputType + lastIdNum;
    let line2IdStr = "line2" + inputType + lastIdNum;

    trashSvg.innerHTML = `<polyline id="${polylineIdStr}" class="removePath" points="3 6 5 6 21 6"></polyline>
                        <path id="${pathIdStr}" class="removePath" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line id="${line1IdStr}" class="removePath" x1="10" y1="11" x2="10" y2="17"></line>
                        <line id="${line2IdStr}" class="removePath" x1="14" y1="11" x2="14" y2="17"></line>`;

    // Append SVG to remove button div
    removeBtn.appendChild(trashSvg);

    // Append both buttons to the container
    container.appendChild(editBtn);
    container.appendChild(removeBtn);

    return container;
}

function getLastNumberFromId(targetId) {
    const match = targetId.match(/\d+$/); // Match one or more digits at the end of the string
    if (match) {
        return parseInt(match[0], 10); // Convert the matched string to a number
    } else {
        return null; // or any other default value you see fit
    }
}

function closeNotesContainer(notesContainer, notesFlags, flags, noteInputCancelBtn) {

    if (flags.noteTaskInputContainerShowing) {
        noteInputCancelBtn.click();
        flags.noteTaskInputContainerShowing = false;
    }

    notesContainer.classList.remove('fullsize');
    notesContainer.classList.remove('fullopacity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notesFlags.notesShowing = false;
}

function openNotesContainer(notesContainer, notesFlags) {
    notesContainer.classList.add('fullsize');
    notesContainer.classList.add('fullopacity');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    notesFlags.notesShowing = true;
}

function noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText) {
    noteTaskInputContainer.style.display = 'none';
    addNoteTaskContainer.style.display = 'flex';
    flags.noteTaskInputContainerShowing = false;
    noteTaskInputText.value = "";
}

// Gets the current position of the caret within the input field and then using that position to insert the emoji.
function insertAtCaret(inputField, textToInsert) {
    // Check if inputField is focused
    if (document.activeElement !== inputField) {
        inputField.focus();
    }

    const startPos = inputField.selectionStart;
    const endPos = inputField.selectionEnd;
    const beforeText = inputField.value.substring(0, startPos);
    const afterText = inputField.value.substring(endPos, inputField.value.length);

    // Insert text at the current caret position
    inputField.value = beforeText + textToInsert + afterText;

    // Move the caret to after the inserted text
    const newPos = startPos + textToInsert.length;
    inputField.setSelectionRange(newPos, newPos);
}

function setEmojiContainerPointLocation(innerWidth, emojiContainer, notesFlags, isMobile) {
    let firstActionWidth;
    if (isMobile) {
        firstActionWidth = 600;
    } else {
        firstActionWidth = 616;
    }

    if (innerWidth < 450) {
        emojiContainer.style.display = "none";
        notesFlags.emojiContainerShowing = false;
    }

    if (innerWidth < firstActionWidth) {
        let percentageStr = (45 + (((firstActionWidth - 1) - innerWidth) / 4.3)) + '%';
        emojiContainer.style.setProperty('--after-left', percentageStr);
        // console.log(percentageStr)
    } else {
        emojiContainer.style.setProperty('--after-left', '45%');
    }
}

function containsNonSpaceChar(input) {
    return /[^\s]/.test(input);
}

function backToLabelSelection(labelContainer, labelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags) {
    //hide create label container and window
    labelContainer.style.display = "none";
    labelWindow.style.display = "none";

    //reset back to label selection window and prompt container and label input container
    //hide or show clear icon depending on presence of labels in the label input area

    if (flags.tagSelected) {
        clearIcon.style.display = "flex";
    } else {
        clearIcon.style.display = "none";
    }
    promptContainer.style.display = "flex";
    labelInputContainer.style.display = "flex";
    labelSelectionWindow.style.display = "block";
}

function deselectTags(tag, flags, tagIcon, clearIcon, labelSelectionRow, counters, tagSelectionDivider, addDoneContainer) {
    let selectedTagId;
    let innerHTML;

    if ((tag.className === 'tag-text')) {
        selectedTagId = tag.parentElement.id;
        innerHTML = tag.parentElement.innerHTML;
    } else {
        selectedTagId = tag.id;
        innerHTML = tag.innerHTML;
    }

    let previousSibling = document.getElementById(selectedTagId).previousElementSibling;
    let nextSibling = document.getElementById(selectedTagId).nextElementSibling;

    if ((previousSibling) && (previousSibling.tagName.toLowerCase() === 'h4')) {
        previousSibling.remove();
    } else if ((nextSibling) && (nextSibling.tagName.toLowerCase() === 'h4')) {
        nextSibling.remove();
    } else {
        flags.tagSelected = false;
        tagIcon.classList.add('blink');
        tagIcon.style.display = 'block';

        if (!flags.clearIconClicked) {
            clearIcon.style.display = 'none';
        }
    }

    document.getElementById(selectedTagId).remove();

    // place tag back in selection area
    let selectionDiv = document.createElement('div');
    selectionDiv.className = 'tag unselectable selection-tag';
    selectionDiv.innerHTML = innerHTML;
    // console.log(innerHTML);
    selectionDiv.id = selectedTagId;
    selectionDiv.firstElementChild.style.backgroundColor = '';
    // console.log(selectionDiv.id);

    labelSelectionRow.insertBefore(selectionDiv, labelSelectionRow.firstChild);
    counters.tagsSelected--;

    //if there weren't any tags left in the selection window, add the selection divider '|'
    //and remove the margin-left value and indicate that there's tags in the selection window
    //MAKE THIS A FUNCTION
    if (flags.tagSelection === false) {
        tagSelectionDivider.style.display = 'flex';
        addDoneContainer.style.marginLeft = '';
        flags.tagSelection = true;
    }
}

function handleTaskEnter_or_n(event, notesFlags, notesContainer, createLabelInput, createLabelDone, updateLabelInput, updateLabelDone, noteInputSaveBtn, noteTaskInputText, noteInputCancelBtn, addNoteTaskContainer, flags) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        if (document.activeElement === createLabelInput) {
            createLabelDone.click();
        } else if (document.activeElement === updateLabelInput) {
            updateLabelDone.click();
        } else if (document.activeElement === noteTaskInputText) {
            noteInputSaveBtn.click();
        } else if (document.activeElement.id === 'note-task-input-text-edit') {
            document.getElementById('note-input-save-btn-edit').click();
        }
    } else if (event.key === 'n') {
        if (!notesFlags.notesShowing) {
            openNotesContainer(notesContainer, notesFlags);
        } else if ((!flags.noteTaskInputContainerShowing) && (!flags.noteTaskInputContainerEditShowing)) {
            addNoteTaskContainer.click();
            taskCheckbox.checked = false;
            event.preventDefault();
        }
    }  else if ((event.key === 't') && (notesFlags.notesShowing) && (!flags.noteTaskInputContainerShowing) && (!flags.noteTaskInputContainerEditShowing)) {
        addNoteTaskContainer.click();
        taskCheckbox.checked = true;
        event.preventDefault();
    }
    
    else if ((event.key === 'Escape') && (notesFlags.notesShowing)) {
        if (document.activeElement === noteTaskInputText) {
            noteInputCancelBtn.click();
        } else {
            closeNotesContainer(notesContainer, notesFlags, flags, noteInputCancelBtn);
        }
    }
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}