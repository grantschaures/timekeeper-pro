import { menuBtn, popupMenu, blogBtn, blog_icon, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, about_exit, blog_exit, blog_post_exit, blog_post_back, back_icons, exit_icons, main_elements, about_container, blog_container, settings_container, blog_post_container, blog_cells, blogs, settings_exit, pomodoroBtnContainer, backgroundsBtnContainer, start_stop_btn, reportIcon, reportPath, blogIcon, homeIcon, blogMenuContainer, aboutIconNotes, body, isMobile } from '../modules/dom-elements.js';

import { blogIdList, flags, counters, state } from '../modules/navigation-objects.js';

import { sessionState } from '../modules/state-objects.js';

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        menuBtn.style.opacity = '1';
    }, 1000)
    
    // event listeners
    menuBtn.addEventListener("click", function() {
        if (flags.popupWindowShowing) {
            flags.popupWindowShowing = false;
            popupMenu.style.opacity = '0';
            setTimeout(() => {
                popupMenu.style.display = "none"
            }, 50)
        } else {
            flags.popupWindowShowing = true;
            popupMenu.style.display = "flex";
            setTimeout(() => {
                popupMenu.classList.add('menuLanding');
                popupMenu.style.opacity = '1';
            }, 100);
        }
    })

    blogMenuContainer.addEventListener("click", function(event) {
        main_elements.style.display = "none";
        document.body.setAttribute('data-dashboard-mode', 'blog');
        state.lastSelectedMode = 'blog';

        //Hide blogs
        if (flags.blogShowing == true) {
            blog_post_container.style.display = 'none';
    
            //ensure that any visible blog becomes hidden when clicking out
            hideBlog(blogs);
        }
    
        //show blog popup window
        blog_container.style.display = "flex";

        body.style.overflowY = 'hidden';

        //Triggers reset animation once you enter for first time
        blog_exit.classList.add('resetRotation');
    });

    about_menu_container.addEventListener("click", function() {
        //Hide main elements
        main_elements.style.display = "none";
    
        //Hide blogs
        if (flags.blogShowing == true) {
            blog_post_container.style.display = 'none';
    
            //ensure that any visible blog becomes hidden when clicking out
            hideBlog(blogs);
        }
    
        //show blog popup window
        about_container.style.display = "flex";

        body.style.overflowY = 'hidden';

        //Triggers reset animation once you enter for first time
        about_exit.classList.add('resetRotation');
    });

    settings_menu_container.addEventListener("click", function() {
        // We don't necessarily need to hide the main elements
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if ((counters.settingsBtnClicked === 0) && (viewportWidth > 650)) {
            if (!isMobile) {
                pomodoroBtnContainer.click();
            } else {
                backgroundsBtnContainer.click();
            }
        }
        counters.settingsBtnClicked++;

        settings_container.style.display = "block"; //EDIT: changed from flex to block
        
        body.style.overflowY = 'hidden';
    
        //Triggers reset animation once you enter for first time
        settings_exit.classList.add('resetRotation');
    });

    login_menu_container.addEventListener("click", function() {
        // alert("This feature is currently under development. Thank you for your patience.");
    
        //eventually uncomment this out to continue w/ login-signup development
        if (sessionState.loggedIn === false) {
            window.location.href = "/login";
        } else {
            logoutUser(sessionState);
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
            blog_container.style.display = "flex";

            flags.blogShowing = false;
        })
    })

    var blog_id; //actually the blog cell id

    blog_cells.forEach(function(blog_cell) {
        blog_cell.addEventListener('click', function() {
            blog_id = blog_cell.id;
            showBlog(blog_id, blog_container, blog_post_container, blogIdList, flags);

            blog_post_exit.classList.add('resetRotation');
            blog_post_back.classList.add('resetBounce');
        })
    })

    document.addEventListener("click", function(event) {

        isClickNotOnMenuElements(event, menuBtn, flags, popupMenu);
        isClickNotOnAboutElements(event, about_menu_container, about_container, menuBtn, about_exit, reportIcon, reportPath);
        isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath);
        isClickNotOnSettingsElements(event, settings_menu_container, start_stop_btn, aboutIconNotes, settings_container, menuBtn, settings_exit, body, state, about_container);

        const excludeTargets = [blogBtn, blog_icon, blogMenuContainer, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container];
        const containers = [about_container, blog_container, menuBtn, blog_post_container, settings_container];
        const exitTargets = [about_exit, blog_exit, blog_post_exit, settings_exit];

        dealWithClick(excludeTargets, containers, exitTargets, event, reportIcon, homeIcon, main_elements, state, blogIcon, blogMenuContainer, blog_container, flags, blog_post_container, settings_exit, about_exit, body);
    })
});

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
        } else {
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

function showBlog(blog_id, blog_container, blog_post_container, blogIdList, flags) {
    //Hide the blog container
    blog_container.style.display = "none";

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
    })
};

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

function isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath) {
    let blogElementsArr = [blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath];

    if (!blogElementsArr.some(element => element.contains(event.target)) || event.target === blog_exit) {
        blog_container.style.display = "none";
    }
}

function isClickNotOnSettingsElements(event, settings_menu_container, start_stop_btn, aboutIconNotes, settings_container, menuBtn, settings_exit, body, state, about_container) {
    let settingsElementsArr = [settings_menu_container, settings_container, menuBtn];

    if ((!settingsElementsArr.some(element => element.contains(event.target)) && (event.target !== start_stop_btn) && (event.target !== aboutIconNotes)) || event.target === settings_exit) {
        settings_container.style.display = "none";

        if ((state.lastSelectedMode === "home") && (about_container.style.display !== "flex")) {
            body.style.overflowY = 'scroll';
        }
    }
}