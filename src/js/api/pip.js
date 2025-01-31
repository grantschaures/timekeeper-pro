import { catsContainer, completedPomodoros_label, completedPomodoros_min, completedPomodorosContainer, display, interruptionsChangeContainer, interruptionsContainer, interruptionsLabel, interruptionsNum, interruptionsQuestionIcon, interruptionsSubContainer, lowerButtons, notesBtn, notesContainer, pipCatShadow, pipIconContainer, pipInfoText, pomodoroInfoTooltip, productivity_chill_mode, progress, progressCatBody, progressCatHead, start_stop_btn, stopwatch, suggestionBreak_label, suggestionBreak_min, targetHoursContainer, targetHoursInterruptionsContainer, timekeepingContainer } from "../modules/dom-elements.js";
import { catIds, counters, flags, intervalArrs, pip, selectedBackground } from "../modules/index-objects.js";

import { displayCat, setBackground } from '../main/index.js';

document.addEventListener("stateUpdated", function() {
  if ("documentPictureInPicture" in window) {
    pipIconContainer.style.display = 'flex';
  }

  pipIconContainer.addEventListener('click', async function() {
    flags.pipWindowOpen = true;

    if (flags.sessionInProgress) {
      intervalArrs.pipWindowEvent.push(Date.now());
    }

    // Open a Picture-in-Picture window.
    let width = 300;
    let height;

    if (flags.intervalTimeToggle) {
      height = 380;
    } else {
      height = 280;
    }

    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: width,
      height: height,
    });

    pip.window = pipWindow;

    // cat
    progressCatHead.style.display = 'flex';
    progressCatBody.style.display = 'flex';
    pipCatShadow.style.display = 'flex';
    pipInfoText.style.display = 'flex';
    setTimeout(() => {
      progressCatHead.style.opacity = '1';
      progressCatBody.style.opacity = '1';
      pipCatShadow.style.opacity = '1';
      pipInfoText.style.opacity = '1';
      mainWindowResize();
    }, 0)

    // hide pipIcon when pip window showing (temp)
    pipIconContainer.style.display = 'none';
    notesBtn.style.display = 'none';
    catsContainer.style.display = 'none';

    timekeepingContainer.style.paddingTop = '10px';
    timekeepingContainer.style.paddingBottom = '10px';
    timekeepingContainer.style.maxHeight = '260px';
    timekeepingContainer.style.marginTop = '10px';
    timekeepingContainer.style.marginBottom = '5px';
    if (counters.startStop === 0) {
      productivity_chill_mode.innerHTML = "<b>Press 'Start'</b>";
    }

    lowerButtons.classList.add('pipMode');
    lowerButtons.style.gap = '0px';
    start_stop_btn.style.marginRight = '10px';
    display.classList.add('pipMode');
    
    suggestionBreak_label.style.display = "none";
    suggestionBreak_min.style.marginBottom = "0px";
    suggestionBreak_min.style.marginTop = "0px";
    completedPomodoros_label.style.display = "none";
    completedPomodorosContainer.style.paddingTop = '22px';

    interruptionsLabel.style.display = 'none';
    targetHoursContainer.style.visibility = 'hidden';
    
    interruptionsContainer.style.marginTop = '5px';
    interruptionsContainer.style.height = '75px';
    interruptionsContainer.style.minHeight = '75px';
    interruptionsContainer.classList.add('pipMode');
    interruptionsContainer.style.zIndex = '26';
    interruptionsNum.style.marginTop = '3px';
    interruptionsSubContainer.style.marginTop = '0px';
    interruptionsChangeContainer.style.marginBottom = '0px';
    interruptionsChangeContainer.style.marginTop = '0px';

    // hide the interruptionsQuestionIcon
    interruptionsQuestionIcon.style.display = 'none';

    let pipContainer = document.createElement('div');
    pipContainer.id = 'pipContainer';
    pipContainer.appendChild(interruptionsContainer);
    pipContainer.appendChild(timekeepingContainer);
    pipWindow.document.body.append(pipContainer);

    // backgrounds
    if (flags.inHyperFocus) {
      setBackground(selectedBackground.flowtime, 1);
    } else if (counters.startStop > 0) {
      setBackground(selectedBackground.chilltime, 1);
    } else {
      if (flags.darkThemeActivated) {
        pip.window.document.body.style.backgroundImage = 'linear-gradient(90deg, #202020, #202020, #202020)';
      }
    }

    // css stuff
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");
    
        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement("link");
    
        link.rel = "stylesheet";
        link.type = styleSheet.type;
        link.media = styleSheet.media;
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });

    pipWindow.addEventListener("pagehide", (event) => {
      flags.pipWindowOpen = false;
      
      if (flags.sessionInProgress) {
        intervalArrs.pipWindowEvent.push(Date.now());
      }

      // cat
      progressCatHead.style.display = 'none';
      progressCatHead.style.opacity = '0';
      progressCatBody.style.display = 'none';
      progressCatBody.style.opacity = '0';
      pipCatShadow.style.display = 'none';
      pipCatShadow.style.opacity = '0';
      pipInfoText.style.display = 'none';
      pipInfoText.style.opacity = '0';

      pipIconContainer.style.display = 'flex';
      notesBtn.style.display = 'flex';
      catsContainer.style.display = 'block';
      displayCat(catIds, counters);

      timekeepingContainer.style.paddingTop = '';
      timekeepingContainer.style.paddingBottom = '';
      timekeepingContainer.style.maxHeight = '';
      timekeepingContainer.style.marginTop = '0px';
      timekeepingContainer.style.marginBottom = '25px';

      if (flags.intervalTimeToggle) {
        timekeepingContainer.style.height = '350px';
      } else {
        timekeepingContainer.style.height = '150px';
      }


      if (counters.startStop === 0) {
        productivity_chill_mode.innerHTML = "<b>Press 'Start' to begin session</b>";
      }

      lowerButtons.classList.remove('pipMode');
      lowerButtons.style.gap = '10px';
      start_stop_btn.style.marginRight = '0px';
      display.classList.remove('pipMode');

      interruptionsLabel.style.display = 'block';
      targetHoursContainer.style.visibility = 'visible';

      suggestionBreak_label.style.display = "flex"
      suggestionBreak_min.style.marginBottom = "45px";
      suggestionBreak_min.style.marginTop = "27px";
      completedPomodoros_label.style.display = "flex";
      completedPomodorosContainer.style.paddingTop = '0px';

      interruptionsNum.style.fontSize = '50px';
      interruptionsNum.style.marginTop = '';
      interruptionsContainer.style.height = '150px';
      interruptionsContainer.style.minHeight = '';
      interruptionsContainer.style.marginTop = '0px';
      interruptionsContainer.classList.remove('pipMode');
      interruptionsContainer.style.zIndex = '25';
      interruptionsSubContainer.style.marginTop = '6px';
      interruptionsChangeContainer.style.marginBottom = '30px';
      interruptionsChangeContainer.style.marginTop = '-10px';

      // show the interruptionsQuestionIcon
      interruptionsQuestionIcon.style.display = 'flex';


      progress.insertAdjacentElement('afterend', timekeepingContainer);
      targetHoursContainer.insertAdjacentElement('afterend', interruptionsContainer);
    });

    pipWindow.addEventListener('resize', function() {
      let pipWindowWidth = pipWindow.innerWidth;
      
      if (pipWindowWidth <= 300) {
        interruptionsNum.style.fontSize = '35px';
        completedPomodoros_min.style.fontSize = '35px';
        interruptionsContainer.style.height = '60px';
        interruptionsContainer.style.minHeight = '60px';
      } else {
        interruptionsNum.style.fontSize = '50px';
        completedPomodoros_min.style.fontSize = '50px';
        interruptionsContainer.style.height = '75px';
        interruptionsContainer.style.minHeight = '75px';     
      }
    })

    pipWindow.document.getElementById('end_session_btn').addEventListener('click', function() {

      window.focus(); // get back to the tab
      pipWindow.close(); // close the pip window

    })

    // pipWindow.document.addEventListener('keydown', (event) => {
    //   if (event.key === 'Enter') {
    //     console.log('test')
    //     start_stop_btn.click();
    //   }
    // })
  })

  completedPomodoros_min.addEventListener('mouseenter', function() {
    if (flags.pipWindowOpen) {
      pomodoroInfoTooltip.style.display = 'flex';
      setTimeout(() => {
        pomodoroInfoTooltip.style.opacity = '1';
      }, 0);
    }
  });

  completedPomodoros_min.addEventListener('mouseleave', function() {
    pomodoroInfoTooltip.style.display = 'none';
    pomodoroInfoTooltip.style.opacity = '0';
  });

  window.addEventListener('resize', function() {
    mainWindowResize();
  })

  function mainWindowResize() {
    let mainWindowHeight = window.innerHeight;
    let mainWindowWidth = window.innerWidth;

    if (mainWindowHeight <= 430) {
      pipCatShadow.style.opacity = '0';
    } else {
      pipCatShadow.style.opacity = '1';
    }

    if (mainWindowWidth <= 320) {
      pipInfoText.style.opacity = '0';
    } else {
      pipInfoText.style.opacity = '1';
    }
  }
});