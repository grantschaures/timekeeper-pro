const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path'); // Require the path module to handle file paths

let files = ['public/js/main/index.js', 'public/js/main/navigation.js', 'public/js/main/notes.js']; // List of files to minify

files.forEach(file => {
    try {
        console.log(`Minifying ${file}`);
        const code = fs.readFileSync(file, 'utf8');
        const minified = UglifyJS.minify(code).code;
        
        // Construct the new path within the minified directory
        const minifiedDir = path.join(path.dirname(file), '../minified');
        const minifiedFilePath = path.join(minifiedDir, path.basename(file).replace('.js', '.min.js'));
        
        // Ensure the minified directory exists
        if (!fs.existsSync(minifiedDir)){
            fs.mkdirSync(minifiedDir);
        }

        fs.writeFileSync(minifiedFilePath, minified);
        console.log(`Successfully minified ${file} to ${minifiedFilePath}`);
    } catch (error) {
        console.error(`Error minifying ${file}: ${error}`);
    }
});