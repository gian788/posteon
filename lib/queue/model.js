'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QueueElementSchema = new Schema({
  provider: {
    name: String,
		apiKey: String,
		clientId: String,
		clientSecret: String,
  },
  createdAt: Date,
	lockedAt: Date,
	lockedUntil: Date,
  appId: Schema.Types.ObjectId,
  options: Schema.Types.Mixed,
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
QueueElementSchema.methods = {

};

/**
 * Plugins
 */

module.exports = mongoose.model('QueueElement', QueueElementSchema);
