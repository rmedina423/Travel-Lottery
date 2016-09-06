var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var User = require('../models/user');

/****************************************
  Collection: Place
*****************************************/

var UserCollection = Backbone.Collection.extend({
	url: App.Settings.apiRoot + '/users',
	model: User,
	getUser: function (placeId) {
		return this.findWhere({placeId: placeId});
	}
});

App.Collections.user = new UserCollection;

module.exports = App.Collections.user;