var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');


var query = Game.findOne();
query.exec(function(err, game){
  console.log(game.odd_point_home + " against " + game.away_team);
});
