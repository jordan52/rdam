/*
 based on hummingbird
 have a look at wheres-waldo
 this is how you deal with cookies:
http://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
 and this http://hublog.hubmed.org/archives/001927.html
*/

var sys = require('sys'),
  fs = require('fs'),
  querystring = require('querystring'),
  url = require('url'),
  redisClient = require('deps/redis-node-client/lib/redis-client').createClient();

try {
  var configJSON = fs.readFileSync(__dirname + "/../config/app.json");
} catch(e) {
  sys.log("File config/app.json not found. Try: `cp config/app.json.sample config/app.json`");
}

var Rdam = function(db, callback) {

  this.metrics = [];
};


Rdam.prototype = {
  init: function(callback) {
      callback();
  },


  serveRequest: function(req, res){

    var urlObj = url.parse(req.url, true);

    var timestamp = new Date();

    var headers = { "Content-Type": "text/plain"};
    res.writeHead(200, headers);
    res.write(timestamp.toString());
    res.write('\ntimestamp again ');
    res.write(timestamp.getTime().toString());
    res.write('\n\nurl was ');
    res.write(urlObj.href.toString() + ' ');
    res.write('\n\npathname was ');
    res.write(urlObj.pathname.toString() + ' ');

    var env = req.headers;
    env.url = req.url;
    env.query = urlObj.query;
    env.datetime = timestamp.toString();
    env.milliseconds = timestamp.getTime().toString();
    res.write('\n\n\n');
    res.write(JSON.stringify(env));

    res.write('\n\n\n');

    for(var property in req.headers) {
      res.write(property.toString() + ':' + req.headers[property] + ' ');
    }


    res.write('\n\n I think the key will be\n')
    
    redisClient.keys('*', function(err, data){
      res.write(data.toString() + '\n');
      res.write(data.length.toString() + '\n');
      for(var o in data) {
        res.write(o.toString() + ' - ' + data[o] + ' '); 
          redisClient.get(data[o], function(err, data){
            res.write(data.toString());
 //?THIS DOESN"T WORK.. duh.
          });
        res.write('\n');
      }
      res.end();
    });
  

    var day = timestamp.getUTCFullYear() + "-" + (timestamp.getUTCMonth() + 1) + "-" + timestamp.getUTCDate();
    var keys = [
      "hits-by-url:" + req.headers['host'] + urlObj.pathname.toString(), 
      "hits-by-url-by-date:" + req.headers['host'] + urlObj.pathname.toString() + ":" + day 
    ];
    for(i in keys){
      redisClient.incr(keys[i]);
    }
    //track the hit
    var key = req.headers['host'] + urlObj.pathname.toString() + ":" + timestamp.getTime().toString(); 
    redisClient.set(key, JSON.stringify(env));
  },

  handleError: function(req, res, e) {
    res.writeHead(500, {});
    res.write("Server error");
    res.close();

    e.stack = e.stack.split('\n');
    e.url = req.url;
   sys.log(JSON.stringify(e, null, 2));
  }

};
exports.Rdam = Rdam;
