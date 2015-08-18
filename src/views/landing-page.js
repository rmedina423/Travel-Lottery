var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// Templates
var mainTemplate = require('../templates/main.hbs')
var aboutTemplate = require('../templates/about.hbs')
var headerTemplate = require('../templates/header.hbs')
var signInTemplate = require('../templates/sign-in.hbs')
var learnMoreTemplate = require('../templates/learn-more.hbs')
var missionTemplate = require('../templates/mission.hbs')
var howItWorks = require('../templates/howItWorks.hbs')
var contTemplate = require('../templates/contributions.hbs')
var footerTemplate = require('../templates/footer.hbs')

var LandingPage = Backbone.View.extend({

	el: 'body',

	render: function () {
		var templates = {
			header: headerTemplate(),
			contributions: contTemplate(),
			primary: {
				part1: missionTemplate(),
				part2:howItWorks()
			},
			footer: footerTemplate()
		}

		this.$el.append(mainTemplate(templates))

		$('.lightbox').on('click', function () {
			$(this).remove()
		})
	},

})

module.exports = LandingPage