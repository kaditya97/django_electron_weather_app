const electron = require("electron");
var urlExists = require('url-exists');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true }});
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  setInterval(function() {
    urlExists('http://127.0.0.1:8000/', function(err, exists) {
        if(exists==true){
            mainWindow.loadURL(`http://127.0.0.1:8000/`)
        }
      });
    }, 5000);
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

var child = require('child_process');
var executablePath = path.join(__dirname, './dist/weather.exe');

var shell = child.exec(`${executablePath} runserver`);

app.on('quit',() => {
  shell.kill(`SIGTERM`);
  var ex = child.exec('taskkill /im weather.exe /t /f',() => {ex.kill(`SIGTERM`);});
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
