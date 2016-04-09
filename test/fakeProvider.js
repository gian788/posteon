module.exports = function (simulateError, cb) {
  if (!cb) {
    cb = simulateError;
    simulateError = undefined;
  }
  return {
    name: 'fake',
    /*send: function (message, callback) {
      console.log('arguments', arguments.length)

      if (arguments.length === 3) {
        if (!cb) {
          callback(null, {status: 'success'});
        } else if (simulateError) {
          cb(new Error('Send Error'));
        } else {
          cb();
        }
      } else {
        if (cb) {
          if (simulateError) {
            cb(new Error('Send Error'));
          } else {
            cb();
          }
        }
      }
    }*/

    /*wrapped*/
    send: function (credential, options, callback) {
      if (!cb) {
        callback(null, {status: 'success'});
      } else if (simulateError) {
        cb(new Error('Send Error'));
      } else {
        cb();
      }
    }
  };
};
