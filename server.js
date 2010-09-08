require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var sys = require('sys'),
  http = require('http'),
  fs = require('fs'),
  redisClient = require('deps/redis-node-client/lib/redis-client').createClient(),
  Rdam = require('rdam').Rdam;

try {
  var configJSON = fs.readFileSync(__dirname + "/config/app.json");
} catch(e) {
  sys.log("File config/app.json not found. Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON.toString());
