/*
 * 项目路由配置
 * */

'user strict';

module.exports = function (app) {
    //单点登录
    app.use('/auth', require('./controller/auth').index);
    /*
     * 注册新手项目
     * url为http://vip.suning.com/newTask/
     * */
    app.use('/newTask', require('./api/newTask'));
}