import {
    notesContainer, taskContainer, promptContainer, labelInputContainer, createLabelContainer, createLabelWindow, createLabelInput, createLabelDone, createLabelCancel, updateLabelContainer, updateLabelWindow, updateLabelInput, updateLabelCancel, updateLabelDone, labelSelectionWindow, labelSelectionRow, clearIcon, notesBtn, notesConsole, taskPrompt, tagIcon, tagSelection, tagSelectionDivider, addDoneContainer, selectionDoneDiv, selectionDone, addTagIcon, emojiBtn, emojiBtn2, emojiImg, emojiImg2, emojiContainer, emojiSymbols, transitionNotesAutoSwitchToggle, start_stop_btn, tutorialImgContainers, aboutIconNotes, settings_menu_container, notesBtnContainer, notesSettingsHr1, notesSettingsHr2, addingDeletingUpdatingLabelsInfoBlock, addNoteTaskContainer, noteTaskInputContainer, noteTaskInputText, noteInputCancelBtn, noteInputSaveBtn, taskCheckbox, dynamicList, textarea, settingsContainer, aboutContainer, blogContainer, main_elements, isMobile, propagateUnfinishedTasksToggle, clearNotesConsoleBtn, body,
    confirmLabelDeletionPopup,
    popupOverlay,
    confirmLabelDeletionNoBtn,
    confirmLabelDeletionYesBtn,
    labelToDeleteContainer,
    confirmLabelDeletionText,
    timestampsToggle
} from '../modules/dom-elements.js';
import { flags as indexflags } from '../modules/index-objects.js';
import { state as navigationState, flags as navFlags } from '../modules/navigation-objects.js';
import { notesFlags, counters, state, flags, emojiMap, tutorialContainerMap, fontSizeArr, fontNumArr, labelDict, notesArr, selectedLabelDict, labelFlags, labelArrs } from '../modules/notes-objects.js';
import { sessionState } from '../modules/state-objects.js';

import { updateUserSettings } from '../state/update-settings.js'; // minified
import { updateLabels } from '../state/update-labels.js'; // minified
import { updateDeletedLabels } from '../state/update-deleted-labels.js'; // minified
import { updateNotes } from '../state/update-notes.js'; // minified

// main event listener
document.addEventListener("stateUpdated", function() {
    // ---------------------
    // HELPER FUNCTIONS 1
    // ---------------------


    // spanTimestamps.forEach(timestamp => {
    //     timestamp.style.display = 'none';
    //     timestamp.style.border = '2px solid white';
    //     console.log(timestamp)
    // })

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
            if ((flags.tagSelected && !indexflags.inHyperFocus) || (!flags.tagSelected && indexflags.inHyperFocus)) {
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

    //set initial emoji container point location
    setEmojiContainerPointLocation(window.innerWidth, emojiContainer, notesFlags, isMobile);

    // we just happened to decide to dynamically populate labels container, even for non-logged in user 🤷‍♂️
    if (sessionState.loggedIn) {
        modifyConfirmLabelDeletionText(confirmLabelDeletionText);
    } else {
        populateTaskLabelContainer(); // populates task label container w/ default labels
    }

    // initialize labelFlags w/ current label names

    if (isMobile) {
        aboutIconNotes.style.display = "none";
        notesSettingsHr1.style.display = "none";
        notesSettingsHr2.style.display = "none";
        addingDeletingUpdatingLabelsInfoBlock.style.display = "none";
    }
    // //
    // BEGINNING OF EVENT LISTENER SECTION
    // //

    dynamicList.addEventListener('click', function(event) {
        let target = event.target;
        let targetId = target.id;

        if ((target.className.baseVal === 'check') || (target.className.baseVal === 'svgCheck')) {
            checkOrUncheckTask(targetId);

        } else if ((target.classList.contains("editRemoveBtn")) || (target.classList.contains("editRemoveSvg")) || (target.classList.contains("editIcon")) || (target.classList.contains("removePath"))) {

            if ((target.classList.contains('editBtn')) || (target.classList.contains('editIcon'))) {
                handleEditBtnClick(targetId, flags, noteTaskInputContainer, addNoteTaskContainer, state);

            } else if ((target.classList.contains('removeBtn')) || (target.classList.contains('removeSvg')) || (target.classList.contains('removePath'))) {
                handleRemoveBtnClick(targetId);
            }
        } else if ((targetId === "note-input-save-btn-edit") || (targetId === "note-input-cancel-btn-edit")) {
            if (targetId === "note-input-save-btn-edit") {
                noteInputSaveBtnClick_editMode(state, flags);
            } else if (targetId === "note-input-cancel-btn-edit") {
                noteInputCancelBtnClick_editMode(state, flags);
            }
        }
    })

    taskCheckbox.addEventListener('click', function() {
        noteTaskInputText.focus();
    })

    function autoExpand() {
        textarea.style.height = '24px';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    noteInputSaveBtn.addEventListener('click', function() {

        noteInputSave(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText, taskCheckbox, counters, dynamicList);

        // Scroll the new noteTaskDiv into view
        setTimeout(() => {
            notesConsole.scrollTo({ top: notesConsole.scrollHeight, behavior: 'smooth' });
        }, 0);

        // Reset noteTaskInput
        noteTaskInputText.value = "";
        noteTaskInputText.focus();
        autoExpand();
    })

    noteInputCancelBtn.addEventListener('click', function() {
        noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
        autoExpand(); // resets input container to original size for next input
    })

    addNoteTaskContainer.addEventListener('click', function() {
        addNoteTaskContainer.style.display = 'none';
        noteTaskInputContainer.style.display = 'flex';

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

    textarea.addEventListener('input', autoExpand);

    notesBtn.addEventListener("click", function() {
        if (notesFlags.notesShowing === false) {
            openNotesContainer(notesContainer, notesFlags);
        } else {
            closeNotesContainer(notesContainer, notesFlags, isMobile);
        }
    })
    
    document.addEventListener('keydown', (event) => handleTaskEnter_or_n(event, notesFlags, notesContainer, createLabelInput, createLabelDone, updateLabelInput, updateLabelDone, noteInputSaveBtn, noteTaskInputText, noteInputCancelBtn, addNoteTaskContainer, flags, isMobile, settingsContainer, aboutContainer, blogContainer, main_elements));
    
    clearIcon.addEventListener("click", async function() {

        let tagDivs = document.querySelectorAll('.selected-tag .tag-text');
        tagDivs.forEach(tag => { // resetting font size back to default 20px
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
        
        // query select all w/ className 'tag unselectable selected-tag'
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

        if ((event.key === 'Shift') && (!flags.shiftPressed) && (target)) {
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

            if ((state.lastSelectionElement !== null) && (state.labelToDeleteId === null)) {
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
        if (!((target.classList.contains('tag-text')) && ((flags.shiftPressed) || (flags.altPressed)) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) && (state.lastSelectionElement !== null) && (state.labelToDeleteId === null)) {
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
                deleteLabel(target, addDoneContainer, tagSelectionDivider, flags);
                return;
            } else if ((flags.altPressed) || ((flags.altPressed) && (flags.shiftPressed))) {
                updateLabel(target);
            } else {
                if (counters.tagsSelected === 5) {
                    alert("You've reached your max limit of 5 labels");
                } else {
                    addLabelToInputContainer(target);
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
        removeLabelFromInputContainer(target);
    })

    createLabelCancel.addEventListener("click", function(event) {
        //clear the input
        createLabelInput.value = "";
        
        backToLabelSelection(createLabelContainer, createLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);

        hideEmojiContainer(emojiContainer, notesFlags);

        flags.createLabelWindowOpen = false;
    })

    updateLabelCancel.addEventListener("click", function(event) {
        //clear the input
        updateLabelInput.value = "";
        
        backToLabelSelection(updateLabelContainer, updateLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);

        hideEmojiContainer(emojiContainer, notesFlags);

        flags.updateLabelWindowOpen = false;
    })
    
    createLabelDone.addEventListener("click", function(event) {
        //take user input and turn into a label selection element
        if ((createLabelInput.value !== "") && (containsNonSpaceChar(createLabelInput.value))) {

            // Ensure that there's no more than 100 labels
            // if number of labels === 100, then alert user and return
            let totalLabelCount = Object.keys(labelDict).length;
            if (totalLabelCount >= 100) {
                alert("You've reached your limit of 100 labels. If you'd like to add more labels, you can delete other labels by holding shift and clicking on the label you'd like to delete.");
                createLabelCancel.click();
                return;
            }

            let isUnique = checkLabelIsUnique(createLabelInput);

            // Ensuring entry is not more than 42 letters
            if (((createLabelInput.value).trim()).length > 42) {
                alert("Oops! Your label seems a bit too long. Could you please make it 42 characters or shorter? Thank you!");
                return; //allows user to basically retry
            }

            if (isUnique) {
                createLabel(createLabelInput, counters, labelSelectionRow, addDoneContainer); // where we actually add label to document + update labelDict
                replaceEmoji(state, emojiImg, emojiImg2);

                if (sessionState.loggedIn) {
                    const labelArr = [labelDict, selectedLabelDict, counters.lastLabelIdNum, state.lastSelectedEmojiId];
                    updateLabels(labelArr);
                }
            }

            flags.createLabelWindowOpen = false;

            // update database with label list including new addition
        }

        showTagSelectionDivider(flags, tagSelectionDivider, addDoneContainer);

        hideEmojiContainer(emojiContainer, notesFlags);
        
        //go back to label selection window
        createLabelInput.value = "";
        backToLabelSelection(createLabelContainer, createLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags);
    })

    updateLabelDone.addEventListener("click", function(event) {
        //take user input and turn into a label selection element
        if ((updateLabelInput.value !== "") && (containsNonSpaceChar(updateLabelInput.value))) {

            let isUnique = checkIfUpdatedLabelIsUnique(state, updateLabelInput);

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

            replaceEmoji(state, emojiImg, emojiImg2);

            flags.updateLabelWindowOpen = false;

            // edit labelFlags
            const oldLabelName = labelDict[state.elementToUpdateId];
            const newLabelName = updateLabelInput.value;
            renameKey(labelFlags, oldLabelName, newLabelName);

            // edit labelArrs
            renameKey(labelArrs, oldLabelName, newLabelName);

            // edit labelDict
            labelDict[state.elementToUpdateId] = newLabelName;

            if (sessionState.loggedIn) {
                const labelArr = [labelDict, selectedLabelDict, counters.lastLabelIdNum, state.lastSelectedEmojiId];
                updateLabels(labelArr);
            }
        }

        showTagSelectionDivider(flags, tagSelectionDivider, addDoneContainer);

        hideEmojiContainer(emojiContainer, notesFlags);
        
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
            hideEmojiContainer(emojiContainer, notesFlags);
        }
    })

    emojiBtn2.addEventListener("click", function() {
        // console.log("emoji btn 2 was pressed");

        if (!notesFlags.emojiContainerShowing) {
            emojiContainer.style.display = "block";
            setTimeout(() => {
                emojiContainer.classList.add('emojiPopup');
                emojiContainer.style.opacity = '1';
            }, 1);

            notesFlags.emojiContainerShowing = true;
        } else {

            // console.log("else statement executed");

            hideEmojiContainer(emojiContainer, notesFlags);
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

    transitionNotesAutoSwitchToggle.addEventListener('click', async function() {
        if (transitionNotesAutoSwitchToggle.checked) {
            flags.transitionNotesAutoSwitchToggle = true;
        } else {
            flags.transitionNotesAutoSwitchToggle = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                notes: {
                    autoSwitchToggle: flags.transitionNotesAutoSwitchToggle
                }
            });
        }
    })

    propagateUnfinishedTasksToggle.addEventListener('click', async function() {

        if (propagateUnfinishedTasksToggle.checked) {
            flags.propagateUnfinishedTasksToggle = true;
        } else {
            flags.propagateUnfinishedTasksToggle = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                notes: {
                    propagateUnfinishedTasksToggle: flags.propagateUnfinishedTasksToggle
                }
            });
        }
    })

    timestampsToggle.addEventListener('click', async function() {
        const spanTimestamps = document.querySelectorAll('.spanTimestamp');
        const spanArrows = document.querySelectorAll('.spanArrow');
        const spanCompletions = document.querySelectorAll('.spanCompletion');

        if (timestampsToggle.checked) {
            flags.timestampsToggle = true;
            showTimestamps(spanTimestamps, spanArrows, spanCompletions);

        } else {
            flags.timestampsToggle = false;
            hideTimestamps(spanTimestamps, spanArrows, spanCompletions);
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                notes: {
                    timestampsToggle: flags.timestampsToggle
                }
            });
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

    clearNotesConsoleBtn.addEventListener("click", function() {
        let reductionCounter = 0;

        let notesArrLength = notesArr.length;
        for (let i = notesArrLength - 1; i >= 0; i--) {
            // console.log(notesArr[i].id);

            if (flags.propagateUnfinishedTasksToggle) {
                if ((notesArr[i].classList.includes("completed-task")) || (notesArr[i].classList.includes("note"))) {
                    removeNoteFromDocAndArr(notesArr[i].id);
                    reductionCounter++;
                }
            } else {
                removeNoteFromDocAndArr(notesArr[i].id);
                reductionCounter++;
            }
        }

        let lastTaskInputIdNum = counters.lastTaskInputIdNum;
        if (sessionState.loggedIn) {
            const notesObj = {
                notesArr,
                lastTaskInputIdNum
            }
            updateNotes(notesObj);
        }

        if (reductionCounter !== 0) {
            new Notification("The notes console has been reset.");
        } else {
            new Notification("No changes were made to the notes console.");
        }
    })

    confirmLabelDeletionNoBtn.addEventListener("click", function() {
        hideConfirmLabelDeletionPopup(popupOverlay, confirmLabelDeletionPopup, state);
    })

    confirmLabelDeletionYesBtn.addEventListener("click", function() {
        labelDeletion(addDoneContainer, tagSelectionDivider, flags, state);
        hideConfirmLabelDeletionPopup(popupOverlay, confirmLabelDeletionPopup, state);
    })
})

// -------------------
// HELPER FUNCTIONS 2
// -------------------
function hideTimestamps(spanTimestamps, spanArrows, spanCompletions) {

    let timestampElements = [spanTimestamps, spanArrows, spanCompletions];
    timestampElements.forEach(elements => {
        elements.forEach(element => {
            element.style.display = 'none';
        })
    })
}

function showTimestamps(spanTimestamps, spanArrows, spanCompletions) {

    let timestampElements = [spanTimestamps, spanArrows, spanCompletions];
    timestampElements.forEach(elements => {
        elements.forEach(element => {
            element.style.display = 'block';
        })
    })
}

function modifyConfirmLabelDeletionText(confirmLabelDeletionText) {
    confirmLabelDeletionText.innerText = "Are you sure you want to delete the following label and its associated data?";
}

function hideConfirmLabelDeletionPopup(popupOverlay, confirmLabelDeletionPopup, state) {
    flags.confirmLabelDeletionWindowShowing = false;
    state.labelToDeleteId = null;
    popupOverlay.style.display = "none";
    confirmLabelDeletionPopup.style.display = "none";
    body.style.overflowY = 'scroll';
    
    labelToDeleteContainer.removeChild(labelToDeleteContainer.firstChild); // remove label in popup
}

function showConfirmLabelDeletionPopup(labelId, popupOverlay, confirmLabelDeletionPopup, state) {
    flags.confirmLabelDeletionWindowShowing = true;
    state.labelToDeleteId = labelId;
    popupOverlay.style.display = "flex"; 
    confirmLabelDeletionPopup.style.display = "block";
    body.style.overflowY = 'hidden';

    insertLabelToDeleteIntoPopup(labelId); // add label to popup
}

function insertLabelToDeleteIntoPopup(labelId) {
    let labelName = document.getElementById(labelId).firstChild.innerText;
    let innerHTMLString = "<h4 class='tag-text-delete-label-popup'>" + labelName + "</h4>";

    let selectionDiv = document.createElement('div');
    selectionDiv.className = 'tag unselectable selection-tag';
    selectionDiv.innerHTML = innerHTMLString;

    labelToDeleteContainer.appendChild(selectionDiv);
}

function updateLabelArr(labelName, labelArrs, timeStamp) {
    if (!labelArrs[labelName]) {
        labelArrs[labelName] = [];
    }

    labelArrs[labelName].push(timeStamp);
    console.log(labelArrs);
}

function renameKey(obj, oldKey, newKey) {
    if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];  // Create new key with the old key's value
        delete obj[oldKey];         // Delete the old key
    }
}

function removeLabelFromInputContainer(target) {
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
            adjustLabelFontSize(state, fontSizeArr, fontNumArr, labelInputContainer);
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
}

function addLabelToInputContainer(target) {
    counters.tagsSelected++;
    addLabelInputContainerTagDivider(counters, labelInputContainer);
    addLabel(target, labelInputContainer);
    addLabelInitialActions(flags, tagIcon, promptContainer, clearIcon);
    removeTagSelectionDivider(addDoneContainer, tagSelectionDivider, flags);


    if ((labelInputContainer.scrollWidth > labelInputContainer.clientWidth) || (state.currentLabelInputTagSize < 20)) {
        adjustLabelFontSize(state, fontSizeArr, fontNumArr, labelInputContainer);

        if (labelInputContainer.scrollWidth > labelInputContainer.clientWidth) {
            labelInputContainer.style.justifyContent = 'left';
        }
    }
}

function populateTaskLabelContainer() {
    let initialLabelValues = ["✍️ Homework", "📚 Reading", "🧘 Meditation"];

    for (let i = 0; i < initialLabelValues.length; i++) {
        let initialLabelInput = document.createElement('input');
        initialLabelInput.value = initialLabelValues[i];
        createLabel(initialLabelInput, counters, labelSelectionRow, addDoneContainer);
    }
}

function hideEmojiContainer(emojiContainer, notesFlags) {
    emojiContainer.style.display = "none";
    emojiContainer.style.opacity = '0';
    notesFlags.emojiContainerShowing = false;
}

function showTagSelectionDivider(flags, tagSelectionDivider, addDoneContainer) {
    if (flags.tagSelection === false) {
        tagSelectionDivider.style.display = 'flex';
        addDoneContainer.style.marginLeft = '';
        flags.tagSelection = true;
    }
}

function replaceEmoji(state, emojiImg, emojiImg2) {
    // REPLACES Emoji Btn Picture W/ Last Selected Emoji!
    if (state.lastSelectedEmojiId !== null) {
        // get path of src for last selected emoji id
        // assign that path to the OGemoji id (represents the emoji btn)
        let emojiImgPath = document.getElementById(state.lastSelectedEmojiId).src;
        emojiImg.src = emojiImgPath; // for add label container
        emojiImg2.src = emojiImgPath; // for update label container
    }
}

function createLabel(createLabelInput, counters, labelSelectionRow, addDoneContainer) {
    // Label Creation Process
    let labelName = createLabelInput.value;
    let innerHTMLString = "<h4 class='tag-text'>" + labelName + "</h4>";
    
    let selectionDiv = document.createElement('div');
    selectionDiv.className = 'tag unselectable selection-tag';
    selectionDiv.innerHTML = innerHTMLString;
    
    counters.lastLabelIdNum += 1;
    selectionDiv.id = "tag-" + (counters.lastLabelIdNum);

    labelSelectionRow.insertBefore(selectionDiv, addDoneContainer);

    // update labelDict
    labelDict[selectionDiv.id] = labelName;

    // initialize labelFlag
    labelFlags[labelName] = false;

    // initialize labelArr
    labelArrs[labelName] = [];
}

function checkLabelIsUnique(createLabelInput) {
    let isUnique = true;
    let inputVal = createLabelInput.value.trim();
    
    const hasValue = Object.values(labelDict).includes(inputVal);
    
    if (hasValue) {
        alert("The label '" + inputVal + "' already exists!");
        isUnique = false;
    }

    return isUnique;
}

function checkIfUpdatedLabelIsUnique(state, updateLabelInput) {
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

    return isUnique;
}

function noteInputSave(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText, taskCheckbox, counters, dynamicList) {
    let inputStr = noteTaskInputText.value;
    if (inputStr === "") {
        noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
        return;
    }

    // we're checking length of list before addition of new note/ task
    if (dynamicList.children.length >= 100) {
        alert("You've reached your limit of 100 notes/ tasks!");
        noteInputCancel(noteTaskInputContainer, addNoteTaskContainer, flags, noteTaskInputText);
        return;
    }

    // if length of the note/task is 1000 characters or more
    if (isMoreThan1000Chars(inputStr)) {
        alert("Please keep your notes/tasks less than 1000 characters. Thanks!");
        return;
    }

    let container;
    let noteTaskDiv = document.createElement('div');
    noteTaskDiv.classList.add('noteTask');

    let spanTimestamp = document.createElement('span');
    spanTimestamp.classList.add('spanTimestamp');
    let spanTimestampId = "spanTimestamp" + counters.lastTaskInputIdNum;
    spanTimestamp.id = spanTimestampId;

    if (taskCheckbox.checked) { // TASK
        // Create check element and attach to div
        let taskCircularCheckDiv = createCheckElements(counters);
        noteTaskDiv.appendChild(taskCircularCheckDiv);
        noteTaskDiv.classList.add('task');
        container = createNote(inputStr, noteTaskDiv, counters, container, spanTimestamp);

    } else { // NOTE
        // make a new note div
        noteTaskDiv.classList.add('note');
        container = createNote(inputStr, noteTaskDiv, counters, container, spanTimestamp);

    }

    // add timestamp of note/ task creation
    spanTimestamp.textContent = getTimestamp();

    // save note or task to database

    noteTaskDiv.appendChild(container);
    dynamicList.appendChild(noteTaskDiv);

    // id: noteTaskDiv.id
    // classList: noteTaskDiv.classList
    // content: inputStr
    const notesArrObj = {
        id: noteTaskDiv.id,
        classList: [...noteTaskDiv.classList], // convert to string arr
        content: inputStr,
        date: Date.now(),
        completionDate: null
    }
    notesArr.push(notesArrObj);

    let lastTaskInputIdNum = counters.lastTaskInputIdNum;
    if (sessionState.loggedIn) {
        const notesObj = {
            notesArr,
            lastTaskInputIdNum
        }
        updateNotes(notesObj);
    }
}

function getTimestamp() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Add leading zero to minutes if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timestamp = hours + ':' + minutes + ' ' + ampm;
    return timestamp;
}

function isMoreThan1000Chars(inputStr) {
    if (inputStr.length > 1000) {
        return true;
    } else {
        return false;
    }
}

export function addLabelInitialActions(flags, tagIcon, promptContainer, clearIcon) {
    // initial actions if adding first label to label input container
    if (!flags.tagSelected) {
        flags.tagSelected = true;
        tagIcon.style.marginLeft = '5px';
        tagIcon.classList.add('tagToLeftSide');
        promptContainer.style.width = '100%';

        clearIcon.style.display = 'flex';
    }
}

function addLabel(target, labelInputContainer) {
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
    // console.log(innerHTML);

    // Remove tag from selection window
    document.getElementById(selectionTagId).remove();

    // Add tag to label input container
    let selectedDiv = document.createElement('div');
    selectedDiv.className = 'tag unselectable selected-tag';
    selectedDiv.innerHTML = innerHTML;
    selectedDiv.id = selectionTagId;

    selectedDiv.firstElementChild.style.backgroundColor = selectedBackgroundColor;
    labelInputContainer.appendChild(selectedDiv);  

    selectedLabelDict[selectionTagId] = labelDict[selectionTagId]; // update selectedLabelDict

    // set corresponding label in notesFlags to true
    const labelName = selectedLabelDict[selectionTagId];
    labelFlags[labelName] = true;

    // if in hyperFocus (deep work), add timeStamp to labelArr
    let timeStamp = Date.now();
    if (indexflags.inHyperFocus) {
        updateLabelArr(labelName, labelArrs, timeStamp);
    }

    if (sessionState.loggedIn) {
        const labelArr = [labelDict, selectedLabelDict, counters.lastLabelIdNum, state.lastSelectedEmojiId];
        updateLabels(labelArr);
    }
}

export function addLabelInputContainerTagDivider(counters, labelInputContainer) {

    //if more than 1 selected tag, adds a '|' divider to left
    if (counters.tagsSelected > 1) {
        let dividerElement = document.createElement('h4');
        dividerElement.className = 'tag-divider unselectable';
        dividerElement.innerText = '|';
        labelInputContainer.append(dividerElement);
    }
}

export function adjustLabelFontSize(state, fontSizeArr, fontNumArr, labelInputContainer) {
    let tagDivs = document.querySelectorAll('.selected-tag .tag-text');
    let fontArrIndex = 0;
    do {
        tagDivs.forEach(tag => {
            tag.style.fontSize = fontSizeArr[fontArrIndex];
            state.currentLabelInputTagSize = fontNumArr[fontArrIndex];
        })
        fontArrIndex++;
    } while (((labelInputContainer.scrollWidth - labelInputContainer.clientWidth) > 0) && (fontArrIndex < 9))
}

function deleteLabel(target) {
    let toDeleteTagId;

    if (target.className === 'tag-text deleteJiggling') {
        toDeleteTagId = target.parentElement.id;
    } else {
        toDeleteTagId = target.id;
    }

    // call function which shows popup container prompting user to confirm their intended action
    showConfirmLabelDeletionPopup(toDeleteTagId, popupOverlay, confirmLabelDeletionPopup, state);
}

function labelDeletion(addDoneContainer, tagSelectionDivider, flags, state) {
    document.getElementById(state.labelToDeleteId).remove();
    removeTagSelectionDivider(addDoneContainer, tagSelectionDivider, flags);
    
    const labelName = labelDict[state.labelToDeleteId];

    // create label key-value pair to insert into deletedLabels
    let deletedLabel = {};
    deletedLabel[state.labelToDeleteId] = labelName;
    
    // edit labelDict
    delete labelDict[state.labelToDeleteId];
    
    // edit labelFlags
    delete labelFlags[labelName];
    
    // edit labelArrs
    delete labelArrs[labelName];
    
    if (sessionState.loggedIn) {
        const labelArr = [labelDict, selectedLabelDict, counters.lastLabelIdNum, state.lastSelectedEmojiId];
        updateLabels(labelArr);

        updateDeletedLabels(deletedLabel);
    }
}

export function removeTagSelectionDivider(addDoneContainer, tagSelectionDivider, flags) {
    if (!addDoneContainer.previousElementSibling) {
        tagSelectionDivider.style.display = 'none';
        addDoneContainer.style.marginLeft = '7px';
        flags.tagSelection = false;
    }
}

function createNote(inputStr, noteTaskDiv, counters, container, spanTimestamp) {

    let spanContainer = document.createElement('span');
    spanContainer.classList.add('spanContainer');

    let taskText = document.createElement('span');
    taskText.textContent = inputStr;
    taskText.classList.add('spanText');
    let taskTextId = "spanText" + counters.lastTaskInputIdNum;
    taskText.id = taskTextId;
    taskText.setAttribute('data-testid', taskTextId);

    let spanArrow = document.createElement('span');
    spanArrow.classList.add('spanArrow');
    let spanArrowId = "spanArrow" + counters.lastTaskInputIdNum;
    spanArrow.id = spanArrowId;

    let spanCompletion = document.createElement('span');
    spanCompletion.classList.add('spanCompletion');
    let spanCompletionId = "spanCompletion" + counters.lastTaskInputIdNum;
    spanCompletion.id = spanCompletionId;

    spanContainer.appendChild(taskText);
    spanContainer.appendChild(spanTimestamp);
    spanContainer.appendChild(spanArrow);
    spanContainer.appendChild(spanCompletion);
    noteTaskDiv.appendChild(spanContainer);

    let noteTaskDivIdStr = "taskDiv" + counters.lastTaskInputIdNum;
    noteTaskDiv.id = noteTaskDivIdStr;
    noteTaskDiv.setAttribute('data-testid', noteTaskDivIdStr);
    // console.log(noteTaskDiv.id);

    container = appendEditRemoveContainer("Task", counters.lastTaskInputIdNum);

    counters.lastTaskInputIdNum += 1;

    return container;
}

export function createCheckElements(counters) {
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

    let svgCheckId = "svgCheck" + counters.lastTaskInputIdNum;
    svgCheck.id = svgCheckId;
    svgCheck.setAttribute('data-testid', svgCheckId);
    
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

    return taskCircularCheckDiv;
}

function noteInputCancelBtnClick_editMode(state, flags) {
    document.getElementById('note-task-input-container-edit').remove();
    document.getElementById(state.currentNoteTaskEditId).style.display = "flex";
    
    flags.noteTaskInputContainerEditShowing = false; 
}

function noteInputSaveBtnClick_editMode(state, flags) {
    let inputEditStr = document.getElementById('note-task-input-container-edit').querySelector('textarea').value;

    document.getElementById(state.currentNoteTaskEditId).querySelector('.spanText').textContent = inputEditStr;

    document.getElementById(state.currentNoteTaskEditId).style.display = "flex";
    document.getElementById('note-task-input-container-edit').remove();

    flags.noteTaskInputContainerEditShowing = false;

    const indexToEdit = notesArr.findIndex(obj => obj.id === state.currentNoteTaskEditId);
    notesArr[indexToEdit].content = inputEditStr;

    let lastTaskInputIdNum = counters.lastTaskInputIdNum;
    if (sessionState.loggedIn) {
        const notesObj = {
            notesArr,
            lastTaskInputIdNum
        }
        updateNotes(notesObj);
    }
}

function handleRemoveBtnClick(targetId) {

    removeNoteFromDocAndArr(targetId);

    let lastTaskInputIdNum = counters.lastTaskInputIdNum;
    if (sessionState.loggedIn) {
        const notesObj = {
            notesArr,
            lastTaskInputIdNum
        }
        updateNotes(notesObj);
    }
}

function removeNoteFromDocAndArr(targetId) {
    let idNum = getLastNumberFromId(targetId);
    let taskInputId = "taskDiv" + idNum;


    // remove element from document
    if (document.getElementById(taskInputId)) {
        document.getElementById(taskInputId).remove();
    }

    // remove element from array
    const indexToRemove = notesArr.findIndex(obj => obj.id === taskInputId);
    if (indexToRemove !== -1) {
        notesArr.splice(indexToRemove, 1);
    }
}

function handleEditBtnClick(targetId, flags, noteTaskInputContainer, addNoteTaskContainer, state) {
    let idNum = getLastNumberFromId(targetId);
    let taskInputId = "taskDiv" + idNum;

    if (flags.noteTaskInputContainerShowing) {
        noteTaskInputContainer.style.display = 'none';
        addNoteTaskContainer.style.display = 'flex';
    }

    if (getTypeFromId(targetId) === "Task") {
        editNoteTask(taskInputId, state, flags, idNum);
    }
}

function checkOrUncheckTask(targetId) {
    let idNum = getLastNumberFromId(targetId);
    let taskDivId = "taskDiv" + idNum;
    let taskDiv = document.getElementById(taskDivId);
    let check = document.getElementById("check" + idNum);
    let taskCircularCheckElement = taskDiv.firstElementChild;

    const indexToUpdate = notesArr.findIndex(obj => obj.id === taskDivId);

    if (taskDiv.classList.contains('completed-task')) {
        taskCircularCheckElement.style.backgroundColor = "";
        check.setAttribute('stroke-width', '2');
        check.parentElement.parentElement.style.opacity = '';
        taskDiv.classList.remove('completed-task');

        // reset completionDate
        notesArr[indexToUpdate].completionDate = null;

        // remove spanCompletion text + arrow
        document.getElementById("spanArrow" + idNum).innerText = "";
        document.getElementById("spanCompletion" + idNum).innerText = "";
        document.getElementById("spanArrow" + idNum).style.opacity = "0";
        document.getElementById("spanCompletion" + idNum).style.opacity = "0";

    } else if (!(taskDiv.classList.contains('completed-task'))) {
        taskCircularCheckElement.style.backgroundColor = "#3ba43e";
        check.setAttribute('stroke-width', '3');
        check.parentElement.parentElement.style.opacity = '1';
        taskDiv.classList.add('completed-task');

        // update completionDate
        let completionDate = Date.now();
        notesArr[indexToUpdate].completionDate = completionDate;

        // add the timestamp + arrow
        document.getElementById("spanArrow" + idNum).innerText = "--->";
        document.getElementById("spanCompletion" + idNum).innerText = getTimestamp(); // add the timestamp
        document.getElementById("spanArrow" + idNum).style.opacity = "1";
        document.getElementById("spanCompletion" + idNum).style.opacity = "1"; // add the timestamp
    }

    notesArr[indexToUpdate].classList = [...taskDiv.classList];

    let lastTaskInputIdNum = counters.lastTaskInputIdNum;
    if (sessionState.loggedIn) {
        const notesObj = {
            notesArr,
            lastTaskInputIdNum
        }
        updateNotes(notesObj);
    }
}

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
    // console.log("input");
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
    noteTaskInputText.setAttribute('data-testid', "note-task-input-text-edit");
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

    /** END PRODUCT
     * <div id="note-task-input-container-edit">
            <div id="upper-half-note-task-input-edit">
                <textarea id="note-task-input-text-edit" data-testid="note-task-input-text-edit" placeholder="Description">
                    <!-- Content from noteTaskDivContent will be here -->
                </textarea>
            </div>
            <div id="lower-half-note-task-input-edit">
                <div id="save-cancel-container-edit">
                    <div id="note-input-save-container-edit" class="save-cancel-task-container">
                        <div id="note-input-save-btn-edit">Save</div>
                    </div>
                    <div id="note-input-cancel-container-edit" class="save-cancel-task-container">
                        <div id="note-input-cancel-btn-edit">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
     */
}

function editNoteTask(noteTaskId, state, flags, idNum) {
    // Hide noteDiv or taskDiv
    state.currentNoteTaskEditId = noteTaskId;
    const noteTaskDiv = document.getElementById(noteTaskId);

    let spanTextId = "spanText" + idNum;
    let noteTaskDivContent = document.getElementById(spanTextId).innerText;

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

export function appendEditRemoveContainer(inputType, lastIdNum) {
    const container = document.createElement('div'); //for edit remove container
    container.classList.add('editRemoveContainer');

    let containerIdStr = "editRemoveContainer" + inputType + lastIdNum;
    container.id = containerIdStr;

    // Create edit button div
    const editBtn = document.createElement('div');
    editBtn.classList.add('editRemoveBtn');
    editBtn.classList.add('editBtn');
    editBtn.classList.add('no-select');

    let editBtnIdStr = "editBtn" + inputType + lastIdNum;
    editBtn.setAttribute('id', editBtnIdStr);
    editBtn.setAttribute('data-testid', editBtnIdStr);

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
    removeBtn.classList.add('no-select');

    let removeBtnIdStr = "removeBtn" + inputType + lastIdNum;
    removeBtn.setAttribute('id', removeBtnIdStr);
    removeBtn.setAttribute('data-testid', removeBtnIdStr);

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

export function getLastNumberFromId(targetId) {
    const match = targetId.match(/\d+$/); // Match one or more digits at the end of the string
    if (match) {
        return parseInt(match[0], 10); // Convert the matched string to a number
    } else {
        return null; // or any other default value you see fit
    }
}

function closeNotesContainer(notesContainer, notesFlags, isMobile) {
    notesContainer.classList.remove('fullsize');
    notesContainer.classList.remove('fullopacity');

    
    if (!isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    notesFlags.notesShowing = false;
}

function openNotesContainer(notesContainer, notesFlags) {
    notesContainer.classList.add('fullsize');
    notesContainer.classList.add('fullopacity');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    notesFlags.notesShowing = true;

    // re-establishing focus on input element if it was last open is an optional feature you can add later if you have time
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
    selectionDiv.id = selectedTagId;
    selectionDiv.firstElementChild.style.backgroundColor = '';

    labelSelectionRow.insertBefore(selectionDiv, labelSelectionRow.firstChild);
    counters.tagsSelected--;

    //if there weren't any tags left in the selection window, add the  selection divider '|'
    //and remove the margin-left value and indicate that there's tags in the selection window

    showTagSelectionDivider(flags, tagSelectionDivider, addDoneContainer);

    const labelName = selectedLabelDict[selectedTagId];

    delete selectedLabelDict[selectedTagId]; // update selectedLabelDict

    // add timeStamp (to represent taking away label) to labelArr if in hyperFocus
    let timeStamp = Date.now();
    if (indexflags.inHyperFocus) { // needs to execute first
        updateLabelArr(labelName, labelArrs, timeStamp);
    }

    // set corresponding label in notesFlags to false
    labelFlags[labelName] = false; // needs to execute second

    if (sessionState.loggedIn) {
        const labelArr = [labelDict, selectedLabelDict, counters.lastLabelIdNum, state.lastSelectedEmojiId];
        updateLabels(labelArr);
    }
}

function handleTaskEnter_or_n(event, notesFlags, notesContainer, createLabelInput, createLabelDone, updateLabelInput, updateLabelDone, noteInputSaveBtn, noteTaskInputText, noteInputCancelBtn, addNoteTaskContainer, flags, isMobile, settingsContainer, aboutContainer, blogContainer, main_elements) {
    if (navigationState.lastSelectedMode === 'home') {
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
        } else if ((event.key === 'n') && (canOpenNotes(blogContainer, aboutContainer, settingsContainer, main_elements))) {
            if (!notesFlags.notesShowing) {
                openNotesContainer(notesContainer, notesFlags);
            } else if ((!flags.noteTaskInputContainerShowing) && (!flags.noteTaskInputContainerEditShowing) && (notesFlags.notesConsoleShowing) && (!navFlags.sessionSummaryPopupShowing)) {
                addNoteTaskContainer.click();
                taskCheckbox.checked = false;
                event.preventDefault();
                noteTaskInputText.value = "";
            }
        }  else if ((event.key === 't') && canInputTask()) {
            addNoteTaskContainer.click();
            taskCheckbox.checked = true;
            event.preventDefault();
            noteTaskInputText.value = "";
        } else if ((event.key === 'l') && canOpenLabels()) {
            taskPrompt.click();
            event.preventDefault();
        } else if ((event.key === 'Escape') && (notesFlags.notesShowing) && (!navFlags.sessionSummaryPopupShowing)) {
            if (flags.noteTaskInputContainerShowing) {
                noteInputCancelBtn.click();
            } else if (flags.noteTaskInputContainerEditShowing) {
                document.getElementById('note-input-cancel-btn-edit').click();
            } else if (flags.createLabelWindowOpen) {
                createLabelCancel.click();
            } else if (flags.updateLabelWindowOpen) {
                updateLabelCancel.click();
            } else if (flags.confirmLabelDeletionWindowShowing) {
                confirmLabelDeletionNoBtn.click();
            } else if (!notesFlags.notesConsoleShowing) { // aka if label container is open
                selectionDone.click();
            } else {
                closeNotesContainer(notesContainer, notesFlags, isMobile);
            }
        }
    }
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function canOpenNotes(blogContainer, aboutContainer, settingsContainer, main_elements) {

    if ((blogContainer.style.display === "") && (aboutContainer.style.display === "") && (settingsContainer.style.display === "")) {
        return true; //if very first action is hitting 'n'
    } else {
        return ((settingsContainer.style.display === "none" || settingsContainer.style.display === "") && (main_elements.style.display !== "none") && (!navFlags.sessionSummaryPopupShowing));
    }

}

function canInputTask() {
    if ((notesFlags.notesShowing) && (notesFlags.notesConsoleShowing) && (!flags.noteTaskInputContainerShowing) && (!flags.noteTaskInputContainerEditShowing) && (!navFlags.sessionSummaryPopupShowing) && (settingsContainer.style.display !== 'block')) {
        return true;
    }

    return false;
}

function canOpenLabels() {
    if ((notesFlags.notesShowing) && (notesFlags.notesConsoleShowing) && (!flags.noteTaskInputContainerShowing) && (!flags.noteTaskInputContainerEditShowing) && (!navFlags.sessionSummaryPopupShowing) && (settingsContainer.style.display !== 'block')) {
        return true;
    }

    return false;
}