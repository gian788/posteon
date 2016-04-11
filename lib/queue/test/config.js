module.exports = {
	dbs: {
		mongoDB: {
			uri: 'mongodb://localhost/mailer-dev',
			debug: false,
			options: {},
		},
	},
	queue: {
		lockTime: 60 * 1000,
	}
};
