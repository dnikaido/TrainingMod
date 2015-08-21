(function() {
    'use strict';

    angular.module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$log', '$scope', 'User'];
    function UserController($log, $scope, User) {
        var vm = this;

        vm.user = $scope.user = new User('Joe');
    }
})();