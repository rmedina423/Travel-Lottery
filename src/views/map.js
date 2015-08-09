var $ = require('jquery')
var Backbone = require('backbone')
// App

var App = require('../app')

// View: map

var Map = Backbone.View.extend({

	collection: App.Collections.place,

	render: function () {

		var markers = []


		var Map = new google.maps.Map($('#map')[0], {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 3,
			center: {lat: 10, lng: 0},
			disableDefaultUI: true
		})

		this.collection.fetch().done(function (places) {
			places.forEach(function (place) {
				console.log(place.G, place.K)

				var marker = new google.maps.Marker({
					map: Map,
					position: new google.maps.LatLng(place.G, place.K)
				})

				markers.push(marker)
			})
		})

		// Create the search box and link it to the UI element.
		var input = $('#address')[0]
		// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

		var searchBox = new google.maps.places.SearchBox(input);

		// [START region_getplaces]
		// Listen for the event fired when the user selects an item from the
		// pick list. Retrieve the matching places for that item.
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces()

			if (places.length == 0) {
				return
			}

			// markers.forEach(function (marker) {
			// 	marker.setMap(null)
			// })

			// For each place, get the icon, place name, and location.
			markers = []
			var bounds = new google.maps.LatLngBounds()

			places.forEach(function (place) {

				var image = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				}

				// Create a marker for each place.
				var marker = new google.maps.Marker({
					map: Map,
					// icon: image,
					// title: place.name,
					position: place.geometry.location,
					// animation: google.maps.Animation.DROP
				})

				markers.push(marker)

				App.Collections.place.create(place.geometry.location)

				bounds.extend(marker.position)

				var G = marker.position.G
				G = Math.round(G * 100) / 100 - 5

				var  K = marker.position.K
				K = Math.round(K * 100) / 100 - 8

				MarkerPosition = new google.maps.LatLng(G, K)

				Map.setCenter(MarkerPosition)
				Map.panTo(MarkerPosition)
			})

			// Map.fitBounds(bounds)
			Map.setZoom(3)

			$('#geocoding_form').css('display', 'none')
			$('#why').css('display', 'initial')

		})
		// [END region_getplaces]
		
	}
})



module.exports = Map



