'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LogSchema = new Schema({
  createdAt: Date,
  messageId: Schema.Types.ObjectId,
  appId: Schema.Types.ObjectId,
  status: Schema.Types.Mixed,
  data: Schema.Types.Mixed,
}, { });

/**
 * Virtuals
 */


/**
 * Validations
 */


/**
 * Pre-save hook
 */


/**
 * Methods
 */
LogSchema.methods = {

};

/**
 * Plugins
 */

module.exports = mongoose.model('Log', LogSchema);
