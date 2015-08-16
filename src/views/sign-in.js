var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')
// App

var App = require('../app')
var Place = require('../models/place')
var User = require('../models/user')

var signInTemplate = require('../templates/sign-in.hbs')

var SignIn = Backbone.View.extend({
	el: 'body',

	render: function () {
		this.$el.html(signInTemplate())
	}
})

module.exports = SignIn
