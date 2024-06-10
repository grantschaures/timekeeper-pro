const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// take dom-elements.js and minify each variable name, and output the file to minified_testing

// File paths
const inputFilePath = path.join(__dirname, '../src/js/modules/dom-elements.js');
const outputFilePath = path.join(__dirname, '../src/js/minified_testing/dom-elements.min.js');


// Read the file content
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

// Parse the code to an AST (Abstract Syntax Tree)
const ast = parser.parse(fileContent, {
  sourceType: 'module'
});

// Generate a mapping of old variable names to new minified names
const nameMapping = {};
let counter = 0;

// Helper function to generate new variable names
const generateNewName = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let newName = '';
  let tempCounter = counter;

  do {
    newName = letters[tempCounter % letters.length] + newName;
    tempCounter = Math.floor(tempCounter / letters.length) - 1;
  } while (tempCounter >= 0);

  counter++;
  return newName;
};

// Traverse the AST and rename variables
traverse(ast, {
  VariableDeclarator(path) {
    const oldName = path.node.id.name;
    if (!nameMapping[oldName]) {
      nameMapping[oldName] = generateNewName();
    }
    path.node.id.name = nameMapping[oldName];
  },
  ExportNamedDeclaration(path) {
    path.node.specifiers.forEach(specifier => {
      const oldName = specifier.local.name;
      if (!nameMapping[oldName]) {
        nameMapping[oldName] = generateNewName();
      }
      specifier.local.name = nameMapping[oldName];
      specifier.exported.name = nameMapping[oldName];
    });
  },
  Identifier(path) {
    const oldName = path.node.name;
    if (nameMapping[oldName]) {
      path.node.name = nameMapping[oldName];
    }
  }
});

// Generate the transformed code
const output = generate(ast, {}, fileContent);

// Save the transformed code to a new file
fs.writeFileSync(outputFilePath, output.code, 'utf-8');

console.log(`Minification complete. Minified file saved as ${outputFilePath}`);