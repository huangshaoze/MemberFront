var url = require('url');
var path = require('path');
var _ = require('underscore');
var prfs = require('prfs');
var EventProxy = require('eventproxy');
var ep = EventProxy();

var isJson = function (obj) {
    return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};

var basePage = {
    passport: {
        _init: function (req, res, next) {
            
            var urlObj = url.parse(req.url);
            try {
                var tempfilterKey = '^.*$';
                var patt = new RegExp(tempfilterKey);
                if (patt.test(urlObj.pathname)) {
                    (function (req, res, next) {
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
                    })(req, res, next);
                }
                else { next(); }
            } 
	catch (e) { next(); }
        },
        private: function (req, res, next) {
            req._EXT_DATA = { "passport": "private" };
            basePage.passport._init(req, res, next);
        },
        getway: function (req, res, next) {
            req._EXT_DATA = { "passport": "gateway" };
            basePage.passport._init(req, res, next);
        }
    },
    resourse: function (req, res, next, resource) {
        prfs(resource, function (err, dom) {
            if (err) throw err;
            ep.emit("prfsDom", { prfs: dom });
        });
        ep.all("prfsDom", function (prfsDom) {
            req._PRFS = prfsDom;
            next();
        });
    }
}
module.exports = basePage;
