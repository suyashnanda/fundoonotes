var ToDo = angular.module('ToDo.Http', [])

ToDo.factory('httpService', function() {
  /**add a commom baseurl and get the token to use*/
  return {
    baseUrl: "http://192.168.0.174:8080/fundoonote/api/",
    getToken: function() {
      var token = localStorage.getItem('token');
      this.token = token;
      return token
    }
  }
});

/***interceptor to set the token*/
ToDo.factory('jwtInjector', function(httpService) {
  return {
    request: function(config) {
      if (!httpService.getToken()) {
        config.headers['Authorization'] = httpService.token;
      }
      if (RegExp('packing', 'i').test(window.location.host)) {
        return config
      }
      return config;
    }
  };
});
