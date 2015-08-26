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
  clientID: '448444201920-fktpd7hs51e3fomuof5h7s5rv2b0rei8.apps.googleusercontent.com',
  clientSecret: 'a6gV3zPvzvsOzXTw8imUkZtv',
    callbackURL: 'http://5f0c544f.ngrok.com/auth/google/callback'
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

var local = {}

function localMiddleware(req, res, next) {
  res.local = local
  next()
}

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
  localMiddleware,
  function (req, res, next) {
    res.local.redirect = req.query.redirect
    next()
  },
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

app.get('/auth/google/callback', 
  localMiddleware,
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    console.log(res.local.redirect)

    if (res.local.redirect) {
      res.redirect('/#/' + res.local.redirect)
    } else {
      res.redirect('/')
    }

    request('http://localhost:3000/api/users/' + req.user.id, function (err, res, body) {
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
          console.log(error)
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

app.get('/auth/google/logout', function (req, res){
  req.logout()
  res.redirect('/')
})

// request data
app.get('/auth/google/profile', function (req, res) {
  res.json(req.user)
  
})

app.listen(3000, function () {
  console.log('Server started on http://localhost:3000')
})