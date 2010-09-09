require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var sys = require('sys'),
  http = require('http'),
  fs = require('fs'),
  Rdam = require('rdam').Rdam;

try {
  var configJSON = fs.readFileSync(__dirname + "/config/app.json");
} catch(e) {
  sys.log("File config/app.json not found. Try: `cp config/app.json.sample config/app.json`");
}
var config = JSON.parse(configJSON.toString());

var rdam = new Rdam();

rdam.init( function() {
  http.createServer( function(req, res) {
    try{
      rdam.serveRequest(req, res);
    } catch (e) {
      rdam.handleError(req, res, e);
    }
  }).listen(config.tracking_port);
  sys.puts('Tracking server running at http://*:' + config.tracking_port + '/tracking_pixel.gif');
});
