Windows = function(){
};

Windows.isAdminUser = function(callback){
  var wincmd = require('node-windows');
  wincmd.isAdminUser(function(isAdmin){
    console.log('Mirando el valor isAdmin: ' + isAdmin);
    if (isAdmin) {
      console.log('The user has administrative privileges.');
      callback(true);
      return;
    } else {
      console.log('NOT AN ADMIN');
      callback(false);
      return;
    }
  });
};

module.exports = Windows;
