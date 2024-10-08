const fs = require('fs');

function addGoogleAnalyticsScript(filePath) {
    const analyticsScript = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-E3SBGG3VKK"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-E3SBGG3VKK');
    </script>`;

    // Read the index.html file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Find the closing </head> tag and insert the new HTML before it
        const updatedHTML = data.replace('</head>', `${analyticsScript}\n</head>`);

        // Write the updated HTML back to the index.html file
        fs.writeFile(filePath, updatedHTML, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log('HTML content successfully inserted into the <head>!');
        });
    });
}

const indexHtmlPath = './public/index.html';

// add Google Analytics
addGoogleAnalyticsScript(indexHtmlPath);