describe('UserController', function () {

    var User, controller, scope;
    beforeEach(module('app'));
    beforeEach(inject(function ($injector, $controller, $rootScope) {
        User = $injector.get('User');
        scope = $rootScope.$new();
        controller = $controller('UserController', {
            $scope: scope
        });
    }));

    it('assigns a person to the controller', function () {
        expect(controller.user).to.be.an.instanceOf(User);
    });

    it('assigns a person to the scope', function () {
        expect(scope.user).to.be.an.instanceOf(User);
    });

});