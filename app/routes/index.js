'use strict';

module.exports = function(app) {
    
    // Home route
    var index = require('../controllers/index');
    app.get('/index', index.render);

    app.get('/', function(req, res){
    	res.render('twitter');
    });

};