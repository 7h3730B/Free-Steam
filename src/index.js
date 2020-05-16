const {
  app,
  BrowserWindow,
} = require('electron');
const FreeGamesWindow = require('./window.js');
const path = require('path');

function createWindow() {

  let mainWindow = new FreeGamesWindow(800, 400, true);

  mainWindow.setMenuBarVisibility(false);
  //mainWindow.setIcon('');

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools();

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('Window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});