var should = require('should');

var posteon = require('../lib/index');
var config = require('./config');
var fakeProvider = require('./fakeProvider');


describe('Posteon test', function() {
	//@TODO: clean db

	it('Send test', function(done) {
		posteon.init(config);
		var fakeProviderInstance = fakeProvider();
		posteon.addProvider(fakeProviderInstance);

		posteon.send(
      {
        name: fakeProviderInstance.name,
      },
      {
        to: [{name: 'Gianluca', email: 'gianluca.pengo@gmail.com'}],
        from: {name: 'Posteon', email: 'posteon@test.com'},
        subject: 'Test send',
        html: '<h1>Test send header</h1><p>Test body</p>',
        //text: 'text',
				//attachments: 'attachments',
        //images: 'images',
				//tags: 'tags',
        //headers: 'headers',
        //metadata: 'metadata',
      },
      function(err, res){
				should.not.exist(err);
        res.should.be.instanceof(Object);
        res.should.have.property('status').equal('queued');
				done();
			});
	});
});
