var ToDo = angular.module('ToDo')

ToDo.factory('adminService', function($http, $location, httpService) {
  var adminData = {};
  adminData.getUsers = function() {
    return $http({
      method: "GET",
      url: httpService.baseUrl + 'admin/getalluser',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  adminData.getNotes = function() {
    return $http({
      method: "POST",
      url: httpService.baseUrl + 'admin/notes',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  adminData.getNotesCount = function(userId) {
    return $http({
      method: "POST",
      url: httpService.baseUrl + 'admin/note-count/' + userId,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }


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
