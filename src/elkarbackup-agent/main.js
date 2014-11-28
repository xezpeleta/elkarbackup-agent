var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');
var Tray = require('tray');
var Menu = require('menu');

var cygwin = require('./cygwin');
var windows = require('./windows');

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
  mainWindow = new BrowserWindow({width: 600, height: 400, icon: path.join(__dirname, 'img/ovdesktop-logo.png'), title: 'ElkarBackup Agent'});
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


ipc.on('startInstallation', function(event, arg){
  var ipc = require('ipc');
  mainWindow.setTitle('Installing...');
  console.log('Cygwin not installed. Installing...');

  mainWindow.webContents.send('change-message', 'Creating directory <b>C:\\cygwin</b> ...');
  mainWindow.webContents.send('change-progress', '10');
  cygwin.createDirectory();

  mainWindow.webContents.send('change-message', 'Installing Cygwin ...');
  mainWindow.webContents.send('change-progress', '20');
  cygwin.install(function(err){
    if (err){
      console.log('Error installing Cygwin');
      mainWindow.webContents.send('change-message', 'Error installing Cygwin');
      //TODO: delete progress bar
      mainWindow.webContents.send('change-cancel-button', 'Close');
    } else{
      mainWindow.webContents.send('change-message', 'Cygwin installed successfully ...');
      mainWindow.webContents.send('change-progress', '80');
    }
  });
  setTimeout(function(){
    mainWindow.webContents.send('change-progress', '40');
  }, 3000);
});



ipc.on('startCheck', function(event, arg){
  var ipc = require('ipc');
  mainWindow.setTitle('Checking...');
  mainWindow.webContents.send('change-message', 'Checking user privileges...');
  windows.isAdminUser2(function (isAdmin){
    if ( isAdmin == true ) {
      mainWindow.webContents.send('change-message', 'Looking for any previous installation...');
      if ( cygwin.isInstalled() == false ) {
        // Installation
        setTimeout(function(){
          console.log('fake timeout');
          mainWindow.loadUrl('file://' + __dirname + '/install.html');
        },3000);
      } else {
        console.log('Cygwin already installed!');
        mainWindow.webContents.send('change-message', 'There has been an error. Installation folder <b>C:\\cygwin</b> already exists!');
        mainWindow.webContents.send('change-cancel-button', 'Close');
      }
    } else {
      console.log('Must have admin privileges');
      mainWindow.webContents.send('change-message', 'The installation will be canceled. <b>You need administrator privileges</b>');
    }
  });
});

ipc.on('cancel', function(event,arg){
  var dialog = require('dialog');
  var r = dialog.showMessageBox(mainWindow, { type: 'info', buttons: [ 'Cancel', 'OK'], title: 'Cancel', message: 'Do you really want to cancel the installation and exit?'});
  if (r == 1) {
    process.exit(0);
  }
});


/*
ipc.on('btnCygInstall', function(event, arg) {
  if ( cygwin.isInstalled() == false ) {
    console.log('Cygwin not installed. Installing...');
    try {
      cygwin.createDirectory();
      cygwin.install(function(err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('installed');
        //cygwin.importGroups();
        //cygwin.importUsers();
        //cygwin.sshHostConfig();
        //cygwin.addFirewallRule();
        //cygwin.sshStartService();
      });
    } catch (ex) {
      console.log('Cannot install Cygwin, admin privileges needed: ' + ex);
    }
  } else {
    console.log('Cygwin already installed!');
    cygwin.sshIsRunning (function (running) {
      if (running == true) {
        console.log('OpenSSH daemon is running');
      } else {
        console.log('OpenSSH daemon is NOT running');
      }
    });
  }
});
*/
