var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');

mongoose.connection.once('connected', function() {
  console.log("Database connected successfully")

  Game.collection.update({},
    {$unset: {rest_time_home: true, rest_time_away: true}},
    {multi: true, safe: true}
  );
  console.log("collection updated");
  mongoose.connection.close()
});
