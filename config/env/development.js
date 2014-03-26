'use strict';

module.exports = {
    //db: 'mongodb://localhost/mean-dev',
    db: 'mongodb://meanadmin:password123@oceanic.mongohq.com:10027/app23411827',
    app: {
        name: 'MEAN - A Modern Stack - Development'
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'cPE5QwZQbnMX4zRHNFUsA',
        clientSecret: 'gkCHSKZplvb5K3edoNWz3q7lvcOJPFzeNQ4kvUB6S4',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
/*
var t = new twitter({
    //rest_base: 'https://api.twitter.com/1.1',
    consumer_key: 'YWkWeFaQRGRybI0NYNrYiw',           // <--- FILL ME IN
    consumer_secret: '1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE',        // <--- FILL ME IN
    access_token_key: '15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC',       // <--- FILL ME IN
    access_token_secret: 'iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI'     // <--- FILL ME IN
});
*/