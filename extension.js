const vscode = require('vscode');
const { MermaidClassRenameProvider } = require('./renameProvider');

function activate(context) {

    console.log('activate!!!!');

    registerMermaidArrowHover(context);

    console.log('activate!!!!: 10');
    
    // F2 リネーム用プロバイダ登録
    const renameProvider = new MermaidClassRenameProvider();
    context.subscriptions.push(
        vscode.languages.registerRenameProvider('markdown', renameProvider)
    );

    console.log('activate!!!!: 18');

    const arrowMap = {
        '--|>': '<|--',
        '<|--': '--|>',
        '..|>': '<|..',
        '<|..': '..|>',
        '-->': '<--',
        '<--': '-->',
        '..>': '<..',
        '<..': '..>',
        '--*': '*--',
        '*--': '--*',
        '--o': 'o--',
        'o--': '--o',
    };

    // 逆引き用：すべての矢印パターンを長い順にソートしておく
    const supportedArrows = Object.keys(arrowMap).sort((a, b) => b.length - a.length);

    const provider = {
        provideCodeActions(document, range) {
            const line = document.lineAt(range.start.line);
            const text = line.text;

            // 行に含まれる最初のマッチした矢印を探す（長いもの優先）
            const matchedArrow = supportedArrows.find(arrow =>
                new RegExp(`\\b\\w+\\s+${escapeRegExp(arrow)}\\s+\\w+\\b`).test(text)
            );

            if (!matchedArrow) return;

            const reversedArrow = arrowMap[matchedArrow];
            if (!reversedArrow) return;

            // 向き反転・方向反転の選択肢をクイック修正で表示
            const action1 = new vscode.CodeAction("矢印の向きのみ反転（例：a --> b → a <-- b）", vscode.CodeActionKind.QuickFix);
            action1.edit = new vscode.WorkspaceEdit();
            action1.edit.replace(document.uri, line.range, text.replace(matchedArrow, reversedArrow));

            const action2 = new vscode.CodeAction("矢印の方向を反転（例：a --> b → b --> a）", vscode.CodeActionKind.QuickFix);
            action2.edit = new vscode.WorkspaceEdit();
            action2.edit.replace(document.uri, line.range, text.replace(
                new RegExp(`(\\b\\w+)\\s+${escapeRegExp(matchedArrow)}\\s+(\\b\\w+)`),
                (_, left, right) => `${right} ${matchedArrow} ${left}`
            ));

            const action3 = new vscode.CodeAction("矢印の向きと方向を両方反転（例：a --> b → b <-- a）", vscode.CodeActionKind.QuickFix);
            action3.edit = new vscode.WorkspaceEdit();
            action3.edit.replace(document.uri, line.range, text.replace(
                new RegExp(`(\\b\\w+)\\s+${escapeRegExp(matchedArrow)}\\s+(\\b\\w+)`),
                (_, left, right) => `${right} ${reversedArrow} ${left}`
            ));

            return [action1, action2, action3];
        }
    };

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider("markdown", provider, {
            providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
        })
    );

    console.log('activate!!!!: 82');
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

function registerMermaidArrowHover(context) {
    const arrowDescriptions = {
        '..': '点線(クラス図)',
        '--': '実線(クラス図)',
        '..>': '依存(クラス図)',
        '<..': '依存(クラス図)',
        '-->': '関連(クラス図) / 遷移(状態遷移図)',
        '<--': '関連(クラス図) / 遷移(状態遷移図)',
        '--|>': '継承(クラス図)',
        '<|--': '継承(クラス図)',
        '..|>': '実現(クラス図)',
        '<|..': '実現(クラス図)',
        '--*': '合成(クラス図)',
        '*--': '合成(クラス図)',
        '--o': '集約(クラス図)',
        'o--': '集約(クラス図)',
        '->': '直線(シーケンス図)',
        '->>': '同期実線(シーケンス図)',
        '-->>': '同期点線(シーケンス図)',
        '-x': '終了実線(シーケンス図)',
        '--x': '終了点線(シーケンス図)',
        '-)': '非同期実線(シーケンス図)',
        '--)': '非同期点線(シーケンス図)',
    };

    const arrows = Object.keys(arrowDescriptions).sort((a, b) => b.length - a.length);

    const hoverProvider = {
        provideHover(document, position) {
            const line = document.lineAt(position.line).text;

            for (const arrow of arrows) {
                const index = line.indexOf(arrow);
                if (index >= 0) {
                    const inRange = position.character >= index && position.character <= index + arrow.length;
                    if (inRange) {
                        const desc = arrowDescriptions[arrow];
                        return new vscode.Hover(`**Mermaid 矢印**: \`${arrow}\` — ${desc}`);
                    }
                }
            }

            return null;
        }
    };

    context.subscriptions.push(
        vscode.languages.registerHoverProvider('markdown', hoverProvider)
    );
}
