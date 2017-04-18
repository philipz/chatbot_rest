var restify = require('restify');

var server = restify.createServer();
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));
server.listen(1337, function() {
  console.log('%s listening at %s', server.name, server.url);
});
