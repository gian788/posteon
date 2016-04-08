var should = require('should');

var QueueElement = require('../model');
var send = require('../send');
var config = require('./config');
var fakeProvider = require('../../../test/fakeProvider');

describe('Send', function() {
	this.timeout(10000);
	it('send', function(done) {
		var fakeProviderInstance = fakeProvider();
    var message = {
			provider: {name: fakeProviderInstance.name},
			options: {html: 'Test'},
      createdAt: new Date(),
		};
		var count = 0;
		var doneCol = function (err) {
			if(err || ++count == 2) return done(err);
		};
		var mailer = {
			logger: {
				sendError: function (message, response) {
					doneCol(new Error(response));
				},
				sendSuccess: function (message, response) {
					doneCol();
				}
			},
			options: config
		};

		var queue = require('../index')(mailer);
		queue.init();
		var sender = send(mailer);
		var wrapped = sender(fakeProviderInstance);
    QueueElement.create(message, function (err, queueElement) {
      should.not.exist(err);

			wrapped(queueElement, function (err) {
				should.not.exist(err);
				QueueElement.findById(queueElement._id, function (err, el) {
					should.not.exist(err);
					should.not.exist(el);
					doneCol();
				});
			});
    });
	});
});
