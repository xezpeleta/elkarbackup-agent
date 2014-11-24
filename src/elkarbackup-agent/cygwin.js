Cygwin = function(){
};

//
// Check if Cygwin is already installed
//
Cygwin.isInstalled = function(){
  var path = require('path');
  var fs = require('fs');
  if ( fs.existsSync('c:\\cygwin') == true ) {
    return(true);
  } else {
    return(false);
  }
};

Cygwin.sshIsRunning = function(callback){
  var serviceManager = require('windows-service-manager');
  serviceManager.queryService('sshd' ,function(error, services) {
    //console.log(error || services.state);
    if ( services.state == 4) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

//
// Cygwin Installation (.bat file)
//
Cygwin.doInstallation = function(path, callback){
  var output = null;
  var exec = require('child_process').exec, child;
  if (process.platform == 'win32') {
    installer = path.join(__dirname, '../install-cygwin-sshd.bat');
  }
  child = exec(installer,
    function (error, stdout, stderr) {
      if (error != null) {
        console.log('exec error: ' + error);
      };
    });
  callback('sdafasdfa');
};

module.exports = Cygwin;
