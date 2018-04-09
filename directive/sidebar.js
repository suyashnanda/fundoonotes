var ToDo = angular.module("ToDo");

//SIDEBAR DIRECTIVE
ToDo.directive("sideBar", function() {
  return {
    templateUrl: 'template/sideBar.html'
  };
});
