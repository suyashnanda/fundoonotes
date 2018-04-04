(function () {
    'use strict';

    angular
        .module('app')
        .factory('jwtInjector', [function() {
            return {
              request: function(config) {
                // config.url = httpService.baseUrl + config.url;
                // if (!UserService.getUserToken()) {
                //   config.headers['Authorization'] = UserService.getUserToken();
                // }
                 config.headers['Authorization'] = localStorage.getItem("token");
                return config;
              }
            };
        }])
        .factory('HttpService', HttpService);

    HttpService.$inject = ['$http','httpService'];
    function HttpService($http,httpService) {
      var service = {};
      service.baseUrl = httpService.baseUrl + "admin/";

      return service;
    }
  })();
