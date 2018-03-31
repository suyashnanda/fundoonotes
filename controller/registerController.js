var ToDo = angular.module('ToDo')

ToDo.controller('registerController',function($scope,userRegisterService,$location){
	$scope.registerUser= function(){
		var a= userRegisterService.registerUser($scope.user,$scope.error);
			a.then(function(response){
				console.log("Registration successfull");
				localStorage.setItem('token',response.data.responseMessage)
				$location.path('/login')
			},function(response){
				console.log("failed to register");
				$scope.error=response.data.responseMessage;
			});
	}
});