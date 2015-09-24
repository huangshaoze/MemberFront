/*
 * 根据业务需要配置不同url或后缀名文件的缓存时间
 * var cacheSetting = {
 *      '.html': 'max-age=3600, s-maxage=3600',
 *      '.do': 'no-cache'
 * };
 * */

var cacheSetting = {
	'\.htm$': 'max-age=1800, s-maxage=1800'
};

module.exports = function (app) {
	if (typeof cacheSetting != 'undefined') {
		app.set('_cfg_cache_map', cacheSetting);
	}
};