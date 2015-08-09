/* jshint node: true, asi: true */
var Backbone = require('backbone')
var GMaps = require('gmaps')

// App
var App = require('./app')

// Collection: Place
var placeCollection = require('./collections/place');

// View: Map
var Map = require('./views/map')
App.Views.Map  = new Map

// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    '*actions': 'defaultRoute'
  },

  // Route handlers

  index: function() {
    App.Views.Map.render()
  },

  defaultRoute: function(actions) {
    console.log('404');
  }
})

  // Initiate the router
App.router = new App.Router;

Backbone.history.start();