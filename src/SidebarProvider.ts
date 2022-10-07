import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
// import * as tokensObj from '@pleo-io/telescope-tokens';

// const tokens = Object.keys(tokensObj).map((name) => ({name, value: tokensObj[name]}));


// export default getMatchingTokens;

import { getNonce } from "./getNonce";


export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getHtmlForWebview();

    // webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      console.log(message)
      console.log(message.command)
      vscode.window.showInformationMessage(message.command);
      vscode.env.openExternal(vscode.Uri.parse(message.text))
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

   getHtmlForWebview(): string {
    try {
      console.log(" EDDDWWWWW ")
      const reactApplicationHtmlFilename = 'index.html';
      const htmlPath = path.join(__dirname, reactApplicationHtmlFilename);
      const html = fs.readFileSync(htmlPath).toString();
  
      return html;
    }
    catch (e) {
      return `Error getting HTML for web view: ${e}`;
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    // const styleMainUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    // );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    //Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
			</head>
      <body>
        <div>
          LETS GOOOOOOO
        </div>
			</body>
			</html>`;
  }
}