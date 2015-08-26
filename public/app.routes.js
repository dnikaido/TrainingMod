(function() {
    'use strict';

    angular
        .module('app')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/home');
    }

    function getStates() {
        return [
            {
                state: 'home',
                config: {
                    url: '/home',
                    templateUrl: 'assets/html/home/home.html'
                }
            }
        ];
    }
})();