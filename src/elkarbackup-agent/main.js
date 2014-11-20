function execSpiceClient(file) {
  var exec = require('child_process').exec, child;
  if (process.platform == 'linux') {
    spiceclient = 'remote-viewer';
    args = '--full-screen';
  } else if (process.platform == 'darwin') {
    spiceclient = '/Applications/RemoteViewer.app/Contents/MacOS/RemoteViewer';
    args = '';
  } else if (process.platform == 'win*') {
    spiceclient = 'c:\Program Files\RemoteViewer\RemoteViewer.exe'; // FIX and test...
    args = '';
  }
  child = exec(spiceclient + ' ' + file + ' ' + args,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      };
    });
};

var config = require('./config');   // Config file
var proxmox = require('./proxmox'); // Proxmox methods

var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');
var Tray = require('tray');
var Menu = require('menu');

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
  appIcon = new Tray(path.join(__dirname, 'img/ovdesktop-logo.png'));
  //appIcon.setToolTip('elkarbackup-agent');
  //var contextMenu = Menu.buildFromTemplate([
  //  { label: 'Item1', type: 'radio' }
  //]);
  //appIcon.setContextMenu(contextMenu);
  mainWindow = new BrowserWindow({width: 300, height: 500, icon: path.join(__dirname, 'img/ovdesktop-logo.png')});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Tray action
  appIcon.on('clicked', function() {
    mainWindow.show();
    mainWindow.focus();
  })

  // Window closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

// "Connect" button pressed
var ipc = require('ipc');
ipc.on('btnConnect', function(event, arg) {
  username = arg.username;
  password = arg.password;
  host = arg.host;

  var server = config.proxmox.server;
  var ticket = '';
  var csrf = '';

  os = require('os');
  var sconfigfile = os.tmpdir() + '/spiceproxy';

  authdata = proxmox.auth(server, username, password, function (status, ticket, csrf) {
    if (status == 200) {
      //
      // Testing some methods
      //
      /*
      proxmox.getVmList(ticket, server, function(status, vmlist) {
        if (status == 200) {
          console.log('SPICE enabled available VM:');
          for(var vm in vmlist.data){
            if (vmlist.data[vm].status == 'running') {
              vmid = vmlist.data[vm].vmid;
              proxmox.getVmConfig(ticket, server, vmid, function (status, vmconfig) {
                if (status == 200) {
                  console.log(vmconfig.data.name + ': ' + proxmox.isSpiceEnabled(vmconfig, vmid));
                }
              });
            }
          }
        }
      });
      */
      proxmox.getSpiceConfig(ticket, csrf, server, host, function (status, sconfig) {
        if (status == 200) {
          var fs = require('fs');
          fs.writeFile(sconfigfile, sconfig, function(err) {
            if (err) {
              console.log(error);
            } else {
              execSpiceClient(sconfigfile);
            }
          })
        } else {
          console.log('ERROR: cannot get spice proxy configuration file');
        }
      });
    } else {
      console.log('ERROR: authentication error');
    }
  })
});
