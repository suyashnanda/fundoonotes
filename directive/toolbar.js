var ToDo = angular.module("ToDo");

//NAVBAR DIRECTIVE
ToDo.directive("toolBar", function() {
  return {
    templateUrl: 'template/NavBar.html'
  };
});
