document.addEventListener("DOMContentLoaded", function() {
    const menu_btn = document.getElementById("menuBtn");
    const popup_window = document.getElementById("popup-menu");

    const blog_btn = document.getElementById("blogBtn");
    const blog_icon = document.getElementById("blogIcon");
    const blog_menu_container = document.getElementById("blogMenuContainer");

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
    
    const break_suggestion_info_icon = document.getElementById("breakSuggestionInfoIcon");
    const break_suggestion_info_window = document.getElementById("breakSuggestionInfoMessage");

    const chill_time_break_suggestion_icon = document.getElementById("chillTimeBreakSuggestionInfoIcon");
    const chill_time_break_suggestion_info_window = document.getElementById("breakSuggestionInfoMessage2");

    const settings_exit = document.getElementById("settingsExit");

    //ADD TO THIS LIST WHEN YOU CREATE A NEW BLOG
    const blogIdList = {
        'blog_1': 'blogPost1'
        // 'blog_2': 'blogPost2'
    }

    let flags = {
        blogShowing: false,
        breakSuggestionInfoWindowShowing: false,
        chillTimeBreakSuggestionInfoWindowShowing: false
    }

    menu_btn.addEventListener("click", function() {
        //Cause the menu window to become visable
        if (popup_window.style.display == "flex") {
            popup_window.style.opacity = '0';
            popup_window.style.display = "none"
        } else {
            popup_window.style.display = "flex";
            setTimeout(() => {
                popup_window.classList.add('menuLanding');
                popup_window.style.opacity = '1';
            }, 1);
        }
    })

    function handleClickBlog(event) {
        main_elements.style.display = "none";
    
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
    }
    blog_menu_container.addEventListener("click", handleClickBlog);

    function handleClickAbout(event) {
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
    }
    about_menu_container.addEventListener("click", handleClickAbout);

    function handleClickSettings(event) {
        //Hide main elements
        main_elements.style.display = "none";
    
        //Hide blogs
        if (flags.blogShowing == true) {
            blog_post_container.style.display = 'none';
    
            //ensure that any visible blog becomes hidden when clicking out
            hideBlog(blogs);
        }
    
        //show blog popup window
        settings_container.style.display = "flex";
    
        //Triggers reset animation once you enter for first time
        settings_exit.classList.add('resetRotation');
    }
    settings_menu_container.addEventListener("click", handleClickSettings);

    function handleClickLogInOut(event) {
        alert("This feature is currently under development. Thank you for your patience.");
    
        //eventually uncomment this out to continue w/ login-signup development
        //window.location.href = "/login";
    }
    login_menu_container.addEventListener("click", handleClickLogInOut);

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
        if (!menu_btn.contains(event.target)) {
            popup_window.style.display = "none";
        }
        if ((event.target !== about_btn && event.target !== about_icon && event.target !== about_menu_container && !about_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == about_exit) {
            about_container.style.display = "none";
        }
        if ((event.target !== blog_btn && event.target !== blog_icon && event.target !== blog_menu_container && !blog_container.contains(event.target) && !blog_post_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == blog_exit) {
            blog_container.style.display = "none";
        }
        if ((event.target !== settings_btn  && event.target !== settings_icon && event.target !== settings_menu_container && !settings_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == settings_exit) {
            settings_container.style.display = "none";
        }

        if ((event.target !== blog_btn && event.target !== blog_icon && event.target !== blog_menu_container && event.target !== about_btn && event.target !== about_icon  && event.target !== about_menu_container && !about_container.contains(event.target) && !blog_container.contains(event.target) && !menu_btn.contains(event.target)  && !blog_post_container.contains(event.target) && event.target !== settings_btn && event.target !== settings_icon && event.target !== settings_menu_container && !settings_container.contains(event.target) && event.target !== logInOut_btn && event.target !== login_icon && event.target !== login_menu_container) || (event.target == about_exit) || (event.target == blog_exit) || (event.target == blog_post_exit) || (event.target == settings_exit)) {
            main_elements.style.display = "block";

            if (flags.blogShowing == true) {
                blog_post_container.style.display = 'none';

                //ensure that any visible blog becomes hidden when clicking out
                hideBlog(blogs);
            }

            break_suggestion_info_window.style.display = "none";
            flags.breakSuggestionInfoWindowShowing = false;

            chill_time_break_suggestion_info_window.style.display = "none";
            flags.chillTimeBreakSuggestionInfoWindowShowing = false;
        }

    })

    settings_container.addEventListener("click", function(event) {
        if (event.target != break_suggestion_info_icon) {
            break_suggestion_info_window.style.display = "none";
            flags.breakSuggestionInfoWindowShowing = false;
        }

        if (event.target != chill_time_break_suggestion_icon) {
            chill_time_break_suggestion_info_window.style.display = "none";
            flags.chillTimeBreakSuggestionInfoWindowShowing = false;
        }
    })

    break_suggestion_info_icon.addEventListener("click", function() {
        //basically, we're going to bring up a little pop-up window to explain the toggle function
        if (flags.breakSuggestionInfoWindowShowing) {
            break_suggestion_info_window.style.display = "none";
            flags.breakSuggestionInfoWindowShowing = false;
        } else {
            break_suggestion_info_window.style.display = "flex";
            flags.breakSuggestionInfoWindowShowing = true;
        }
        
    })

    chill_time_break_suggestion_icon.addEventListener("click", function() {
        if (flags.chillTimeBreakSuggestionInfoWindowShowing) {
            chill_time_break_suggestion_info_window.style.display = "none";
            flags.chillTimeBreakSuggestionInfoWindowShowing = false;
        } else {
            chill_time_break_suggestion_info_window.style.display = "flex";
            flags.chillTimeBreakSuggestionInfoWindowShowing = true;
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