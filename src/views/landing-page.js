var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')
var slick = require('slick-carousel')

// App
var App = require('../app')

// map
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

		// Calculate contributions made
		this.collection.user.fetch().done(function (users) {

			// pluck all contributions in an array and add
			var contributions = _.pluck(users, 'contributions').reduce(_.add)
			var userModels = _this.collection.user.models
			var validEntrants = []

			// if contributions reach, reset contribution totals forEach entrant
			if (contributions === App.WinningNumber) {
				userModels.forEach(function (user) {
					user.set('contributions', 0)
					user.save()
				})

				// push each person into an array that made contribution
				users.forEach(function (user) {
					if (!!user.contributions) {
						var validUser = App.Collections.user.findWhere({id: user.id})
						validEntrants.push(validUser)
					}
				})

				// randomly select an index from validEntrants array
				var lengthOfUsers = validEntrants.length
				var randomUserIndex = _.random(0, lengthOfUsers - 1)
				var winner = validEntrants[randomUserIndex].attributes
				console.log(randomUserIndex)

				// fetch winner place location, & retrieve winner info
				_this.collection.place.fetch().done(function () {
					var place = _this.collection.place.getPlace(winner.placeId)
					var placeName = place.get('name')

					var winnerInfo = {
						img: winner.photos[0].value,
						fullName: winner.displayName,
						place: placeName,
						msg: winner.msg,
						firstName: winner.name.givenName,
						contributions: contributions
					}

					// give property of winner to current winner
					winnerModel = App.Collections.user.models[randomUserIndex]
					console.log(winnerModel)
					winnerModel.set('winner', true)
					winnerModel.save()
					console.log(randomUserIndex)
					console.log(winnerModel)

					_this.$el.append(contTemplate(winnerInfo))

					// add carousel
					$('.slick').slick({
						infinite: true,
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: true,
						autoplaySpeed: 6000,
						arrows: false,
						cssEase: 'ease'
					})

				})

			} else {
				var pastWinners = []
				
				// push past winners into an array
				users.forEach(function (user) {
					if (user.winner) {
						var pastWinner = App.Collections.user.findWhere(user)
						pastWinners.push(pastWinner)
					}
				})

				// fetch places and retrieve randomely selected past winner info
				_this.collection.place.fetch().done(function () {
					var lengthOfWinners = pastWinners.length

					if (lengthOfWinners) {
						var randomUserIndex = _.random(0, lengthOfWinners - 1)
						var modelWinner = pastWinners[randomUserIndex].attributes
						var place = _this.collection.place.getPlace(modelWinner.placeId)
						var placeName = place.get('name')

						var modelWinnerInfo = {
							img: modelWinner.photos[0].value,
							fullName: modelWinner.displayName,
							place: placeName,
							msg: modelWinner.msg,
							firstName: modelWinner.name.givenName,
							contributions: contributions
						}

						_this.$el.append(contTemplate(modelWinnerInfo))
					}

					// add carousel
					$('.slick').slick({
						infinite: true,
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: true,
						autoplaySpeed: 6000,
						arrows: false,
						cssEase: 'ease'
					})
				})
			}
		})

		// add scroll event to window
		$(window).scroll(function() {
			var topOfWindow = $(window).scrollTop()
			var bottomOfWindow = topOfWindow + $(window).height()

			// add animation to icons
			$('.animated').each(function(){
				var iconPos = $(this).offset().top

				if(iconPos <= bottomOfWindow && iconPos >= topOfWindow){
					$(this).addClass('flipInY')
				} else {
					$(this).removeClass('flipInY')
				}

			})
		})

		// initiate map on page
		map(this.$el.find('#map')[0])
	},

	events: {
		"click a.target-anchor": "scroll",
		"click a.learn-more": "scrollMore"
	},

	scroll: function () {
		// animate smooth transition
		$('html, body').animate({
			scrollTop: $('#mission-statement').offset().top
		}, 500);

		return false;
	},

	scrollMore: function () {
		// animate smooth transition
		$('html, body').animate({
			scrollTop: $('[name=learn-more]').offset().top
		}, 500);

		return false;
	}

})

module.exports = LandingPage