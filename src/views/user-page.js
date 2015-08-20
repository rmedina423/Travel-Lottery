var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// templates
var userProfile = require('../templates/user-profile.hbs')

var UserProfile = Backbone.View.extend({
	el: 'main',

	render: function() {
		this.$el.html(userProfile())
	}
})

module.exports = UserProfile