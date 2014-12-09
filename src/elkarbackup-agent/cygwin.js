Cygwin = function(){
};

//
// Check if Cygwin is already installed
//
Cygwin.isInstalled = function(callback){
  var fs = require('fs');

  var cygdir = process.env.SystemDrive + '\\cygwin';
  if ( fs.existsSync(cygdir) == true ) {
    callback(true);
  } else {
    callback(false);
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
/*
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
*/

//
// Cygwin Installation (step by step)
//

// Create Cygwin directory
Cygwin.createDirectory = function() {
  var fs = require('fs');

  var cygdir = process.env.SystemDrive + '\\cygwin';
  fs.mkdir(cygdir,
    function (err) {
      if (err) throw err;
    });
};

// Download Cygwin installer (currently not using)
Cygwin.downloadSetup = function(callback) {
  var http = require('http');
  var fs = require('fs');

  var source = 'http://www.cygwin.com/setup-x86.exe';
  var destination = process.env.SystemDrive + '\\cygwin\\cygwin-setup.exe';

  var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });
  }

  download(source, destination, function(){
    callback();
  });
};

Cygwin.install = function(callback) {
  // run setup in quiet mode, install OpenSSH and Rsync
  path = require('path')
  //var root = path.join(process.argv[1],'..','..')
  var packagedir = path.join(process.argv[1],'cygwin-files');
  var setup = path.join(packagedir,'cygwin-setup.exe');
  var cygdir = process.env.SystemDrive + '\\cygwin';
  var packages = 'openssh,openssl,curl,cygrunsrv,rebase,wget,rsync';
  var source = 'http://cygwin.mirrors.pair.com';

  var exec = require('child_process').exec, child;
  // From Internet (very slooow)
  //child = exec(setup + ' --quiet-mode --root ' + cygdir + ' --packages ' + packages + ' --site ' + source,
  // From Local directory
  child = exec(setup + ' --local-install --local-package-dir ' + packagedir + ' --quiet-mode --root ' + cygdir + ' --packages ' + packages,
    {maxBuffer: 1024 * 800},
    function(error, stdout, stderr) {
      if (error != null) {
        console.log('exec error: ' + error);
        callback(error);
        return;
      } else {
        callback();
      }
  });
};

Cygwin.rebaseall = function(callback) {
  // Rebase your packages to avoid strange errors
  //cmd /c %SystemDrive%\cygwin\bin\ash -c /bin/rebaseall
  var path = require('path')
  var exec = require('child_process').exec, child;
  child = exec(path.join(process.env.SystemDrive,'cygwin\\bin\\ash') + ' -c /bin/rebaseall',
    function(error, stdout, stderr) {
      if (error != null) {
        console.log('exec error: ' + error);
        callback(error);
        return;
      } else {
        callback();
      }
  });
};

Cygwin.importGroups = function(callback) {
  // Import local groups
  var path = require('path')
  var exec = require('child_process').exec, child;
  child = exec(path.join(process.env.SystemDrive,'cygwin\\bin\\bash') + ' -c \'PATH=/usr/local/bin:/usr/bin:/bin:/usr/X11R6/bin mkgroup -l\'>'+process.env.SystemDrive+'\\cygwin\\etc\\group',
  function(error, stdout, stderr) {
    if (error != null) {
      console.log('exec error: ' + error);
      callback(error);
      return;
    } else {
      callback();
    }
  });
};

Cygwin.importUsers = function(callback) {
  // Import local users
  var path = require('path')
  var exec = require('child_process').exec, child;
  child = exec(path.join(process.env.SystemDrive,'cygwin\\bin\\bash') + ' -c \'PATH=/usr/local/bin:/usr/bin:/bin:/usr/X11R6/bin mkpasswd -l\'>'+process.env.SystemDrive+'\\cygwin\\etc\\passwd',
  function(error, stdout, stderr) {
    if (error != null) {
      console.log('exec error: ' + error);
      callback(error);
      return;
    } else {
      callback();
    }
  });
};

Cygwin.sshHostConfig = function(callback) {
  // SSH host config, generate service etc...
  var path = require('path')
  var exec = require('child_process').exec, child;
  child = exec(path.join(process.env.SystemDrive,'cygwin\\bin\\bash') + ' -c \'PATH=/usr/local/bin:/usr/bin:/bin:/usr/X11R6/bin /usr/bin/ssh-host-config -y -c \"ntsecbinmode tty\" -w \"abc&&123!!\" \'',
  function(error, stdout, stderr) {
    if (error != null) {
      console.log('exec error: ' + error);
      callback(error);
      return;
    } else {
      callback();
    }
  });
};

module.exports = Cygwin;
