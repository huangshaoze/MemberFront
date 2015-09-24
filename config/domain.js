var domain = {
	// 中台服务
	serviceDomain: {
		dev: 'http://vssdev.cnsuning.com:3001',
		sit: 'http://ssit.service.cnsuning.com',
		pre: 'http://spre.service.cnsuning.com',
		prd: 'http://s.service.cnsuning.com'
	},
	// 前台应用
	appDomain: {
		dev: 'http://vipdev.cnsuning.com:3000',
		sit: 'http://vipsit.cnsuning.com',
		pre: 'http://vippre.cnsuning.com',
		prd: 'http://vip.suning.com'
	},
	// 静态资源
	resDomain: {
        dev: 'http://vipdev.cnsuning.com:3000',
        sit: 'http://vipsit.cnsuning.com',
        pre: 'http://vippre.cnsuning.com',
        prd: 'http://vip.suning.com'
	},
	// 图片服务器
	imageDomain: {
		dev: 'http://sit1image.suning.cn',
		sit: 'http://sit1image.suning.cn',
		pre: 'http://preimage.suning.cn',
		prd: 'http://image.suning.cn'
	}
};


module.exports = function (app) {
	if (typeof domain != 'undefined') {
		app.set('_cfg_domain', domain);
	}
};