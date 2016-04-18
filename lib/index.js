'use strict';

/*!
 * Module dependencies.
 */
var _ = require('lodash');
var queue = require('./queue');
var logger = require('./logger');
var render = require('./render');

function Posteon () {
  this.options = {};
  this.providers = {};
  this.queue = queue(this);
  this.logger = logger(this);
  this.render = render(this);
}

/**
 * Sets mailer options
 *
 * # Example:
 *
 *   posteon.set('debug', true)
 *
 * @param {String} key
 * @param {String|Function} value
 * @api public
 */

Posteon.prototype.set = function(key, value) {
  if (arguments.length == 1) {
    return this.options[key];
  }

  this.options[key] = value;
  return this;
};

/**
 * Gets posteon options
 *
 * # Example:
 *
 *   posteon.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @api public
 */

Posteon.prototype.get = Posteon.prototype.set;

/**
 * Add email provider
 *
 * # Example:
 *
 *   posteon.addProvider('sendgrid', require('posteon-adpter-sendgrid'))
 *
 * @param {String} providerName
 * @param {Function} adapter
 * @api public
 */

Posteon.prototype.addProvider = function(adapter) {
  this.queue.registerAdapter(adapter.name, adapter);
  this.providers[adapter.name] = adapter;
};

/**
 * Init Posteon
 *
 * # Example:
 *
 *   posteon.init()
 *
 *   posteon.init({..})
 *
 * @param {Object} options
 * @method init
 * @api public
 */

Posteon.prototype.init = function(options) {
  this.options = _.merge(options, this.options);
  this.queue.init();
  this.logger.init();

  //resume work queue
  this.queue.resumeWork();
};

/**
 * Send a message
 *
 * # Example:
 *
 *   posteon.send({name: 'sendgrid', apiKey: 'YOUR_APYKEY'}, {to: {name: 'John', email: 'john@dra.it'}, from: {name: 'Postie Pigeon', email: 'postie.pigeon@dra.it'}, html: 'Hello John!'});
 *
 * @param {Object} provider
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

Posteon.prototype.send = function (provider, options, callback) {
  var self = this;
  //check options and create message object
  if (!self.providers[provider.name]) {
    return callback(new Error('Bad provider'));
  }

  var error = checkOptions(options);
  if (error) {
    return callback(new Error(error));
  }

  var message = {
    provider: provider,
    createdAt: new Date(),
    options: options
  };

  if (options.appId) {
    message.appId = options.appId;
    delete options.appId;
  }

  if (!Array.isArray(message.options.to)) {
    message.options.to = [message.options.to];
  }

  //add to queue
  self.queue.add(message, function (err, message) {
    if (err) {
      return callback(err);
    }
    callback(null, {
      messageId: message._id,
      status: 'queued',
      createdAt: message.createdAt,
      html: message.options.html
    });
  });
};

var checkOptions = function (options) {
  return;
};


module.exports = new Posteon();
