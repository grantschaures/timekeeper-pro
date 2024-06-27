document.addEventListener("click", function(event) {

    isClickNotOnMenuElements(event, menuBtn, flags, popupMenu);
    isClickNotOnQuestionMenuElements(event, questionIcon, flags, popupQuestionMenu);
    isClickNotOnAboutElements(event, about_menu_container, about_container, menuBtn, about_exit, reportIcon, reportPath);
    isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath);
    isClickNotOnSettingsElements(event, settingsContainer, settings_exit, body, state, about_container);

    const excludeTargets = [blogBtn, blog_icon, blogMenuContainer, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container];
    const containers = [about_container, blog_container, menuBtn, blog_post_container, settingsContainer];
    const exitTargets = [about_exit, blog_exit, blog_post_exit, settings_exit];

    dealWithClick(excludeTargets, containers, exitTargets, event, reportIcon, homeIcon, main_elements, state, blogIcon, blogMenuContainer, blog_container, flags, blog_post_container, settings_exit, about_exit, body);
})

function dealWithClick(excludeTargets, containers, exitTargets, event, reportIcon, homeIcon, main_elements, state, blogIcon, blogMenuContainer, blog_container, flags, blog_post_container, settings_exit, about_exit, body) {
    // if the click is not any of the main menu windows or is an exit btn
    if ((!excludeTargets.includes(event.target) && !containers.some(container => container.contains(event.target))) || exitTargets.includes(event.target)) {
        // if user is exiting about or settings windows, make the setting the last one the user was on
        if (reportIcon.contains(event.target)) {
            alert("This feature is currently under development. Thank you for your patience.");
            // document.body.setAttribute('data-dashboard-mode', 'report');
            // state.lastSelectedMode = 'report';
            // main_elements.style.display = "none";
        } else if (homeIcon.contains(event.target)) {
            document.body.setAttribute('data-dashboard-mode', 'home');
            main_elements.style.display = "block";
            state.lastSelectedMode = "home"
            body.style.overflowY = 'scroll';

        } else if (blogIcon.contains(event.target)) {
            blogMenuContainer.click();

        } else if ((event.target === settings_exit) || (event.target === about_exit)) {
            if (state.lastSelectedMode === 'report') {
                document.body.setAttribute('data-dashboard-mode', 'report');
            } else if (state.lastSelectedMode === 'home') {
                document.body.setAttribute('data-dashboard-mode', 'home');
                main_elements.style.display = "block";
            } else if (state.lastSelectedMode === 'blog') {
                document.body.setAttribute('data-dashboard-mode', 'blog');
                blog_container.style.display = "flex";
            }
        } else if ((event.target !== aboutIconNotes) && (!deleteAccountPopup.contains(event.target)) && (!accountPopup.contains(event.target)) && (!loginQuestionMenuContainer.contains(event.target)) && (event.target !== popupOverlay)) {
            document.body.setAttribute('data-dashboard-mode', 'home');
            main_elements.style.display = "block";
            state.lastSelectedMode = 'home';
            body.style.overflowY = 'scroll';
        }
        
        if (flags.blogShowing == true) {
            blog_post_container.style.display = 'none';
            hideBlog(blogs);
        }
    }
}

function isClickNotOnAboutElements(event, about_menu_container, about_container, menuBtn, about_exit, reportIcon, reportPath) {
    let aboutElementsArr = [about_menu_container, about_container, menuBtn, reportIcon, reportPath];

    // Check if event.target is not contained within any of the aboutElementsArr
    // or if the event.target is the about_exit
    if (!aboutElementsArr.some(element => element.contains(event.target)) || event.target === about_exit) {
        about_container.style.display = "none";
    }
}

function isClickNotOnMenuElements(event, menuBtn, flags, popupMenu) {
    // if click is not on menu, hide menu
    if (!menuBtn.contains(event.target)) {
        flags.popupWindowShowing = false;
        popupMenu.style.opacity = '0';
        setTimeout(() => {
            popupMenu.style.display = "none"
        }, 50)
    }
}

function isClickNotOnQuestionMenuElements(event, questionIcon, flags, popupQuestionMenu) {
    // if click is not on menu, hide menu
    if (!questionIcon.contains(event.target)) {
        flags.popupQuestionWindowShowing = false;
        popupQuestionMenu.style.opacity = '0';
        setTimeout(() => {
            popupQuestionMenu.style.display = "none"
        }, 50)
    }
}

function isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath) {
    let blogElementsArr = [blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath];

    if (!blogElementsArr.some(element => element.contains(event.target)) || event.target === blog_exit) {
        blog_container.style.display = "none";
    }
}

function isClickNotOnSettingsElements(event, settingsContainer, settings_exit, body, state, about_container) {

    if (event.target === settings_exit) {
        settingsContainer.style.display = "none";

        if ((state.lastSelectedMode === "home") && (about_container.style.display !== "flex")) {
            body.style.overflowY = 'scroll';
        }
    }
}