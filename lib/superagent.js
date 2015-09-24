'user strict';

// 全局对象
var app = global._cfg_app;
var serviceDomain = app.get('appDomain') + '/mf';

// http client 及其配置
var authConfig = app.get('_cfg_auth');
var request = require('superagent');
var prefix = require('superagent-prefix')(serviceDomain);
var auth = require('superagent-auth')(authConfig);

var Q = require("q");

module.exports = {
    post: function (url, params) {
        var deferred = Q.defer();
        request
       .post(url)
       .send(params)
       .end(function (err, res) {
            if (!err) {
                deferred.resolve(err);
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    },
    get: function (url, params) {
        var deferred = Q.defer();
        request
       .get(url)
       .query(params)
       .end(function (err, res) {
            if (!err) {
                deferred.resolve(err);
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
};
