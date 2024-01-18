const UglifyJS = require('uglify-js');
const fs = require('fs');

let files = ['public/js/index.js', 'public/js/menu.js', 'public/js/notes.js']; // List of files to minify

files.forEach(file => {
    try {
        console.log(`Minifying ${file}`);
        const code = fs.readFileSync(file, 'utf8');
        const minified = UglifyJS.minify(code).code;
        fs.writeFileSync(file.replace('.js', '.min.js'), minified);
        console.log(`Successfully minified ${file}`);
    } catch (error) {
        console.error(`Error minifying ${file}: ${error}`);
    }
});
