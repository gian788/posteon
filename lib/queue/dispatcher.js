var events = require('events');
var _ = require('lodash');

var eventsName = {
  newMessage: 'new_message',
};


function Dispatcher (mailer, options) {
  this.mailer = mailer;
  this.options = {};
  this.eventEmitter = new events.EventEmitter();

  if (options) {
    this.init(options);
  }
}

/**
 * Sets dispatcher options
 *
 * # Example:
 *
 *   dispatcher.set('debug', true)
 *
 * @param {String} key
 * @param {String|Function} value
 * @api public
 */

Dispatcher.prototype.set = function(key, value) {
  if (arguments.length == 1) {
    return this.options[key];
  }

  this.options[key] = value;
  return this;
};

/**
 * Gets dispatcher options
 *
 * # Example:
 *
 *   dispatcher.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @api public
 */

Dispatcher.prototype.get = Dispatcher.prototype.set;

/**
 * Init Dispatcher
 *
 * # Example:
 *
 *   dispatcher.init()
 *
 *   dispatcher.init({..})
 *
 * @param {Object} options
 * @method init
 * @api public
 */

Dispatcher.prototype.init = function (options) {
  this.options = _.merge(options, this.options);
};

/**
 * Rigister an adapter
 *
 * # Example:
 *
 *   dispatcher.registerAdapter('test', adapter)
 *
 * @param {String} providerName
 * @param {Object} adapter
 * @api public
 */

Dispatcher.prototype.registerAdapter = function (providerName, adapter) {
  if (this.options.sendWrapper) {
    this.eventEmitter.on(eventsName.newMessage + '_' + providerName, this.options.sendWrapper(adapter));
  } else {
    this.eventEmitter.on(eventsName.newMessage + '_' + providerName, adapter.send);
  }
  if (this.options.debug) {
    console.log(new Date() + ' - Registered ' + providerName + 'adapter' + (this.mailer.options.sendWrapper ? 'with wrapper' : ''));
  }
};

/**
 * Trigger new message event to right adapter
 *
 * # Example:
 *
 *   dispatcher.newMessage(message)
 *
 * @param {Object} message
 * @api public
 */

Dispatcher.prototype.newMessage = function (message) {
  if (this.options.debug) {
    console.log(eventsName.newMessage + '_' + message.provider.name, message);
  }
  this.eventEmitter.emit(eventsName.newMessage + '_' + message.provider.name, message);
};


module.exports = function (mailer, options) {
  return new Dispatcher(mailer, options);
};
