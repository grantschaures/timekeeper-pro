document.addEventListener("DOMContentLoaded", function() {
    const notesContainer = document.getElementById("notes-container");
    
    const taskContainer = document.getElementById("task-container");
    const promptContainer = document.getElementById("prompt-container");
    const taskInputContainer = document.getElementById("task-input-container");

    const userInputTask = document.getElementById("userInputTask");

    const clearIcon = document.getElementById("clearIcon");

    const notesBtn = document.getElementById("notes");

    const notesConsole = document.getElementById("notes-console");

    // CONSOLE
    let notesFlags = {
        isClicked: false,
        notesShowing: false
    }

    let counters = {
        notesLines: 0
    }

    let state = {
        currentNoteInputId: null,
        currentNoteTimeId: null,
        lastNotesLineTime: null
    }

    let intervals = {
        notesTime: null
    }

    let currentTime = getCurrentTime();

    
    //Set initial console line
    setNewConsoleLine(counters, getCurrentTime(), state);

    //continually compare values
    intervals.notesTime = setInterval(() => compareNoteLineTime(state), 1000);

    notesBtn.addEventListener("click", function() {
        if (notesFlags.notesShowing === false) {
            // notesContainer.style.display = "block"; //old instant transition

            notesContainer.classList.add('fullsize');
            notesContainer.classList.add('fullopacity');
            
            document.getElementById(state.currentNoteInputId).focus();
            notesFlags.notesShowing = true;
        } else {
            notesContainer.classList.remove('fullsize');
            notesContainer.classList.remove('fullopacity');

            // notesContainer.style.display = "none"; //old instant transition
            notesFlags.notesShowing = false;
        }
    })

    taskInputContainer.addEventListener("mousedown", function() {
        promptContainer.style.display = "none";
        notesFlags.isClicked = true;
    })
    
    document.addEventListener("click", function(event) {
        notesFlags.isClicked = false;
        if ((userInputTask.value == "") && (event.target !== userInputTask) && (event.target !== clearIcon) && (document.activeElement !== userInputTask)) {
            clearIcon.style.display = "none";
            promptContainer.style.display = "flex";
        } else if ((userInputTask.value != "") && (event.target !== userInputTask)) { //submit task
            clearIcon.style.display = 'flex';
        }
    })

    document.addEventListener('keydown', (event) => handleTaskEnter(event, clearIcon, promptContainer, counters, getCurrentTime(), state, notesConsole));

    clearIcon.addEventListener("click", async function() {
        clearIcon.classList.add('resetIconRotation');

        userInputTask.value = "";
        userInputTask.focus();

        await delay(500);
        clearIcon.style.display = "none";
        clearIcon.classList.remove('resetIconRotation');
    })
})


function handleTaskEnter(event, clearIcon, promptContainer, counters, currentTime, state, notesConsole) {
    if (event.key === 'Enter') {
        event.preventDefault();
        
        if ((document.activeElement === userInputTask) && (userInputTask.value == "")) {
            userInputTask.blur();
            clearIcon.style.display = "none";
            promptContainer.style.display = "flex";
        } else if (document.activeElement === userInputTask) { //submit task
            clearIcon.style.display = 'flex';
            userInputTask.blur();
            document.getElementById(state.currentNoteInputId).focus();
        } else if ((document.activeElement === document.getElementById(state.currentNoteInputId)) && (document.activeElement.value !== "")) {
            if ((document.getElementById(state.currentNoteInputId)).value == "clear") {
                clearConsole(notesConsole, counters);
            } else {
                document.getElementById(state.currentNoteInputId).blur();
                document.getElementById(state.currentNoteInputId).setAttribute('readonly', 'readonly');
            }
            setNewConsoleLine(counters, currentTime, state);
            document.getElementById(state.currentNoteInputId).focus();
        }
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

    let textArea = document.getElementById(noteInput.id);
    textArea.addEventListener("input", function() {
        let latestTextArea = document.getElementById(state.currentNoteInputId);
        if (window.innerWidth >= 600) {
            if (latestTextArea.value.length >= 42) {
                // Reset height to ensure we get the actual scroll height
                latestTextArea.style.height = 'auto';
                latestTextArea.style.height = latestTextArea.scrollHeight + 'px';
            } else {
                latestTextArea.style.height = '20px';
            }
        } else { //if small viewport width, we'll just have to have extra line if only one line entered :/
            latestTextArea.style.height = 'auto';
            latestTextArea.style.height = latestTextArea.scrollHeight + 'px';
        }
    })
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
