var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');

// App
var App = require('../app');

// Models
var Place = require('../models/place');
var User = require('../models/user');

// map.js
var map = require('../map');

// Templates
var mapTemplate = require('../templates/map.hbs');
var searchTemplate = require('../templates/search.hbs');
var contTemplate = require('../templates/contributions.hbs');
var whyTemplate = require('../templates/why.hbs');
var infowWindowTemplate = require('../templates/infowindow.hbs');
var aboutTemplate = require('../templates/about.hbs');
var paymentTemplate = require('../templates/payment.hbs');
var logInTemplate = require('../templates/log-in-first.hbs');

// Collections GO BACK and put this into the VIEW
var userCollection = App.Collections.user;
var placeCollection = App.Collections.place;

// Current User
var getUserInfo = $.get('/auth/google/profile');

var Process = Backbone.View.extend({
	el: 'main',

	render: function() {
		var href = $('#loggedInUser a').attr('href', '/auth/google?redirect=process');

		this.$el.html(
			mapTemplate()+ 
			searchTemplate()
		);

		map(this.$el.find('#map')[0]);
		
		var _this = this;
		var input = $('#address')[0];
		var searchBox = new google.maps.places.SearchBox(input);

			getUserInfo.done(function (userLoggedIn) {
				_this.userLoggedIn = userLoggedIn;

				google.maps.event.addListener(searchBox, 'places_changed', function() {
					App.Settings.rotateMap = false;

					var place = searchBox.getPlaces()[0];
					var position = place.geometry.location;
					var bounds = new google.maps.LatLngBounds();

					_this.position = position;

					var marker = new google.maps.Marker({
						map: App.map,
						title: place.name,
						icon: userLoggedIn.photos[0].value,
						position: position,
						animation: google.maps.Animation.DROP
					});

					_this.marker = marker;

					$('main').append(whyTemplate({destination: place.name}));

					var placeData = {
						name: place.name,
						lat: position.G,
						lng: position.K,
					};

					var usersSelection = placeCollection.findWhere(placeData);

					if (!usersSelection) {
						var place = new Place(placeData);
						placeCollection.add(place);
						place.save();
					}

					bounds.extend(marker.position);

					var lat = marker.position.G - 25;
					var  lng = marker.position.K - 40;

					MarkerPosition = new google.maps.LatLng(lat, lng);

					App.map.setCenter(MarkerPosition);
					App.map.panTo(MarkerPosition);

					$('#geocoding_form').css('display', 'none');
				});
			});

	},

	events: {
		"keypress input#address": "preventDefault",
		"click input.btn": "nextStep",
		"click .payment": "payment",
		"click #submit-payment": "submitPayment",
		"change input#address": "signIn",
		"click .home": "removeMarker"
	},

	preventDefault: function (event) {
		if (event.keyCode == '13') {
			event.preventDefault();

			if(!getUserInfo.responseText) {
				this.$el.find('label[for=address]').html(logInTemplate());
			}
		}
	},

	nextStep: function () {
		event.preventDefault();

		var msg = $('#this_is_why').val();
		this.msg = msg;

		var currentUser = userCollection.findWhere({
			displayName: this.userLoggedIn.displayName
		});

		$('#why').css('display', 'none');


		App.Settings.rotateMap = true;
		this.$el.append(aboutTemplate());
	},

	payment: function () {
		$('.lightbox').remove();
		this.$el.append(paymentTemplate());
	},

	submitPayment: function () {
		var user = userCollection.findWhere({displayName: this.userLoggedIn.displayName});
		var contributions = user.get('contributions');

		var currentPlace = placeCollection.findWhere({
			lat: this.position.G,
			lng: this.position.K
		});

		var match = userCollection.findWhere({placeId: currentPlace.id});

		user.save({
			msg: this.msg,
			placeId: currentPlace.id,
		});

		if (!!contributions) {
			contributions = contributions + 1;
			user.set('contributions', contributions);
			user.save();
		} else {
			user.set('contributions', 1);
			user.save();
		}

		App.router.navigate('/', { trigger: true });

	},

	signIn: function () {
		if(!getUserInfo.responseText) {
			this.$el.find('label[for=address]').html(logInTemplate());
		}
	},

	removeMarker: function () {
		App.router.navigate('/', { trigger: true });
	}
});

module.exports = Process;