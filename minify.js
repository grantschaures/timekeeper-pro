const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path'); // Require the path module to handle file paths

let files = [
    'src/js/main/index.js',
    'src/js/main/navigation.js',
    'src/js/main/notes.js',
    'src/js/api/google-signin.js',
    'src/js/state/state.js',
    'src/js/state/update-labels.js',
    'src/js/state/update-notes.js',
    'src/js/state/update-settings.js',
    'src/js/utility/initialize_gui.js',
    'src/js/login_signup/login.js',
    'src/js/login_signup/signup.js',
    'src/js/login_signup/reset-password.js',
    'src/js/login_signup/set-password.js',
]; // List of files to minify

files.forEach(file => {
    try {
        console.log(`Minifying ${file}`);
        const code = fs.readFileSync(file, 'utf8');
        const minified = UglifyJS.minify(code, {
            compress: {
                drop_console: true // Option to drop console statements
            }
        });

        if (minified.error) {
            throw minified.error;
        }
        
        // Construct the new path within the minified directory
        const minifiedDir = path.join(path.dirname(file), '../minified');
        const minifiedFilePath = path.join(minifiedDir, path.basename(file).replace('.js', '.min.js'));
        
        // Ensure the minified directory exists
        if (!fs.existsSync(minifiedDir)){
            fs.mkdirSync(minifiedDir);
        }

        fs.writeFileSync(minifiedFilePath, minified.code);
        console.log(`Successfully minified ${file} to ${minifiedFilePath}`);
    } catch (error) {
        console.error(`Error minifying ${file}: ${error}`);
    }
});