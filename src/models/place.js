var Backbone = require('backbone');

/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: Place
*****************************************/

App.Models.Place = Backbone.Model.extend({
  url: function() {
    var base = App.Settings.apiRoot + '/places';
    if (this.isNew()) return base;
    return base + '/' + this.id;
  }
});

module.exports = App.Models.Place;
