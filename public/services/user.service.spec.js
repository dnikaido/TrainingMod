describe('User', function () {

    var User, $httpBackend;

    beforeEach(module('app'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        User = $injector.get('User');
        $httpBackend.whenGET(/\.html$/).respond('');
    }));

    describe('Constructor', function () {

        it('assigns a name', function () {
            expect(new User('Ben')).to.have.property('name', 'Ben');
        });

    });

    describe('#greet', function () {

        it('greets others visitors informally', function () {
            expect(new User('Ben').greet()).to.equal('Hey Ben!');
        });

    });

    describe('#create', function() {
        it('creates the user on the server', function() {
            $httpBackend.expectPOST('/users', {
                    name: 'Joe'
                })
                .respond(200);
            var succeeded;
            new User('Joe').create()
                .then(function() {
                    succeeded = true;
                });
            $httpBackend.flush();
            expect(succeeded).to.be.true;
        })
    })
});

