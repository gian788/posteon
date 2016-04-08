var should = require('should');

var mailer = require('../lib/index');
var config = require('./config');
var fakeProvider = require('./fakeProvider');

describe('Mailer test', function() {
	//this.timeout(1000);

	it('Send test (Mandrill)', function(done) {
		mailer.init(config);
		var fakeProviderInstance = fakeProvider();
		mailer.addProvider(fakeProviderInstance);

		mailer.send(
      {
        name: fakeProviderInstance.name,
      },
      {
        to: [{name: 'Gianluca', email: 'gianluca.pengo@gmail.com'}],
        from: {name: 'Kademy', email: 'noreply@kademy.it'},
        subject: 'Test send (Mandrill)',
        html: '<h1>Test send (Mandrill)</h1><p>Test body</p>',
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
