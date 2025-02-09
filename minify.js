const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// List of files to minify
let files = [
    'src/js/main/index.js',
    'src/js/main/navigation.js',
    'src/js/main/notes.js',
    'src/js/main/end-session.js',

    'src/js/api/google-signin.js',
    'src/js/api/pip.js',

    'src/js/state/state.js',
    'src/js/state/update-labels.js',
    'src/js/state/update-deleted-labels.js',
    'src/js/state/update-notes.js',
    'src/js/state/update-settings.js',
    'src/js/state/update-target-hours.js',
    'src/js/state/update-showing-time-left.js',
    'src/js/state/delete-account.js',
    'src/js/state/session-completion.js',
    'src/js/state/last-interval-switch.js',
    'src/js/state/check-session.js',
    'src/js/state/check-invaliDate.js',
    'src/js/state/update-invaliDate.js',
    'src/js/state/add-session.js',
    'src/js/state/add-notes-entry.js',
    'src/js/state/update-notes-entry.js',
    'src/js/state/delete-session.js',
    'src/js/state/update-session-summary-data.js',

    'src/js/utility/initialize-gui.js',
    'src/js/utility/preload.js',
    'src/js/utility/update-streaks.js',
    'src/js/utility/identification.js',
    'src/js/utility/mini-charts.js',
    'src/js/utility/day-view.js',
    'src/js/utility/session-summary-chart.js',
    'src/js/utility/adv-charts.js',
    'src/js/utility/main-charts.js',
    'src/js/utility/session-view.js',

    'src/js/login-signup/login.js',
    'src/js/login-signup/signup.js',
    'src/js/login-signup/reset-password.js',
    'src/js/login-signup/set-password.js',

    'src/js/dashboard/populate-dashboard.js',
    'src/js/dashboard/daily-sessions.js',
    'src/js/dashboard/label-distribution.js',
    'src/js/dashboard/metric-charts.js',
    'src/js/dashboard/summary-stats.js',
];

// Function to detect exported names
const detectExportedNames = (code) => {
    const ast = parser.parse(code, { sourceType: 'module' });
    const exportedNames = new Set();

    traverse(ast, {
        ExportNamedDeclaration(path) {
            path.node.specifiers.forEach(specifier => {
                exportedNames.add(specifier.exported.name);
            });
            if (path.node.declaration) {
                if (path.node.declaration.id) {
                    exportedNames.add(path.node.declaration.id.name);
                } else if (path.node.declaration.declarations) {
                    path.node.declaration.declarations.forEach(declaration => {
                        exportedNames.add(declaration.id.name);
                    });
                }
            }
        },
        ExportDefaultDeclaration(path) {
            if (path.node.declaration.id) {
                exportedNames.add(path.node.declaration.id.name);
            }
        }
    });

    return Array.from(exportedNames);
};

files.forEach(file => {
    try {
        console.log(`Minifying ${file}`);
        const code = fs.readFileSync(file, 'utf8');
        const exportedNames = detectExportedNames(code);

        const minified = UglifyJS.minify(code, {
            compress: {
                drop_console: true
            },
            mangle: {
                reserved: exportedNames,
                toplevel: true
            }
        });

        if (minified.error) {
            throw minified.error;
        }

        // Construct the new path within the minified directory
        const minifiedDir = path.join(path.dirname(file), '../minified');
        const minifiedFilePath = path.join(minifiedDir, path.basename(file).replace('.js', '.min.js'));

        // Ensure the minified directory exists
        if (!fs.existsSync(minifiedDir)) {
            fs.mkdirSync(minifiedDir);
        }

        fs.writeFileSync(minifiedFilePath, minified.code);
        console.log(`Successfully minified ${file} to ${minifiedFilePath}`);
    } catch (error) {
        console.error(`Error minifying ${file}: ${error}`);
    }
});
