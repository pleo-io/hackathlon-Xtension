import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
// import InteractorFactory from "./Interaction/InteractorFactory";
import * as tokensObj from "@pleo-io/telescope-icons";
const tokens = Object.keys(tokensObj).map((name) => ({
  name,
  value: tokensObj[name],
}));

// const Interactor = InteractorFactory.create();
const vscode = acquireVsCodeApi();

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { directoryInfo: "" };
  }

  updateFilesToDisplay() {
    // Interactor.getDirectoryInfo((directoryInfo) => {
    //   this.setState({ directoryInfo: directoryInfo });
    // });
  }

  render() {
    return (
      <>
        <h1>VSCode Heyyoo Pleeoo X-tension</h1>
        <div className="container">
          {/* {tokens.map((token) => {
                return (
                  <>
                    <span>{token.name}</span>
                    <br />
                  </>
                );
              })} */}
          {/* <div className="col-sm">
              <h3>Some functionality</h3>
              <p>Use this button to execute some functionality</p>
              <button
                onClick={() => {
                  Interactor.showInformationMessage(
                    "Emojis are in vogue at the moment 🐛"
                  );
                }}
              >
                Click me
              </button>
            </div> */}
          <div className="row">
            <button
              onClick={() => {
                vscode.postMessage({
                  command: "staging",
                  text: "https://app.staging.pleo.io",
                });
              }}
            >
              Staging
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                vscode.postMessage({
                  command: "slack",
                  text: "https://getpleo.slack.com/archives/C03KNNEFG8P",
                });
              }}
            >
              Slack
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                vscode.postMessage({
                  command: "notion",
                  text: "https://www.notion.so/pleo/Company-wide-0631444e47f34b5fb1610f3f08c8f142",
                });
              }}
            >
              Notion
            </button>
          </div>
          <div className="row">
            <button
              onClick={() => {
                vscode.postMessage({
                  command: "figma",
                  text: "https://www.figma.com/files/957312574001572161/recent?fuid=987338811394121642",
                });
              }}
            >
              Figma
            </button>
          </div>
          {/* <div className="col-sm">
              <button onClick={() => this.updateFilesToDisplay()}>
                Run <code>dir</code> command
              </button>
              <br />
              <code>
                {this.state.directoryInfo !== ""
                  ? this.state.directoryInfo
                  : "Run the command..."}
              </code>
            </div> */}
          {/* <div className="col-sm">
              <form>
                <fieldset>
                  <legend>HEEYYOOOOO WE ARE PLEYYOOOOO 2 </legend>
                  <label for="username">Username</label>
                  <input type="text" id="Username" placeholder="Username" />
                  <br />
                  <label for="password">Password</label>
                  <input type="password" id="password" placeholder="Password" />
                </fieldset>
              </form>
            </div> */}
        </div>
        <div className="row">
          <div className="col-sm">
            <div className="card">
              <img
                src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
                width="300"
                className="section media"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("index"));
