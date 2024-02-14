document.addEventListener("DOMContentLoaded", function() {
    //Redesign edit

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
        noteInputs: 0
    }

    let state = {
        currentNoteInputId: null,
        currentNoteTimeId: null,
        lastNotesLineTime: null,
        currentLabelInputTagSize: 20,
        generalTarget: null,
        lastSelectionElement: null,
        lastSelectedEmojiId: null,
        elementToUpdateId: null
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
        noteTaskInputContainerShowing: false
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

        if (taskCheckbox.checked) {
            // make a new task div
            noteTaskDiv.innerText = inputStr;
        } else {
            // make a new note div
            noteTaskDiv.innerText = inputStr;
        }

        dynamicList.appendChild(noteTaskDiv);

        // Scroll the new noteTaskDiv into view
        setTimeout(() => {
            notesConsole.scrollTo({ top: notesConsole.scrollHeight, behavior: 'smooth' });
        }, 0);

        noteTaskInputText.value = "";
        noteTaskInputText.focus();
    })

    noteInputCancelBtn.addEventListener('click', function() {
        noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
    })

    addNoteTaskContainer.addEventListener('click', function() {
        console.log('add note task container clicked');
        addNoteTaskContainer.style.display = 'none';
        noteTaskInputContainer.style.display = 'flex';

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
    // autoExpand();
















    notesBtn.addEventListener("click", function() {
        if (notesFlags.notesShowing === false) {
            openNotesContainer(notesContainer, notesFlags);
        } else {
            closeNotesContainer(notesContainer, notesFlags);
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
function closeNotesContainer(notesContainer, notesFlags) {
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
        }
    } else if (event.key === 'n') {
        if (!notesFlags.notesShowing) {
            openNotesContainer(notesContainer, notesFlags);
        } else if (!flags.noteTaskInputContainerShowing) {
            addNoteTaskContainer.click();
            taskCheckbox.checked = false;
            event.preventDefault();
        }
    }  else if ((event.key === 't') && (notesFlags.notesShowing) && (!flags.noteTaskInputContainerShowing)) {
        addNoteTaskContainer.click();
        taskCheckbox.checked = true;
        event.preventDefault();
    }
    
    else if ((event.key === 'Escape') && (notesFlags.notesShowing)) {
        if (document.activeElement === noteTaskInputText) {
            noteInputCancelBtn.click();
        } else {
            closeNotesContainer(notesContainer, notesFlags);
        }
    }
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}