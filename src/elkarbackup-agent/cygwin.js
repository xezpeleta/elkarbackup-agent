Cygwin = function(){
};

//
// Cygwin Installation
//
Cygwin.doInstallation = function(path, callback){
  var output = process.platform;
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
  callback(output);
};

module.exports = Cygwin;
