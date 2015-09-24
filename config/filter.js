/*
 * var filter = {
 *      '.do': function(req, res, next){
 *           // do something
 *           next();
 *       }
 * };
 * */

var filterSetting = {
    '.*': function (req, res, next) {
		var device = require('device')(req);
		req._EXT_DATA = req._EXT_DATA || {};
		req._EXT_DATA.device = device;
        if (req._EXT_DATA.device.device == "mobile") { 
            req._EXT_DATA._AUTH_QUERYSTRING = "&loginTheme=wap_new";
        }
		// passport
		var Client = require('ids-client'), _EXT_DATA = req._EXT_DATA || false;
		if (_EXT_DATA && (_EXT_DATA.hasOwnProperty('passport') || _EXT_DATA.hasOwnProperty('sso'))) {
			var client = Client();
			client.auth(req, res, next);
		} else {
			next();
		}
	}
};

module.exports = function (app) {
	if (typeof filterSetting != 'undefined') {
		app.set('_cfg_filter_map', filterSetting);
	}
};