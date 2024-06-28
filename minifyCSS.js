const fs = require('fs');
const path = require('path');
const uglifycss = require('uglifycss');

// List of CSS files to minify and overwrite
const cssFiles = [
    path.join(__dirname, 'src', 'css', 'background-animations.css'),
    path.join(__dirname, 'src', 'css', 'blog.css'),
    path.join(__dirname, 'src', 'css', 'icons.css'),
    path.join(__dirname, 'src', 'css', 'login-signup.css'),
    path.join(__dirname, 'src', 'css', 'menu.css'),
    path.join(__dirname, 'src', 'css', 'notes.css'),
    path.join(__dirname, 'src', 'css', 'privacy-and-terms.css'),
    path.join(__dirname, 'src', 'css', 'settings.css'),
    path.join(__dirname, 'src', 'css', 'styles.css'),
    path.join(__dirname, 'src', 'css', 'report.css')
];

cssFiles.forEach((file) => {
    // Read the content of the CSS file
    const cssContent = fs.readFileSync(file, 'utf-8');

    // Minify the CSS content
    const minifiedCss = uglifycss.processString(cssContent);

    // Overwrite the original CSS file with the minified content
    fs.writeFileSync(file, minifiedCss);

    console.log(`Minified and overwritten ${file}`);
});
