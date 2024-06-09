document.addEventListener("DOMContentLoaded", function() {
    const imgUrls = [

        // flowtime/ chilltime gradients
        "/images/hyperchill_gradients/blue-green-gradient.jpg",
        "/images/hyperchill_gradients/red-orange-gradient.jpg",
        "/images/hyperchill_gradients/lemon-lime-gradient.jpg",
        "/images/hyperchill_gradients/blue-purple-gradient.jpg",
        "/images/hyperchill_gradients/purple-pink-gradient.jpg",
        "/images/hyperchill_gradients/black-gradient.jpg",

        // flowtime worlds
        "/images/iStock/iStock-1253862403-mid-edit.jpg",
        "/images/iStock/iStock-1306875579-mid.jpg",
        "/images/iStock/iStock-1394258416-mid-edit.jpg",

        // chilltime worlds
        "/images/iStock/iStock-1253862403-mid-orange.jpg",
        "/images/iStock/iStock-1306875579-mid-invert.jpg",
        "/images/iStock/iStock-1394258416-mid-edit.jpg",

        // flowtime worlds cell images
        "/images/iStock/iStock-1253862403-small.jpg",
        "/images/iStock/iStock-1306875579-small.jpg",

        // chilltime worlds cell images
        "/images/iStock/iStock-1253862403-small-orange.jpg",
        "/images/iStock/iStock-1306875579-small-invert.jpg",

        // both worlds cell image (glowing triangle)
        "/images/iStock/iStock-1394258416-small.jpg",
    ];

    // preloadImages(imgUrls);
})

function preloadImages(imageUrls) {
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}