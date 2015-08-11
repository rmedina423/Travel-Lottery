var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')
// App

var App = require('../app')
var Place = require('../models/place')
var User = require('../models/user')

var addressTemplate = require('../templates/address.hbs')
var reasonTemplate = require('../templates/reason.hbs')
var whyTemplate = require('../templates/this_is_why.hbs')

// View: map

var Map = Backbone.View.extend({

	collection: App.Collections.place,

	render: function () {
		var PersonLoggedIn = {
			name: 'Ryan M. Medina',
			email: 'rmedina423@gmail.com',
			image: 'whatever'
		}
		var user = new User(PersonLoggedIn)
		App.Collections.user.add(user)
		user.save()

		var _this = this
		var markers = []

		$('body').append(addressTemplate())

		var Map = new google.maps.Map($('#map')[0], {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 3,
			center: {lat: 10, lng: 20},
			disableDefaultUI: true
		})

		this.collection.fetch().done(function (places) {
			_this.placesCached = places
			places.forEach(function (place) {

				var marker = new google.maps.Marker({
					map: Map,
					position: new google.maps.LatLng(place.lat, place.lng)
				})

				markers.push(marker);
			})
		})


		setInterval(function () {
			if (App.Settings.rotateMap) {

				var place = _.find(_this.placesCached,{ id: _.random(1, markers.length) })

				var marker = new google.maps.Marker({
					map: Map,
					position: new google.maps.LatLng(place.lat, place.lng)
				})

				var lat = marker.position.G - 25
				var  lng = marker.position.K - 40

				MarkerPosition = new google.maps.LatLng(lat, lng)

				Map.setCenter(MarkerPosition)
				Map.panTo(MarkerPosition)
			}

		}, 3000)

		// Create the search box and link it to the UI element.
		var input = $('#address')[0]
		var searchBox = new google.maps.places.SearchBox(input);

		// Listen for the event fired when the user selects an item from the
		// pick list. Retrieve the matching places for that item.
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			App.Settings.rotateMap = false

			$('#geocoding_form').css('display', 'none')

			var placeArray = searchBox.getPlaces()
			var place = placeArray[0]

			if (placeArray.length == 0) {
				return
			}

			// For each place, get the icon, place name, and location.
			var bounds = new google.maps.LatLngBounds()

				// Create a marker for each place.
				var marker = new google.maps.Marker({
					map: Map,
					title: place.name,
					position: place.geometry.location,
					animation: google.maps.Animation.DROP
				})

				_this.markerCached = marker

				$('main').append(reasonTemplate({destination: place.name}))

				markers.push(marker)

				var placeData = {
					name: place.name,
					lat: place.geometry.location.G,
					lng: place.geometry.location.K
				}

				var place = new Place(placeData)
				App.Collections.place.add(place)
				place.save()

				bounds.extend(marker.position)

				var G = marker.position.G - 25
				var  K = marker.position.K - 40

				MarkerPosition = new google.maps.LatLng(G, K)

				Map.setCenter(MarkerPosition)
				Map.panTo(MarkerPosition)


			$('input.btn').on('click', function(event) {
				event.preventDefault()

				// start interval again!

				var why = $('#this_is_why').val()

				centerOfMap = Map.getCenter()

				CurrentPlace = App.Collections.place.findWhere({
					lat: centerOfMap.G +25,
					lng: centerOfMap.K +40
				})

				CurrentUser = App.Collections.user.findWhere(PersonLoggedIn)
				CurrentUser.save({msg: why, placeId: CurrentPlace.id})

				var data = {
					name: PersonLoggedIn.name,
					msg: why
				}

				var infowindow = new google.maps.InfoWindow({
					content: whyTemplate(data)
				});

				infowindow.open(Map,_this.markerCached);

				$('#why').css('display', 'none')
				App.Settings.rotateMap = true
			})
		})
		// [END region_getplaces]
		
	}
})



module.exports = Map



