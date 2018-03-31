var ToDo = angular.module('ToDo');

ToDo.factory('noteService', function($http,$location) {
	var notes={};

	
	notes.service=function(url,method,note){
		
		return $http({	
		    method: method,
		    url: url,
		    data:note,
		    headers: {
		        'Authorization': localStorage.getItem('token')
		    }
		
		});
	}
	
	notes.update=function(url,method,noteId,status,field){
		return $http({
			method : method,
			url : url,
			params : {
				noteId : noteId,
				status : status,
				field  : field
			},
			headers: {
		        'Authorization': localStorage.getItem('token')
		    }
			
		})
	}
	
	notes.uploadImage=function(url,method,image){
		return $http({
			method :method,
			url:url,
			data:image,
			headers :{
				 'Authorization': localStorage.getItem('token')
			}
		})
	}
	
		notes.collaborate=function(url,method,note,email){
		console.log("inside collaborated");
		return $http({	
		    method: method,
		    url: url,
		    data:note,
		    headers: {
		        
		    	'Authorization': localStorage.getItem('token'),
		    	'Email': email
		    }
		
		});
	}
	
	notes.label=function(url,method,label){
		console.log("inside label");
		return $http({
			method : method,
			url :url,
			data:label,
			headers:{
				'Authorization': localStorage.getItem('token')
			}
		})
	}
	
	notes.getUrl=function(url){
		return $http({
		    method: 'POST',
		    url: 'geturl',
		    headers: {
		        'url': url,
		        'Authorization': localStorage.getItem('token')
		    }
		
		});
	}

	return notes;
})