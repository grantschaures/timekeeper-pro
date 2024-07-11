(async () => {
    try {
      const { generate } = await import('critical');
  
      await generate({
        // Inline the generated critical-path CSS
        inline: true,
  
        // Base directory where the HTML and CSS files are located
        base: 'public/',
  
        // HTML source file to be operated against
        src: 'index.html',
  
        // CSS files to be used
        css: [
          '../src/css/styles.css',
          '../src/css/background-animations.css',
          '../src/css/blog.css',
          '../src/css/icons.css',
          '../src/css/menu.css',
          '../src/css/notes.css',
          '../src/css/report.css',
          '../src/css/settings.css',
          '../src/css/space.css'
        ],
  
        // Viewport width and height
        width: 1300,
        height: 900,
  
        // Output results to file
        target: {
          html: 'index.html', // The HTML file with inlined critical CSS
        },
  
        // Extract inlined styles from referenced stylesheets
        extract: true,
  
        // Ignore specific CSS rules
        ignore: {
          atrule: ['@font-face'], // Ignore @font-face rules
          rule: [/some-regexp/], // Ignore rules matching this regex
          decl: (node, value) => /big-image\.png/.test(value), // Ignore declarations with this value
        },
      });
      console.log('Critical CSS generation and inlining complete!');
    } catch (err) {
      console.error('Error generating critical CSS:', err);
    }
  })();
  