// Setup twitter streaming
var twitter = require('ntwitter'),
    _ = require('underscore');

module.exports = function(app, sockets){
  
  // Setup twitter API access
  var t = new twitter({
      consumer_key: 'cPE5QwZQbnMX4zRHNFUsA',           // <--- FILL ME IN
      consumer_secret: 'gkCHSKZplvb5K3edoNWz3q7lvcOJPFzeNQ4kvUB6S4',        // <--- FILL ME IN
      access_token_key: '15854229-ILHfY2kPICpFPm6d4OOWVUG36byi1xVHNLfcDOoiz',       // <--- FILL ME IN
      access_token_secret: 'bZKoNCrUS4EUQxodj1wLUw6Dpy6hZCfzst3ift9sP9UGk'     // <--- FILL ME IN
  });

  // USA
  var trendsLoc = 2458410;

  // Get the top 10 trending topics from twitter
  var trends = [];
  t.get('/trends/place.json', { id: trendsLoc }, function(err,data) {
      var trendsO = data[0].trends;
      trends = _.map(trendsO, function(trend){
        return trend.name;
      });
      console.log("trends", trends);
      startStream();
  });

  // Stream tweets from the previously fetched trending topics
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