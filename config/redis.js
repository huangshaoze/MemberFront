var redis = {
	'dev': {
		host: 'localhost', port: 6379
	},
	'sit': {
		host: '10.27.162.65', port: 6379
	},
	'pre': {
		host: '10.27.162.69', port: 6379
	},
	'prd': {
		host: '192.168.16.199', port: 6379
	}
};

module.exports = function (app) {
	if (typeof redis != 'undefined') {
		global._cfg_redis = redis;
		if (app) {
			app.set('_cfg_redis', redis);
		}
		return redis;
	}
};