var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')
// App

var App = require('../app')
var Place = require('../models/place')
var User = require('../models/user')

var signInTemplate = require('../templates/sign-in.hbs')

window.signInCallback = function signInCallback(authResult) {
	if (authResult.code) {
		$.post('/auth/google/callback', authResult)
			.done(function(data) {
				$.get('/api/users/' + data.id).done(function (user) {
					console.log('exists', user)
					$.ajax({
						url: '/api/users/' + data.id,
						data: data,
						method: 'PUT'
					}).done(function (createUser) {
						console.log('updated user')
					}).fail(function (xhr) {
						console.log('could\'t update user')
					})
				}).fail(function (xhr) {
					console.log('doesn\'t exist', xhr)
					$.post('/api/users', data).done(function (createUser) {
						console.log('new created user')
					}).fail(function (xhr) {
						console.log('unable to create user')
					})
				})

				$('#signinButton').hide();
			}); 
	} else if (authResult.error) {
		console.log('There was an error: ' + authResult.error);
	}
}

var SignIn = Backbone.View.extend({

	render: function () {
		this.$el = $('#sign-in-button')
		this.$el.html(signInTemplate())
	}
})

module.exports = SignIn
