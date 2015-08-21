describe('welcome Directive', function() {
    var element, scope;

    beforeEach(module('app'));
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        element = $compile('<welcome user="user"></welcome>')(scope);
        scope.user = {
            greet: function() {
                return 'Hello!';
            },
            favoriteColor: 'blue'
        };
    }));

    it('welcomes the person', function() {
        scope.$digest();
        expect(element.find('span').text()).to.equal('Hello! Welcome to the app!');
    });

    it('displays the person\'s favorite color on hover', function() {
        scope.$digest();
        element.triggerHandler('mouseenter');
        expect(element.css('color')).to.equal('blue');
        element.triggerHandler('mouseleave');
        expect(element.css('color')).to.be.empty;
    });
});