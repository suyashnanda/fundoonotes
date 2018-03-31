var toDo = angular.module('ToDo');

toDo.factory('dummyservice', function($http, $location) {
	
var login={};
login.service=function(){
	return $http({
		method:'GET',
		url:'gettoken',
	})
	}
return login;
})