var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// templates
var userProfile = require('../templates/user-profile.hbs')

var UserProfile = Backbone.View.extend({
	el: 'main',

	collection: {
		user: App.Collections.user,
		place: App.Collections.place
	},

	render: function(userId) {
		this.$el.html('')
		var _this = this

		if (!!userId) {
			this.collection.user.fetch().done(function () {
				var userModel = _this.collection.user.get(userId)
				var userPlaceId = userModel.get('placeId')

				_this.collection.place.fetch().done(function () {
					var placeModel = _this.collection.place.getPlace(userPlaceId)
					var placeName = placeModel.get('name')

					var userInfo = {
						img: userModel.get('photos')[0].value,
						fullName: userModel.get('displayName'),
						firstName: userModel.get('name').givenName,
						contributions: userModel.get('contributions'),
						msg: userModel.get('msg'),
						place: placeName
					}

					_this.$el.html(userProfile(userInfo))
				})

			})
		} else {
			this.collection.user.fetch().done(function () {
				var userModels = _this.collection.user.models
				userModels.forEach(function (userModel) {
					var userPlaceId = userModel.attributes.placeId
					
					_this.collection.place.fetch().done(function () {
						var placeModels = _this.collection.place.getPlace(userPlaceId)
						var placeName = placeModels.get('name')

						userInfo = {
							img: userModel.get('photos')[0].value,
							fullName: userModel.get('displayName'),
							firstName: userModel.get('name').givenName,
							contributions: userModel.get('contributions'),
							msg: userModel.get('msg'),
							place: placeName
						}

						_this.$el.append(userProfile(userInfo))

					})
				})
			})
		}
	}
})

module.exports = UserProfile