var ToDo = angular.module('ToDo')

/**admin service to all get and post requests*/
ToDo.factory('adminService', function($http, $location, httpService) {
  var adminData = {};
  //get all the users
  adminData.getUsers = function() {
    return $http({
      method: "GET",
      url: httpService.baseUrl + 'admin/getalluser',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  //get notes
  adminData.getNotes = function() {
    return $http({
      method: "POST",
      url: httpService.baseUrl + 'admin/notes',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  //get notes count
  adminData.getNotesCount = function(userId) {
    return $http({
      method: "POST",
      url: httpService.baseUrl + 'admin/note-count/' + userId,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  //get count
  adminData.getCount = function(userId) {
    return $http({
      method: "GET",
      url: httpService.baseUrl + 'admin/note-count',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }
  return adminData;
});
