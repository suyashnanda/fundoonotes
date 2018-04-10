var ToDo = angular.module('ToDo')

ToDo.controller('registerController', function($scope, userRegisterService, $location) {

  /**function to register a particular user*/
  $scope.registerUser = function() {
    var user = userRegisterService.registerUser($scope.user, $scope.error);
    user.then(function(response) {
      localStorage.setItem('token', response.data.responseMessage)
      $location.path('/login')
    }, function(response) {
      $scope.error = response.data.responseMessage;
    });
  }
});
