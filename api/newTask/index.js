'use strict';
/*
 * 注册路由
 * basePage.passport.private:需要登录权限验证
 * basePage.passport.getway:无需登录权限验证
 * basePage.resourse:用于配置公共头尾
 * */
var router = require('express').Router();
var basePage = require(global._cfg_app_root + '/lib/basePage');
var newTaskController = require('./controller/ceshi');

module.exports = router;


var controller = new newTaskController(router);

router.route(['/:id']).get(function (req, res, next) {
    basePage.resourse(req, res, next, ["resources", "header", "footer", "logo"]);
}, controller.ceshi);


