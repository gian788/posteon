module.exports = {
	dbs: {
		mongoDB: {
			uri: 'mongodb://localhost/mailer-dev',
			debug: true,
			options: {},
		},
	},
	lockTime: 60 * 1000,
};
