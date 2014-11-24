var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');
var Tray = require('tray');
var Menu = require('menu');

var cygwin = require('./cygwin');

require('crash-reporter').start();

// Quit when all windows are closed
app.on('window-all-closed', function() {
  // But not in MacOS (you know...)
  if (process.platform != 'darwin')
    app.quit();
});

var mainWindow = null;
var appIcon = null;
// Ready for creating browser windows
app.on('ready', function() {
  //appIcon = new Tray(path.join(__dirname, 'img/ovdesktop-logo.png'));
  //appIcon.setToolTip('elkarbackup-agent');
  /*
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' }
  ]);
  appIcon.setContextMenu(contextMenu);
  */
  mainWindow = new BrowserWindow({width: 500, height: 300, icon: path.join(__dirname, 'img/ovdesktop-logo.png')});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Tray action
  /*
  appIcon.on('clicked', function() {
    mainWindow.show();
    mainWindow.focus();
  });
  */

  // Window closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

var ipc = require('ipc');
ipc.on('btnCygInstall', function(event, arg) {
  //output = cygwin.checkPreviousInstallation()
  cygwin.doInstallation(path, function (output) {
    console.log(output);
  });
});
