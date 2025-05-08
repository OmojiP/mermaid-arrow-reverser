const vscode = require('vscode');

class MermaidClassRenameProvider {
    provideRenameEdits(document, position, newName) {
        const fullText = document.getText();
        const mermaidBlocks = getMermaidCodeBlocks(fullText);
        const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
        if (!wordRange) return;

        const oldName = document.getText(wordRange);
        const edit = new vscode.WorkspaceEdit();

        for (const block of mermaidBlocks) {
            const { code, rangeOffset } = block;
            const regex = /\b\w+\b/g;
            let match;
            while ((match = regex.exec(code)) !== null) {
                if (match[0] === oldName) {
                    const start = document.positionAt(rangeOffset + match.index);
                    const end = document.positionAt(rangeOffset + match.index + oldName.length);
                    edit.replace(document.uri, new vscode.Range(start, end), newName);
                }
            }
        }

        return edit;
    }

    prepareRename(document, position) {
        console.log('prepareRename called');
        
        const fullText = document.getText();
        const mermaidBlocks = getMermaidCodeBlocks(fullText);

        const offset = document.offsetAt(position);
        for (const block of mermaidBlocks) {
            const { code, rangeOffset } = block;
            if (offset >= rangeOffset && offset < rangeOffset + code.length) {
                const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
                if (wordRange) {
                    return wordRange;
                }
            }
        }

        return Promise.reject("この位置ではリネームできません（mermaidコードブロック外）");
    }
}

function getMermaidCodeBlocks(text) {
    const regex = /```mermaid\s*([\s\S]*?)```/g;
    const blocks = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        blocks.push({
            code: match[1],
            rangeOffset: match.index + match[0].indexOf(match[1]),
        });
    }
    return blocks;
}

module.exports = {
    MermaidClassRenameProvider
};