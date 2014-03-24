// Setup twitter streaming
var twitter = require('ntwitter'),
    //io = require('socket.io'),
    _ = require('underscore');
    //http = require('http');

module.exports = function(app, sockets){
  

  var t = new twitter({
      //rest_base: 'https://api.twitter.com/1.1',
      consumer_key: 'cPE5QwZQbnMX4zRHNFUsA',           // <--- FILL ME IN
      consumer_secret: 'gkCHSKZplvb5K3edoNWz3q7lvcOJPFzeNQ4kvUB6S4',        // <--- FILL ME IN
      access_token_key: '15854229-ILHfY2kPICpFPm6d4OOWVUG36byi1xVHNLfcDOoiz',       // <--- FILL ME IN
      access_token_secret: 'bZKoNCrUS4EUQxodj1wLUw6Dpy6hZCfzst3ift9sP9UGk'     // <--- FILL ME IN
  });
  var trends = [];
  var trendsLoc = 2458410;
  t.get('/trends/place.json', { id: trendsLoc }, function(err,data) {
      console.log(data);
      var trendsO = data[0].trends;
      console.log('trends0', trendsO);
      trends = _.map(trendsO, function(trend){
        //console.log('name', trend.name);
        return trend.name;
      });
      console.log("trends", trends);
      startStream();
  });
  function startStream() {
    console.log('starting the stream');
    t.stream('statuses/filter', { track: trends, language: 'en' }, function(stream) {
      stream.on('data', function(tweet) {
          console.log(tweet.text);
          sockets.sockets.emit('match', tweet);
      });
    });
  };
}