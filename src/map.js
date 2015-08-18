var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('./app')

// Models
var Place = require('./models/place')
var User = require('./models/user')

// why template
	var whyTemplate = require('./templates/infowindow.hbs')
	var addressTemplate = require('./templates/address.hbs')
	var reasonTemplate = require('./templates/reason.hbs')


function map() {
	var userCollection = App.Collections.user
	var placeCollection = App.Collections.place


	var personLoggedIn = {
		name: 'Duane',
		email: 'rmedina423@gmail.com',
		image: '../../images/duane.jpg'
	}
	var markers = []
	var infowindow

	userCollection.fetch().done(function () {
		var person = userCollection.findWhere(personLoggedIn)

		if (!!person === false) {
			var user = new User(personLoggedIn)
			userCollection.add(user)
			user.save()
		}

	})

	var map = new google.maps.Map($('#map')[0], {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 3,
		center: {lat: 10, lng: 20},
		disableDefaultUI: true
	})

	App.Map = map

	placeCollection.fetch().done(function (places) {
		places.forEach(function (place) {

			var matchedUser = userCollection.getUser(place.id)
			
			if (matchedUser) {
				var userImage = matchedUser.get('image')

				var marker = new google.maps.Marker({
					map: map,
					icon: userImage,
					position: new google.maps.LatLng(place.lat, place.lng)
				})

				markers.push(marker)
			}
		})
	})

	setInterval(function () {
			if (App.Settings.rotateMap) {

				if (infowindow) {
					infowindow.close()
				}


				var place = placeCollection.findWhere({ id: _.random(1, placeCollection.length) })
				var user = userCollection.getUser(place.id)

				if (user) {
					var userInfo = {
						name: user.get('name'),
						msg: user.get('msg'),
						img: user.get('image')
					}

					var lat = place.get('lat')
					var lng = place.get('lng')

					markerPositionViewPort = new google.maps.LatLng(lat - 25, lng -40)
					markerPositionInfo = new google.maps.LatLng(lat, lng)

					var marker = new google.maps.Marker({
						map: map,
						icon: userInfo.img,
						position: markerPositionInfo
					})

					infowindow = new google.maps.InfoWindow({
						content: whyTemplate(userInfo)
					})

					infowindow.open(map, marker)

					map.setCenter(markerPositionViewPort)
					map.panTo(markerPositionViewPort)

					var iwOuter = $('.gm-style-iw')
					var iwBackground = iwOuter.prev()

					// Remove the background shadow DIV
					iwBackground.children(':nth-child(2)').css({'display' : 'none'})

					// Remove the white background DIV
					iwBackground.children(':nth-child(4)').css({'display' : 'none'})
				}
			}

		}, 3000)

	// $('body').append(addressTemplate())

	// Create the search box and link it to the UI element.
	var input = $('#address')[0]
	var searchBox = new google.maps.places.SearchBox(input);

	// Listen for the event fired when the user selects an item from the
	// pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		App.Settings.rotateMap = false

		map.setOptions({scrollwheel: false, draggable: false})

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
			map: map,
			title: place.name,
			icon: personLoggedIn.image,
			position: place.geometry.location,
			animation: google.maps.Animation.DROP
		})

		$('main').append(reasonTemplate({destination: place.name}))

		var placeData = {
			name: place.name,
			lat: place.geometry.location.G,
			lng: place.geometry.location.K,
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

		map.setCenter(MarkerPosition)
		map.panTo(MarkerPosition)
	})

	$('body').on('click', 'input.btn', function (event) {
		event.preventDefault()

		var msg = $('#this_is_why').val()

		var centerOfMap = map.getCenter()

		// console.log(centerOfMap.G + 25, centerOfMap.K + 40)
		currentPlace = placeCollection.findWhere({
			lat: centerOfMap.G + 25,
			lng: centerOfMap.K + 40
		})


		var currentUser = userCollection.findWhere(personLoggedIn)

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
			name: personLoggedIn.name,
			msg: msg
		}

		infowindow = new google.maps.InfoWindow({
			content: whyTemplate(data)
		})

		var lastMarker = _.last(markers)

		infowindow.open(map, lastMarker)

		$('#why').css('display', 'none')
		App.Settings.rotateMap = true
		map.setOptions({scrollwheel: true, draggable: true})
	})


}

module.exports = map