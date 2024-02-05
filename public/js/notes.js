document.addEventListener("DOMContentLoaded", function() {
    const notesContainer = document.getElementById("notes-container");
    
    const taskContainer = document.getElementById("task-container");
    const promptContainer = document.getElementById("prompt-container");
    const labelInputContainer = document.getElementById("label-input-container");
    const createLabelContainer = document.getElementById("create-label-container");
    const createLabelWindow = document.getElementById("create-label-window");
    const createLabelInput = document.getElementById("create-label-input");

    const createLabelDone = document.getElementById("create-label-done");
    const createLabelCancel = document.getElementById("create-label-cancel");

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

    const emojiBtn = document.getElementById("emoji-btn"); // this is the div surrounding OGemoji
    const emojiImg = document.getElementById("OGemoji");
    const emojiContainer = document.getElementById("emoji-container");

    const emojiSymbols = document.querySelectorAll('.emoji-symbol')

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
        lastLabelIdNum: 3 //subject to change based on num of predefined labels for user (need to store in database)
    }

    let state = {
        currentNoteInputId: null,
        currentNoteTimeId: null,
        lastNotesLineTime: null,
        currentLabelInputTagSize: 20,
        generalTarget: null,
        lastSelectionElement: null,
        lastSelectedEmojiId: null
    }

    let intervals = {
        notesTime: null
    }

    let flags = {
        tagSelected: false,
        tagSelection: true,
        clearIconClicked: false,
        controlPressed: false
    }

    const emojiMap = {
        "studying-man-emoji": "👨‍💻",
        "studying-woman-emoji": "👩‍💻",
        "meditation-emoji": "🧘",
        "meditation-woman-emoji": "🧘‍♀️",
        "happy-emoji": "😄",
        "zany-emoji": "🤪",
        "melting-emoji": "🫠",
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

    fontSizeArr = ['20px', '19px', '18px', '17px', '16px', '15px', '14px', '13px', '12px'];
    fontNumArr = [20, 19, 18, 17, 16, 15, 14, 13, 12];

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let currentTime = getCurrentTime();
    
    //Set initial console line
    setNewConsoleLine(counters, getCurrentTime(), state);

    //continually compare values
    intervals.notesTime = setInterval(() => compareNoteLineTime(state), 1000);

    //set initial emoji container point location
    setEmojiContainerPointLocation(window.innerWidth, emojiContainer, notesFlags, isMobile);

    notesBtn.addEventListener("click", function() {
        if (notesFlags.notesShowing === false) {
            notesContainer.classList.add('fullsize');
            notesContainer.classList.add('fullopacity');

            document.getElementById(state.currentNoteInputId).focus();
            notesFlags.notesShowing = true;
        } else {
            notesContainer.classList.remove('fullsize');
            notesContainer.classList.remove('fullopacity');
            notesFlags.notesShowing = false;
        }
    })
    
    document.addEventListener('keydown', (event) => handleTaskEnter_or_n(event, counters, currentTime, state, notesConsole, notesFlags, state, notesContainer, createLabelInput, createLabelDone));
    
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
        if ((event.key === 'Control') && (!flags.controlPressed)) {
            // console.log('control Key Pressed');
            flags.controlPressed = true;

            let target = state.generalTarget;
            if ((target.classList.contains('tag-text')) && (flags.controlPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) {

                state.lastSelectionElement = target;
                target.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
                target.classList.add('deleteJiggling');
            }
        }
    })

    document.addEventListener('keyup', function(event) {
        if ((event.key === 'Control') && (flags.controlPressed)) {
            // console.log('control Key Released');
            flags.controlPressed = false;

            state.lastSelectionElement.style.backgroundColor = "";
            state.lastSelectionElement.classList.remove('deleteJiggling');
        }
    })

    document.addEventListener('mouseover', function(event) {
        let target = event.target;
        state.generalTarget = target;
        // console.log(target);

        // If user control-clicks on label and quickly moves mouse to outside,
        // it catches that movement in case the labelSelectionRow mouseover
        // event listener missed it and resets color and jiggle class
        if ((!((target.classList.contains('tag-text')) && (flags.controlPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) && (state.lastSelectionElement !== null))) {
            state.lastSelectionElement.style.backgroundColor = "";
            state.lastSelectionElement.classList.remove('deleteJiggling');
        } 
    })

    labelSelectionRow.addEventListener('mouseover', function(event) {
        // console.log("test")

        // Consistently sets this state variable to contain current element in the
        // label selection row
        let target = event.target;

        //if active element contains tag-selection class and enter is pressed
        if ((target.classList.contains('tag-text')) && (flags.controlPressed) && (target !== selectionDoneDiv) && (target !== selectionDone) && (target !== addTagIcon)) {

            // if a previous element was selected for deletion, it's reset
            if (state.lastSelectionElement !== null) {
                state.lastSelectionElement.style.backgroundColor = "";
                state.lastSelectionElement.classList.remove('deleteJiggling');
            }
            state.lastSelectionElement = target;

            target.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            target.classList.add('deleteJiggling');

        } else if (state.lastSelectionElement !== null) {
            state.lastSelectionElement.style.backgroundColor = "";
            state.lastSelectionElement.classList.remove('deleteJiggling');
        }
    })

    labelSelectionRow.addEventListener('click', function(event) {
        var target = event.target;

        if (target.className === 'selection-tag' || (((target.className === 'tag-text') || (target.className === 'tag-text deleteJiggling')) && (target.innerText !== "Done"))) {

            if (flags.controlPressed) {
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
                    emojiImg.src = emojiImgPath;
                }
            }
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

    createLabelWindow.addEventListener("click", function() {
        createLabelInput.focus();
    })

    // setting up event listeners to insert emoji selected from emoji container
    // into the label creation input
    emojiSymbols.forEach(symbol => {
        symbol.addEventListener("click", function() {
            let targetEmojiId = symbol.id;
            let emojiToInsert = emojiMap[targetEmojiId];
            createLabelInput.value += emojiToInsert;

            //keep track of last selected emoji
            state.lastSelectedEmojiId = targetEmojiId;

            // then trigger close of menu
            emojiContainer.style.display = "none";
            notesFlags.emojiContainerShowing = false;
        })
    })

    document.addEventListener("click", function(event) {
        if ((!emojiContainer.contains(event.target)) && (event.target !== emojiImg) && (emojiContainer.style.display === "block")) {
            emojiContainer.style.display = "none";
            notesFlags.emojiContainerShowing = false;
        }
    })

    window.addEventListener('resize', function() {
        setEmojiContainerPointLocation(this.window.innerWidth, emojiContainer, notesFlags, isMobile);
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

        document.getElementById(state.currentNoteInputId).focus();
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

        //focus on input
        createLabelInput.focus();
    }
})

// ---------------------
// HELPER FUNCTIONS 2
// ---------------------
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

function backToLabelSelection(createLabelContainer, createLabelWindow, clearIcon, promptContainer, labelInputContainer, labelSelectionWindow, flags) {
    //hide create label container and window
    createLabelContainer.style.display = "none";
    createLabelWindow.style.display = "none";

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

function handleTaskEnter_or_n(event, counters, currentTime, state, notesConsole, notesFlags, state, notesContainer, createLabelInput, createLabelDone) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        if ((document.activeElement === document.getElementById(state.currentNoteInputId)) && (document.activeElement.value !== "")) {
            if ((document.getElementById(state.currentNoteInputId)).value == "clear") {
                clearConsole(notesConsole, counters);
            } else {
                document.getElementById(state.currentNoteInputId).blur();
                document.getElementById(state.currentNoteInputId).setAttribute('readonly', 'readonly');
            }
            setNewConsoleLine(counters, currentTime, state);
            document.getElementById(state.currentNoteInputId).focus();
        } else if (document.activeElement === createLabelInput) {
            createLabelDone.click();
        }
    } else if ((event.key === 'n') && (!notesFlags.notesShowing)) {
        notesContainer.classList.add('fullsize');
        notesContainer.classList.add('fullopacity');
        
        // for some reason, this 0ms timeout "clears the input buffer" so-to-speak
        setTimeout(() => {
            document.getElementById(state.currentNoteInputId).focus();
        }, 0)
        notesFlags.notesShowing = true;
    } else if ((event.key === 'Escape') && (notesFlags.notesShowing)) {
        notesContainer.classList.remove('fullsize');
        notesContainer.classList.remove('fullopacity');
        document.getElementById(state.currentNoteInputId).blur();

        // notesContainer.style.display = "none"; //old instant transition
        notesFlags.notesShowing = false;
    }
}

function clearConsole(notesConsole, counters) {
    while (notesConsole.firstChild) {
        notesConsole.removeChild(notesConsole.firstChild);
    }
    counters.notesLines = 0;
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function setNewConsoleLine(counters, currentTime, state) {
    // Create elements
    var timeDiv = document.createElement("div");
    timeDiv.id = "console-line-time" + counters.notesLines;
    timeDiv.className = "console-line-time";
    timeDiv.innerText = currentTime;

    state.lastNotesLineTime = currentTime;
    state.currentNoteTimeId = timeDiv.id;

    var arrowDiv = document.createElement("div");
    arrowDiv.id = "console-line-arrow" + counters.notesLines;
    arrowDiv.className = "console-line-arrow";
    arrowDiv.innerText = ">";

    var noteInputDiv = document.createElement("div");
    noteInputDiv.id = "note-input-div" + counters.notesLines;
    noteInputDiv.className = "note-input-div";

    var noteInput = document.createElement("textarea");
    noteInput.type = "text";
    noteInput.id = "noteInput" + counters.notesLines;
    noteInput.className = "noteInput";

    state.currentNoteInputId = noteInput.id;

    var consoleLineContainer = document.createElement("div");
    consoleLineContainer.id = "console-line-container" + counters.notesLines;
    consoleLineContainer.className = "console-line-container";

    var notesConsole = document.getElementById("notes-console");
    
    notesConsole.appendChild(consoleLineContainer);
    consoleLineContainer.appendChild(timeDiv);
    consoleLineContainer.appendChild(arrowDiv);
    consoleLineContainer.appendChild(noteInputDiv);
    noteInputDiv.appendChild(noteInput);

    counters.notesLines++;

    // Still not 100% correct
    let textArea = document.getElementById(noteInput.id);
    textArea.addEventListener("input", function() {
        let latestTextArea = document.getElementById(state.currentNoteInputId);
        if (window.innerWidth >= 592) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 42);
        } else if (window.innerWidth < 325) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 15);
        } else if (window.innerWidth < 337) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 16);
        } else if (window.innerWidth < 348) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 17);
        } else if (window.innerWidth < 359) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 18);
        } else if (window.innerWidth < 370) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 19);
        } else if (window.innerWidth < 381) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 20);
        } else if (window.innerWidth < 392) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 21);
        } else if (window.innerWidth < 403) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 22);
        } else if (window.innerWidth < 414) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 23);
        } else if (window.innerWidth < 425) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 24);
        } else if (window.innerWidth < 436) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 25);
        } else if (window.innerWidth < 448) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 26);
        } else if (window.innerWidth < 459) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 27);
        } else if (window.innerWidth < 470) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 28);
        } else if (window.innerWidth < 481) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 29);
        } else if (window.innerWidth < 492) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 30);
        } else if (window.innerWidth < 503) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 31);
        } else if (window.innerWidth < 514) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 32);
        } else if (window.innerWidth < 526) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 33);
        } else if (window.innerWidth < 539) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 34);
        } else if (window.innerWidth < 553) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 35);
        } else if (window.innerWidth < 566) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 36);
        } else if (window.innerWidth < 579) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 37);
        } else if (window.innerWidth < 592) {
            modifyNoteEntryNewlineTriggerLength(latestTextArea, 38);
        }
    })
}

function modifyNoteEntryNewlineTriggerLength(latestTextArea, triggerChars) {
    if (latestTextArea.value.length >= triggerChars) {
        // Reset height to ensure we get the actual scroll height
        latestTextArea.style.height = 'auto';
        latestTextArea.style.overflow = 'auto';
        latestTextArea.style.height = latestTextArea.scrollHeight + 'px';
    } else {
        latestTextArea.style.height = '20px';
        latestTextArea.style.overflow = 'hidden';
    }
}

function getCurrentTime() {
    // Get the current timestamp from Date.now()
    const timestamp = Date.now();

    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Format the time parts
    const hours = date.getHours() % 12 || 12; // convert 24h to 12h format and handle 0 as 12
    const minutes = date.getMinutes().toString().padStart(2, '0'); // ensure two digits
    const suffix = date.getHours() >= 12 ? 'PM' : 'AM';

    // Combine the parts into a time string
    const timeString = `${hours}:${minutes} ${suffix}`;

    return timeString;
}

function compareNoteLineTime(state) {
    if (getCurrentTime() !== state.lastNotesLineTime) {
        updateLatestConsoleNoteLineTime(getCurrentTime(), state);
    }
}

function updateLatestConsoleNoteLineTime(currentTime, state) {
    document.getElementById(state.currentNoteTimeId).innerText = currentTime;
}
