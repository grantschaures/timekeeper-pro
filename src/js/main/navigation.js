import { menuBtn, popupMenu, blogBtn, blog_icon, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, about_exit, blog_exit, blog_post_exit, blog_post_back, back_icons, exit_icons, main_elements, aboutContainer, blogContainer, settingsContainer, blog_post_container, blog_cells, blogs, settings_exit, pomodoroBtnContainer, backgroundsBtnContainer, start_stop_btn, reportIcon, reportPath, spaceIcon, homeIcon, blogMenuContainer, aboutIconNotes, body, isMobile, popupOverlay, questionIcon, popupQuestionMenu, privacyPolicyContainer, termsAndConditionsContainer, loginQuestionMenuContainer, accountPopup, deleteAccountPopup, goBackBtn, deleteAccountPopupNoBtn, deleteAccountPopupYesBtn, deleteAccountBtn, spaceContainer, shortcutsContainer, shortcutsPopup, shortcutsExit, dashboardContainer, flowTimeAnimationToggle, chillTimeAnimationToggle, flowAnimation, chillAnimation, target_hours_input, streaksContainer, threeWayToggle, labelToDeleteContainer, confirmLabelDeletionPopup, labelSelectionRow, confirmLabelDeletionNoBtn, sessionSummaryOkBtn, sessionSummarySignupPromptPopup, HC_icon_signup_prompt, settingsGUIContainer, darkLightThemeGUIContainer } from '../modules/dom-elements.js';
import { blogIdList, flags, counters, state } from '../modules/navigation-objects.js';
import { sessionState } from '../modules/state-objects.js';
import { dashboardCatIds, flags as indexFlags, tempCounters} from '../modules/index-objects.js';
import { labelArrs, labelDict, labelFlags, flags as notesFlags, selectedLabelDict } from '../modules/notes-objects.js';
import { chimePath, bellPath, soundMap } from '../modules/sound-map.js';

import { deleteUserAccount } from '../state/delete-account.js'; // minified
import { animationsFadeIn, animationsFadeOut, triggerSilentAlertAudioMobile } from './index.js'; // minified

window.addEventListener('popstate', (event) => {
    const hash = window.location.hash.substring(1);
    if (event.state && event.state.window) {
        let window = event.state.window;
        if (window === 'blog') {
            // open blog
            openBlogContainer();
        } else if (window === 'about') {
            // open about page
            openAboutContainer();
        } else if (window === 'settings') {
            // open settings window
            openSettingsContainer();
        }
    } else if (hash === "") {
        setDinkleDoinkSetting("home");
        subMainContainerTransition("flex");
        resetMode(dashboardContainer);
        resetMode(spaceContainer);
        aboutContainer.style.display = "none";
        blogContainer.style.display = "none";
        hideSettingsContainer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    const hash = window.location.hash.substring(1);
    if ((path === 'blog') && (hash === "")) {
        // open blog
        openBlogContainer();
    } else if (path === 'about') {
        // open about page
        openAboutContainer();
    } else if (path === 'settings') {
        history.pushState({}, '', '/');
    }

    if (hash) {
        displayBlogPost(hash); // Call your function to display the correct blog post
    }

});

document.addEventListener("stateUpdated", function() {

    // This may actually detect all mobile + iPad devices
    function isIpadCheck() {
        const userAgent = navigator.userAgent || window.opera;
        return /iPad/.test(userAgent) || (navigator.maxTouchPoints > 1);
    }
    let isIpad = isIpadCheck();

    if (!isMobile) {
        questionIcon.style.display = 'flex';
        streaksContainer.style.display = 'flex';
        settingsGUIContainer.style.display = 'flex';
        darkLightThemeGUIContainer.style.display = 'flex';
    }

    setTimeout(() => {
        menuBtn.style.opacity = '1';
        flags.canToggleSwitch = true;

        if (!(isMobile)) {
            questionIcon.style.opacity = '1';
            streaksContainer.style.opacity = '1';
            settingsGUIContainer.style.opacity = '1';
            darkLightThemeGUIContainer.style.opacity = '1';

            setTimeout(() => {
                streaksContainer.style.transition = 'opacity 0.25s ease-in-out, background-color 0.25s ease';
                darkLightThemeGUIContainer.style.transition = 'opacity 0.25s ease-in-out, background-color 0.25s ease';
            }, 1000)
        }
    }, 1000)
    
    // event listeners

    window.addEventListener('beforeunload', function (event) {

        if (indexFlags.sessionInProgress) {
            // Prevent the default action of closing the tab
            event.preventDefault();
        
            // Chrome requires returnValue to be set
            event.returnValue = ''; // Some browsers will show a default dialog
        
            // Returning undefined or nothing also works in many cases
            return undefined;
        }
    });

    menuBtn.addEventListener("click", function() {
        if (flags.popupWindowShowing) {
            closeMenu(flags, popupMenu);
        } else {
            openMenu(flags, popupMenu);
        }
    })
    
    questionIcon.addEventListener("click", function() {
        if (flags.popupQuestionWindowShowing) {
            closeQuestionMenu(flags, popupQuestionMenu);
        } else {
            openQuestionMenu(flags, popupQuestionMenu);
        }
    })

    blogMenuContainer.addEventListener("click", function() {
        openBlogContainer();
    });

    about_menu_container.addEventListener("click", function() {
        openAboutContainer()
    });

    settings_menu_container.addEventListener("click", function() {
        openSettingsContainer();
    });

    settingsGUIContainer.addEventListener("click", function() {
        if (!flags.settingsContainerShowing) {
            openSettingsContainer();
        } else {
            hideSettingsContainer();
        }
    });

    // Question Menu
    privacyPolicyContainer.addEventListener("click", function() {
        const url = window.location.origin + '/privacy-policy';

        // Open the specified URL in a new tab
        window.open(url, '_blank');
    })

    termsAndConditionsContainer.addEventListener("click", function() {
        const url = window.location.origin + '/terms-and-conditions';

        // Open the specified URL in a new tab
        window.open(url, '_blank');
    })

    window.addEventListener("resize", function() {
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (viewportWidth <= 725) {
            flags.popupQuestionWindowShowing = false;
            popupQuestionMenu.style.opacity = '0';
            popupQuestionMenu.style.display = "none"
        }
    });

    // similar function in index.js
    function logoutUser() {
        fetch('/api/state/logout', {
            method: 'POST'
        })
        .then(() => {
            sessionState.loggedIn = false;
            window.location.href = "/";
            console.log("Logged out successfully.");
        })
        .catch(error => console.error('Logout failed', error));
    }

    login_menu_container.addEventListener("click", function() {
        if (sessionState.loggedIn === false) {
            window.location.href = "/login";
        } else {
            logoutUser(sessionState);
        }
    });

    loginQuestionMenuContainer.addEventListener("click", function() {
        if (sessionState.loggedIn === false) {
            window.location.href = "/login";
        } else {
            showAccountPopup(popupOverlay, accountPopup);
        }
    })

    goBackBtn.addEventListener("click", function() {
        hideAccountPopup(popupOverlay, accountPopup);
    })

    shortcutsContainer.addEventListener("click", function() {
        showShortcutsPopup(popupOverlay, shortcutsPopup);
    })
    
    // TO-DO: update this for sessionSummaryPopup
    popupOverlay.addEventListener("click", function(event) {
        if ((flags.accountWindowShowing) && (!accountPopup.contains(event.target))) {
            goBackBtn.click();
        } else if ((flags.deleteAccountWindowShowing) && (!deleteAccountPopup.contains(event.target))) {
            deleteAccountPopupNoBtn.click();
        } else if ((flags.shortcutsWindowShowing) && (!shortcutsPopup.contains(event.target))) {
            hideShortcutsPopup(popupOverlay, shortcutsPopup);
        } else if ((notesFlags.confirmLabelDeletionWindowShowing) && (!confirmLabelDeletionPopup.contains(event.target))) {
            confirmLabelDeletionNoBtn.click();
        } else if ((flags.sessionSummarySignupPromptPopupShowing) && (!sessionSummarySignupPromptPopup.contains(event.target) && (event.target !== sessionSummaryOkBtn))) {
            hideSessionSummarySignupPromptPopup();
            popupOverlay.style.display = 'none';
            subMainContainerTransition("flex");
        }
    })

    shortcutsExit.addEventListener("click", function() {
        hideShortcutsPopup(popupOverlay, shortcutsPopup);
    })

    // delete account stuff
    deleteAccountBtn.addEventListener("click", async function() {
        showDeleteAccountPopup(popupOverlay, deleteAccountPopup);
    })
    
    deleteAccountPopupNoBtn.addEventListener("click", function() {
        hideDeleteAccountPopup(popupOverlay, deleteAccountPopup);
    })
    
    deleteAccountPopupYesBtn.addEventListener("click", async function() {
        // this condition isn't necessary since user would need to be
        // logged in anyway in order to click on the deleteAccount button
        if (sessionState.loggedIn) {
            await deleteUserAccount();
        }
        window.location.href = "/";
    })
    // delete account stuff

    exit_icons.forEach(function(icon) {
        icon.addEventListener('mouseover', function() {
            icon.classList.remove('resetRotation');
            icon.classList.add('triggerRotation');
        })
    
        icon.addEventListener('mouseout', function() {
            icon.classList.remove('triggerRotation');
            icon.classList.add('resetRotation');
        })
    })

    back_icons.forEach(function(icon) {
        icon.addEventListener('mouseover', function() {
            icon.classList.remove('resetBounce');
            icon.classList.add('triggerBounceLeft');
        })
    
        icon.addEventListener('mouseout', function() {
            icon.classList.remove('TriggerBounceLeft');
            icon.classList.add('resetBounce');
        })

        icon.addEventListener('click', function() {
            //Hide blogs
            if (flags.blogShowing) {
                blog_post_container.style.display = 'none';

                //ensure that any visible blog becomes hidden when clicking out
                hideBlog(blogs);

                // remove hash
                history.replaceState(null, null, window.location.pathname);
            }

            //show blog popup window
            blogContainer.style.display = "flex";

            flags.blogShowing = false;
        })
    })

    var blog_id; //actually the blog cell id

    blog_cells.forEach(function(blog_cell) {
        blog_cell.addEventListener('click', function() {
            blog_id = blog_cell.id;
            showBlog(blog_id, blogContainer, blog_post_container, blogIdList, flags);

            blog_post_exit.classList.add('resetRotation');
            blog_post_back.classList.add('resetBounce');
        })
    })

    document.addEventListener("click", function(event) {

        isClickNotOnMenuElements(event, menuBtn, flags, popupMenu);
        isClickNotOnQuestionMenuElements(event, questionIcon, flags, popupQuestionMenu);
        isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath);
        isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit);
        isClickNotOnSettingsElements(event, settingsContainer, settings_exit, body);
    
        const excludeTargets = [blogBtn, blog_icon, blogMenuContainer, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, aboutIconNotes, popupOverlay, start_stop_btn]; // all stuff in the main menu and question menu + others
        const containers = [aboutContainer, blogContainer, menuBtn, questionIcon, blog_post_container, settingsContainer, popupQuestionMenu, deleteAccountPopup, accountPopup, loginQuestionMenuContainer, shortcutsPopup, confirmLabelDeletionPopup, labelSelectionRow];
        const exitTargets = [about_exit, blog_exit, blog_post_exit];
        const exitTargetsWithSettings = [about_exit, blog_exit, blog_post_exit, settings_exit];
    
        dealWithClick(excludeTargets, containers, exitTargets, exitTargetsWithSettings, event, reportIcon, homeIcon, state, spaceIcon, flags, blog_post_container);
    })

    document.addEventListener('keydown', (event) => handleLeftRightArrowKeys(event));

});

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

function displayBlogPost(postId) {
    // hiding main elements
    subMainContainer.style.display = "none";

    const blogPost = document.getElementById(postId);    
    if (blogPost) {
        // adjust URL
        window.location.hash = postId;
        blog_post_container.scrollTo(0, 0);

        //Hide the blog container
        blogContainer.style.display = "none";

        //Show the new actual blog post window (white, now)
        blog_post_container.style.display = "block";

        flags.blogShowing = true;

        document.getElementById(postId).classList.remove("hidden");
    } else {
        history.pushState({}, '', '/');
    }
}

function openSettingsContainer() {
    // HIDING ELEMENTS
    blogContainer.style.display = "none"; // hide main blog container
    aboutContainer.style.display = "none"; // hide main blog container
    closeMenu(flags, popupMenu); // hide main menu

    // SHOWING ELEMENTS
    settingsContainer.style.display = "block";

    // if coming from blog or about (which hides subMainContainer)
    if (state.lastSelectedMode === 'home') {
        subMainContainer.style.display = "flex";
        subMainContainer.offsetHeight; // forcing reflow
        setTimeout(() => {
            subMainContainer.style.opacity = 1;
        }, 0)
    }

    history.pushState({ window: "settings" }, '', `/${"settings"}`);

    // OTHER CHANGES
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    if ((counters.settingsBtnClicked === 0) && (viewportWidth > 650)) {
        pomodoroBtnContainer.click();
    }

    triggerSilentAlertAudioMobile(soundMap.Chime, soundMap.Bell, chimePath, bellPath, indexFlags);

    flags.settingsContainerShowing = true;
    counters.settingsBtnClicked++;
    body.style.overflowY = 'hidden'; // no scroll    
    settings_exit.classList.add('resetRotation'); // reset animation
}

function openAboutContainer() {
    // HIDING ELEMENTS
    subMainContainer.style.display = "none"; // hide main elements
    blogContainer.style.display = "none"; // hide main blog container
    closeMenu(flags, popupMenu); // hide main menu
        
    if (flags.blogShowing) { // hide blog content
        blog_post_container.style.display = 'none';
        hideBlog(blogs);
    }

    if (flags.settingsContainerShowing) {
        hideSettingsContainer();
    }

    // SHOWING ELEMENTS
    aboutContainer.style.display = "flex"; // show about container
    fadeInUIContainer(streaksContainer, isMobile); // showing streaks container
    fadeInUIContainer(darkLightThemeGUIContainer, isMobile); // showing darkLightThemeGUIContainer
    history.pushState({ window: "about" }, '', `/${"about"}`);

    // OTHER CHANGES
    body.style.overflowY = 'hidden'; // no scroll
    about_exit.classList.add('resetRotation'); // triggers reset animation
    setDinkleDoinkSetting("home"); // needs to execute first
    subMainContainerTransition("none");
    fadeInAnimations(); // needs to execute second

    resetMode(dashboardContainer);
    resetMode(spaceContainer);
}

function openBlogContainer() {
    // HIDING ELEMENTS
    subMainContainer.style.display = "none"; // hide main elements
    aboutContainer.style.display = "none"; // hide main blog container
    closeMenu(flags, popupMenu); // hide main menu

    if (flags.blogShowing) { // hide blog content
        blog_post_container.style.display = 'none';
        hideBlog(blogs);
    }

    if (flags.settingsContainerShowing) {
        hideSettingsContainer();
    }

    // SHOWING ELEMENTS
    blogContainer.style.display = "flex"; // show main blog container
    fadeInUIContainer(streaksContainer, isMobile); // showing streaks container
    fadeInUIContainer(darkLightThemeGUIContainer, isMobile); // showing darkLightThemeGUIContainer
    history.pushState({ window: "blog" }, '', `/${"blog"}`);

    // OTHER CHANGES
    body.style.overflowY = 'hidden'; // no scroll
    blog_exit.classList.add('resetRotation'); // triggers reset animation
    setDinkleDoinkSetting("home"); //  needs to execute first
    subMainContainerTransition("none");
    fadeInAnimations(); // needs to execute second

    resetMode(dashboardContainer);
    resetMode(spaceContainer);
}

function fadeInUIContainer(container, isMobile) {
    if (!isMobile) {
        container.style.display = 'flex';
        setTimeout(() => {
            container.style.opacity = 1;
        }, 0)
    }
}

function fadeOutUIContainer(container) {
    container.style.opacity = 0;
    setTimeout(() => {
        container.style.display = 'none';
    }, 250)
}

function slimeSwitch() {
    addPseudoElementStyle('scaleX(1.25)');
    setTimeout(() => {
        addPseudoElementStyle('scaleX(1)');
    }, 150) // halfway through toggle switch
}

function addPseudoElementStyle(transformValue) {
    let styleElement = document.getElementById('pseudo-style');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'pseudo-style';
        document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
        .dinkle-doink-mode::after {
            transform: ${transformValue};
        }
    `;
}

function handleLeftRightArrowKeys(event) {

    // add any additional inputs here
    let flagArr = [notesFlags.noteTaskInputContainerShowing, notesFlags.noteTaskInputContainerEditShowing, notesFlags.createLabelWindowOpen, notesFlags.updateLabelWindowOpen, flags.settingsContainerShowing, flags.sessionSummaryPopupShowing, flags.sessionSummarySignupPromptPopupShowing, !flags.canToggleSwitch, (document.activeElement.id === 'target-hours')]

    if (flags.allowToggleSwitch && flagArr.every(flag => !flag)) {
        if (event.key === 'ArrowLeft') {
            if (state.lastSelectedMode === 'space') { // --> HOME
                slimeSwitch();
                hideDashboardCat();
                fadeInUIContainer(streaksContainer, isMobile);
                fadeInUIContainer(darkLightThemeGUIContainer, isMobile); // showing darkLightThemeGUIContainer
                setDinkleDoinkSetting("home"); // needs to execute first
                resetMode(dashboardContainer);
                resetMode(spaceContainer);
                subMainContainerTransition("flex");
                fadeInAnimations(); // needs to execute second
                
            } else if (state.lastSelectedMode === 'home') { // --> REPORT
                history.pushState({}, '', '/');
                slimeSwitch();
                displayDashboardCat();
                fadeOutUIContainer(streaksContainer);
                fadeOutUIContainer(darkLightThemeGUIContainer);
                initializeNewMode(dashboardContainer);
                isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath);
                isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit);
                subMainContainerTransition("none");
                fadeOutAnimations(); // needs to execute first
                setDinkleDoinkSetting("report"); // needs to execute second
                
                if (flags.blogShowing) { // hide blog content
                    blog_post_container.style.display = 'none';
                    hideBlog(blogs);
                }
            }
        } else if (event.key === 'ArrowRight') {
            if (state.lastSelectedMode === 'report') { // --> HOME
                slimeSwitch();
                hideDashboardCat();
                fadeInUIContainer(streaksContainer, isMobile);
                fadeInUIContainer(darkLightThemeGUIContainer, isMobile); // showing darkLightThemeGUIContainer
                setDinkleDoinkSetting("home"); // needs to execute first
                resetMode(dashboardContainer);
                resetMode(spaceContainer);
                subMainContainerTransition("flex");
                fadeInAnimations(); // needs to execute second
                
            } else if (state.lastSelectedMode === 'home') { // --> SPACE
                history.pushState({}, '', '/');
                slimeSwitch();
                hideDashboardCat();
                fadeOutUIContainer(streaksContainer);
                fadeOutUIContainer(darkLightThemeGUIContainer);
                initializeNewMode(spaceContainer);
                isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath);
                isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit);
                subMainContainerTransition("none");
                fadeOutAnimations(); // needs to execute first
                setDinkleDoinkSetting("space"); // needs to execute second
    
                if (flags.blogShowing) { // hide blog content
                    blog_post_container.style.display = 'none';
                    hideBlog(blogs);
                }
            }
        }
        switchDelay(flags);
    }
}

// purpose of this function is to prevent goons from spamming the three-way toggle for no good reason
function switchDelay(flags) {
    flags.allowToggleSwitch = false;
    setTimeout(() => {
        flags.allowToggleSwitch = true;
    }, 250)
}

function setDinkleDoinkSetting(mode) { // and also state.lastSelectedMode value
    body.setAttribute('dinkle-doink-setting', mode);
    state.lastSelectedMode = mode;
}

export function subMainContainerTransition(display) {
    if (display === "none") {
        subMainContainer.style.opacity = 0;
        subMainContainer.offsetHeight; // forcing reflow
        body.style.overflowY = 'hidden'; // ensuring no scroll can occur during 150ms transition
        setTimeout(() => {
            if (subMainContainer.style.opacity == 0) { // deals w/ edge case where user toggles right/left and back rapidly
                subMainContainer.style.display = display; // none
            }
        }, 150)

        if (indexFlags.pipWindowOpen) {
            document.getElementById('pip-cat-shadow').style.opacity = '0';
        }
        
    } else if (display === "flex") {
        subMainContainer.style.display = display; // flex
        subMainContainer.offsetHeight; // forcing reflow
        setTimeout(() => {
            subMainContainer.style.opacity = 1;
        }, 0)

        if (indexFlags.pipWindowOpen) {
            document.getElementById('pip-cat-shadow').style.opacity = '1';
        }
    }
}

function initializeNewMode(containerType) {
    setTimeout(() => {
        containerType.style.display = "flex";
        containerType.offsetHeight; // forcing reflow
        setTimeout(() => {
            containerType.style.opacity = 1;
        }, 0)
    }, 100)
}

function resetMode(containerType) {
    containerType.classList.add('no-transition');
    containerType.style.opacity = 0;
    setTimeout(() => {
        if (containerType.style.opacity == 0) { // deals w/ edge case where user toggles right/left and back rapidly
            containerType.style.display = "none";
        }
        body.style.overflowY = 'scroll'; // re enable scroll for main elements
        containerType.classList.remove('no-transition'); // re enable 0.5s opacity transition for report or space container
    }, 150)
}

function dealWithClick(excludeTargets, containers, exitTargets, exitTargetsWithSettings, event, reportIcon, homeIcon, state, spaceIcon, flags, blog_post_container) {
    // if the click is not any of the main menu windows or is an exit btn
    if ((!excludeTargets.includes(event.target) && !containers.some(container => container.contains(event.target))) || exitTargetsWithSettings.includes(event.target)) {
        // if user is exiting about or settings windows, make the setting the last one the user was on
        if (reportIcon.contains(event.target)) { // --> REPORT
            if (state.lastSelectedMode !== 'report') {
                slimeSwitch(); 
            }

            history.pushState({}, '', '/');
            displayDashboardCat();
            fadeOutUIContainer(streaksContainer);
            fadeOutUIContainer(darkLightThemeGUIContainer);
            initializeNewMode(dashboardContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("none");
            fadeOutAnimations(); // needs to execute first
            setDinkleDoinkSetting("report"); // needs to execute second

        } else if (homeIcon.contains(event.target)) { // --> HOME
            if (state.lastSelectedMode !== 'home') {
                slimeSwitch(); 
            }

            hideDashboardCat();
            fadeInUIContainer(streaksContainer, isMobile);
            fadeInUIContainer(darkLightThemeGUIContainer, isMobile); // showing darkLightThemeGUIContainer
            setDinkleDoinkSetting("home"); // needs to execute first
            resetMode(dashboardContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("flex");
            fadeInAnimations(); // needs to execute second
            
        } else if (spaceIcon.contains(event.target)) { // --> SPACE
            if (state.lastSelectedMode !== 'space') {
                slimeSwitch(); 
            }

            history.pushState({}, '', '/');
            hideDashboardCat();
            fadeOutUIContainer(streaksContainer);
            fadeOutUIContainer(darkLightThemeGUIContainer);
            initializeNewMode(spaceContainer);
            resetMode(dashboardContainer);
            subMainContainerTransition("none");
            fadeOutAnimations(); // needs to execute first
            setDinkleDoinkSetting("space"); // needs to execute second
        }
        
        // when hitting a blog or about exit (or clicking outside those containers), or a settings exit if in home mode
        setTimeout(() => {
            // const path = window.location.pathname.split('/').pop();
            if (((exitTargets.includes(event.target)) || (state.lastSelectedMode === 'home')) && (!flags.sessionSummaryPopupShowing) && (!flags.sessionSummarySignupPromptPopupShowing) && (!settingsGUIContainer.contains(event.target)) && (!flags.settingsContainerShowing) && (!darkLightThemeGUIContainer.contains(event.target))) {
                setDinkleDoinkSetting("home");
                subMainContainerTransition("flex");
                resetMode(dashboardContainer);
                resetMode(spaceContainer);
                history.pushState({}, '', '/');
            }
        }, 0)
        
        // hiding blog content
        if ((flags.blogShowing) && (!darkLightThemeGUIContainer.contains(event.target))) {
            blog_post_container.style.display = 'none';
            hideBlog(blogs);
        }
    }
}

function displayDashboardCat() {
    if ((indexFlags.muffinToggle) && ((!indexFlags.sessionInProgress) || (indexFlags.inHyperFocus)) && (!indexFlags.pipWindowOpen)) {
        let randNum = Math.floor(Math.random() * 9);
        tempCounters.dashboardCatIdsArrIndex = randNum;
        let dashboardCatId = dashboardCatIds[randNum];
        document.getElementById(dashboardCatId).style.display = 'flex';
    }
}

function hideDashboardCat() {
    let dashboardCatId = dashboardCatIds[tempCounters.dashboardCatIdsArrIndex];
        document.getElementById(dashboardCatId).style.display = 'none';
}

function isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath) {
    let aboutElementsArr = [about_menu_container, aboutContainer, menuBtn, questionIcon, popupQuestionMenu, shortcutsPopup, accountPopup, popupOverlay, darkLightThemeGUIContainer, settingsContainer];

    // Check if event.target is not contained within any of the aboutElementsArr
    // or if the event.target is the about_exit
    if (!aboutElementsArr.some(element => element.contains(event.target)) || event.target === about_exit) {
        aboutContainer.style.display = "none";
    }
}

function isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit) {
    let blogElementsArr = [blogMenuContainer, blogContainer, blog_post_container, menuBtn, questionIcon, popupQuestionMenu, shortcutsPopup, accountPopup, popupOverlay, darkLightThemeGUIContainer, settingsContainer];

    if (!blogElementsArr.some(element => element.contains(event.target)) || event.target === blog_exit) {
        blogContainer.style.display = "none";
    }
}

function isClickNotOnMenuElements(event, menuBtn, flags, popupMenu) {
    // if click is not on menu, hide menu
    if (!menuBtn.contains(event.target)) {
        closeMenu(flags, popupMenu);
    }
}

function isClickNotOnQuestionMenuElements(event, questionIcon, flags, popupQuestionMenu) {
    // if click is not on question menu, hide menu
    if (!questionIcon.contains(event.target)) {
        closeQuestionMenu(flags, popupQuestionMenu);
    }
}

function isClickNotOnSettingsElements(event, settingsContainer, settings_exit, body) {
    if ((event.target === settings_exit)) {
        hideSettingsContainer();
    }
}

function hideSettingsContainer() {
    // Programmatic Changes
    flags.settingsContainerShowing = false;
    
    // GUI changes
    settingsContainer.style.display = "none";
    body.style.overflowY = 'scroll';

    // URL changes
    history.pushState({}, '', '/');
}

function fadeOutAnimations() {
    animationsFadeOut(flowAnimation);
    animationsFadeOut(chillAnimation);
}

function fadeInAnimations() {
    if (indexFlags.inHyperFocus) {
        if (indexFlags.flowTimeAnimationToggle) {
            animationsFadeIn(flowAnimation, "block");
        }

    } else {
        if ((indexFlags.chillTimeAnimationToggle) || (!indexFlags.sessionInProgress)) {
            animationsFadeIn(chillAnimation, "flex");
        }
    }
}

function showBlog(blog_id, blogContainer, blog_post_container, blogIdList, flags) {
    // adjust URL
    window.location.hash = blogIdList[blog_id];
    blog_post_container.scrollTo(0, 0);

    //Hide the blog container
    blogContainer.style.display = "none";

    //Show the new actual blog post window (white, now)
    blog_post_container.style.display = "block";

    flags.blogShowing = true;

    document.getElementById(blogIdList[blog_id]).classList.remove("hidden");
};

function hideBlog(blogs) {
    blogs.forEach(function(blog) {
        if (!document.getElementById(blog.id).classList.contains("hidden")) {
            document.getElementById(blog.id).classList.add("hidden");
        }
    });
    pauseVideo();

    flags.blogShowing = false;
};

// main menu
function closeMenu(flags, popupMenu) {
    flags.popupWindowShowing = false;
    popupMenu.style.opacity = '0';
    setTimeout(() => {
        popupMenu.style.display = "none"
    }, 50)
}

function openMenu(flags, popupMenu) {
    flags.popupWindowShowing = true;
    popupMenu.style.display = "flex";
    setTimeout(() => {
        popupMenu.classList.add('menuLanding');
        popupMenu.style.opacity = '1';
    }, 100);
}

// question window
function closeQuestionMenu(flags, popupQuestionMenu) {
    flags.popupQuestionWindowShowing = false;
    popupQuestionMenu.style.opacity = '0';
    setTimeout(() => {
        popupQuestionMenu.style.display = "none"
    }, 50)
}

function openQuestionMenu(flags, popupQuestionMenu) {
    flags.popupQuestionWindowShowing = true;
    popupQuestionMenu.style.display = "flex";
    setTimeout(() => {
        popupQuestionMenu.classList.add('questionMenuLanding');
        popupQuestionMenu.style.opacity = '1';
    }, 100);
}

// account popup (btn in question window)
function showAccountPopup(popupOverlay, accountPopup) {
    flags.accountWindowShowing = true;
    popupOverlay.style.display = "flex"; 
    accountPopup.style.display = "block";
    body.style.overflowY = 'hidden';
}

function hideAccountPopup(popupOverlay, accountPopup) {
    flags.accountWindowShowing = false;
    accountPopup.style.display = "none";
    popupOverlay.style.display = "none";
    body.style.overflowY = 'scroll';
}

// delete account functions
function showDeleteAccountPopup(popupOverlay, deleteAccountPopup) {
    flags.deleteAccountWindowShowing = true;
    popupOverlay.style.display = "flex";
    deleteAccountPopup.style.display = "block";
}

function hideDeleteAccountPopup(popupOverlay, deleteAccountPopup) {
    flags.deleteAccountWindowShowing = false;
    deleteAccountPopup.style.display = "none";
    popupOverlay.style.display = "none";
}

// shortcut functionality

function showShortcutsPopup(popupOverlay, shortcutsPopup) {
    flags.shortcutsWindowShowing = true;
    popupOverlay.style.display = "flex"; 
    shortcutsPopup.style.display = "block";
    body.style.overflowY = 'hidden';
}

function hideShortcutsPopup(popupOverlay, shortcutsPopup) {
    flags.shortcutsWindowShowing = false;
    shortcutsPopup.style.display = "none";
    popupOverlay.style.display = "none";
    body.style.overflowY = 'scroll';
}

// session summary signup prompt popup hide
function hideSessionSummarySignupPromptPopup() {
    flags.sessionSummarySignupPromptPopupShowing = false;
    sessionSummarySignupPromptPopup.style.display = "none";
    HC_icon_signup_prompt.classList.remove('hyperChillSlowRotate');
    sessionSummarySignupPromptPopup.style.opacity = 0;
}