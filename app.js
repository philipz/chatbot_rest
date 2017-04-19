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

server.get('/', restify.serveStatic({
	'directory': __dirname,
	'charSet': 'utf-8',
	'default': 'index.html'
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
		console.log('real:' + req.params.real);
		redisSet('REAL', req.params.real, res);
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

server.get('/oi', function (req, res, next) {
  redisGet('OI', res);
});

server.get('/real', function (req, res, next) {
  redisGet('REAL', res);
});

server.listen(process.env.port || process.env.PORT || 1337, function () {
    console.log('%s listening to %s', server.name, server.url);
});