(function () {
    'use strict';

    angular
        .module('app')
        .factory('User', User);

    User.$inject = ['$http'];
    function User($http) {
        return function User(name) {
            var user = this;

            user.name = name;
            user.create = create;
            user.greet = greet;

            function create() {
                return $http.post('/users', user);
            }

            function greet() {
                return 'Hey ' + user.name + '!';
            }
        };
    }
})();