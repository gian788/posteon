var should = require('should');

var dispatcher = require('../dispatcher')();

describe('Dispatcher', function() {

	it('Register adapter', function(done) {
		dispatcher.registerAdapter('noop_adapter', {send: function () {}});
		done();
	});

  it('Emit event', function(done) {
		var message = {
			provider: {name: 'test', apiKey: 'TEST_APIKEY'},
			options: {html: 'Test'}
		};
		dispatcher.registerAdapter(
			message.provider.name,
			{
				send: function (message) {
					message.should.be.instanceof(Object);
					message.provider.apiKey.should.be.equal('TEST_APIKEY');
					message.should.be.instanceof(Object);
					message.options.html.should.be.equal('Test');
					done();
				}
			}
		);
		dispatcher.newMessage(message);
	});

});
