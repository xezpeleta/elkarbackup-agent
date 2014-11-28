Windows = function(){
};

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

Windows.isAdminUser2 = function(callback){
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

module.exports = Windows;
