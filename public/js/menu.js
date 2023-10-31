document.addEventListener("DOMContentLoaded", function() {
    const menu_btn = document.getElementById("menuBtn");
    const popup_window = document.getElementById("popup-menu");
    const blog_btn = document.getElementById("blogBtn");
    const about_btn = document.getElementById("aboutBtn");
    const settings_btn = document.getElementById("settingsBtn");
    const logInOut_btn = document.getElementById("logInOutBtn");
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

    //Add to this list when you create a new blog
    const blogIdList = {
        'blog_1': 'blogPost1',
        'blog_2': 'blogPost2',
        'blog_3': 'blogPost3',
        'blog_4': 'blogPost4'
    }

    let flags = {
        blogShowing: false
    }

    menu_btn.addEventListener("click", function() {
        //Cause the menu window to become visable
        if (popup_window.style.display == "block") {
            popup_window.style.display = "none"
        } else {
            popup_window.style.display = "block";
        }
    })

    about_btn.addEventListener("click", function() {
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
    })

    blog_btn.addEventListener("click", function() {
        //Hide main elements
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
    })

    settings_btn.addEventListener("click", function() {
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
    })

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
        if ((event.target !== about_btn && !about_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == about_exit) {
            about_container.style.display = "none";
        }
        if ((event.target !== blog_btn && !blog_container.contains(event.target) && !blog_post_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == blog_exit) {
            blog_container.style.display = "none";
        }
        if ((event.target !== settings_btn && !settings_container.contains(event.target) && !menu_btn.contains(event.target)) || event.target == settings_exit) {
            settings_container.style.display = "none";
        }

        //eventually check for Settings and logInOut buttons and if event.target is equal to the settings and logInOut containers and what they contain
        if ((event.target !== blog_btn && event.target !== about_btn && !about_container.contains(event.target) && !blog_container.contains(event.target) && !menu_btn.contains(event.target)  && !blog_post_container.contains(event.target) && event.target !== settings_btn  && !settings_container.contains(event.target)) || (event.target == about_exit) || (event.target == blog_exit) || (event.target == blog_post_exit) || (event.target == settings_exit)) {
            main_elements.style.display = "block";

            if (flags.blogShowing == true) {
                blog_post_container.style.display = 'none';

                //ensure that any visible blog becomes hidden when clicking out
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