module.exports = {
	dbs: {
		mongoDB: {
			uri: 'mongodb://localhost/mailer-dev',
			debug: false,
			options: {},
		},
	},
	lockTime: 60 * 1000,
};
