'user strict';
var Q = require("q");
var _ = require('underscore');

//project config
var COM = require('./common');
var superagent = require("../../../lib/superagent.js");


module.exports = newTaskController;

//构造函数
function newTaskController(router) {

}
newTaskController.prototype = {
    //私有变量
    constructor: newTaskController,
    
    ceshi: function (req, res) {
        //基本数据
        var data = {};
        data = _.extend(data, req._PRFS);//公共头尾
        data = _.extend(data, COM.HTMLHEAD());//
        data = _.extend(data, req._EXT_DATA);
        
        superagent.get('http://product.suning.com/pds-web/ajax/itemInfo_928635487.html', { 1: 1 }).done(function () {
            console.log("OK");
            res.render('newTask/index', data);
        }, function () {
            res.send("error");
        });
    }
}
