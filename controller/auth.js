var id = 'passport';
var url = require('url');
var idsClient = require('ids-client');
// auth
exports.index = function (req, res) {
	var client = idsClient(),
		ticket = req.query.ticket,
		targetUrl = req.query.targetUrl,
		hostname = targetUrl ? url.parse(targetUrl).hostname : false,
		isSafeTarget = false;
	if (/\.(cn?)suning\.com$/i.test(hostname) || 'localhost' == hostname || /^\d{1,3}\.^\d{1,3}\.^\d{1,3}\.^\d{1,3}$/.test(hostname)) {
		isSafeTarget = true;
	}
	if (!ticket) {
		console.error('TICKET_EMPTY');
		res.redirect('http://www.suning.com');
	} else {
		client.set({id: id}).validateTicket(req, res, ticket, function (err, user) {
			var authIdKey = client.config.authIdKey;
			if (err) {
				if (isSafeTarget) {
					res.redirect(targetUrl);
				} else {
					res.end(err.message);
				}
				res.end(err.message);
			} else if (isSafeTarget) {
				req._idsStore = {
					user: user,
					targetUrl: targetUrl
				};
				client.writeAuthInfo(req, res);
			}
		});
	}
};