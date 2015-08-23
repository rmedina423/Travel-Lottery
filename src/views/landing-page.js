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
var winnerTemmplate = require('../templates/winner.hbs')

var LandingPage = Backbone.View.extend({

	el: 'main',

	collection: {
		user: App.Collections.user,
		place: App.Collections.place
	},

	render: function () {
		var _this = this

		this.$el.html(
			mapTemplate()+
			missionTemplate()+ 
			howItWorksTemplate()+ 
			footerTemplate()
		)

		this.collection.user.fetch().done(function (users) {
			contributions = _.pluck(users, 'contributions').reduce(_.add)

			// if (contributions === 21) {
				var lengthOfUsers = App.Collections.user.length
				var randomUserIndex = _.random(0, lengthOfUsers - 1)
				var winner = App.Collections.user.models[randomUserIndex].attributes

				_this.collection.place.fetch().done(function () {
					var place = _this.collection.place.getPlace(winner.placeId)
					var placeName = place.get('name')

					var winnerInfo = {
						img: winner.photos[0].value,
						fullName: winner.displayName,
						place: placeName,
						msg: winner.msg,
						firstName: winner.name.givenName
					}

					_this.$el.append(winnerTemmplate(winnerInfo))
				})

			// } else {
			// 	_this.$el.append(contTemplate({contributions: contributions}))
			// }


			// setInterval(function () {
			// 	$('#contributions').toggleClass('slideInLeft')
			// 	$('#contributions').toggleClass('shake')
			// }, 1000)




			$('a.show-more').click(function () {
				$('html, body').animate({
					scrollTop: $('#mission-statement').offset().top
				}, 500);

				return false;
			})

		})


		$(window).scroll(function() {
			var topOfWindow = $(window).scrollTop()
			var bottomOfWindow = topOfWindow + $(window).height()

			$('.animated').each(function(){
				var iconPos = $(this).offset().top

				if(iconPos <= bottomOfWindow && iconPos >= topOfWindow){
					$(this).addClass('flipInY')
				} else {
					$(this).removeClass('flipInY')
				}

			})
		})

		map(this.$el.find('#map')[0])
	},

	events: {
		"click a.learn-more": "scroll"
	},

	scroll: function () {
		$('html, body').animate({
			scrollTop: $('[name=learn-more]').offset().top
		}, 500);

		return false;
	}

})

module.exports = LandingPage