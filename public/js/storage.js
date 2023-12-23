function setCurrentPomodoroNotification(counters, pomodoroIntervalArr) {
    const indexMappings = {
        0: 0, 2: 0, 4: 0, 6: 0, // Mapping for Pomodoro intervals
        1: 1, 3: 1, 5: 1,       // Mapping for short breaks
        7: 2                    // Mapping for long break
    };

    const currentOrderIndex = counters.currentPomodoroIntervalOrderIndex;
    if (currentOrderIndex in indexMappings) {
        counters.currentPomodoroIntervalIndex = indexMappings[currentOrderIndex];
        counters.currentPomodoroNotification = pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    }
}

function setPomodoroIntervalArr(event, pomodoroIntervalArr, validatedFinalInputVal, counters, productivity_chill_mode, flags) {
    const pomodoroMappings = {
        'pomodoroInput': { index: 0, label: 'Pomodoro' },
        'shortBreakInput': { index: 1, label: 'Short Break' },
        'longBreakInput': { index: 2, label: 'Long Break' }
    };

    const inputId = event.target.id;
    const mapping = pomodoroMappings[inputId];

    if (mapping) {
        pomodoroIntervalArr[mapping.index] = validatedFinalInputVal;

        if (counters.currentPomodoroIntervalIndex === mapping.index && counters.startStop !== 0 && flags.pomodoroNotificationToggle) {
            productivity_chill_mode.innerText = `${mapping.label} | ${pomodoroIntervalArr[mapping.index]} min`;
        }
    }
}