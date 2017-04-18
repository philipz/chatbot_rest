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

function redisSet(key, value) {
	client.set(key, value, redis.print);
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

server.get('/users', function (req, res, next) {
	var query = req.query;
	var result = req.params;
  console.log(result);
  res.send(users);
});

server.post('/users', function (req, res, next) {
	if (req.params.passwd === 'tradingbot') {
		console.log('OIValue:' + req.params.OIValue);
		redisSet('OI', req.params.OIValue);
		res.send('OK');
	} else {
		res.send('NG');
	}
});

server.get('/oi', function (req, res, next) {
  redisGet('OI', res);
});

server.listen(1337, function () {
	console.log('%s listening at %s', server.name, server.url);
});