import * as vscode from 'vscode';
import { window, commands, ExtensionContext } from 'vscode';

let imports: string =`import numpy as np
import pandas as pd 
from math import log, sqrt`

let NewArrays: string =`x = np.array([1, 2, 3, 4])
y = np.array([sqrt(i) for i in x])
w = np.array([log(i) for i in x])`

let DisplayDataFrame: string=`z = pd.DataFrame(x)
print(z)`

let INITIAL_CODE: string[] = [
	imports, 
	NewArrays,
	DisplayDataFrame
];

export function activate(context: vscode.ExtensionContext) {
	let viewcode = vscode.window.createOutputChannel('Stored Code List');
	let temp = context.globalState.get<string[]>('code-list');
	if(temp == undefined){
		INITIAL_CODE = INITIAL_CODE;
	}
	else{
		INITIAL_CODE = temp;
	}
	context.subscriptions.push(commands.registerCommand('democompanion.insertcode', async () => {
		let i = 0;

		const result = await window.showQuickPick(INITIAL_CODE, {
			placeHolder: 'Select the code to insert',
		});
	
		const editor = vscode.window.activeTextEditor;
			
		if(editor && result) {
			const document = editor.document;
			const selection = editor.selection;
	
			editor.edit(editBuilder => {
				editBuilder.replace(selection, result);
			});
	
			window.showInformationMessage(`Inserted: ${result}`);
		}
	
		if(result == undefined){
			window.showInformationMessage(`No code inserted`);
		}

		context.globalState.update('code-list', INITIAL_CODE);

	}));

	context.subscriptions.push(commands.registerCommand('democompanion.addcode', async () => {
		const result = await window.showInputBox({
			value: 'Your code here',
			placeHolder: 'For example: print("Hello, VS Code!")',
		});
		
		if(result != undefined){
			window.showInformationMessage(`Added code to list: ${result}`);
			INITIAL_CODE.push(result);
		}
		else{
			window.showInformationMessage(`No code added to list`);
		}

		context.globalState.update('code-list', INITIAL_CODE);

	}));

	context.subscriptions.push(commands.registerCommand('democompanion.removecode', async () => {
		let i = 0;
		const result = await window.showQuickPick(INITIAL_CODE, {
			placeHolder: 'Choose a line to remove',
		});
	
		if(result == undefined){
			window.showInformationMessage(`No code removed from list`);
		}
	
		else{
		INITIAL_CODE.forEach( (item, index) => {
			if(item === result) INITIAL_CODE.splice(index,1);
		  });
		window.showInformationMessage(`Removed code from list: ${result}`);
		}

		context.globalState.update('code-list', INITIAL_CODE);

	}));

	context.subscriptions.push(commands.registerCommand('democompanion.viewcode', async () => {
		INITIAL_CODE.forEach( (item, index) => {
			viewcode.append(`Stored code line ${index}: \n\n` + INITIAL_CODE[index] + `\n\n`);
		  });
		  window.showInformationMessage(`Navigate to Output -> Stored Code List`);
	}));

	context.subscriptions.push(commands.registerCommand('democompanion.rightclickcode', async () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			const word = document.getText(selection);
			INITIAL_CODE.push(word);
			window.showInformationMessage(`Added code to list`);
		}
		context.globalState.update('code-list', INITIAL_CODE);
	}));
}