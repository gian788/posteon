'use strict';

var mongoose = require('mongoose');
var LogElement = require('./model');

/*!
 * Module dependencies.
 */

function Logger (mailer) {
  this.mailer = mailer;
}

/**
 * Init Logger
 *
 * # Example:
 *
 *   logger.init()
 *
 * @method init
 * @api public
 */

Logger.prototype.init = function() {
  if (mongoose.connections[0].readyState === 0) {
    var dbOptions = this.mailer.options.dbs.mongoDB;
    mongoose.connect(dbOptions.uri, dbOptions.options);
    mongoose.connection.on('error', function (err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });

    if (dbOptions.debug) {
      mongoose.set('debug', true);
    }
  }
};

/**
 * Log queued message
 *
 * # Example:
 *
 *   queue.set(message, callback)
 *
 *   queue.set(message)
 *
 * @param {Object} message
 * @param {Function} callback
 * @api public
 */

Logger.prototype.queued = function (message, callback) {
  if (!callback) {
    callback = function noop () {};
  }
  console.error(new Date(), message._id.toString(), 'message queued');
  LogElement.create({
    createdAt: new Date(),
    messageId: message._id,
    status: 'queued',
    data: {message: message}
  });
};

/**
 * Log error generated while sending a message
 *
 * # Example:
 *
 *   queue.set(message, response, callback)
 *
 *   queue.set(message, callback)
 *
 *   queue.set(message)
 *
 * @param {Object} message
 * @param {Object} response
 * @param {Function} callback
 * @api public
 */

Logger.prototype.sendError = function (message, response, callback) {
  if (!callback) {
    callback = function noop () {};
  }
  console.error(new Date(), message._id.toString(), 'sended failed', response);
  LogElement.create({
    createdAt: new Date(),
    messageId: message._id,
    status: 'error',
    data: {error: response, message: message},
  });
};

/**
 * Log successfully sended message
 *
 * # Example:
 *
 *   queue.set(message, response, callback)
 *
 *   queue.set(message, callback)
 *
 *   queue.set(message)
 *
 * @param {Object} message
 * @param {Object} response
 * @param {Function} callback
 * @api public
 */

Logger.prototype.sendSuccess = function (message, response, callback) {
  if (!callback) {
    callback = function noop () {};
  }
  console.log(new Date(), message._id.toString(), 'sended success');
  LogElement.create({
    createdAt: new Date(),
    messageId: message._id,
    status: 'send_success',
    data: {message: message
  });
};


module.exports = function (mailer) {
  return new Logger(mailer);
};
