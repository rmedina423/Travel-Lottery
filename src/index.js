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

// View: Process
var Process = require('./views/process.js')
App.Views.process = new Process

// View: User Profile
var UserProfile = require('./views/user-page')
App.Views.userProfile = new UserProfile

var loggedInUserTemplate = require('./templates/logged-in-user.hbs')
var searchButtonTemplate = require('./templates/search-button.hbs')



// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    'userprofile(/)': 'userProfile',
    'userprofile/:id(/)': 'userProfile',
    'process(/)': 'process',
    '*actions': 'defaultRoute'
  },

  // Route handlers

  index: function() {
    App.Views.landingPage.render()
  },

  process: function() {
    App.Views.process.render()
  },

  userProfile: function(id) {
    App.Views.userProfile.render(id)
  },

  defaultRoute: function(actions) {
    console.log('404');
  }
})

  // Initiate the router
App.router = new App.Router;

Backbone.history.start();

$.get('/auth/google/profile').done(function (user) {
  console.log('logged in! :)')
  $('#loggedInUser').html(loggedInUserTemplate({user: user.displayName}))
  $('.primary-footer > div').html(searchButtonTemplate())
  $('#contributions').append(searchButtonTemplate())

}).fail(function () {
  console.log('not logged in :(')
})