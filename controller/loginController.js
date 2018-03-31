/**
 * 
 */
var ToDo = angular.module('ToDo')

ToDo.controller('loginController',function($scope,loginService,$location,toastr){
	
	$scope.loginUser= function(){
		console.log("At the beggining of controller");
		var a = loginService.service('POST','login',$scope.user,$scope.error);
		console.log(a);
			a.then(function(response){
				console.log(response.data.responseMessage);
				localStorage.setItem('token',response.data.responseMessage);
				
				console.log("login success");
				$location.path('home');
			},function(response){
				if(response.status==409)
					{
						$scope.error=response.data.responseMessage;
						toastr.error($scope.error,{ timeOut: 1000 });
					}
				else if(response.status==401){
					$scope.error = response.data.responseMessage;
					toastr.error($scope.error,{ timeOut: 1000 });
				} 
				else if(response.status==401){
					$scope.error = response.data.responseMessage;
					toastr.error($scope.error,{ timeOut: 1000 });
				} 
				
				else
					{	
						console.log("fail");
						$scope.error="Enter valid data";
						toastr.error($scope.error,{ timeOut: 1000 });
					}
			});
	}
	
	$scope.forgetPassword=function(){
		console.log($scope.user);
		var message=loginService.service('POST','forgotpassword',$scope.user);
		
		message.then(function(response) {
			$scope.error=response.data.responseMessage;
		},function(response){
				console.log("forgot password error");
				$scope.error=response.data.responseMessage;
		
			});
	}
	
	$scope.resetpassword = function(){
		var path=$location.path();
		console.log("$location.path",$location.path());
		path=path.replace(path.charAt(0),'');
		if($scope.cpassword==$scope.user.password){
		var message=loginService.service('POST',path,$scope.user);
		message.then(function(response) {
			$scope.error=response.data.message;
			$location.path('/login');
		},function(response){
				$scope.error=response.data.message;
			});
		}else{
			$scope.error='Password does not match';
		}
	}
	
	$scope.exit=function(){
		$location.path('/login');
	}
});
