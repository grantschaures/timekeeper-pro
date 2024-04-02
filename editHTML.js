const fs = require('fs');
const filePath = './public/index.html';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Sequentially replace each minified JS file reference with the non-minified version
    let result = data.replace(/\/js\/index\.js/g, '/js/index.min.js');
    result = result.replace(/\/js\/menu\.js/g, '/js/menu.min.js');
    result = result.replace(/\/js\/notes\.js/g, '/js/notes.min.js');

    // Write the final result back to the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log('File updated successfully.');
    });
});