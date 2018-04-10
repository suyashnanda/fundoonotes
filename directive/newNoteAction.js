var ToDo = angular.module("ToDo");

//NEW NOT ACTION FRO UPDATE
ToDo.directive("newNoteAction", function() {
  return {
    templateUrl: 'template/createNewNoteAction.html'
  };
});
