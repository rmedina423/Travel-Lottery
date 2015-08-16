var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// why template
var whyTemplate = require('../templates/this_is_why.hbs')
// var addressTemplate = require('../templates/address.hbs')
var reasonTemplate = require('../templates/reason.hbs')
var learnMoreTemplate = require('../templates/learn-more.hbs')
var whatWeDoTemplate = require('../templates/whatWeDo.hbs')
var wahtWeDo2Template = require('../templates/whatWeDo(part2).hbs')
var contTemplate = require('../templates/contributions.hbs')

var LandingPage = Backbone.View.extend({

	el: 'body',

	render: function () {
		// this.$el.append(learnMoreTemplate())
		this.$el.append(contTemplate())
		this.$el.append(whatWeDoTemplate())
		this.$el.append(wahtWeDo2Template())
	},

	// events: {
 //    "click a.learn-details i": "scrollDown"
	// },

	// scrollDown: function () {
	// 	this.$el.append(wahtWeDo2Template())
	// 	$('a.learn-details').removeClass('learn-details')
	// }

})

module.exports = LandingPage