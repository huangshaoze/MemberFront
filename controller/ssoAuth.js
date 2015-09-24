/**
 * Created by 15050971 on 2015/7/6.
 * auth:zhujinxiong
 */

var http = require('http');
var parse = require('xml2js').Parser({
    async :false,
    trim:true,
    tagNameProcessors :[function(name){
        return name.replace("cas:","");
    }]
});

var redisStorge = require('ids-client').redisStore;

exports.auth = function (req, res) {
    console.log("授权正在处理");
    //验证通过 通过ticket获取用户信息  http://sso.cnsuning.com/ids/serviceValidate?ticket=xxxxxxxx
    var ticket = req.query.ticket;
    var hostUrl = req.protocol+ "://"+req.headers.host + "/auth";
    var encodeService = encodeURIComponent(hostUrl);
    var serviceValUrl = 'http://sso.cnsuning.com/ids/serviceValidate?ticket=' + ticket + '&service=' +encodeService;
    http.get(serviceValUrl, function(result) {
        result.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            parse.parseString(chunk, function (err, user) {
                var successData = user.serviceResponse.authenticationSuccess[0];
                var userId = successData.user[0];
                var sessionIdentifier = successData.sessionIdentifier[0];
                console.log(userId+":"+sessionIdentifier);

                //写入cookie 写入redis
                redisStorge.saveAuthInfo(userId,sessionIdentifier);
                //跳转targeturl

            });
        });
    }).on('error', function(e) {
        console.log("错误：" + e.message);
    });
    res.send('auth 正在处理');
};

