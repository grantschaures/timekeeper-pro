//
//  JavaScript code for main event handling
//

document.addEventListener("DOMContentLoaded", function() {
    // ------------------------------
    // DOM ELEMENTS & INITIAL SETUP
    // ------------------------------
    const start_stop_btn = document.getElementById("start-stop");
    const submit_change_btn = document.getElementById("target-hours-submit");
    const end_session_btn = document.getElementById("end-session");
    const body = document.querySelector("body");

    const total_time_display = document.getElementById("progress-text");

    const productivity_chill_mode = document.getElementById("productivity-chill-mode");
    const audio = document.getElementById("click-sound"); //plays sound effect when stop/start button hit
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const display = document.getElementById("display");

    const redFavicon = "/images/RED.png";
    const blueFavicon = "/images/BLUE.png";
    const link = document.querySelector("link[rel~='icon']");

    const timeConvert = {
        msPerHour: 3600000,
        msPerMin: 60000,
        msPerSec: 1000
    };

    //bundle these function together after getting a good understanding of them

    //INTERVALS
    let intervals = {
        main: null, //progress bar interval
        total: null,
        local: null //interval for time display
    };
    
    //START TIMES
    let startTimes = {
        hyperFocus: undefined, //startTime of current hyper focus session
        chillTime: undefined, //startTime of current chill time session
        local: undefined, //local start time for current display
        beginning: undefined //very first start time of entire session
    };

    //TIME AMOUNTS
    let targetTime = null; //Target amount of time in ms

    let elapsedTime = {
        hyperFocus: 0, //Accumulated time from each productivity interval
        chillTime: 0 //time elapsed during each Chill Time mode
    }

    //STATE-RELATED FLAGS AND COUNTERS
    let startStopCounter = 0; //tracks number of times start/stop is pressed

    let flags = {
        hitTarget: false, //Flag: target time has been reached
        submittedTarget: false, //Flag: if target time has been submitted
        inHyperFocus: true, //Boolean Flag: check if in hyper focus mode
    }

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn));

    start_stop_btn.addEventListener("click", function() {

        playClick(audio);
        resetDisplay(display);

        startStopCounter++; //keep track of button presses

        if (startStopCounter === 1) {
            veryStartActions(startTimes);
        }

        startTimes.local = Date.now();
        clearInterval(intervals.local);
        intervals.local = setInterval(() => timeDisplay(startTimes.local, display, timeConvert), 1000); //using arrow function so we can pass arguments
        
        
        if (!intervals.main) { //executes when interval is undefined --> Hyper Focus Mode
            setFavicon(link, redFavicon);
            
            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop", "Hyper Focus");
            startTimes.hyperFocus = Date.now();
            intervals.total = setInterval(() => totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime), 1000);
            intervals.main = setInterval(() => updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)
            
            if (startStopCounter > 1) {
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;

                //TESTING
                console.log("Logged: " + Math.floor((Date.now() - startTimes.chillTime) / 1000) + " seconds of chill time.");
                console.log("Logged: " + Math.floor((elapsedTime.chillTime) / 1000) + " seconds of elapsed chill time.");
                console.log("----------------");
            }
            setBackground("linear-gradient(to bottom, #ff595e, #ca403b)");
        } else { //--> Chill Time
            setFavicon(link, blueFavicon);
            
            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Chill Time");
            startTimes.chillTime = Date.now();

            clearInterval(intervals.main);
            intervals.main = null;

            clearInterval(intervals.total);
            intervals.total = null;

            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;
            
            //TESTING
            console.log("Logged: " + Math.floor((Date.now() - startTimes.hyperFocus) / 1000) + " seconds of hyper focus.");
            console.log("Logged: " + Math.floor((elapsedTime.hyperFocus) / 1000) + " seconds of elapsed hyper focus.");
            console.log("----------------");
            
            setBackground("linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)");
        }
    });
    
    submit_change_btn.addEventListener("click", function() {
        if (!flags.submittedTarget) { //When submitting target hours
            
            let inputHours = document.getElementById("target-hours").value;
            
            // Check if the input is empty or zero
            if(!targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, startStopCounter)) {
                return;
            }

            if (flags.hitTarget) { //remove glowing effect if we've hit the target time (regardless of mode)
                progressContainer.classList.remove("glowing-effect");
            }

            targetTime = replaceTargetHours(inputHours, targetTime, flags); //sets targetTime

            if (!flags.inHyperFocus) { //if we're in chill time

                /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time */
                updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            }
            
            flags.hitTarget = false;
        }
        else if (flags.submittedTarget) { //When changing target hours

            changeTargetHours(flags);
        }
    });

    end_session_btn.addEventListener("click", function() { //temporary function
        location.reload();
    });

    stopSoundMobile(audio);
});

// ---------------------
// HELPER FUNCTIONS
// ---------------------

function changeTargetHours(flags) {

    document.getElementById("target-hours").remove();
        
    let enterHours = document.createElement('input');
    enterHours.type = "number";
    enterHours.id = "target-hours";
    enterHours.name = "hours";
    enterHours.min = "0";
    document.getElementById("coolDiv").appendChild(enterHours);
    
    document.getElementById('target-hours-submit').textContent = "Submit";
    flags.submittedTarget = false;
};

function replaceTargetHours(inputHours, targetTime, flags) {

    let targetHours = Math.round((parseFloat(inputHours)) * 100) / 100; //return to 100 after testing
    targetTime = targetHours * 60 * 60 * 1000; //converting hours -> milliseconds
    document.getElementById("target-hours").remove();

    let submitTarget = document.createElement('h4');
    submitTarget.textContent = targetHours;
    submitTarget.id = "target-hours";
    document.getElementById("coolDiv").appendChild(submitTarget);
    document.getElementById('target-hours-submit').textContent = "Change";
    flags.submittedTarget = true;

    return targetTime;
};

function targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, startStopCounter) {
    const roundedHours = Math.round((parseFloat(inputHours)) * 100) / 100;
    if (!inputHours || roundedHours <= 0 || roundedHours > 24 || (roundedHours * 60 * 60 * 1000) <= getTotalElapsed(flags.inHyperFocus, elapsedTime.hyperFocus, startTimes.local)) {
        
        if (startStopCounter !== 0) { //if not very start of program
            if (flags.inHyperFocus) { //if not at very start and in hyper focus
                alert("Enter a valid target time between " + Math.ceil((parseFloat((elapsedTime.hyperFocus + (Date.now() - startTimes.local)) / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
            }
            else if (!flags.inHyperFocus) { //if not at very start and in chill time
                alert("Enter a valid target time between " + Math.ceil((parseFloat(elapsedTime.hyperFocus / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
            }
        }
        else if (startStopCounter === 0) { //if at very start
            alert("Enter a valid target time between 0.01 hours and 24 hours");
        }
        return false;
    }
    return true;
};

function setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, stop_start, hf_ct) {
    start_stop_btn.innerText = stop_start;
    productivity_chill_mode.innerText = hf_ct;
    flags.inHyperFocus = stop_start === "Stop";
};

function updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer) {

    let timeDiff;

    if (isNaN(targetTime) || targetTime === null) { //if user doesn't input target time, break out
        return;
    }

    if (flags.inHyperFocus) { //if in productivity mode
        timeDiff = Date.now() - startTimes.hyperFocus + elapsedTime.hyperFocus;
    }
    else if (!flags.inHyperFocus) { //if in chill time
        timeDiff = elapsedTime.hyperFocus;
    }
    
    let percentage = timeDiff / targetTime;
    
    if (percentage > 1) {
        percentage = 1; //cap percentage at 100%
    }
    
    if (targetTime !== 0 && percentage >= 1 && !flags.hitTarget) { //when target time is hit
        flags.hitTarget = true;
        setTimeout(() => {
            console.log("Congrats! You've hit your target time!");
            alert("Congrats! You've hit your target time!");
        }, 1); //experiment w/ value to solve timing issues
        
        progressContainer.classList.add("glowing-effect"); //adds glowing effect to progress bar container
    }
    
    progressBar.style.width = (percentage * 100) + '%';
};

function resetDisplay(display) {
    display.innerText = "00:00:00"; //immediately resets display w/ no lag time
};

function veryStartActions(startTimes) {
    startTimes.beginning = Date.now();
    setBrowserTabTitle(); //sets browser tab title to the stopwatch time '00:00:00'
    document.getElementById("target-hours").classList.remove("glowing-effect");
};

function setBackground(background_color) {
    document.body.style.backgroundImage = background_color;  // Set the background color back to red when started
    document.documentElement.style.backgroundImage = background_color;
};

function playClick(audio) {
    audio.volume = 0.25; //lowering volume of sound
    audio.play().catch(error => {
        console.error("Audio playback error:", error);
    });
};

function handleEnter(event, start_stop_btn, submit_change_btn) {

    if (event.key === 'Enter') {
        event.preventDefault();
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
        } else {
            start_stop_btn.click();
        }
    }
};

function timeDisplay(local_startTime, display, timeConvert) {
    const timeDiff = Date.now() - local_startTime;
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);
    
    // Format the time values
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    
    display.textContent = `${hours}:${minutes}:${seconds}`;
};

function totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime) {
    
    let timeDiff = getTotalElapsed(flags.inHyperFocus, elapsedTime.hyperFocus, startTimes.local);
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);

    // Format the time values
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    if (flags.submittedTarget) {
        let percentage = timeDiff / targetTime;
        
        if (percentage > 1) {
            percentage = 1; //cap percentage at 100%
        }

        total_time_display.textContent = `${hours}:${minutes}:${seconds}` + " (" + Math.trunc(percentage * 100) + "%)";
    } else {
        total_time_display.textContent = `${hours}:${minutes}:${seconds}`;
    }
};

function getTotalElapsed(inHyperFocus, elapsedTime, local_startTime) { //return current total hyper focus time
    return inHyperFocus ? (elapsedTime + (Date.now() - local_startTime)) : elapsedTime;
};

function setBrowserTabTitle() {
    // Function to set the browser tab title based on the content of the #display div
    function setTabTitleFromDisplay() {
        document.title = document.getElementById("display").innerText;
    };

    // Initially set the browser tab title
    setTabTitleFromDisplay();

    // Create a new mutation observer to watch for changes to the #display div
    const observer = new MutationObserver(setTabTitleFromDisplay);

    // Start observing the #display div for changes to its child nodes or subtree
    observer.observe(document.getElementById("display"), {
        childList: true,
        subtree: true,
        characterData: true
    });
};

function setFavicon(link, faviconPath) {
    // If it doesn't exist, create it and append to the head
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    link.href = faviconPath;
}

function stopSoundMobile(audio) {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        audio.pause(); // Pause the audio
    }
}