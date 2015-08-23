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
	model: Place,
	getPlace: function (id) {
		return this.findWhere({id: id})
	}
})

App.Collections.place = new PlaceCollection

module.exports = App.Collections.place