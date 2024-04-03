const fs = require('fs');
const filePath = './public/index.html';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Sequentially replace each minified JS file reference with the minified version
    let result = data.replace(/\/js\/main\/index\.js/g, '/js/minified/index.min.js');
    result = result.replace(/\/js\/main\/navigation\.js/g, '/js/minified/navigation.min.js');
    result = result.replace(/\/js\/main\/notes\.js/g, '/js/minified/notes.min.js');

    // Write the final result back to the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log('File updated successfully.');
    });
});