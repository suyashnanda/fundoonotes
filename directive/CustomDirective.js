var ToDo = angular.module("ToDo");

//NAVBAR DIRECTIVE
ToDo.directive("toolBar", function() {
  return {
    templateUrl: 'template/NavBar.html'
  };
});

//SIDEBAR DIRECTIVE
ToDo.directive("sideBar", function() {
  return {
    templateUrl: 'template/sideBar.html'
  };
});

// Directive to display Links
ToDo.directive("noteLink", function() {
  return {
    templateUrl: 'template/note.link.html',
    scope:{
      links : "="
    }
  };
});

//CARD ACTIONS LIKE REMIDER,COLOR SELECTION,ARCHIVE AND DELETE
ToDo.directive("cardAction", function() {
  return {
    restrict: 'E',
    scope: {
      colors: '=',
      note: '=',
      colorChanged: '&',
      openImageUploader:'&'
    },
    templateUrl: 'template/mdCardAction.html',
    controller: function($scope) {
      $scope.onColorChange = function(newColor, note) {
        note.color = newColor;
        $scope.colorChanged(note);
      }
      $scope.openImageUploader = function(env) {
        console.log("directive calling",env)
        // $(className).trigger("click");
      }
      // $scope.uploadImage = function(selectedfiles) {
      //   console.log("selectedfiles",selectedfiles);
      // }
    }
  };
});
//NEW NOT ACTION FRO UPDATE
ToDo.directive("newNoteAction", function() {
  return {
    templateUrl: 'template/createNewNoteAction.html'
  };
});
//FILE SELECTION
ToDo.directive("ngFileSelect", function(fileReader, $timeout) {
  return {
    scope: {
      ngModel: '='
    },
    link: function($scope, el) {
      function getFile(file) {
        fileReader.readAsDataUrl(file, $scope).then(function(result) {
          $timeout(function() {
            $scope.ngModel = result;
          });
        });
      }
      el.bind("change", function(e) {
        var file = (e.srcElement || e.target).files[0];
        getFile(file);
      });
    }
  };
});

ToDo.factory("fileReader", function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();
    var reader = getReader(deferred, scope);
    reader.readAsDataURL(file);
    return deferred.promise;
  };

  return {
    readAsDataUrl: readAsDataURL
  };
});
