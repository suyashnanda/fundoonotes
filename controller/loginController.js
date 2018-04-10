var ToDo = angular.module('ToDo')

ToDo.controller('loginController', function($scope, loginService, $location, toastr) {
  /**function to login for user*/
  $scope.loginUser = function() {
    var a = loginService.service('POST', 'login', $scope.user, $scope.error);
    a.then(function(response) {
      localStorage.setItem('token', response.data.responseMessage);
      $location.path('home');
    }, function(response) {
      if (response.status == 409) {
        $scope.error = response.data.responseMessage;
        toastr.error($scope.error, {
          timeOut: 1000
        });
      } else if (response.status == 401) {
        $scope.error = response.data.responseMessage;
        toastr.error($scope.error, {
          timeOut: 1000
        });
      } else {
        $scope.error = "Enter valid data";
        toastr.error($scope.error, {
          timeOut: 1000
        });
      }
    });
  }
  //function to get user password in case of forget password
  $scope.forgetPassword = function() {
    var message = loginService.service('POST', 'forgotpassword', $scope.user);
    message.then(function(response) {
      $scope.error = response.data.responseMessage;
    }, function(response) {
      $scope.error = response.data.responseMessage;
    });
  }

  /**function to apply new password in case of forgot*/
  $scope.resetpassword = function() {
    var path = $location.path();
    path = path.replace(path.charAt(0), '');
    if ($scope.cpassword == $scope.user.password) {
      var message = loginService.service('POST', path, $scope.user);
      message.then(function(response) {
        $scope.error = response.data.message;
        $location.path('/login');
      }, function(response) {
        $scope.error = response.data.message;
      });
    } else {
      $scope.error = 'Password does not match';
    }
  }

  $scope.exit = function() {
    $location.path('/login');
  }
});
