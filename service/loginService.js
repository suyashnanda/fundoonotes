/**
 * 
 */

var ToDo = angular.module('ToDo')

ToDo.factory('loginService',function($http,$location){
	var login ={};
	
	login.service = function(method,url,user){
		return $http({
			method :method,
			url :url,
			data : user
			
		});
	}

	return login;
});