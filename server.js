var _ = require('lodash')
var express = require('express')
var app = express() 
var logger = require('morgan')
var request = require('request')

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var passport = require('passport')
var GooglePlusStrategy = require('passport-google-oauth').OAuth2Strategy

var jsonServer = require('json-server')
var apiRouter = jsonServer.router('db.json')
app.use('/api', apiRouter)

// configure Google+ strategy
passport.use(new GooglePlusStrategy({
  clientID: '448444201920-fktpd7hs51e3fomuof5h7s5rv2b0rei8.apps.googleusercontent.com',
  clientSecret: 'a6gV3zPvzvsOzXTw8imUkZtv',
  callbackURL: 'http://5f0c544f.ngrok.com/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  // Create or update user, call done() when complete... 
  done(null, profile)
}))

// Write session cookie
passport.serializeUser(function(user, done) {
	// console.log('serialize', user)
  done(null, user)
})

// Read session cookie
passport.deserializeUser(function(user, done) {
	// console.log('deserialize', user)
	done(null, user)
})

// create middleware to store local values
var local = {}

function localMiddleware(req, res, next) {
  res.local = local
  next()
}

// initalize standard middlewares
app.use(logger('dev'))
app.use(express.static(__dirname))
app.use(cookieParser())
app.use(bodyParser())
app.use(session({ secret: '4251654+987165+646' }))
app.use(passport.initialize())
app.use(passport.session())

// custom middleware to set headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// initiate OAuth login
app.get('/auth/google',
  localMiddleware,
  function (req, res, next) {
    res.local.redirect = req.query.redirect
    next()
  },
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

// complete OAuth process
app.get('/auth/google/callback', 
  localMiddleware,
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {

    if (res.local.redirect) {
      res.redirect('/#/' + res.local.redirect)
    } else {
      res.redirect('/')
    }

    // if user exists, update else post to database api
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

          if (error) {
            console.log(error)
          }
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

          if (!error) {
            console.log('successful update')
          }
        })
      }

    })

  })

// route: logout current user
app.get('/auth/google/logout', function (req, res){
  req.logout()
  res.redirect('/')
})

// request data
app.get('/auth/google/profile', function (req, res) {
  res.json(req.user)
  
})

// starts server on port: 3000
app.listen(3000, function () {
  console.log('Server started on http://localhost:3000')
})