var ToDo = angular.module('ToDo');

ToDo.factory('noteService', function($http, $location, httpService) {
  var notes = {};
  notes.service = function(url, method, note) {

    return $http({
      method: method,
      url: httpService.baseUrl + url,
      data: note,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  notes.update = function(url, method, noteId, status, field) {
    return $http({
      method: method,
      url: httpService.baseUrl + url,
      params: {
        noteId: noteId,
        status: status,
        field: field
      },
      headers: {
        'Authorization': localStorage.getItem('token')
      }

    })
  }

  notes.uploadImage = function(url, method, image) {
    return $http({
      method: method,
      url: httpService.baseUrl + url,
      data: image,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
  }

  notes.collaborate = function(url, method, note, email) {
    return $http({
      method: method,
      url: httpService.baseUrl + url,
      data: note,
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Email': email
      }
    });
  }

  notes.label = function(url, method, label) {
    return $http({
      method: method,
      url: httpService.baseUrl + url,
      data: label,
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
  }

  notes.getUrl = function(url) {
    return $http({
      method: 'POST',
      url: httpService.baseUrl + 'geturl',
      headers: {
        'url': httpService.baseUrl + url,
        'Authorization': localStorage.getItem('token')
      }
    });
  }

  return notes;
})
