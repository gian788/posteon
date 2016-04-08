var QueueElement = require('./model');

module.exports = function (mailer) {
  return function (adapter) {
    return function (message, callback) {
      if (!callback) {
        callback = function noop () {};
      }
      QueueElement.update({_id: message._id}, {$set: {lockedUntil: new Date(Date.now() + mailer.options.lockTime)}, locketAt: new Date()}, function (err) {
        if(err) {
          return callback(err);
        }

        adapter.send(message.provider, message.options, function (err, response) {
          QueueElement.remove({_id: message._id}, function (err) {
            if (err) {
              console.error(err);
            }
            if (callback) {
              callback();
            }
          });

          if (err) {
            mailer.logger.sendError(message, response);
          } else {
            mailer.logger.sendSuccess(message, response);
          }
        });
      });
    };
  };
};
