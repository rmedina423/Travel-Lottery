/* jshint node: true, asi: true */
var Backbone = require('backbone')
var GMaps = require('gmaps')

// App
var App = require('./app')

// View: map
var map = require('./views/map')
App.Views.map  = new Map

// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    '*actions': 'defaultRoute'
  },

  // Route handlers

  index: function() {
    App.Views.map
  },

  defaultRoute: function(actions) {
    console.log('404');
  }
})

  // Initiate the router
App.router = new App.Router;

Backbone.history.start();