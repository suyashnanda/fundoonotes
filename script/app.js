var ToDo = angular.module('ToDo', ['ui.router', 'ngSanitize','angular-loading-bar','ngAnimate',
  'ngMaterial', 'tb-color-picker', 'ngMaterialDatePicker',
  'toastr', 'ngFileUpload', 'base64', 'ngMessages', 'ToDo.Http'
])
/**config file to define all the states*/
ToDo.config(function($httpProvider, $stateProvider, $urlRouterProvider,cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = true;
  $httpProvider.interceptors.push('jwtInjector');

  $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'template/signup.html',
      controller: 'registerController'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'template/login.html',
      controller: 'loginController'
    })

    .state('home', {
      url: '/home',
      templateUrl: 'template/home.html',
      controller: 'homeController'
    })

    .state('forgotPassword', {
      url: '/forgotpassword',
      templateUrl: 'template/forgotPassword.html',
      controller: 'loginController'
    })

    .state('resetPassword', {
      url: '/resetPassword/:token',
      templateUrl: 'template/resetPassword.html',
      controller: 'loginController'
    })

    .state('trash', {
      url: '/trash',
      templateUrl: 'template/trash.html',
      controller: 'homeController'
    })

    .state('reminder', {
      url: '/reminder',
      templateUrl: 'template/reminder.html',
      controller: 'homeController'
    })

    .state('archive', {
      url: '/archive',
      templateUrl: 'template/archive.html',
      controller: 'homeController'
    })

    .state('dummy', {
      url: '/dummy',
      templateUrl: 'template/dummypage.html',
      controller: 'dummyController'
    })

    .state('label', {
      url: '/label/:name',
      templateUrl: 'template/labels.html',
      controller: 'homeController'
    })

    .state('admin', {
      url: '/admin',
      templateUrl: 'template/admin.html',
      controller: 'adminController'
    })

    .state('search', {
      url: '/search',
      templateUrl: 'template/search.html',
      controller: 'homeController'
    });

  $urlRouterProvider.otherwise('login');
});
