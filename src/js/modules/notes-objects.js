export const notesFlags = {
    isClicked: false,
    notesShowing: false,
    notesConsoleShowing: true,
    emojiContainerShowing: false
}

export const counters = {
    notesLines: 0,
    tagsSelected: 0,
    lastLabelIdNum: 0, //subject to change based on num of predefined labels for user (need to store in database)
    lastNoteInputIdNum: 0, // not being used
    lastTaskInputIdNum: 0
}

export const state = {
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

export const flags = {
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

export const emojiMap = {
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

export const tutorialContainerMap = {
    "addingImgContainer": "addingLabelInstructions",
    "deletingImgContainer": "deletingLabelInstructions",
    "updatingImgContainer": "updatingLabelInstructions"
}

export const fontSizeArr = ['20px', '19px', '18px', '17px', '16px', '15px', '14px', '13px', '12px'];
export const fontNumArr = [20, 19, 18, 17, 16, 15, 14, 13, 12];