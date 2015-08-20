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


var map = function(mapEl) {
	var userCollection = App.Collections.user
	var placeCollection = App.Collections.place
	var markers = []
	var infowindow

	userCollection.fetch()

	var map = new google.maps.Map(mapEl, {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 3,
		center: {lat: 10, lng: 20},
		disableDefaultUI: true,
		scrollwheel: false
	})

	App.map = map

	placeCollection.fetch().done(function (places) {
		places.forEach(function (place) {

			var matchedUser = userCollection.getUser(place.id)
			// console.log(matchedUser)
			
			if (matchedUser) {
				var userImage = matchedUser.get('image[url]')

				var marker = new google.maps.Marker({
					map: map,
					icon: userImage,
					position: new google.maps.LatLng(place.lat, place.lng)
				})

				markers.push(marker)
			}
		})
	})

	// setInterval(function () {
		// if (App.Settings.rotateMap) {

		// 	if (infowindow) {
		// 		infowindow.close()
		// 	}

			// var place = placeCollection.findWhere({ id: _.random(1, placeCollection.length) })
			// var user = userCollection.getUser(place.id)

			// if (user) {
			// 	var userInfo = {
			// 		name: user.get('name'),
			// 		msg: user.get('msg'),
			// 		img: user.get('image')
			// 	}

			// 	var lat = place.get('lat')
			// 	var lng = place.get('lng')

			// 	markerPositionViewPort = new google.maps.LatLng(lat - 25, lng -40)
			// 	markerPositionInfo = new google.maps.LatLng(lat, lng)

			// 	var marker = new google.maps.Marker({
			// 		map: map,
			// 		icon: userInfo.img,
			// 		position: markerPositionInfo
			// 	})

			// 	infowindow = new google.maps.InfoWindow({
			// 		content: whyTemplate(userInfo)
			// 	})

			// 	infowindow.open(map, marker)

			// 	map.setCenter(markerPositionViewPort)
			// 	map.panTo(markerPositionViewPort)

			// 	var iwOuter = $('.gm-style-iw')
			// 	var iwBackground = iwOuter.prev()
			// 	iwOuter.next().hide();

			// 	// Remove the background shadow DIV
			// 	iwBackground.children(':nth-child(2)').css({'display' : 'none'})

			// 	// Remove the white background DIV
			// 	iwBackground.children(':nth-child(4)').css({'display' : 'none'})
			// }
	// 	}

	// }, 3000)
}

module.exports = map