var express = require('express');
var run = require('./lib/express');
var app = express();
var root = __dirname;
var env = process.env.NODE_ENV || 'dev';
app.set('_cfg_app_root', root);
app.set('env', env);
run(app);

