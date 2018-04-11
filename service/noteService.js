var ToDo = angular.module('ToDo');

ToDo.factory('noteService', function($http, $location, httpService,cfpLoadingBar) {
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
  notes.searchStringInArray = function(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].match(str)) return j;
    }
    return -1;
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
        'Authorization': localStorage.getItem('token'),
        "Content-Type": undefined
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
        'url': url,
        'Authorization': localStorage.getItem('token')
      }
    });
  }
  /**Loading bar*/
  notes.start = function() {
    cfpLoadingBar.start();
  };

  notes.complete = function() {
    cfpLoadingBar.complete();
  }
  return notes;
})
