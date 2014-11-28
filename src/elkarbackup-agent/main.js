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

// GARBITZEKO

var wincmd = require('node-windows');

wincmd.isAdminUser(function(isAdmin){
 if (isAdmin) {
 console.log('The user has administrative privileges.');
 } else {
 console.log('NOT AN ADMIN');
 }
});
// FIN GARBITZEKO

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
  mainWindow.webContents.send('change-progress', '10');
  setTimeout(function(){
    mainWindow.webContents.send('change-progress', '40');
  }, 3000);
});



ipc.on('startCheck', function(event, arg){
  mainWindow.setTitle('Checking...');
  if ( cygwin.isInstalled() == false ) {
    // Installation
    setTimeout(function(){
      console.log('fake timeout');
      mainWindow.loadUrl('file://' + __dirname + '/install.html');
    },3000);
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
