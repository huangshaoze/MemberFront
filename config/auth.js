// 注意此处必须使用小写key
var auth = {
	'x-authorization': 'vss-authorization-key'
};

module.exports = function (app) {
	if (typeof auth != 'undefined') {
		app.set('_cfg_auth', auth);
	}
};