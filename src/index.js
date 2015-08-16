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


var Map = require('./map')
var map = new Map


//View: where-why
// var WhereWhy = require('./views/where-why')
// App.Views.whereWhy = new WhereWhy

// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    '*actions': 'defaultRoute'
  },

  // Route handlers

  index: function() {
    App.Views.landingPage.render()
  },

  defaultRoute: function(actions) {
    console.log('404');
  }
})

  // Initiate the router
App.router = new App.Router;

Backbone.history.start();

function signInCallback(authResult) {
  if (authResult.code) {
    $.post('/auth/google/callback', { code: authResult.code})
    .done(function(data) {
      $('#signinButton').hide();
    }); 
  } else if (authResult.error) {
    console.log('There was an error: ' + authResult.error);
  }
};