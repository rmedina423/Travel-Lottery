var Backbone = require('backbone')


/****************************************
  App
*****************************************/

var App = require('../app')
var Place = require('../models/place')

/****************************************
  Collection: Place
*****************************************/

var PlaceCollection = Backbone.Collection.extend({
	url: App.Settings.apiRoot + '/places',
	model: Place
})

App.Collections.place = new PlaceCollection

module.exports = App.Collections.place