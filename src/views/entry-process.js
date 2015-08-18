var $ = require('jquery')
var Backbone = require('backbone')
var _ = require('lodash')

// App
var App = require('../app')

// Models
var Place = require('../models/place')
var User = require('../models/user')

// why template
var whyTemplate = require('../templates/infowindow.hbs')
// var addressTemplate = require('../templates/address.hbs')
var reasonTemplate = require('../templates/reason.hbs')
var learnMoreTemplate = require('../templates/learn-more.hbs')