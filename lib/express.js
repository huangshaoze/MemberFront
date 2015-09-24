/*
 * 该模块自动执行 config 目录下所有可用的配置文件模块
 * */
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var timeout = require('connect-timeout');
var path = require('path');
var url = require('url');
var fs = require('fs');
var domain = require('domain');
var _ = require('underscore');
var moment = require('moment-timezone');
// 判断是否为json
var isJson = function (obj) {
    return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};
// 判断是否为array
var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};


module.exports = initExpress;

function initExpress(app) {
    /*
	 * 使用 domain 捕获所有异常
	 * */
	app.use(function (req, res, next) {
        var d = domain.create();
        d.on('error', function (err) {
            console.error(err);
            res.status(500);
            res.render('50x', { message: err.message.toString() }, function (err, html) {
                res.end(html);
            });
			//d.dispose();
        });
        d.add(req);
        d.add(res);
        d.run(next);
    });
    
    global._cfg_app = app;
    /*
	 * 读取环境参数
	 * */
	var env = app.get('env');
    
    /*
	 * 读取应用根目录
	 * */
	var root = app.get('_cfg_app_root');
    global._cfg_app_root = root;
    
    /*
	 * 自动载入config目录下所有配置文件
	 * 该文件必须是一个js模块
	 * */
	var configDir = path.join(root, 'config');
    var files = fs.readdirSync(configDir);
    files.forEach(function (file) {
        var filePath = path.join(configDir, file);
        if (fs.statSync(filePath).isFile() && /.*\.js$/i.test(file)) {
            require(filePath)(app);
        }
    });
    
    /*
     *创建log文件夹 
     **/
   var logsrc = app.get('log');
    if (logsrc) {
        if (!fs.existsSync(logsrc)) {
            fs.mkdirSync(logsrc);
        } else {
            console.log("路径存在");
        }
    }
    
    /*
	 * console 是否输出调试信息
	 * */
	var consoleDebug = app.get('console');
    if (consoleDebug) {
        require('./console')(console, consoleDebug);
    }
    
    /*
	 * 静态资源目录
	 * */
    app.use('/static', express.static(path.join(root, 'static')));
    
    var apiDir = path.join(root, 'api');
    
    var list = require('./scanFolder')(apiDir);
    _.each(list.folders, function (file, index) {
        //匹配static
        if (/\\static$/g.test(file)) {
            var arr = file.split('\\');
            app.use('/' + arr[arr.length - 2], express.static(file));
        }
    });
    
    /*
	 * 信任代理
	 * */
	app.set('trust proxy', true);
    
    // cookie
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());
    
    /*
	 * 解析 post 参数
	 * json / application/x-www-form-urlencoded
	 * */
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    /*
	 * 接收文件上传
	 * */
	app.use(multer({
        dest: path.join(root, 'temp')
    }));
    
    
    
    /*
	 * response time
	 * */
	var responseTime = app.get('x-response-time');
    if (responseTime) {
        app.use(require('response-time')());
    }
    
    /*
	 * 超时设置
	 * */
	var timeoutTime = app.get('timeoutTime');
    app.use(timeout(timeoutTime, { "respond": true }));
    
    // session
    var options = {
        name: '.SID',
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 20 * 60 * 1000 // 20分钟
        }
    };
    var redis = app.get('_cfg_redis');
    var session = require('express-session');
    var Redis = require('ioredis');
    if (redis && redis[env]) {
        var client = Redis.createClient(redis[env]);
        session.client = client;
        app.set('_cfg_redis_client', client);
    }
    app.use(session(options));
    
    /*
	 * 载入 package.json，并保存至 app
	 * */
	var pkg = require(path.join(root, 'package.json'));
    app.set('_cfg_pkg', pkg);
    
    /*
	 * 设置 x-powered-by
	 * */
	app.use(function (req, res, next) {
        res.setHeader('X-Powered-By', pkg.name + '/' + pkg.version);
        next();
    });
    
    /*
	 * 开启GZip
	 * */
	var compression = require('compression');
    var shouldCompress = function (req, res) {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    };
    app.use(compression({ filter: shouldCompress }));
    
    /*
	 * 设置模板中使用的域名
	 * 此处实际上是从 _cfg_domain 中读取的配置文件逐条注册
	 * */
	var domain_map = app.get('_cfg_domain');
    if (domain_map) {
        for (var key in domain_map) {
            app.set(key, domain_map[key][env] || '');
        }
    }
    
    /*
	 * 设置模板中使用的时间戳
	 * */
	var ts = moment().tz(app.get('timezone') || 'Asia/Shanghai').format("YYYYMMDD");
    app.set('version', ts);
    
    /*
	 * 设置缓存
	 * 此处实际上是从 _cfg_cache_map 中读取的配置文件逐条注册
	 * */
	var cache_map = app.get('_cfg_cache_map');
    if (cache_map) {
        for (var key in cache_map) {
            (function (key) {
                app.use(function (req, res, next) {
                    var url = req.url;
                    try {
                        var patt = new RegExp(key);
                        if (patt.test(url)) {
                            res.setHeader('Cache-Control', cache_map[key].toString());
                        }
                    } catch (e) {
                    } finally {
                        next();
                    }
                });
            })(key);
        }
    }
    
    /*
	 * 设置数据库连接信息
	 * 此处实际上是从 _cfg_db 中读取的配置文件逐条注册
	 * */
	var db = app.get('_cfg_db');
    if (db) {
        app.set('dbConfig', db[env] || {});
    }
    
    /*
     *添加监控 
     **/
    app.use(function (req, res, next) {
        var exec_start_at = Date.now();
        var _send = res.send;
        res.send = function () {
            res.set('X-Execution-Time', String(Date.now() - exec_start_at));
            return _send.apply(res, arguments);
        };
        next();
    });
    
    /*
     *注册路由 
     **/
    require('./../routes')(app);
    
    /*
	 * 模板引擎
	 * */
	var template = require('art-template');
    template.config('base', '');
    template.config('extname', '.html');
    app.engine('.html', template.__express);
    app.set('view engine', 'html');
    if (fs.existsSync(root + '/lib/template-helper.js')) {
        require(root + '/lib/template-helper');
    }
    
    /*
	 * 启动应用
	 * */
	var port = app.get('port');
    if (!port) {
        console.error('Error: app must listen on a port');
        return false;
    } else {
        app.listen(port, function () {
            console.info('Info: app listening on port ' + port);
        });
    }
    
    /*
	 * 404 500
	 * */
	app.use(function (req, res, next) {
        res.status(404);
        res.render('40x', function (err, html) {
            res.end(html);
        });
    });
    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(500);
        res.render('50x', { message: err.message.toString() }, function (err, html) {
            res.end(html);
        });
        return false;
    });
}