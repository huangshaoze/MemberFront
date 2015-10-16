var os = require('os');
var exec = require('child_process').exec;
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: 'info',
            filename: 'logs/info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error',
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});
/*
 * 扩展 console 对象，使其具备时间、文件行数定位等功能。
 * */
"use strict";
module.exports = function (console, options) {
    
    // 关闭所有控制台输出
    if (options == false) {
        ['log', 'info', 'warn', 'error', 'dir', 'assert'].forEach(function (f) {
            console[f] = function () {
            };
            //logger.log(f, 'message %s', 123);
        });
        return false;
    }
    
    var util = require('util');
    var _ = require('underscore');
    var _con = _.clone(console);
    var _message = function (message) {
        var err = new Error;
        Error.captureStackTrace(err);
        stack = err.stack.toString();
        var stackArr = stack.split('\n');
        for (var i = 0; i < stackArr.length; i++) {
            if (/Console/.test(stackArr[i])) {
                i++;
                if (/\(.*\)/.test(stackArr[i])) {
                    file = stackArr[i].match(/\((.*)\)/);
                } else {
                    file = stackArr[i].match(/at\s(.*)/);
                }
                file = file && file[1] ? file[1].replace(/\(|\)/g, '') : file;
                break;
            }
        }
        var _msg = ('[-LOG-] at ' + new Date().toString());
        file ? _msg += (file) : null;
        _msg += (message);
        _msg += ('[-EOF-]');
        return _msg;
    }
    
    if (options && options.debug) console.log = console.debug = function () {
        var message = util.format.apply(this, arguments);
        _con.log(_message(message));
    };
    
    console.error = function () {
        var message = util.format.apply(this, arguments);
        logger.log("error", _message(message), {
            node: {
                vesion: process.version,
                memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
                uptime: process.uptime()
            },
            system: {
                loadavg: os.loadavg(),
                freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'M'
            },
            evn: process.env.NODE_ENV,
            hostname: os.hostname(),
            pid: process.pid
        });
    }
};


