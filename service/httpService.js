
var ToDo = angular.module('ToDo')

ToDo.factory('httpService',function(){

	return {
    baseUrl : "http://192.168.0.180:8080/ToDo/",
    getToken : function () {
      var token = localStorage.getItem('token');
      this.token = token;
        return token
    }
  }
});

ToDo.factory('jwtInjector', function(httpService) {
    return {
        request: function(config) {
            // config.url = httpService.baseUrl + config.url;
            if (!httpService.getToken()) {
                config.headers['Authorization'] = httpService.token;
            }
            if (RegExp('packing','i').test(window.location.host)) {
               return config
             }
             
             // var rest_request_regex = new RegExp('^.*?/api/(.*)$')
             // config.url = config.url.replace(rest_request_regex,httpService.baseUrl+'/$1')

             // var files_request_regex = new RegExp('^/(files/(.*))$')
             // config.url = config.url.replace(files_request_regex,httpService.baseUrl+'/$1')

            return config;
        }
    };
});
