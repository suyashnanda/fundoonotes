/**
 *
 */

var ToDo = angular.module('ToDo')

ToDo.factory('loginService', function($http, $location, httpService) {
  var login = {};
  login.service = function(method, url, user) {
    return $http({
      method: method,
      url: httpService.baseUrl + url,
      data: user
    });
  }
  return login;
});
