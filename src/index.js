/* jshint node: true, asi: true */
var Backbone = require('backbone')

// App
var App = require('./app')

// Collection: Place
var placeCollection = require('./collections/place')
var userCollection = require('./collections/user')

// View: Landing Page
var LandingPage = require('./views/landing-page')
App.Views.landingPage = new LandingPage

// View: Sign in
var SignIn = require('./views/sign-in')
App.Views.signIn = new SignIn

// View: Process
var Process = require('./views/process.js')
App.Views.process = new Process

// View: User Profile
var UserProfile = require('./views/user-page')
App.Views.userProfile = new UserProfile



// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    'userprofile(/)': 'userProfile',
    'process(/)': 'process',
    '*actions': 'defaultRoute'
  },

  // Route handlers

  index: function() {
    App.Views.landingPage.render()
    // App.Views.signIn.render()
  },

  process: function() {
    App.Views.process.render()
  },

  userProfile: function() {
    App.Views.userProfile.render()
  },

  defaultRoute: function(actions) {
    console.log('404');
  }
})

  // Initiate the router
App.router = new App.Router;

Backbone.history.start();