import { menuBtn, popupMenu, blogBtn, blog_icon, about_btn, about_icon, about_menu_container, settings_btn, settings_icon, settings_menu_container, logInOut_btn, login_icon, login_menu_container, about_exit, blog_exit, blog_post_exit, blog_post_back, back_icons, exit_icons, main_elements, about_container, blog_container, settings_container, blog_post_container, blog_cells, blogs, settings_exit, pomodoroBtnContainer, backgroundsBtnContainer, start_stop_btn, reportIcon, reportPath, blogIcon, homeIcon, blogMenuContainer, aboutIconNotes, body, isMobile } from '../modules/dom-elements.js';

import { blogIdList, flags, counters, state } from '../modules/navigation-objects.js';

import { sessionState } from '../modules/state-objects.js';

function hideBlog(blogs) {
    blogs.forEach(function(blog) {
        if (!document.getElementById(blog.id).classList.contains("hidden")) {
            document.getElementById(blog.id).classList.add("hidden");
        }
    })
};

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

});