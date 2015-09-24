/*
 * 此模块为系统基本配置
 * 更多详细配置见 ../lib/auto-config.js
 * */
module.exports = function (app) {

	// port
	app.set('port', 3000);

	// timezone
	app.set('timezone', 'Asia/Shanghai');

	// timeout
	app.set('timeoutTime', '100s');

	// setMaxListeners
	app.setMaxListeners(100);

	// response time
	app.set('x-response-time', true);

	/*
	 * console debug
	 * app.set('console', false);  关闭所有控制台输出
	 * app.set('console', true);  原始的控制台输出
	 * app.set('console', {debug: true});  console.log 会附加输出文件行数等信息，便于定位
	 * */
	app.set('console', { debug: true });
    
    //日志输出路径
    app.set('log', false);

};