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
		var personLoggedIn = {
			name: 'Duane',
			email: 'rmedina423@gmail.com',
			image: '../../images/duane.jpg'
		}

		App.Collections.user.fetch().done(function () {
			var person = App.Collections.user.findWhere(personLoggedIn)

			if (!!person === false) {
				var user = new User(personLoggedIn)
				App.Collections.user.add(user)
				user.save()
			}

		})

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
			places.forEach(function (place) {

				var matchedUser = App.Collections.user.findWhere({placeId: place.id})
				
				if (matchedUser) {
					var userImage = matchedUser.get('image')
	
					var marker = new google.maps.Marker({
						map: Map,
						icon: userImage,
						position: new google.maps.LatLng(place.lat, place.lng)
					})
	
					markers.push(marker)
				}
			})
		})

		setInterval(function () {
			if (App.Settings.rotateMap) {

				var place = _this.collection.findWhere({ id: _.random(1, markers.length) })

				var lat = place.get('lat') - 25
				var  lng = place.get('lng') - 40

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

			Map.setOptions({scrollwheel: false, draggable: false})

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
				icon: personLoggedIn.image,
				position: place.geometry.location,
				animation: google.maps.Animation.DROP
			})

			console.log(marker.position)

			_this.markerCached = marker

			$('main').append(reasonTemplate({destination: place.name}))


			var placeData = {
				name: place.name,
				lat: place.geometry.location.G,
				lng: place.geometry.location.K,
			}

			var usersSelection = App.Collections.place.findWhere(placeData)

			if (!!usersSelection == false) {
				var place = new Place(placeData)
				App.Collections.place.add(place)
				place.save()

				markers.push(marker)
			}

			bounds.extend(marker.position)

			var G = marker.position.G - 25
			var  K = marker.position.K - 40

			MarkerPosition = new google.maps.LatLng(G, K)

			Map.setCenter(MarkerPosition)
			Map.panTo(MarkerPosition)
		})
		// [END region_getplaces]

		$('body').on('click', 'input.btn', function (event) {
			event.preventDefault()

			var msg = $('#this_is_why').val()

			var centerOfMap = Map.getCenter()

			console.log(centerOfMap.G +25, centerOfMap.K +40)

			currentPlace = App.Collections.place.findWhere({
				lat: centerOfMap.G +25,
				lng: centerOfMap.K +40
			})

			var currentUser = App.Collections.user.findWhere(personLoggedIn)

			currentUser.save({msg: msg, placeId: currentPlace.id})

			console.log(currentUser)

			var data = {
				name: personLoggedIn.name,
				msg: msg
			}

			var infowindow = new google.maps.InfoWindow({
				content: whyTemplate(data)
			});

			infowindow.open(Map,_this.markerCached);

			$('#why').css('display', 'none')
			App.Settings.rotateMap = true
			Map.setOptions({scrollwheel: true, draggable: true})
		})
	}
})



module.exports = Map



