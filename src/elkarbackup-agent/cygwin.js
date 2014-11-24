Cygwin = function(){
};

//
// Check if Cygwin is already installed
//
Cygwin.isInstalled = function(){
  var fs = require('fs');
  if ( fs.existsSync('c:\\cygwin') == true ) {
    return(true);
  } else {
    return(false);
  }
};

//
// Returns true if OpenSSH service is running. Too slow...
//
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
// Cygwin Installation (with .bat file). Provisional.
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


//
// Cygwin Installation (step by step)
//

// Create Cygwin directory. Not tested
Cygwin.createDirectory = function() {
  var fs = requite('fs');
  fs.mkdir('C:\\cygwin',
    function (err) {
      if (err) throw err;
      console.log('Cannot create Cygwin directory: C:\\cygwin ');
    });
};

// Download Cygwin installer. Not tested
Cygwin.downloadSetup = function() {
  var http = require('http');
  var fs = require('fs');

  var file = fs.createWriteStream('setup-x86.exe');
  var request = http.get('http://www.cygwin.com/setup-x86.exe', function(response) {
    response.pipe(file);
  });
};

Cygwin.install = function() {
  // run setup in quiet mode, install OpenSSH and Rsync
};

Cygwin.rebaseall = function() {
  // Rebase your packages to avoid strange errors
};

Cygwin.importGroups = function() {
  // Import local groups
};

Cygwin.importUsers = function() {
  // Import local users
};

Cygwin.sshHostConfig = function() {
  // SSH host config, generate service etc...
};

// This function shouldn't be in this file
Cygwin.addFirewallRule = function() {
  // Add firewall rules
};

// This function shouldn't be in this file
Cygwin.sshStartService = function() {
  // Start SSH service
};

module.exports = Cygwin;
