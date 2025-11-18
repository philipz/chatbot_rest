var os = require('os');
var restify = require('restify');
var redis = require('redis');

// Redis v4 configuration
var client = redis.createClient({
	socket: {
		host: 'tradingbot.redis.cache.windows.net',
		port: 6379
	},
	password: 'PASSWORD'
});

client.on('error', function (err) {
	console.log('Error ' + err);
});

client.on('connect', function () {
	console.log('Connected to Redis');
});

// Connect to Redis
client.connect().catch(function(err) {
	console.error('Failed to connect to Redis:', err);
});

function redisSet(key, value, res) {
	client.set(key, value)
		.then(function(reply) {
			console.log(reply);
			res.send('OK');
		})
		.catch(function(err) {
			console.error('Redis SET error:', err);
			res.send('ER');
		});
}

function redisGet(key, res) {
	client.get(key)
		.then(function(reply) {
			console.log(reply);
			res.send(reply || '');
		})
		.catch(function(err) {
			console.error('Redis GET error:', err);
			res.send('');
		});
}

function respond(req, res, next) {
	res.send('hello ' + req.params.name);
	console.log(req.params);
	return next();
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    keepExtensions: false,
    uploadDir: os.tmpdir(),
    multiples: true,
    hash: 'sha1'
 }));

server.pre(restify.plugins.pre.sanitizePath());

server.get(/^\/(public)\/(.*)/, restify.plugins.serveStatic({
    'directory': __dirname
}));

server.get('/', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'index.html'
}));

server.get('/index.html', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'index.html'
}));

server.get('/options1.html', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'options1.html'
}));

server.get('/options2.html', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'options2.html'
}));

server.get('/options6.html', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'options6.html'
}));

server.get('/disclaimer.html', restify.plugins.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'disclaimer.html'
}));

server.get('/policy.html', restify.plugins.serveStatic({
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
