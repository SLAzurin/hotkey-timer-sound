const { app, BrowserWindow, globalShortcut } = require("electron");
if (require("electron-squirrel-startup")) app.quit();

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  const ret = globalShortcut.register("CommandOrControl+X", () => {
    win.webContents.executeJavaScript(
      'document.getElementById("start-button").click();'
    );
    console.log("CommandOrControl+X is pressed");
  });

  if (!ret) {
    console.log("registration failed");
    process.exit(1);
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  // Unregister a shortcut.
  globalShortcut.unregister("CommandOrControl+X");

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
