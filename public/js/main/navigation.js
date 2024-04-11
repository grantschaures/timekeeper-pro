document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.getElementById("menuBtn");
    const popup_window = document.getElementById("popup-menu");
    const blogBtn = document.getElementById("blogBtn");
    const blog_icon = document.getElementById("blogIcon"); // icon in popup-menu
    const about_btn = document.getElementById("aboutBtn");
    const about_icon = document.getElementById("aboutIcon");
    const about_menu_container = document.getElementById("aboutMenuContainer");
    const settings_btn = document.getElementById("settingsBtn");
    const settings_icon = document.getElementById("settingsIcon");
    const settings_menu_container = document.getElementById("settingsMenuContainer");
    const logInOut_btn = document.getElementById("logInOutBtn");
    const login_icon = document.getElementById("loginIcon");
    const login_menu_container = document.getElementById("loginMenuContainer");
    const about_exit = document.getElementById("aboutExit");
    const blog_exit = document.getElementById("blogExit");
    const blog_post_exit = document.getElementById("blogPostExit");
    const blog_post_back = document.getElementById("blogPostBack");
    const back_icons = document.querySelectorAll(".backIcon");
    const exit_icons = document.querySelectorAll(".exitIcon");
    const main_elements = document.querySelector("main");
    const about_container = document.getElementById("aboutContainer");
    const blog_container = document.getElementById("blogContainer");
    const settings_container = document.getElementById("settingsContainer");
    const blog_post_container = document.getElementById("blogPostContainer");
    const blog_cells = document.querySelectorAll(".blog_cell");
    const blogs = document.querySelectorAll(".blog");
    const settings_exit = document.getElementById("settingsExit");
    const pomodoroBtnContainer = document.getElementById("pomodoroBtnContainer");
    const backgroundsBtnContainer = document.getElementById("backgroundsBtnContainer");
    const start_stop_btn = document.getElementById("start-stop");
    const reportIcon = document.getElementById("report-icon");
    const reportPath = document.getElementById("report-path");
    const blogIcon = document.getElementById("blog-icon"); // icon in three way toggle
    const homeIcon = document.getElementById("home-icon");
    const blogMenuContainer = document.getElementById("blogMenuContainer");
    const aboutIconNotes = document.getElementById('aboutIconNotes');
    const body = document.body;

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    /**
     * OBJECTS
     */
    
    const blogIdList = {
        'blog_1': 'blogPost1'
        // 'blog_2': 'blogPost2'
    }

    let flags = {
        blogShowing: false,
        popupWindowShowing: false
    }

    let counters = {
        settingsBtnClicked: 0
    }

    let state = {
        lastSelectedMode: 'home'
    }

    /**
     * INITIAL ACTIONS
     */
    
    setTimeout(() => {
        menuBtn.style.opacity = '1';
    }, 1000)
    
    /**
     * EVENT LISTENERS
     */

    menuBtn.addEventListener("click", function() {
        if (flags.popupWindowShowing) {
            flags.popupWindowShowing = false;
            popup_window.style.opacity = '0';
            setTimeout(() => {
                popup_window.style.display = "none"
            }, 50)
        } else {
            flags.popupWindowShowing = true;
            popup_window.style.display = "flex";
            setTimeout(() => {
                popup_window.classList.add('menuLanding');
                popup_window.style.opacity = '1';
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
        alert("This feature is currently under development. Thank you for your patience.");
    
        //eventually uncomment this out to continue w/ login-signup development
        // window.location.href = "/login";
    });

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

        isClickNotOnMenuElements(event, menuBtn, flags, popup_window);
        isClickNotOnAboutElements(event, about_menu_container, about_container, menuBtn, about_exit, reportIcon, reportPath);
        isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath);
        isClickNotOnSettingsElements(event, settings_menu_container, start_stop_btn, aboutIconNotes, settings_container, menuBtn, settings_exit, body);

        // if the click is not any of the main menu windows or is an exit btn
        if ((event.target !== blogBtn && event.target !== blog_icon && event.target !== blogMenuContainer && event.target !== about_btn && event.target !== about_icon  && event.target !== about_menu_container && !about_container.contains(event.target) && !blog_container.contains(event.target) && !menuBtn.contains(event.target)  && !blog_post_container.contains(event.target) && event.target !== settings_btn && event.target !== settings_icon && event.target !== settings_menu_container && !settings_container.contains(event.target) && event.target !== logInOut_btn && event.target !== login_icon && event.target !== login_menu_container) || (event.target == about_exit) || (event.target == blog_exit) || (event.target == blog_post_exit) || (event.target == settings_exit)) {
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
            }
            
            if (flags.blogShowing == true) {
                blog_post_container.style.display = 'none';
                hideBlog(blogs);
            }
        }
    })
});

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

function isClickNotOnMenuElements(event, menuBtn, flags, popup_window) {
    // if click is not on menu, hide menu
    if (!menuBtn.contains(event.target)) {
        flags.popupWindowShowing = false;
        popup_window.style.opacity = '0';
        setTimeout(() => {
            popup_window.style.display = "none"
        }, 50)
    }
}

function isClickNotOnBlogElements(event, blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath) {
    let blogElementsArr = [blogIcon, blogMenuContainer, blog_container, blog_post_container, menuBtn, blog_exit, reportIcon, reportPath];

    if (!blogElementsArr.some(element => element.contains(event.target)) || event.target === blog_exit) {
        blog_container.style.display = "none";
    }
}

function isClickNotOnSettingsElements(event, settings_menu_container, start_stop_btn, aboutIconNotes, settings_container, menuBtn, settings_exit, body) {
    let settingsElementsArr = [settings_menu_container, settings_container, menuBtn];

    if ((!settingsElementsArr.some(element => element.contains(event.target)) && (event.target !== start_stop_btn) && (event.target !== aboutIconNotes)) || event.target === settings_exit) {
        settings_container.style.display = "none";
        body.style.overflowY = 'scroll';
    }
}