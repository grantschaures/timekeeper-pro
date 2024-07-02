import { menuBtn, popupMenu, blogBtn, blog_icon, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, about_exit, blog_exit, blog_post_exit, blog_post_back, back_icons, exit_icons, main_elements, aboutContainer, blogContainer, settingsContainer, blog_post_container, blog_cells, blogs, settings_exit, pomodoroBtnContainer, backgroundsBtnContainer, start_stop_btn, reportIcon, reportPath, spaceIcon, homeIcon, blogMenuContainer, aboutIconNotes, body, isMobile, popupOverlay, questionIcon, popupQuestionMenu, privacyPolicyContainer, termsAndConditionsContainer, loginQuestionMenuContainer, accountPopup, deleteAccountPopup, goBackBtn, deleteAccountPopupNoBtn, deleteAccountPopupYesBtn, deleteAccountBtn, spaceContainer, shortcutsContainer, shortcutsPopup, shortcutsExit, reportContainer, flowTimeAnimationToggle, chillTimeAnimationToggle, flowAnimation, chillAnimation } from '../modules/dom-elements.js';

import { blogIdList, flags, counters, state } from '../modules/navigation-objects.js';

import { sessionState } from '../modules/state-objects.js';

import { flags as indexFlags, selectedBackground } from '../modules/index-objects.js';

import { deleteUserAccount } from '../state/delete-account.js'; // minified

import { setBackground, animationsFadeIn, animationsFadeOut } from '../main/index.js'; // minified

document.addEventListener("DOMContentLoaded", function() {

    // This may actually detect all mobile + iPad devices
    function isIpadCheck() {
        const userAgent = navigator.userAgent || window.opera;
        return /iPad/.test(userAgent) || (navigator.maxTouchPoints > 1);
    }
    let isIpad = isIpadCheck();

    setTimeout(() => {
        menuBtn.style.opacity = '1';

        if (!(isMobile)) {
            questionIcon.style.opacity = '1';
        }
    }, 1000)
    
    // event listeners
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

    blogMenuContainer.addEventListener("click", function(event) {

        // HIDING ELEMENTS
        subMainContainer.style.display = "none"; // hide main elements
        aboutContainer.style.display = "none"; // hide main blog container
        closeMenu(flags, popupMenu); // hide main menu

        if (flags.blogShowing) { // hide blog content
            blog_post_container.style.display = 'none';
            hideBlog(blogs);
        }
    
        // SHOWING ELEMENTS
        blogContainer.style.display = "flex"; // show main blog container

        // OTHER CHANGES
        body.style.overflowY = 'hidden'; // no scroll
        blog_exit.classList.add('resetRotation'); // triggers reset animation
        setDinkleDoinkSetting("home");
        subMainContainerTransition("none");

        resetMode(reportContainer);
        resetMode(spaceContainer);
    });

    about_menu_container.addEventListener("click", function() {

        // HIDING ELEMENTS
        subMainContainer.style.display = "none"; // hide main elements
        blogContainer.style.display = "none"; // hide main blog container
        closeMenu(flags, popupMenu); // hide main menu

        if (flags.blogShowing) { // hide blog content
            blog_post_container.style.display = 'none';
            hideBlog(blogs);
        }

        // SHOWING ELEMENTS
        aboutContainer.style.display = "flex"; // show about container

        // OTHER CHANGES
        body.style.overflowY = 'hidden'; // no scroll
        about_exit.classList.add('resetRotation'); // triggers reset animation
        setDinkleDoinkSetting("home");
        subMainContainerTransition("none");

        resetMode(reportContainer);
        resetMode(spaceContainer);
    });

    settings_menu_container.addEventListener("click", function() {

        // HIDING ELEMENTS
        blogContainer.style.display = "none"; // hide main blog container
        aboutContainer.style.display = "none"; // hide main blog container
        closeMenu(flags, popupMenu); // hide main menu

        // SHOWING ELEMENTS
        settingsContainer.style.display = "block";

        // if coming from blog or about (which hides subMainContainer)
        if (state.lastSelectedMode === 'home') {
            subMainContainer.style.display = "block";
        }

        // OTHER CHANGES
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if ((counters.settingsBtnClicked === 0) && (viewportWidth > 650)) {
            pomodoroBtnContainer.click();
        }

        counters.settingsBtnClicked++;
        body.style.overflowY = 'hidden'; // no scroll    
        settings_exit.classList.add('resetRotation'); // reset animation
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
    
    popupOverlay.addEventListener("click", function(event) {
        if ((flags.accountWindowShowing) && (!accountPopup.contains(event.target))) {
            goBackBtn.click();
        } else if ((flags.deleteAccountWindowShowing) && (!deleteAccountPopup.contains(event.target))) {
            deleteAccountPopupNoBtn.click();
        } else if ((flags.shortcutsWindowShowing) && (!shortcutsPopup.contains(event.target))) {
            hideShortcutsPopup(popupOverlay, shortcutsPopup);
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
            if (flags.blogShowing == true) {
                blog_post_container.style.display = 'none';

                //ensure that any visible blog becomes hidden when clicking out
                hideBlog(blogs);
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
    
        const excludeTargets = [blogBtn, blog_icon, blogMenuContainer, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, aboutIconNotes, popupOverlay]; // all stuff in the main menu and question menu + others
        const containers = [aboutContainer, blogContainer, menuBtn, questionIcon, blog_post_container, settingsContainer, popupQuestionMenu, deleteAccountPopup, accountPopup, loginQuestionMenuContainer];
        const exitTargets = [about_exit, blog_exit, blog_post_exit];
        const exitTargetsWithSettings = [about_exit, blog_exit, blog_post_exit, settings_exit];
    
        dealWithClick(excludeTargets, containers, exitTargets, exitTargetsWithSettings, event, reportIcon, homeIcon, state, spaceIcon, flags, blog_post_container);
    })

    document.addEventListener('keydown', (event) => handleLeftRightArrowKeys(event));

});

function handleLeftRightArrowKeys(event) {
    if (event.key === 'ArrowLeft') {
        if (state.lastSelectedMode === 'space') { // --> HOME
            setDinkleDoinkSetting("home"); // needs to execute first
            resetMode(reportContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("flex");
            setModeBackground("/images/iStock/iStock-1306875579-mid.jpg"); // hands
            fadeInAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute second
            
        } else if (state.lastSelectedMode === 'home') { // --> REPORT
            initializeNewMode(reportContainer);
            isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath);
            isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit);
            subMainContainerTransition("none");
            setModeBackground("/images/iStock/iStock-1253862403-mid-edit.jpg"); // basic
            fadeOutAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute first
            setDinkleDoinkSetting("report"); // needs to execute second

            if (flags.blogShowing) { // hide blog content
                blog_post_container.style.display = 'none';
                hideBlog(blogs);
            }
        }
    } else if (event.key === 'ArrowRight') {
        if (state.lastSelectedMode === 'report') { // --> HOME
            setDinkleDoinkSetting("home"); // needs to execute first
            resetMode(reportContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("flex");
            setModeBackground("/images/iStock/iStock-1306875579-mid.jpg"); // hands
            fadeInAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute second
            
        } else if (state.lastSelectedMode === 'home') { // --> SPACE
            initializeNewMode(spaceContainer);
            isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath);
            isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit);
            subMainContainerTransition("none");
            setModeBackground("/images/iStock/iStock-1394258314-mid.jpg"); // space
            fadeOutAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute first
            setDinkleDoinkSetting("space"); // needs to execute second

            if (flags.blogShowing) { // hide blog content
                blog_post_container.style.display = 'none';
                hideBlog(blogs);
            }
        }
    }
}

function setDinkleDoinkSetting(mode) { // and also state.lastSelectedMode value
    body.setAttribute('dinkle-doink-setting', mode);
    state.lastSelectedMode = mode;
}

function subMainContainerTransition(display) {
    if (display === "none") {
    
        subMainContainer.style.opacity = 0;
        subMainContainer.offsetHeight; // forcing reflow
        body.style.overflowY = 'hidden'; // ensuring no scroll can occur during 150ms transition
        setTimeout(() => {
            if (subMainContainer.style.opacity == 0) { // deals w/ edge case where user toggles right/left and back rapidly
                subMainContainer.style.display = display; // none
            }
        }, 150)
        
    } else if (display === "flex") {
        subMainContainer.style.display = display; // flex
        subMainContainer.offsetHeight; // forcing reflow
        setTimeout(() => {
            subMainContainer.style.opacity = 1;
        }, 0)
    }
}

function setModeBackground(imgPath) {
    var modeBackgroundImg = new Image();
    modeBackgroundImg.src = imgPath;
    
    modeBackgroundImg.onload = function() {
        document.documentElement.style.backgroundImage = `url('${imgPath}')`;
    }

    modeBackgroundImg.onerror = function() {
        console.error(`Failed to load image: ${imgPath}`);
    };
}

// function showMainElements() {}

function initializeNewMode(containerType) {
    containerType.style.display = "flex";
    containerType.offsetHeight; // forcing reflow
    setTimeout(() => {
        containerType.style.opacity = 1;
    }, 0)
}

function resetMode(containerType) {
    // console.log(containerType);
    containerType.style.opacity = 0;
    setTimeout(() => {
        if (containerType.style.opacity == 0) { // deals w/ edge case where user toggles right/left and back rapidly
            containerType.style.display = "none";
        }
        body.style.overflowY = 'scroll'; // re enable scroll for main elements
    }, 150)
}

function dealWithClick(excludeTargets, containers, exitTargets, exitTargetsWithSettings, event, reportIcon, homeIcon, state, spaceIcon, flags, blog_post_container) {
    // if the click is not any of the main menu windows or is an exit btn
    if ((!excludeTargets.includes(event.target) && !containers.some(container => container.contains(event.target))) || exitTargetsWithSettings.includes(event.target)) {
        // if user is exiting about or settings windows, make the setting the last one the user was on
        if (reportIcon.contains(event.target)) { // --> REPORT
            initializeNewMode(reportContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("none");
            setModeBackground("/images/iStock/iStock-1253862403-mid-edit.jpg"); // basic
            fadeOutAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute first
            setDinkleDoinkSetting("report"); // needs to execute second

        } else if (homeIcon.contains(event.target)) { // --> HOME
            setDinkleDoinkSetting("home"); // needs to execute first
            resetMode(reportContainer);
            resetMode(spaceContainer);
            subMainContainerTransition("flex");
            setModeBackground("/images/iStock/iStock-1306875579-mid.jpg"); // hands
            fadeInAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute second
            
        } else if (spaceIcon.contains(event.target)) { // --> SPACE
            initializeNewMode(spaceContainer);
            resetMode(reportContainer);
            subMainContainerTransition("none");
            setModeBackground("/images/iStock/iStock-1394258314-mid.jpg"); // space
            fadeOutAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle); // needs to execute first
            setDinkleDoinkSetting("space"); // needs to execute second
        }
        
        // when hitting a blog or about exit (or clicking outside those containers), or a settings exit if in home mode
        if ((exitTargets.includes(event.target)) || (state.lastSelectedMode === 'home')) {
            setDinkleDoinkSetting("home");
            subMainContainerTransition("flex");
            resetMode(reportContainer);
            resetMode(spaceContainer);
        }
        
        // hiding blog content
        if (flags.blogShowing == true) {
            blog_post_container.style.display = 'none';
            hideBlog(blogs);
        }
    }
}

function isClickNotOnAboutElements(event, about_menu_container, aboutContainer, menuBtn, about_exit, reportIcon, reportPath) {
    let aboutElementsArr = [about_menu_container, aboutContainer, menuBtn];

    // Check if event.target is not contained within any of the aboutElementsArr
    // or if the event.target is the about_exit
    if (!aboutElementsArr.some(element => element.contains(event.target)) || event.target === about_exit) {
        aboutContainer.style.display = "none";
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

function isClickNotOnBlogElements(event, blogMenuContainer, blog_post_container, menuBtn, blog_exit) {
    let blogElementsArr = [blogMenuContainer, blogContainer, blog_post_container, menuBtn];

    if (!blogElementsArr.some(element => element.contains(event.target)) || event.target === blog_exit) {
        blogContainer.style.display = "none";
    }
}

function isClickNotOnSettingsElements(event, settingsContainer, settings_exit, body) {

    if (event.target === settings_exit) {
        settingsContainer.style.display = "none";
        body.style.overflowY = 'scroll';
    }
}

function fadeOutAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle) {
    if (indexFlags.sessionInProgress) {
        // remove backgroundContainer background
        // remove animations if present

        setBackground("", 0); // removes background (regardless of current interval mode)

        if ((flowTimeAnimationToggle) && (indexFlags.inHyperFocus)) {
            animationsFadeOut(flowAnimation);
        }
        
        if ((chillTimeAnimationToggle) && (!indexFlags.inHyperFocus)) {
            animationsFadeOut(chillAnimation);
        }
    }
}

function fadeInAnimationsSessionBackground(indexFlags, flowTimeAnimationToggle, chillTimeAnimationToggle) {
    if (indexFlags.sessionInProgress) {
        if (indexFlags.inHyperFocus) {
            setBackground(selectedBackground.flowtime, 1);

            if (flowTimeAnimationToggle) {
                animationsFadeIn(flowAnimation, "block");
            }

        } else {
            setBackground(selectedBackground.chilltime, 1);

            if (chillTimeAnimationToggle) {
                animationsFadeIn(chillAnimation, "flex");
            }
        }
    }
}













function showBlog(blog_id, blogContainer, blog_post_container, blogIdList, flags) {
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
}