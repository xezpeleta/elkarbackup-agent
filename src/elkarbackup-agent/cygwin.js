Cygwin = function(){
};

//
// Check if Cygwin is already installed
//
Cygwin.isInstalled = function(){
  var fs = require('fs');

  var cygdir = process.env.SystemDrive + '\\cygwin2';
  if ( fs.existsSync(cygdir) == true ) {
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
  var fs = require('fs');

  var cygdir = process.env.SystemDrive + '\\cygwin2';
  fs.mkdir(cygdir,
    function (err) {
      if (err) throw err;
    });
};

// Download Cygwin installer. Not tested
Cygwin.downloadSetup = function(callback) {
  var http = require('http');
  var fs = require('fs');

  var source = 'http://www.cygwin.com/setup-x86.exe';
  var destination = process.env.SystemDrive + '\\cygwin2\\cygwin-setup.exe';

  var file = fs.createWriteStream(destination);
  var request = http.get(source, function(response) {
    response.pipe(file);
    callback(response.statusCode);
  });

  request.on('error', function(e) {
    console.log('Error: ' + e.message);
    if (e) throw e;
  });
};

Cygwin.install = function() {
  // run setup in quiet mode, install OpenSSH and Rsync
  var setup = process.env.SystemDrive + '\\cygwin2\\cygwin-setup.exe';
  var cygdir = process.env.SystemDrive + '\\cygwin2';
  var packages = 'openssh,openssl,curl,cygrunsrv,rebase,wget,rsync';
  var source = 'http://cygwin.mirrors.pair.com';
  var packagedir = 'e:\\cygwin-files';

  var exec = require('child_process').exec, child;
  console.log('Running installer');
  child = exec(setup + ' --quiet-mode --root ' + cygdir + ' --packages ' + packages + ' --site ' + source,
  //child = exec(setup + ' --local-install --local-package-dir ' + packagedir + ' --quiet-mode --root ' + cygdir + ' --packages ' + packages,
    function(error, stdout, stderr) {
      if (error != null) {
        console.log('exec error: ' + error);
      };
    });

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
