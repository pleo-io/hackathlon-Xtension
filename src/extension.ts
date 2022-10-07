import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SidebarProvider } from './SidebarProvider';

import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';

const startCommandName = 'extension.startExtension';
const webViewPanelTitle = 'Telescope X';
const webViewPanelId = 'reactExtension';


let webViewPanel : vscode.WebviewPanel;

function startCommandHandler(context: vscode.ExtensionContext): void {
  const showOptions = {
    enableScripts: true
  };

  const panel = vscode.window.createWebviewPanel(
    webViewPanelId,
    webViewPanelTitle,
    vscode.ViewColumn.One,
    showOptions
  );


  panel.webview.html = getHtmlForWebviewIframe();
  panel.webview.onDidReceiveMessage(
    onPanelDidReceiveMessage,
    undefined,
    context.subscriptions
  );

  panel.onDidDispose(onPanelDispose, null, context.subscriptions);

  webViewPanel = panel;
}

function onPanelDispose(): void {
  // Clean up panel here
}

function onPanelDidReceiveMessage(message: any) {
// 	console.log("pliiiezzee");
//   switch (message.command) {
//     case 'showInformationMessage':
//       vscode.window.showInformationMessage(message.text);
//       return;

//     case 'getDirectoryInfo':
// 		console.log("eleos")
// 		vscode.window.showInformationMessage("MPAM");

//     //   runDirCommand((result : string) => webViewPanel.webview.postMessage({ command: 'getDirectoryInfo', directoryInfo: result }));
//       return;
//   }
}

// function runDirCommand(callback : Function) {
//   var spawn = require('child_process').spawn;
//   var cp = spawn(process.env.comspec, ['/c', 'dir']);
  
//   cp.stdout.on("data", function(data : any) {
//     const dataString = data.toString();

//     callback(dataString);
//   });
  
//   cp.stderr.on("data", function(data : any) {
//     // No op
//   });
// }

// function getHtmlForWebview(): string {
//   try {
//     const reactApplicationHtmlFilename = 'index.html';
//     const htmlPath = path.join(__dirname, reactApplicationHtmlFilename);
//     const html = fs.readFileSync(htmlPath).toString();

//     return html;
//   }
//   catch (e) {
//     return `Error getting HTML for web view: ${e}`;
//   }
// }


function getHtmlForWebviewIframe():string {

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
      -->
    
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
     <iframe src="https://pleo-io.github.io/telescope/about/about.home" frameborder="0" width="100%" height="1000px">
  </iframe>
    </body>
    </html>`;
}


const COMMAND = 'extension.openBox';

export function activate(context: vscode.ExtensionContext) {


  const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
		"telescopeX-sidebar",
		sidebarProvider
		)
	);

  context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'typescript' }, new Emojizer(), {
			providedCodeActionKinds: Emojizer.providedCodeActionKinds
		}));

	const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
	context.subscriptions.push(emojiDiagnostics);

	subscribeToDocumentChanges(context, emojiDiagnostics);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'typescript' }, new Emojinfo(), {
			providedCodeActionKinds: Emojinfo.providedCodeActionKinds
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND, () => vscode.env.openExternal(vscode.Uri.parse('https://pleo-io.github.io/telescope/components/box/box.guidelines')))
	);

   const startCommand = vscode.commands.registerCommand(startCommandName, () => startCommandHandler(context));

  context.subscriptions.push(startCommand);
}



export class Emojizer implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
		if (!this.isAtStartOfSmiley(document, range)) {
			return;
		}

		const replaceWithStackFix = this.createFix(document, range, "Stack");

		const replaceWithInlineFix = this.createFix(document, range, "Inline");
		// Marking a single fix as `preferred` means that users can apply it with a
		// single keyboard shortcut using the `Auto Fix` command.
		const replaceWithBoxFix = this.createFix(document, range, "Box");
    replaceWithBoxFix.isPreferred = true;


		const commandAction = this.createCommand();

		return [
			replaceWithStackFix,
			replaceWithInlineFix,
			replaceWithBoxFix,
			commandAction
		];
	}

	private isAtStartOfSmiley(document: vscode.TextDocument, range: vscode.Range) {
		const start = range.start;
		const line = document.lineAt(start.line);
		return line.text[start.character] === '<'  && line.text[start.character + 1] === 'C' && line.text[start.character + 2] === 'e'  && line.text[start.character + 3] === 'l' && line.text[start.character + 5] === '>';
	}

	private createFix(document: vscode.TextDocument, range: vscode.Range, emoji: string): vscode.CodeAction {
		const fix = new vscode.CodeAction(`Convert to ${emoji}`, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, 6)), `<${emoji}>`);
		return fix;
	}

	private createCommand(): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
		return action;
	}
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class Emojinfo implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
		// for each diagnostic entry that has the matching `code`, create a code action command
		return context.diagnostics
			.filter(diagnostic => diagnostic.code === EMOJI_MENTION)
			.map(diagnostic => this.createCommandCodeAction(diagnostic));
	}

	private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Ooopsy! Please check here', vscode.CodeActionKind.QuickFix);
		action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}
}