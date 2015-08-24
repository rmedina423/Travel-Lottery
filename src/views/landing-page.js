var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')
var slick = require('slick-carousel')

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
var winnerTemplate = require('../templates/winner.hbs')

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
			var contributions = _.pluck(users, 'contributions').reduce(_.add)

			if (contributions >= 21) {

				var userModels = _this.collection.user.models

				userModels.forEach(function (user) {
					user.set('contributions', 0)
					user.save()
				})

				var validEntrants = []

				users.forEach(function (user) {
					if (!!user.contributions) {
						var validUser = App.Collections.user.findWhere({id: user.id})
						console.log(validUser)
						validEntrants.push(validUser)
					}
				})

				var lengthOfUsers = validEntrants.length
				var randomUserIndex = _.random(0, lengthOfUsers - 1)
				var winner = validEntrants[randomUserIndex].attributes

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

					winnerModel = App.Collections.user.models[randomUserIndex]
					winnerModel.set('winner', true)
					winnerModel.save()

					_this.$el.append(winnerTemplate(winnerInfo))

					setInterval(function () {
						$('#winner').toggleClass('slideInLeft')
						$('#winner').toggleClass('slideOutRight')
					}, 5000)

					setTimeout(function () {
						contributions = _.pluck(users, 'contributions').reduce(_.add)
						_this.$el.append(contTemplate({contributions: contributions}))

						setInterval(function () {
							$('#contributions').addClass('slideInLeft')
							$('#contributions').toggleClass('slideOutRight')
						}, 5000)

					}, 5000)

				})

			} else {
				_this.$el.append(contTemplate({contributions: contributions}))
				var pastWinners = []
				
				users.forEach(function (user) {
					if (user.winner) {
						var pastWinner = App.Collections.user.findWhere(user)
						pastWinners.push(pastWinner)
					}
				})

				var lengthOfUsers = pastWinners.length
				var randomUserIndex = _.random(0, lengthOfUsers - 1)
				var modelWinner = pastWinners[randomUserIndex].attributes

				_this.collection.place.fetch().done(function () {

					var place = _this.collection.place.getPlace(modelWinner.placeId)
					var placeName = place.get('name')

					var modelWinnerInfo = {
						img: modelWinner.photos[0].value,
						fullName: modelWinner.displayName,
						place: placeName,
						msg: modelWinner.msg,
						firstName: modelWinner.name.givenName
					}
					
					// x = setInterval(function () {
					// 	$('#contributions').toggleClass('slideInLeft')
					// 	$('#contributions').toggleClass('slideOutRight')
					// }, 5000)

					// setTimeout(function () {
					// 	_this.$el.append(winnerTemplate(modelWinnerInfo))

					// 	y = setInterval(function () {
					// 		$('#winner').toggleClass('slideInLeft')
					// 		$('#winner').toggleClass('slideOutRight')
					// 	}, 5000)

					// }, 5000)
				})
			}

			$('a.show-more').click(function () {
				$('html, body').animate({
					scrollTop: $('#mission-statement').offset().top
				}, 500);

				return false;
			})

			$('.slick').slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: false,
				cssEase: 'ease'
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