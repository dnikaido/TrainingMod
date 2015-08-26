(function() {
    'use strict';
    angular.module('app')
        .directive('welcome', function() {
            return {
                restrict: 'A',
                scope: {
                    user: '='
                },
                template: '<span>{{user.greet()}} Welcome to the app!</span>',
                link: function(scope, element) {
                    var original = element.css('color');
                    element.on('mouseenter', function () {
                        element.css('color', scope.user.favoriteColor);
                    });
                    element.on('mouseleave', function () {
                        element.css('color', original);
                    });
                }
            };
        });
})();