var redis = require('redis');
var client = redis.createClient(6379, 'tradingbot.redis.cache.windows.net', {no_ready_check: true});
//client.auth('pm/THZHkMq0u1SfLfuVDNBhDT/v/J5Flu0EpsrLXos4=', function (err) {
//	    if (err) throw err;
//});

client.on("error", function (err) {
	    console.log("Error " + err);
});

client.on('connect', function() {
	    console.log('Connected to Redis');
});

client.set("foo", "bar", redis.print);
client.get("foo", function (err, reply) {
	    if (err) throw err;
	        console.log(reply.toString());
	client.quit();
});
