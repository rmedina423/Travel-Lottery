var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// map.js
var map = require('../map')

// Templates
var mapTemplate = require('../templates/map.hbs')
var signInTemplate = require('../templates/sign-in.hbs')
var missionTemplate = require('../templates/mission.hbs')
var howItWorksTemplate = require('../templates/howItWorks.hbs')
var contTemplate = require('../templates/contributions.hbs')
var footerTemplate = require('../templates/footer.hbs')
var paymentTemplate = require('../templates/payment.hbs')

var LandingPage = Backbone.View.extend({

	el: 'main',

	render: function () {

		this.$el.html(
			mapTemplate()+
			contTemplate()+ 
			missionTemplate()+ 
			howItWorksTemplate()+ 
			footerTemplate()
		)

		map(this.$el.find('#map')[0])
	},

})

module.exports = LandingPage