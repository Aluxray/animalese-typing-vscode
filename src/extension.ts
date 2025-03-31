import path from 'path';
import * as vscode from 'vscode';
import player from 'play-sound';

const SFX = new Map<string, string>([
    ['\t', 'tab'],
    ['\n', 'enter'],
    ['\r', 'enter'],
    ['}', 'brace_closed'],
    ['{', 'brace_open'],
    [']', 'bracket_closed'],
    ['[', 'bracket_open'],
    [')', 'parenthesis_closed'],
    ['(', 'parenthesis_open'],
    ['\\', 'slash_back'],
    ['/', 'slash_forward'],
    ['&', 'ampersand'],
    ['*', 'asterisk'],
    ['@', 'at'],
    ['?', 'question'],
    ['!', 'exclamation'],
    ['~', 'tilde'],
    ['#', 'pound'],
    ['%', 'percent'],
    ['^', 'caret'],
    ['$', 'dollar'],
    ['€', 'dollar'],
    ['£', 'dollar'],
    ['¥', 'dollar'],
    ['¢', 'dollar'],
    ['¤', 'dollar'],
]);

function playSound({filename, isSfx = false, isMale = false}: {filename: string, isSfx?: boolean, isMale?: boolean}) {
    let folder: string = '';
    if (isSfx === true) {
        folder = 'sfx';
    } else if (!isNaN(Number(filename))) {
        folder = 'vocals';
    } else {
        folder = 'animalese';
    }

    let soundPath: string = '';
    if (isSfx === true) {
        soundPath = path.join(__dirname, '..', 'assets', 'audio', folder, filename + '.wav');
    } else {
        soundPath = path.join(__dirname, '..', 'assets', 'audio', folder, isMale ? 'male' : 'female', 'voice_1', filename + '.wav');
    }

    console.log(`Played sound ${soundPath}`);
    player().play(soundPath, (error: unknown) => {
        if (error) {
            console.error('Failed to play sound:', error);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('animalese-typing-vscode.animalese', () => {
        playSound({
            filename: 'Deska'
        });
        vscode.window.showInformationMessage(`Extension loaded successfully!`);
	});

	const sound = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0) {
            const lastChange = event.contentChanges[0].text[0];

            if (lastChange === undefined) {
                playSound({
                    filename: 'backspace',
                    isSfx: true
                });
            } else if (/^[a-z]/i.test(lastChange)) {
                playSound({
                    filename: lastChange
                });
            } else if (/^[0-9-=]/.test(lastChange)) {
                const num = Number(lastChange);
                if (num > 0 && num <= 9) {
                    playSound({
                        filename: (num-1).toString()
                    });
                } else if (num === 0) {
                    playSound({
                        filename: '9'
                    });
                } else if (lastChange === '-') {
                    playSound({
                        filename: '10'
                    });
                } else if (lastChange === '=') {
                    playSound({
                        filename: '11'
                    });
                }
            } else if (SFX.get(lastChange) !== undefined) {
                playSound({
                    filename: SFX.get(lastChange) ?? 'default',
                    isSfx: true
                });
            } else if (lastChange === ' ') {
                const arrows = ['up', 'down', 'left', 'right'];
                playSound({
                    filename: 'arrow_' + arrows[Math.floor(Math.random() * 4)],
                    isSfx: true
                });
            } else {
                playSound({
                    filename: 'default',
                    isSfx: true
                });
            }
        } else {
            playSound({
                filename: 'backspace',
                isSfx: true
            });
        }
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(sound);
}

export function deactivate() {}
