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
var addressTemplate = require('./templates/search.hbs')

var iwOuter = $('.gm-style-iw')
var iwBackground = iwOuter.prev()
iwOuter.next().hide();

iwBackground.children(':nth-child(2)').css({'display' : 'none'})
iwBackground.children(':nth-child(4)').css({'display' : 'none'})


var map = function(mapEl) {
	var userCollection = App.Collections.user
	var placeCollection = App.Collections.place
	var markers = []
	var infowindow

	var iwOuter = $('.gm-style-iw')
	var iwBackground = iwOuter.prev()
	iwOuter.next().hide();

	iwBackground.children(':nth-child(2)').css({'display' : 'none'})
	iwBackground.children(':nth-child(4)').css({'display' : 'none'})

	userCollection.fetch()

	var map = new google.maps.Map(mapEl, {
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		zoom: 3,
		center: {lat: 10, lng: 20},
		disableDefaultUI: true,
		scrollwheel: false
	})

	App.map = map

	placeCollection.fetch().done(function (places) {
		places.forEach(function (place) {

			var matchedUser = userCollection.getUser(place.id)
			
			if (matchedUser) {
				var userImage = matchedUser.attributes.photos[0].value

				var marker = new google.maps.Marker({
					map: map,
					icon: userImage,
					position: new google.maps.LatLng(place.lat, place.lng)
				})

				markers.push(marker)
			}

			if (!matchedUser) {
				unmatchedPlace = placeCollection.getPlace(place.id)
				unmatchedPlace.destroy()
			}

			marker.addListener('click', function() {
				if (infowindow) {
					infowindow.close()
				}
				var placeMarker = placeCollection.findWhere({
					lat: marker.position.G,
					lng: marker.position.K
				})

				var userMarker = userCollection.getUser(placeMarker.id)

				infowindow = new google.maps.InfoWindow({
					content: whyTemplate({
						id: userMarker.get('id'),
						name: userMarker.get('displayName'),
						msg: userMarker.get('msg'),
						winner: String(userMarker.get('winner'))
					})
				})
				
				infowindow.open(map, marker)
			})

		})
	})

	google.maps.event.addListener(map, 'drag', function() {
		App.Settings.rotateMap = false
		setTimeout(function () {
			App.Settings.rotateMap = true
		}, 20000)
	})

	var indexNumber = 0
	setInterval(function () {
		var counter = indexNumber++

		if (counter === placeCollection.length-1) {
			indexNumber = 0
		} else {
			counter
		}

		if (App.Settings.rotateMap) {

			if (infowindow) {
				infowindow.close()
			}

			var place = placeCollection.models[counter]
			var user = userCollection.getUser(place.id)

			if (user) {

				var userInfo = {
					id: user.get('id'),
					name: user.get('displayName'),
					msg: user.get('msg'),
					img: user.get('photos')[0].value,
					winner: String(user.get('winner'))
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
				iwOuter.next().hide();

				iwBackground.children(':nth-child(2)').css({'display' : 'none'})
				iwBackground.children(':nth-child(4)').css({'display' : 'none'})
			}
		}

	}, 4000)
}

var iwOuter = $('.gm-style-iw')
var iwBackground = iwOuter.prev()
iwOuter.next().hide();

iwBackground.children(':nth-child(2)').css({'display' : 'none'})
iwBackground.children(':nth-child(4)').css({'display' : 'none'})

module.exports = map