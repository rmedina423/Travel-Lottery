var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// map.js
var map = require('../map')

// Templates
var mapTemplate = require('../templates/map.hbs')
var searchTemplate = require('../templates/search.hbs')
var contTemplate = require('../templates/contributions.hbs')
var whyTemplate = require('../templates/why.hbs')
var infowWindowTemplate = require('../templates/infowindow.hbs')
var paymentTemplate = require('../templates/payment.hbs')

// Collections GO BACK and put this into the VIEW
var userCollection = App.Collections.user
var placeCollection = App.Collections.place
var markers = []

// Current User
var getUserInfo = $.get('/auth/google/profile')

var Process = Backbone.View.extend({
	el: 'main',

	render: function() {

		this.$el.html(
			mapTemplate()+ 
			searchTemplate()+
			contTemplate()
		)

		$('.show-more').hide()

		map(this.$el.find('#map')[0])
		
		var _this = this
		var input = $('#address')[0]
		var searchBox = new google.maps.places.SearchBox(input)

		getUserInfo.done(function (userLoggedIn) {
			_this.userLoggedIn = userLoggedIn

			google.maps.event.addListener(searchBox, 'places_changed', function() {
				App.Settings.rotateMap = false
				App.map.setOptions({draggable: false})

				$('#geocoding_form').css('display', 'none')

				var placeArray = searchBox.getPlaces()
				var place = placeArray[0]
				var name = place.name
				var position = place.geometry.location
				_this.position = position
				var bounds = new google.maps.LatLngBounds()

				if (placeArray.length == 0) {
					return
				}

				var img = userLoggedIn.image.url

				var marker = new google.maps.Marker({
					map: App.map,
					title: name,
					icon: img,
					position: position,
					animation: google.maps.Animation.DROP
				})

				$('main').append(whyTemplate({destination: name}))

				var placeData = {
					name: name,
					lat: position.G,
					lng: position.K,
				}

				var usersSelection = placeCollection.findWhere(placeData)

				if (!!usersSelection == false) {
					var place = new Place(placeData)
					placeCollection.add(place)
					place.save()

					markers.push(marker)
				}

				bounds.extend(marker.position)

				var G = marker.position.G - 25
				var  K = marker.position.K - 40

				MarkerPosition = new google.maps.LatLng(G, K)

				App.map.setCenter(MarkerPosition)
				App.map.panTo(MarkerPosition)
			})
		})

	},

	events: {
		"click input.btn": "nextStep" 
	},

	nextStep: function () {
		event.preventDefault()

		var msg = $('#this_is_why').val()

		var centerOfMap = App.map.getCenter()

		currentPlace = placeCollection.findWhere({
			lat: this.position.G,
			lng: this.position.K
		})

		var currentUser = userCollection.findWhere({
			email: this.userLoggedIn.email,
			displayName: this.userLoggedIn.displayName
		})

		currentUser.save({msg: msg, placeId: currentPlace.id})

		markers.forEach(function (placeMarker) {
			var place = placeCollection.findWhere({
				lat: placeMarker.position.G,
				lng: placeMarker.position.K
			})
			
			var placeId = place.get('id')
			var match = userCollection.findWhere({placeId: placeId})

			if (!match) {
				place.destroy()
			}
			
			var lastPlaceModel = placeCollection.findWhere({
				lat: _.last(markers).position.G,
				lng: _.last(markers).position.K
			})

			lastPlaceModel.set({id: userCollection.length})
			lastPlaceModel.save()
		})

		var data = {
			name: this.userLoggedIn.displayName,
			msg: msg
		}

		infowindow = new google.maps.InfoWindow({
			content: infowWindowTemplate(data)
		})

		var lastMarker = _.last(markers)

		infowindow.open(map, lastMarker)

		$('#why').css('display', 'none')


		App.Settings.rotateMap = true
		App.map.setOptions({draggable: true})

		// var iwOuter = $('.gm-style-iw')
		// var iwBackground = iwOuter.prev()

		// // Remove the background shadow DIV
		// iwBackground.children(':nth-child(2)').css({'display' : 'none'})

		// // Remove the white background DIV
		// iwBackground.children(':nth-child(4)').css({'display' : 'none'})
		// App.router.navigate('/', { trigger: true })
		// this.$el.append(paymentTemplate())
	}
})

module.exports = Process