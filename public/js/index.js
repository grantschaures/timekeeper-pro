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

    const productivity_chill_mode = document.getElementById("productivity-chill-mode");
    const audio = document.getElementById("click-sound"); //plays sound effect when stop/start button hit
    const progressBar = document.querySelector('.progress-bar');
    const display = document.getElementById("display");

    const timeConvert = {
        msPerHour: 3600000,
        msPerMin: 60000,
        msPerSec: 1000
    };

    let interval;
    let local_interval;
    let startTime;
    let local_startTime;
    let veryStartTime;
    let targetTime;
    let elapsedTime = 0; //Time during each productivity interval
    let elapsedChillTime = 0;
    let startStopCounter = 0;
    let hitTarget = false;
    let submittedTarget = false;
    let inHyperFocus = true;

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn));

    start_stop_btn.addEventListener("click", function() {

        playClick(audio);
        resetDisplay(display);

        startStopCounter++; //keep track of button presses

        if (startStopCounter === 1) {
            veryStartActions(veryStartTime);
        }

        local_startTime = Date.now();
        clearInterval(local_interval);
        local_interval = setInterval(() => timeDisplay(local_startTime, display, timeConvert), 1000);
        
        if (!interval) { //executes when interval is undefined --> Hyper Focus Mode

            setButtonTextAndMode("Stop", "Hyper Focus");
            elapsedChillTime = Date.now() - (veryStartTime + elapsedTime);
            startTime = Date.now();
            interval = setInterval(updateProgressBar, 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)
            setBackground("linear-gradient(to bottom, #ff595e, #ca403b)");
        } else { //--> Chill Time

            setButtonTextAndMode("Start", "Chill Time");
            clearInterval(interval);
            interval = null;
            elapsedTime += Date.now() - startTime;
            console.log("Logged: " + Math.floor((Date.now() - startTime) / 1000) + " seconds of focused effort.");
            setBackground("linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)");
        }
    });
    
    submit_change_btn.addEventListener("click", function() {
        if (!submittedTarget) { //When submitting target hours
            
            let inputHours = document.getElementById("target-hours").value;
            
            // Check if the input is empty or zero
            if(!targetHoursValidate(inputHours, timeConvert)) {
                return;
            }

            replaceTargetHours(inputHours); //sets targetTime

            if (!inHyperFocus) { //if we're in chill time
                updateProgressBar(); //update ProgressBar once to demonstrate change made
            }
            
            hitTarget = false;
        }
        else if (submittedTarget) { //When changing target hours

            changeTargetHours();
        }
    });
    
    end_session_btn.addEventListener("click", function() { //temporary function
        location.reload();
    });

    // ---------------------
    // HELPER FUNCTIONS
    // ---------------------
    function changeTargetHours() {

        document.getElementById("target-hours").remove();
            
        let enterHours = document.createElement('input');
        enterHours.type = "number";
        enterHours.id = "target-hours";
        enterHours.name = "hours";
        enterHours.min = "0";
        document.getElementById("coolDiv").appendChild(enterHours);
        
        document.getElementById('target-hours-submit').textContent = "Submit";
        submittedTarget = false;
    };

    function replaceTargetHours(inputHours) {

        let targetHours = Math.round((parseFloat(inputHours)) * 100) / 100; //return to 100 after testing
        targetTime = targetHours * 60 * 60 * 1000; //converting hours -> milliseconds
        document.getElementById("target-hours").remove();

        let submitTarget = document.createElement('h4');
        submitTarget.textContent = targetHours;
        submitTarget.id = "target-hours";
        document.getElementById("coolDiv").appendChild(submitTarget);
        document.getElementById('target-hours-submit').textContent = "Change";
        submittedTarget = true;
    };

    function targetHoursValidate(inputHours, timeConvert) {
        const roundedHours = Math.round((parseFloat(inputHours)) * 100) / 100;
        if (!inputHours || roundedHours <= 0 || roundedHours > 24 || (roundedHours * 60 * 60 * 1000) <= getTotalElapsed(inHyperFocus, elapsedTime, local_startTime)) {
            
            if (startStopCounter !== 0) { //if not very start of program
                if (inHyperFocus) { //if not at very start and in hyper focus
                    alert("Enter a valid target time between " + Math.ceil((parseFloat((elapsedTime + (Date.now() - local_startTime)) / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
                }
                else if (!inHyperFocus) { //if not at very start and in chill time
                    alert("Enter a valid target time between " + Math.ceil((parseFloat(elapsedTime / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
                }
            }
            else if (startStopCounter === 0) { //if at very start
                alert("Enter a valid target time between 0.01 hours and 24 hours");
            }
            return false;
        }
        return true;
    };

    function setButtonTextAndMode(stop_start, hf_ct) {
        start_stop_btn.innerText = stop_start;
        productivity_chill_mode.innerText = hf_ct;
        inHyperFocus = stop_start === "Stop";
    };
    
    function updateProgressBar() {

        let timeDiff;
        if (inHyperFocus) { //if in productivity mode
            timeDiff = Date.now() - startTime + elapsedTime;
        }
        else if (!inHyperFocus) { //if in chill time
            timeDiff = elapsedTime;
        }
        
        let percentage = timeDiff / targetTime;
        console.log(percentage);

        if (percentage > 1) {
            percentage = 1; //cap percentage at 100%
        }
        
        if (targetTime !== 0 && percentage >= 1 && !hitTarget) { //when target time is hit
            hitTarget = true;
            setTimeout(() => {
                console.log("Congrats! You've hit your target time!");
                alert("Congrats! You've hit your target time!");
            }, 1); //experiment w/ value to solve timing issues
        }
        
        progressBar.style.width = (percentage * 100) + '%';
    };
});

//  I will define functions outside of the DOMContentLoaded event handler
//  if it doesn't require more than 4 parameters

function resetDisplay(display) {
    display.innerText = "00:00:00"; //immediately resets display w/ no lag time
};

function veryStartActions(veryStartTime) {
    veryStartTime = Date.now();
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