// Thanks and credit to facufierro!
const vscode = require('vscode');

function provideDocumentFormattingEdits(document) {
    try {
        const edits = []; // Initialize an array to store text edits

        // Loop through each line in the document
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i); // Get the current line
            const lineText = line.text.trimStart(); // Trim leading white space from the line text

            // Perform specific formatting based on the line content
            if (lineText.startsWith('new entry')) {
                edits.push(vscode.TextEdit.replace(line.range, lineText)); // Replace the line with trimmed text
            } else if (lineText.startsWith('type') || lineText.startsWith('using')) {
                edits.push(vscode.TextEdit.replace(line.range, '\t' + lineText)); // Indent with one tab
            } else if (lineText.startsWith('data')) {
                edits.push(vscode.TextEdit.replace(line.range, '\t\t' + lineText)); // Indent with two tabs
            }
        }

        return edits; // Return the array of TextEdit objects

    } catch (error) {
        // Log errors if any
        console.error(`An error occurred while providing document formatting edits: ${error.message}`);
        return []; // Return an empty array in case of error
    }
}

// Export the function
module.exports = {
    provideDocumentFormattingEdits,
};