var ToDo = angular.module('ToDo');
ToDo.controller('dummyController', function($location, dummyservice) {
  
  //call a service to set token in localstorage and redirect to home page
  var dummyservice = dummyservice.service();
  dummyservice.then(function(response) {
    localStorage.setItem('token', response.data.responseMessage);
    $location.path('/home');
  }, function(response) {

  });
});
