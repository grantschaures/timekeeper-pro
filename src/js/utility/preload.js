document.addEventListener("DOMContentLoaded", function() {
    // Array of image URLs to preload
    const imageUrls = [
        // "/images/hyperchill_gradients/blue-green-gradient.jpg",
        // "/images/hyperchill_gradients/red-orange-gradient.jpg",
        // "/images/hyperchill_gradients/lemon-lime-gradient.jpg",
        // "/images/hyperchill_gradients/blue-purple-gradient.jpg",
        // "/images/hyperchill_gradients/purple-pink-gradient.jpg",
        // "/images/hyperchill_gradients/black-gradient.jpg",
        // "/images/iStock/iStock-1253862403-mid-edit.jpg",
        // "/images/iStock/iStock-1306875579-mid.jpg",
        // "/images/iStock/iStock-1394258314-mid.jpg",
        // "/images/iStock/iStock-1253862403-mid-orange.jpg",
        // "/images/iStock/iStock-1306875579-mid-invert.jpg",
        // "/images/iStock/iStock-1394258314-mid-green-pixelated.jpg",
        // "/images/iStock/iStock-1253862403-small.jpg",
        // "/images/iStock/iStock-1306875579-small.jpg",
        // "/images/iStock/iStock-1394258314-small.jpg",
        // "/images/iStock/iStock-1253862403-small-orange.jpg",
        // "/images/iStock/iStock-1306875579-small-invert.jpg",
        // "/images/iStock/iStock-1394258314-small-green-pixelated.jpg"
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
