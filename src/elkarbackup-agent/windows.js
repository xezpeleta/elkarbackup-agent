Windows = function(){
};

/*
Windows.isAdminUser = function(callback){
  var wincmd = require('node-windows');
  wincmd.isAdminUser(function(isAdmin){
    console.log('Mirando el valor isAdmin: ' + isAdmin);
    if (isAdmin) {
      console.log('The user has administrative privileges.');
      callback(true);
    } else {
      console.log('NOT AN ADMIN');
      callback(false);
    }
  });
};
*/

Windows.isAdminUser = function(callback){
  var exec = require('child_process').exec, child;
  child = exec('NET SESSION',
    function(error, stdout, stderr) {
      if (error != null){
        //console.log('Exec error: ' + error);
        callback(false);
      } else {
        callback(true);
      }
    });
};


Windows.addFirewallRule = function(callback) {
  // Add firewall rules
  var path = require('path')
  var exec = require('child_process').exec, child;
  // todo: change command string or use node
  child = exec('if exist %Systemroot%\\system32\\netsh.exe netsh advfirewall firewall add rule name=\"SSHD\" dir=in action=allow program=\"c:\\cygwin\\usr\\sbin\\sshd.exe\"',
  function(error, stdout, stderr) {
    if (error != null) {
      console.log('exec error: ' + error);
      callback(error);
    } else {
      // todo: change command string or use node
      child = exec('if exist %Systemroot%\\system32\\netsh.exe netsh advfirewall firewall add rule name=\"ssh\" dir=in action=allow protocol=TCP localport=22',
      function(error, stdout, stderr) {
        if (error != null) {
          console.log('exec error: ' + error);
          callback(error);
        } else {
          console.log('Firewall configured');
          callback();
        }
      });
    }
  });
};

/*
Windows.startSshService = function(callback) {
  // Start SSH service
  var Service = require('node-windows').Service;
  var svc = new Service({
    name: 'sshd',
    description: 'CYGWIN sshd',
    script: 'c:\\cygwin\\bin\\cygrunsrv.exe'
  });

  svc.on('alreadyinstalled', function(){
    svc.start();
    callback();
  });

  svc.on('error', function(){
    callback('Error starting SSH service');
  });

  svc.install();
};
*/

Windows.startSshService = function(callback) {
  var sm = require('windows-service-manager');
  sm.startService('sshd', 10, function(err, services) {
    if (err == 'timeout'){
      console.log('Error: ' + err);
      callback(err);
    } else {
      console.log('Started');
      callback();
    }
  });
};


module.exports = Windows;
