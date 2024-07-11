document.addEventListener("DOMContentLoaded", function() {
    // Array of image URLs to preload
    const imageUrls = [
        // broad horizen
        "/images/environments/1253862403-mid-edit.jpg",
        "/images/environments/1253862403-mid-orange.jpg",
        "/images/environments/1253862403-small-orange.jpg",
        "/images/environments/1253862403-small.jpg",

        // hands
        "/images/environments/1306875579-mid-orange.jpg",
        "/images/environments/1306875579-mid.jpg",
        "/images/environments/1306875579-small-orange.jpg",
        "/images/environments/1306875579-small.jpg",

        // space
        "/images/environments/1394258314-mid-green-pixelated.jpg",
        "/images/environments/1394258314-mid.jpg",
        "/images/environments/1394258314-small-green-pixelated.jpg",
        "/images/environments/1394258314-small.jpg",

        // icons
        "/images/icons/menu-6192580-white.png",
        "/images/icons/menu-6192580.png",
        "/images/icons/questionIcon.png",
        "/images/icons/white_tag_icon.png",
        "/images/icons/blogIcon.png",
        "/images/icons/aboutIcon.png",
        "/images/icons/settingsIcon1.png",
        "/images/icons/loginIcon.png",
        "/images/icons/logoutIcon.png",
        "/images/icons/accountIcon.png",
        "/images/icons/shortcutsIconFinal.png",
        "/images/icons/privacyTermsIcon.png",
    ];

    // Function to create and append link tags for preloading images
    function preloadImages(urls) {
        const head = document.head;

        urls.forEach(url => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.href = url;
            link.as = "image";
            head.appendChild(link);
        });
    }

    // Preload the images
    preloadImages(imageUrls);
});
