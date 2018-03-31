var ToDo = angular.module('ToDo')

ToDo.factory('adminService',function($http,$location){
var adminData ={};
	
	
	adminData.getUsers = function(){
		
		return $http({
			method :"GET",
			url :'admin/getAllUser',
			headers: { 'Authorization': localStorage.getItem('token')
					}
		});
	}
	
	

	adminData.getNotes = function(){
		
		return $http({
			method :"POST",
			url :'admin/notes',
			headers: { 'Authorization': localStorage.getItem('token')
					}
		});
	}
	
adminData.getNotesCount = function(userId){
		
		return $http({
			method :"POST",
			url :'admin/note-count/'+userId,
			headers: { 'Authorization': localStorage.getItem('token')
					}
		});
	}
	

adminData.getCount = function(userId){
		
		return $http({
			method :"GET",
			url :'admin/note-count',
			headers: { 'Authorization': localStorage.getItem('token')
					}
		});
	}
	
	
	return adminData;
});