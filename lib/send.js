var adapters = {
  mandrill: require('../adapters/mandrill'),
  sendgrid: require('../adapters/sendgrid'),
};

exports.send = function (options, callback) {
  if(!adapters[options.provider.name]) return callback(new Error('Bad provider'));

  adapters[options.provider.name](options, callback);
};
