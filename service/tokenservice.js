var toDo = angular.module('ToDo');

toDo.factory('dummyservice', function($http, $location,httpService) {
	var login={};
	login.service = function(){
			return $http({
				method:'GET',
				url:httpService.baseUrl + 'gettoken',
			})
	};

	return login;
});
