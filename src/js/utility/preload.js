document.addEventListener("DOMContentLoaded", function() {
    // Array of image URLs to preload
    const imageUrls = [
        // broad horizen
        "/images/environment/1253862403-mid-edit.jpg",
        "/images/environment/1253862403-mid-orange.jpg",
        "/images/environment/1253862403-small-orange.jpg",
        "/images/environment/1253862403-small.jpg",

        // hands
        "/images/environment/1306875579-mid-orange.jpg",
        "/images/environment/1306875579-mid.jpg",
        "/images/environment/1306875579-small-orange.jpg",
        "/images/environment/1306875579-small.jpg",

        // space
        "/images/environment/1394258314-mid-green-pixelated.jpg",
        "/images/environment/1394258314-mid.jpg",
        "/images/environment/1394258314-small-green-pixelated.jpg",
        "/images/environment/1394258314-small.jpg",
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
