'use strict';
var mongoose = require('mongoose');
var QueueElement = require('./model');
var dispatcher = require('./dispatcher');

/*!
 * Module dependencies.
 */

function Queue (mailer) {
  this.mailer = mailer;
  this.options = {};
  this.dispatcher = dispatcher(mailer, { sendWrapper: require('./send')(mailer) } );
}

/**
 * Sets queue options
 *
 * # Example:
 *
 *   queue.set('debug', true)
 *
 * @param {String} key
 * @param {String|Function} value
 * @api public
 */

Queue.prototype.set = function(key, value) {
  if (arguments.length == 1) {
    return this.options[key];
  }

  this.options[key] = value;
  return this;
};

/**
 * Gets queue options
 *
 * # Example:
 *
 *   queue.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @api public
 */

Queue.prototype.get = Queue.prototype.set;

/**
 * Init Queue
 *
 * # Example:
 *
 *   queue.init()
 *
 * @method init
 * @api public
 */

Queue.prototype.init = function(options) {
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
 * Register an email provider adapter to the queue
 *
 * # Example:
 *
 *   queue.registerAdapter('test', require('posteon-adpter-sendgrid'))
 *
 * @param {String} providerName
 * @param {Function} adapter
 * @api public
 */

Queue.prototype.registerAdapter = function(providerName, adapter) {
  this.dispatcher.registerAdapter(providerName, adapter);
};

/**
 * Queue message
 *
 * # Example:
 *
 *   queue.addMessage(message, callback)
 *
 * @param {Object} message
 * @param {Function} adapter
 * @method add
 * @api public
 */

Queue.prototype.add = function (data, callback) {
  var self = this;
  QueueElement.create(data, function (err, message) {
    callback(err, message);
    if (err) {
      return;
    }
    //log
    self.mailer.logger.queued(message);

    self.dispatcher.newMessage(message);
  });
};

/**
 * Get queued messages
 *
 * # Example:
 *
 *   queue.getQueue(providerName, limit, callback)
 *
 *   queue.getQueue(providerName, callback)
 *
 *   queue.getQueue(limit, callback)
 *
 *   queue.getQueue(callback)
 *
 * @param {String} providerName
 * @param {String} limit
 * @param {Function} callback
 * @api public
 */

Queue.prototype.getQueue = function (providerName, limit, callback) {
  if (!callback) {
    if (!limit) {
      callback = providerName;
      providerName = undefined;
    } else {
        callback = limit;
    }
    limit = undefined;
  }
  var query = {$or: [{lockedUntil: {$exists: false}}, {lockedUntil: {$lt: new Date()}}]};
  if (providerName) {
    query['provider.name'] = providerName;
  }
  query = QueueElement.find(query).sort({createdAt: 1});
  if (limit) {
    query.limit(limit);
  }
  query.exec(function (err, queueElements) {
    if (err) {
      return callback(err);
    }
    callback(null, queueElements);
  });
};

/**
 * Get the first message in the queue
 *
 * # Example:
 *
 *   queue.getQueue(providerName, callback)
 *
 * @param {String} providerName
 * @param {Function} callback
 * @api public
 */

Queue.prototype.getNext = function (providerName, callback) {
  this.getQueue(providerName, 1, function (err, queueElements){
    callback(null, queueElements[0]);
  });
};

/**
 * Get all messages in the queue
 *
 * # Example:
 *
 *   queue.getAll(providerName, callback)
 *
 *   queue.getAll(callback)
 *
 * @param {String} providerName
 * @param {Function} callback
 * @api public
 */

Queue.prototype.getAll = function (providerName, callback) {
  if (callback) {
    this.getQueue(providerName, callback);
  } else {
    callback = providerName;
    this.getQueue(callback);
  }
};

/**
 * Count the messages in the queue
 *
 * # Example:
 *
 *   queue.queueLength(providerName, callback)
 *
 *   queue.queueLength(callback)
 *
 * @param {String} providerName
 * @param {Function} callback
 * @api public
 */

Queue.prototype.queueLength = function (providerName, callback) {
  var query = {};
  if (!providerName) {
    callback = providerName;
  } else {
    query['provider.name'] = providerName;
  }
  QueueElement.count(query, callback);
};

/**
 * Resum work queue (usually at startup)
 *
 * # Example:
 *
 *   queue.resumeWork()
 *
 * @api public
 */

Queue.prototype.resumeWork = function () {
  var self = this;
  self.getAll(function (err, queueElements) {
      if (err) {
        return callback(err);
      }
      for (var i = 0; i < queueElements.length; i++) {
        self.dispatcher.newMessage(queueElements[i]);
      }
  });
};


Queue.prototype.Model = require('./model');

module.exports = function (mailer) {
  return new Queue(mailer);
};
