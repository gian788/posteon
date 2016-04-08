var should = require('should');

var QueueElement = require('../model');
var send = require('../send');
var config = require('./config');

describe('Index', function() {
	this.timeout(10000);

  it('set', function (done) {
    var queue = require('../index')({});
    queue.set('test', true);
    queue.options.test.should.be.equal(true);
    done();
  });

  it('get', function (done) {
    var queue = require('../index')({});
    queue.options.test = true;
    var test = queue.get('test');
    test.should.be.equal(true);
    done();
  });

  it('add', function (done) {
    var mailer = {
			logger: {
				queued: function (message) {
					doneCol();
				},
			},
			options: config
		};
    var count = 0;
    var doneCol = function (err) {
      if(err || ++count == 3) return done(err);
    };
    var queue = require('../index')(mailer);
    queue.init();
    queue.dispatcher = {
      newMessage: function (message) {
        doneCol();
      }
    };
    var message = {
			provider: {name: 'test', apiKey: 'TEST_APIKEY'},
			options: {html: 'Test'},
      createdAt: new Date(),
		};
    queue.add(message, function (err, message) {
      should.not.exist(err);
      message.should.be.instanceof(Object);
      message.should.have.property('_id');
      message.should.have.property('createdAt');
      message.should.have.property('options');
      message.should.have.property('provider');

      QueueElement.findById(message._id, function (err, message) {
        should.not.exist(err);
        message.should.be.instanceof(Object);
        doneCol();
      });
    });
  });
});
