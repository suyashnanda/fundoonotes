var ToDo = angular.module('ToDo');


ToDo.controller('adminController', function ($rootScope,$scope,fileReader,$location, $timeout, $mdSidenav,noteService,$mdDialog,mdcDateTimeDialog,toastr
		,$filter,$interval,$state,Upload, $base64,$q,adminService) {
	

	
	$scope.users=[];
	
/*	var getUserdetail=function(){
		var userInfo=noteService.UserInfo();
		userInfo.then(function(response){
			$scope.user=response.data;
			console.log($scope.user);
		},function(response){
			$location.path('login');
		});
	}
	getUserdetail();*/
	
	var getUser=function(){
		var getUsers=adminService.getUsers();
		getUsers.then(function(response){
			$scope.users=response.data;
			console.log($scope.users);
		},function(response){
			
		});
	}
	getUser();
	
	
	$scope.toggleLeft = function(){
		$mdSidenav('left').toggle();
		$scope.margin="250px";
	}
	
	// toggle navbar
    $scope.showNav=true;
    $scope.hideNav=function(){
    	$scope.showNav=!$scope.showNav;
    	}
	
	$scope.toggleList=function(){
		$mdSidenav('left').toggle();
	}
	
	$scope.noteCount=function(user){
		var countResp=adminService.getNotesCount(user.id);
		countResp.then(function(response){
			user.count=response.data;
			console.log(user.count);
		},function(response){
			
		});
	}
	
	
	$scope.count=function(){
		console.log("called");
		var response=adminService.getCount();
		response.then(function(response){
			$scope.counts=response.data;
			console.log($scope.counts);
		},function(response){
			
		});
	}
	
	 $scope.home=function(){
	    	$location.path('home');
	    }	

});