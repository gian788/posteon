var events = require('events');

var eventsName = {
  newMessage: 'new_message',
};


module.exports = function (mailer, options) {
  if (!options) {
    options = {};
  }
  var eventEmitter = new events.EventEmitter();
  return {
    newMessage: function (message) {
      //console.log(eventsName.newMessage + '_' + message.provider.name, message);
      eventEmitter.emit(eventsName.newMessage + '_' + message.provider.name, message);
    },

    registerAdapter: function (providerName, adapter) {
      if (options.sendWrapper) {
        eventEmitter.on(eventsName.newMessage + '_' + providerName, options.sendWrapper(adapter));
      } else {
        eventEmitter.on(eventsName.newMessage + '_' + providerName, adapter.send);
      }
    },
  };
};
