const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const regex = /(h[0-9a-zA-Z]{36})+/;
const contentData = new Map();

const { provideDocumentFormattingEdits } = require('./src/document_formatter');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const xmlFilePath = path.join(context.extensionPath, 'resources', 'english.xml');   
    const workspaceFolders = vscode.workspace.workspaceFolders;
    setupLanguage
    let disposable = vscode.commands.registerCommand('bg3.buildHandles', function () {
		vscode.window.showInformationMessage('Building handle references...');
        rebuildHandleReferences(workspaceFolders, xmlFilePath);
	});
    context.subscriptions.push(disposable);

	vscode.languages.registerHoverProvider(['bg3','xml'], {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            if (regex.test(word)) {
                const foundContent = lookupContentByUid(word);
                if (foundContent !== null) {
                    return new vscode.Hover(foundContent);
                } 
            }
        }
    });
    vscode.languages.registerDocumentFormattingEditProvider('bg3', {
        provideDocumentFormattingEdits(document) {
            return provideDocumentFormattingEdits(document);
        },
    });
}
function setupLanguage() {
    const config = vscode.workspace.getConfiguration();
    const customLanguageId = "bg3"; // Replace with your custom language identifier
    config.update("files.associations", { "*.txt": customLanguageId }, vscode.ConfigurationTarget.Workspace);
}

function rebuildHandleReferences(workspaceFolders, xmlFilePath) {
    contentData.clear(); 
    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            const englishFolderPath = path.join(folder.uri.fsPath, 'Localization', 'English');
            if (fs.existsSync(englishFolderPath)) {
                const xmlFiles = findXmlFilesInFolder(englishFolderPath);
                for (const xmlFile of xmlFiles) {
                    lookupHandlesInXmlSync(xmlFile);
                }
            }
        }
    }
    lookupHandlesInXmlSync(xmlFilePath);
}
function lookupHandlesInXmlSync(xmlFilePath) {
    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    const sax = require('sax');
    const saxParser = sax.parser(true);

    let currentTag = '';
    let currentContentUid = '';
    let currentContent = '';

    saxParser.onopentag = (node) => {
        currentTag = node.name;
        currentContentUid = node.attributes.contentuid || '';
    };

    saxParser.ontext = (text) => {
        if (currentTag === 'content') {
            currentContent += text;
        }
    };

    saxParser.onclosetag = (tagName) => {
        if (tagName === 'content') {
            if (currentContentUid) {
                contentData.set(currentContentUid.trim(), currentContent.trim());
            }
            currentTag = '';
            currentContentUid = '';
            currentContent = '';
        }
    };

    saxParser.write(xmlData).close();
}
function findXmlFilesInFolder(folderPath) {
    const xmlFiles = [];
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && path.extname(file).toLowerCase() === '.xml') {
            xmlFiles.push(filePath);
        }
    }
    return xmlFiles;
}
function lookupContentByUid(contentUid) {
    if (contentData.has(contentUid)) {
        return contentData.get(contentUid);
    } else {
        return null; 
    }
}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
