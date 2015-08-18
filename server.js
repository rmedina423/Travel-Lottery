var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var logger = require('morgan')
var jsonServer = require('json-server')
var GooglePlusStrategy = require('passport-google-plus')
var app = express()

var router = jsonServer.router('db.json')
app.use('/api', router) 

passport.use(new GooglePlusStrategy({
    clientId: '1096081615290-9sr52j3uvur2it35urgo487gcvl3vikv.apps.googleusercontent.com',
    clientSecret: 'r0HJVJ097AuUoDaE1wlYPzF4'
  },
  function(tokens, profile, done) {
    // Create or update user, call done() when complete... 
    done(null, profile, tokens);
  }
))

passport.serializeUser(function(user, done) {
	console.log('serialize', user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log('deserialize', user)
	done(null, user);
});

app.use(logger('dev'))
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'thisismysecret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'user:email' ] }));

app.post('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json(req.user);
  });


// request data
app.get('/auth/google/profile', function (req, res) {
	res.json(req.user)
})

app.listen(3000, function () {
	console.log('Server started on http://localhost:3000')
})