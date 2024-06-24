const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier');

const inputFilePath = path.join(__dirname, 'public/index.html'); // Path to your input HTML file

// Read the input HTML file
fs.readFile(inputFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    // Minify the HTML
    const minified = minify(data, {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: {
            // Options for UglifyJS to ensure proper JavaScript minification
            output: {
                semicolons: true, // Ensure semicolons are preserved
            }
        }
    });

    // Overwrite the input HTML file with the minified content
    fs.writeFile(inputFilePath, minified, (err) => {
        if (err) {
            console.error('Error writing output file:', err);
            return;
        }
        console.log('HTML minification completed successfully and index.html is updated.');
    });
});
