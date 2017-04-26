var os = require('os');
var restify = require('restify');
var redis = require('redis');
var client = redis.createClient(6379, 'tradingbot.redis.cache.windows.net', { no_ready_check: true });
client.auth('pm/THZHkMq0u1SfLfuVDNBhDT/v/J5Flu0EpsrLXos4=', function (err) {
	if (err) throw err;
});

client.on("error", function (err) {
	console.log("Error " + err);
});

client.on('connect', function () {
	console.log('Connected to Redis');
});

function redisSet(key, value, res) {
	client.set(key, value, function (err, reply) {
		if (err) {
			throw err;
			res.send('ER');
		} else {
			console.log(reply.toString());
			res.send('OK');
		}
	});
}

function redisGet(key, res) {
	client.get(key, function (err, reply) {
		if (err) throw err;
		console.log(reply.toString());
		res.send(reply.toString());
	});
}

function respond(req, res, next) {
	res.send('hello ' + req.params.name);
	console.log(req.params);
	return next();
}

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    multipartHandler: function(part) {
        part.on('data', function(data) {
          /* do something with the multipart data */
        });
    },
    multipartFileHandler: function(part) {
        part.on('data', function(data) {
          /* do something with the multipart file data */
        });
    },
    keepExtensions: false,
    uploadDir: os.tmpdir(),
    multiples: true,
    hash: 'sha1'
 }));

server.pre(restify.pre.sanitizePath());

server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));

server.get('/', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'index.html'
}));

server.get('/options1.html', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'options1.html'
}));

server.get('/options2.html', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'options2.html'
}));

server.get('/disclaimer.html', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'disclaimer.html'
}));

server.get('/policy.html', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'policy.html'
}));

server.post('/real', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('real:' + req.params.REAL);
		redisSet('REAL', req.params.REAL, res);
	} else {
		res.send('NG');
	}
});

server.post('/options', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('options:' + req.params.OPTIONS);
		redisSet('OPTIONS', req.params.OPTIONS, res);
	} else {
		res.send('NG');
	}
});

server.post('/oi', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('OI:' + req.params.OI);
		redisSet('OI', req.params.OI, res);
	} else {
		res.send('NG');
	}
});

server.post('/symbol', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('SYMBOL:' + req.params.SYMBOL);
		redisSet('SYMBOL', req.params.SYMBOL, res);
	} else {
		res.send('NG');
	}
});

server.post('/symbolw', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('SYMBOLW:' + req.params.SYMBOLW);
		redisSet('SYMBOLW', req.params.SYMBOLW, res);
	} else {
		res.send('NG');
	}
});

server.get('/oi', function (req, res, next) {
  redisGet('OI', res);
});

server.get('/real', function (req, res, next) {
  redisGet('REAL', res);
});

server.get('/symbol', function (req, res, next) {
  redisGet('SYMBOL', res);
});

server.get('/symbolw', function (req, res, next) {
  redisGet('SYMBOLW', res);
});

server.get('/options', function (req, res, next) {
  redisGet('OPTIONS', res);
});

server.listen(process.env.port || process.env.PORT || 1337, function () {
    console.log('%s listening to %s', server.name, server.url);
});