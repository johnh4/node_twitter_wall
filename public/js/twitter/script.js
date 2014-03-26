$(function() {
    
    console.log("window.location.hostname", window.location.hostname);
    var socket = io.connect(window.location.hostname);
    //var socket = io.connect('http://localhost');

    var acceptTweet = true;
    var elements = [];
    var limit = 50;

    socket.on('match', function(tweet){
      
      // Only process match if one hasn't come through recently (as determined by the acceptTweet flag)
      if(acceptTweet){
        console.log('match triggered');
        
        // create an html element using the tweet's data
        var element = createTweetEl(tweet);

        // Add element to the scene as object, store object in element as property for future reference
        var object = positionObj(element);

        // keep the elements count to size limit
        manageSize();

        // Move object to a new, random position
        moveToNew(object, element);      

        objects.push( object );

        if(congaOn){
            runConga();
        }

        acceptTweet = false;
        var timeout = 3500;
        
        window.setTimeout(function(){
          acceptTweet = true
        }, timeout);
      }
    });

    function createTweetEl(tweet){
        if(tweet.retweeted_status){
            var retweeter = tweet.user.name;
            tweet = tweet.retweeted_status;
        }
        
        var text = tweet.text;

        var tweetEl = $("<div></div>");
        tweetEl.addClass("tweet");

        var name = tweet.user.name;
        var screenName = '@' + tweet.user.screen_name;
        var profImage = tweet.user.profile_image_url;
        var profBanner = tweet.user.profile_banner_url;
        var media = tweet.entities.media;
        var mediaURL = null;
        if(media){
            mediaURL = media[0].media_url;
        }

        // Add time ago.
        /*
        console.log('media', media);
        console.log('mediaURL', mediaURL);
        var created = tweet.created_at;
        console.log("created", created);
        var timeAgo = parseTwitterDate(created);
        console.log("timeAgo", timeAgo);
        text += "<br>Posted " + timeAgo;
        */
        
        // make retweets a different color
        if(/^RT/.test(text)){
          tweetEl.addClass("retweet");
        }

        tweetEl.html(text);

        // label tweet with name and screen name
        tweetEl.append( '<br>' + 'by ' + name + ', @' + screenName + ' ');
        
        // get bigger image
        if(/_normal\./g.test(profImage)){
            profImage = profImage.replace(/(_normal\.)/, '_bigger.');
        };
        profBanner += '/web';

        // add profile image
        var image = $('<div></div>');
        image.css('background-image', 'url(' + profImage + ')');
        image.addClass('profileImage');

        // add profile image
        var banner = $('<div></div>');
        banner.css('background-image', 'url(' + profBanner + ')');
        banner.addClass('profileBanner');

        // add tweet to page
        tweetEl.appendTo('#matches');

        var element = document.createElement('div');
        element.className = 'element';

        var details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = text;

        if(retweeter){
            var retweetEl = document.createElement('div');
            retweetEl.className = 'retweet';
            retweetEl.innerHTML = 'RT by ' + retweeter;
        }

        var screenNameEl = document.createElement('div');
        screenNameEl.className = 'screen-name';
        screenNameEl.innerHTML = screenName;

        var nameEl = document.createElement('div');
        nameEl.className = 'name';
        nameEl.innerHTML = name;

        if(mediaURL){
            var mediaEl = $('<div></div>');
            mediaEl.css('background-image', 'url(' + mediaURL + ')');
            mediaEl.addClass('media-url');
            var mediaIm = new Image();
            mediaIm.src = mediaURL;
            mediaIm.className = 'media-url';
        }

        $(element).append(nameEl);
        $(element).append(image);
        $(element).append(banner);
        $(element).append(screenNameEl);
        if(retweeter){
            element.appendChild(retweetEl);
        }
        element.appendChild(details);
        if(mediaURL){
            $(element).append(mediaIm);
        }

        return element;
    }

    function positionObj(element){
        // Add object to the scene in initial position
        var object = new THREE.CSS3DObject( element );
        object.position.x = 0;
        object.position.y = 3000;
        object.position.z = 0;
        scene.add( object );

        // Store three.js object in html element for future reference
        element.threeObj = object;
        element.addEventListener('mousedown', onDocumentMouseDown);

        // Link prev/next objects
        if(objA.length > 0){
            var lastObj = objA[objA.length-1];
            lastObj.nextO = object;
            object.prevO = lastObj;
        }
        objA.push(object);

        return object;
    }

    function manageSize(){
        console.log('objA.length', objA.length);
        if(objA.length > limit){
            var removeCount = objA.length - limit;
            for(var i = 0; i < removeCount; i++){
                var oldObj = objA[i];
                scene.remove(oldObj);
            }
            objA = objA.slice(removeCount);
            spliceOffset += removeCount;
            render();
        }
    }

    function moveToNew(object, element){
        // Choose a new, random position
        var newPos = {};
        newPos.x = Math.random() * 4000 - 2000;
        newPos.y = Math.random() * 4000 - 2000;
        newPos.z = Math.random() * 4000 - 2000;

        // Move object to the new position
        new TWEEN.Tween( object.position )
            .to( { x: newPos.x, y: newPos.y, z: newPos.z }, Math.random() * 1000 + 1000 )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        $(element).fadeIn(1500);

        // Move camera to the object's new position
        if(followLatest){
            resetCam = true;
            var prevCamPos = camera.position;
            
            camTarg = object.position;

            new TWEEN.Tween( prevCamPos )
                .to( { x: newPos.x, y: newPos.y, z: newPos.z + 600}, Math.random() * 1000 + 1000 )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
        }
    }
    
    function parseTwitterDate(tdate) {
        var system_date = new Date(Date.parse(tdate));
        var user_date = new Date();
        if (K.ie) {
            system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
        }
        var diff = Math.floor((user_date - system_date) / 1000);
        if (diff <= 1) {return "just now";}
        if (diff < 20) {return diff + " seconds ago";}
        if (diff < 40) {return "half a minute ago";}
        if (diff < 60) {return "less than a minute ago";}
        if (diff <= 90) {return "one minute ago";}
        if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
        if (diff <= 5400) {return "1 hour ago";}
        if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
        if (diff <= 129600) {return "1 day ago";}
        if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
        if (diff <= 777600) {return "1 week ago";}
        return "on " + system_date;
    }

    // from http://widgets.twimg.com/j/1/widget.js
    var K = function () {
        var a = navigator.userAgent;
        return {
            ie: a.match(/MSIE\s([^;]*)/)
        }
    }();
});