var ToDo = angular.module("ToDo");

// Directive to display Links
ToDo.directive("noteLink", function() {
  return {
    templateUrl: 'template/note.link.html',
    scope: {
      links: "="
    }
  };
});
