var ToDo = angular.module('ToDo')

ToDo.factory('userRegisterService', function($http, $location, httpService) {
  var details = {};

  details.registerUser = function(user) {
    return $http({
      method: "POST",
      url: httpService.baseUrl + 'userregister',
      data: user
    })
  }
  return details;
})
