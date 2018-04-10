var ToDo = angular.module("ToDo");

//CARD ACTIONS LIKE REMIDER,COLOR SELECTION,ARCHIVE AND DELETE
ToDo.directive("cardAction", function() {
  return {
    restrict: 'E',
    scope: {
      colors: '=',
      note: '=',
      colorChanged : '&',
      imageIsLoaded: '&',
      labels : "=",
      openImageUploader : '&',
      checkboxCheck : '&',
      labelToggle : '&',
      displayDialog : '&',
      collaborators : '&',
      getOwner : '&',
      archive : '&',
      deleteNote : '&',
      removeMySelf : '&',
      makeCopy : '&'
    },
    templateUrl: 'template/mdCardAction.html',
    controller: function($scope) {
      $scope.getOwner({note:$scope.note});
      $scope.onColorChange = function(newColor, note) {
        note.color = newColor;
        $scope.colorChanged(note);
      }
      $scope.openImageUploader = function(env) {
        $($(env.currentTarget).find(".picUpload")[0]).trigger("click")
      }
      $scope.uploadImage = function(selectedfile, usernotes) {
        $scope.imageFile = selectedfile;
        localStorage.setItem('selectedfile', $scope.imageFile[0]);
        localStorage.setItem('userNote', usernotes)
        $scope.imageIsLoaded({note_id:$scope.note.noteId,fileData:$scope.imageFile[0]});
      }
    }
  };
});
