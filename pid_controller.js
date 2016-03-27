var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');

var query = Game.findOne();
query.exec(function(err, game){
  console.log(game.home_team + " against " + game.away_team);
});

/*
The idea here is to take each game and generate four features:
- odd_point_home,
- odd_point_away,
- odd_prim_home,
- odd_prim_away

ODD_POINT:
Euler method: odd_point_home[i] = odd_home[i] - odd_????[i+1]/rest_time_home

ODD_PRIM:
Méthode des trapèzes: odd_prim_home[i] = 0.5 * rest_time_home * (odd_home[i] + odd_????[i+1])
*/
