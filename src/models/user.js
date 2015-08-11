var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: Place
*****************************************/

App.Models.User = Backbone.Model.extend({
  url: function() {
    var base = App.Settings.apiRoot + '/users'
    if (this.isNew()) return base
    return base + '/' + this.id
  }
});

module.exports = App.Models.User
