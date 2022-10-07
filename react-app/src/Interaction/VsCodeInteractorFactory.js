// import Interactor from "./Interactor";

// const VsCodeStateChangeCallbacks = {
//   getDirectoryInfo: (directoryInfo) => {},
// };

// const VsCodeStateChangeBuffer = {
//   directoryInfo: "",
// };

// window.addEventListener("message", (event) => {
//   console.log(1);

//   const message = event.data;

//   switch (message.command) {
//     case "getDirectoryInfo":
//       VsCodeStateChangeBuffer.directoryInfo += message.directoryInfo;
//       VsCodeStateChangeCallbacks.getDirectoryInfo(
//         VsCodeStateChangeBuffer.directoryInfo
//       );
//       break;
//   }
// });

// function createFromVsCodeApi(vscode) {
//   console.log(2);

//   Interactor.showInformationMessage = (text) =>
//     vscode.postMessage({
//       command: "showInformationMessage",
//       text: text,
//     });

//   Interactor.getDirectoryInfo = (callback) => {
//     VsCodeStateChangeCallbacks.getDirectoryInfo = callback;
//     VsCodeStateChangeBuffer.directoryInfo = "";
//     vscode.postMessage({ command: "getDirectoryInfo" });
//     console.log("fantazomia to essteile");
//     console.log(3);
//   };

//   return Interactor;
// }

// const VsCodeInteractorFactory = {
//   createFromVsCodeApi: (vscode) => createFromVsCodeApi(vscode),
// };

// export default VsCodeInteractorFactory;
