'use strict';

module.exports = function(app) {
    
    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

    app.get('/twitter', function(req, res){
    	res.render('twitter');
    });

};
