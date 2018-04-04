(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http','HttpService'];
    function UserService($http,HttpService) {

        var service = {};
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.setUserToken = setUserToken;
        service.getUserToken = getUserToken;

        function GetAll() {
            return $http.get(HttpService.baseUrl + 'getusernotecount').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(HttpService.baseUrl + 'users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(HttpService.baseUrl + 'users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post(HttpService.baseUrl + 'users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return Promise.resolve(res.data);
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

        function getUserToken() {
            return localStorage.getItem("token") || null;
        }

        function setUserToken(token) {
            localStorage.setItem("token",token);
            // localStorage.setItem(users);
        }

      return service;
    }

})();
