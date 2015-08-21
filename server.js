var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var logger = require('morgan')
var jsonServer = require('json-server')
var GooglePlusStrategy = require('passport-google-oauth').OAuth2Strategy
var app = express() 
var request = require('request')
var router = jsonServer.router('db.json')
var _ = require('lodash')
app.use('/api', router) 

passport.use(new GooglePlusStrategy({
    clientID: '1096081615290-9sr52j3uvur2it35urgo487gcvl3vikv.apps.googleusercontent.com',
    clientSecret: 'r0HJVJ097AuUoDaE1wlYPzF4',
    callbackURL: 'http://localhost:8000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Create or update user, call done() when complete... 
    done(null, profile)
  }
))

passport.serializeUser(function(user, done) {
	// console.log('serialize', user)
  done(null, user)
})

passport.deserializeUser(function(user, done) {
	// console.log('deserialize', user)
	done(null, user)
})

app.use(logger('dev'))
app.use(express.static(__dirname))
app.use(cookieParser())
app.use(bodyParser())
app.use(session({ secret: 'thisismysecret' }))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/')
    // Successful authentication, redirect home.
    // res.json(req.user)
    request('http://localhost:3000/api/users/' + req.user.id, function (err, res, body) {
      // console.log('new user')
      console.log(req.user)
      var user = _.omit(req.user, ['_raw', '_json'])
      body = JSON.parse(body)
      if (!body.id) {
        request({
          method: 'POST',
          uri: 'http://localhost:3000/api/users',
          body: user,
          json: true
        },
        function (error, response, body) {
          // console.log(error)
          // console.log(req.user)
        })

      } else {
        _.assign(body, user)
        request({
          method: 'PUT',
          uri: 'http://localhost:3000/api/users/' + body.id,
          body: body,
          json: true
        },
        function (error, response, body) {
          console.log('successful update')
        })
      }

    })

  })


// request data
app.get('/auth/google/profile', function (req, res) {
  res.json(req.user)
  
})

app.listen(3000, function () {
  console.log('Server started on http://localhost:3000')
})