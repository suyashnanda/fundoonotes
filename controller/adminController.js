var ToDo = angular.module('ToDo');

ToDo.controller('adminController', function($rootScope, $scope, fileReader, $location, $timeout, $mdSidenav, noteService, $mdDialog, mdcDateTimeDialog, toastr, $filter, $interval, $state, Upload, $base64, $q, adminService) {

  $scope.users = [];
  /**function to get user from services*/
  var getUser = function() {
    var getUsers = adminService.getUsers();
    getUsers.then(function(response) {
      $scope.users = response.data;
    }, function(response) {});
  }
  getUser();

  /**function to toggle side nav*/
  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
    $scope.margin = "250px";
  }

  /**toggle navbar*/
  $scope.showNav = true;
  $scope.hideNav = function() {
    $scope.showNav = !$scope.showNav;
  }

  $scope.toggleList = function() {
    $mdSidenav('left').toggle();
  }
  /**function to count the number of notes*/
  $scope.noteCount = function(user) {
    var countResp = adminService.getNotesCount(user.id);
    countResp.then(function(response) {
      user.count = response.data;
    }, function(response) {

    });
  }
  /**function to count the number of notes*/
  $scope.count = function() {
    var response = adminService.getCount();
    response.then(function(response) {
      $scope.counts = response.data;
    }, function(response) {

    });
  }
  /**function to redirect to home page*/
  $scope.home = function() {
    $location.path('home');
  }
});
