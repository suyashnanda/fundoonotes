var ToDo = angular.module('ToDo');


ToDo.controller('adminController', function($rootScope, $scope, fileReader, $location, $timeout, $mdSidenav, noteService, $mdDialog, mdcDateTimeDialog, toastr, $filter, $interval, $state, Upload, $base64, $q, adminService) {

  $scope.users = [];

  var getUser = function() {
    var getUsers = adminService.getUsers();
    getUsers.then(function(response) {
      $scope.users = response.data;
    }, function(response) {});
  }
  getUser();

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
    $scope.margin = "250px";
  }

  // toggle navbar
  $scope.showNav = true;
  $scope.hideNav = function() {
    $scope.showNav = !$scope.showNav;
  }

  $scope.toggleList = function() {
    $mdSidenav('left').toggle();
  }

  $scope.noteCount = function(user) {
    var countResp = adminService.getNotesCount(user.id);
    countResp.then(function(response) {
      user.count = response.data;
    }, function(response) {

    });
  }

  $scope.count = function() {
    var response = adminService.getCount();
    response.then(function(response) {
      $scope.counts = response.data;
    }, function(response) {

    });
  }

  $scope.home = function() {
    $location.path('home');
  }
});
